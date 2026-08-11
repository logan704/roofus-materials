// ROOFUS STORAGE — server-enforced CAS revision
//
// Reads remain direct SELECTs. ALL business writes go through SECURITY DEFINER
// compare-and-swap RPCs. Direct INSERT/UPDATE/DELETE is revoked from browser roles,
// which is essential: an already-open legacy tab must not be able to bypass versioning.

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY in .env')
}

export const supabase = createClient(supabaseUrl || '', supabaseKey || '')

export class ConflictError extends Error {
  constructor(key, details = {}) {
    super('CONFLICT: "' + key + '" changed since this browser loaded it.')
    this.name = 'ConflictError'
    this.key = key
    this.details = details
  }
}


export class AmbiguousWriteError extends Error {
  constructor(key, details = {}, cause) {
    super('WRITE_OUTCOME_UNKNOWN: "' + key + '" may or may not have committed. Verify server state before retrying.')
    this.name = 'AmbiguousWriteError'
    this.key = key
    this.details = details
    this.cause = cause
  }
}

export class StorageReadError extends Error {
  constructor(key, cause) {
    super('READ_FAILED: "' + key + '" could not be read from the database.')
    this.name = 'StorageReadError'
    this.key = key
    this.cause = cause
  }
}

const CACHE = Object.create(null)
const VERSION = Object.create(null)

function hasCached(key) {
  return Object.prototype.hasOwnProperty.call(CACHE, key) && VERSION[key] !== undefined
}

function decodeStoredValue(raw) {
  if (typeof raw !== 'string') return raw
  try { return JSON.parse(raw) } catch { return raw }
}

function sameValue(a, b) {
  try { return JSON.stringify(a) === JSON.stringify(b) } catch { return false }
}

function emitConflict(key, details = {}) {
  try {
    if (typeof window !== 'undefined' && window.dispatchEvent) {
      window.dispatchEvent(new CustomEvent('roofus:save-conflict', { detail: { key, ...details } }))
    }
  } catch {}
}

async function readServerRow(key) {
  const { data, error } = await supabase
    .from('kv_store')
    .select('value, version')
    .eq('key', key)
    .maybeSingle()

  if (error) throw new StorageReadError(key, error)
  if (!data) return { exists: false, value: undefined, version: 0 }

  return {
    exists: true,
    value: decodeStoredValue(data.value),
    version: Number(data.version ?? 0)
  }
}

function acceptRow(key, row, defaultValue) {
  const value = row.exists ? row.value : defaultValue
  CACHE[key] = value
  VERSION[key] = row.exists ? row.version : 0
  return value
}

// Cached read for ordinary rendering. A failed database read never poisons VERSION
// with 0. If we already have a known-good cache, return it; otherwise return the
// caller's default, but any later save MUST obtain a real server version first.
export async function ld(key, defaultValue) {
  if (hasCached(key)) return CACHE[key]
  try {
    return acceptRow(key, await readServerRow(key), defaultValue)
  } catch (e) {
    console.error('Load failed:', key, e)
    return defaultValue
  }
}

// Strict fresh read. Unlike the previous patch, a network/RLS error is NOT treated as
// "row missing/version 0" and is NOT silently replaced by a stale value.
export async function ldFresh(key, defaultValue) {
  const row = await readServerRow(key)
  return acceptRow(key, row, defaultValue)
}

export async function refresh(key, defaultValue) {
  delete CACHE[key]
  delete VERSION[key]
  return ldFresh(key, defaultValue)
}

async function ensureKnownVersion(key) {
  if (VERSION[key] !== undefined) return VERSION[key]
  await ldFresh(key, undefined)
  if (VERSION[key] === undefined) throw new StorageReadError(key)
  return VERSION[key]
}

async function reconcileAmbiguousSingle(key, expectedVersion, intendedValue, originalError) {
  try {
    const row = await readServerRow(key)
    const expectedAfter = expectedVersion + 1

    // Lost ACK case: the transaction committed, but the browser never received the
    // response. If server state is exactly the intended value at exactly +1 version,
    // treating this as success is safe even if an identical concurrent writer won.
    if (row.exists && row.version === expectedAfter && sameValue(row.value, intendedValue)) {
      CACHE[key] = row.value
      VERSION[key] = row.version
      return { committed: true, version: row.version }
    }

    // A version change after a TRANSPORT error is ambiguous: our write may have committed
    // and another writer may have changed it again before this reconciliation read. Do not
    // falsely tell the user "not saved" and invite a duplicate business action.
    if (row.version !== expectedVersion) {
      CACHE[key] = row.value
      VERSION[key] = row.version
      throw new AmbiguousWriteError(key, { expectedVersion, currentVersion: row.version }, originalError)
    }
  } catch (e) {
    if (e instanceof ConflictError || e instanceof AmbiguousWriteError) throw e
    // If reconciliation itself cannot read the server, the outcome is genuinely
    // unknown. Do not call it success and do not mutate the local cache.
  }

  throw originalError
}

export async function sv(key, value) {
  const expected = await ensureKnownVersion(key)
  const payload = JSON.stringify(value)

  const { data, error } = await supabase.rpc('kv_cas_write', {
    p_key: key,
    p_expected_version: expected,
    p_value_text: payload
  })

  if (error) {
    console.error('CAS save error:', key, error)
    return reconcileAmbiguousSingle(key, expected, value, error)
  }

  if (!data || data.ok !== true) {
    await refresh(key, undefined).catch(() => {})
    emitConflict(key, { code: data?.code, currentVersion: data?.current_version })
    throw new ConflictError(key, data || {})
  }

  CACHE[key] = value
  VERSION[key] = Number(data.new_version)
  return { version: VERSION[key] }
}

// A snapshot binds values to the exact versions they came from. Use this for any
// business operation that computes multiple blobs and needs them committed atomically.
export async function loadSnapshot(keys, defaults = {}) {
  const rows = await Promise.all(keys.map(async (key) => {
    const row = await readServerRow(key)
    const value = acceptRow(key, row, defaults[key])
    return [key, { value, version: row.exists ? row.version : 0 }]
  }))
  return Object.fromEntries(rows)
}

async function reconcileAmbiguousMulti(snapshot, nextValues, originalError) {
  try {
    const keys = Object.keys(nextValues)
    const rows = await Promise.all(keys.map(async key => [key, await readServerRow(key)]))
    let allCommitted = true
    let anyVersionChanged = false

    for (const [key, row] of rows) {
      const expected = snapshot[key].version
      if (row.version !== expected) anyVersionChanged = true
      if (!(row.exists && row.version === expected + 1 && sameValue(row.value, nextValues[key]))) {
        allCommitted = false
      }
    }

    if (allCommitted) {
      for (const [key, row] of rows) {
        CACHE[key] = row.value
        VERSION[key] = row.version
      }
      return { committed: true }
    }

    if (anyVersionChanged) {
      for (const [key, row] of rows) { CACHE[key] = row.value; VERSION[key] = row.version }
      throw new AmbiguousWriteError('multiple', { keys }, originalError)
    }
  } catch (e) {
    if (e instanceof ConflictError || e instanceof AmbiguousWriteError) throw e
  }

  throw originalError
}

// Commit multiple blobs in ONE PostgreSQL transaction. This is required for approval,
// deleting an approved order, editing an approved order, receipt corrections, damage
// corrections, physical counts, and any other operation where two blobs represent one
// business action.
export async function commitSnapshot(snapshot, nextValues) {
  const keys = Object.keys(nextValues).sort()
  if (!keys.length) throw new Error('commitSnapshot requires at least one write')

  const writes = keys.map(key => {
    if (!snapshot[key]) throw new Error('Snapshot missing key: ' + key)
    return {
      key,
      expected_version: snapshot[key].version,
      value_text: JSON.stringify(nextValues[key])
    }
  })

  const { data, error } = await supabase.rpc('kv_multi_cas_write', { p_writes: writes })

  if (error) {
    console.error('Multi-CAS save error:', error)
    return reconcileAmbiguousMulti(snapshot, nextValues, error)
  }

  if (!data || data.ok !== true) {
    await Promise.all(keys.map(key => refresh(key, undefined).catch(() => {})))
    emitConflict(data?.conflict_key || 'multiple', { code: data?.code })
    throw new ConflictError(data?.conflict_key || 'multiple', data || {})
  }

  for (const key of keys) {
    CACHE[key] = nextValues[key]
    VERSION[key] = Number(data.versions?.[key])
  }

  return { versions: data.versions || {} }
}

export async function ldL(key, defaultValue) {
  try {
    const raw = localStorage.getItem('roofus_' + key)
    return raw ? JSON.parse(raw) : defaultValue
  } catch {
    return defaultValue
  }
}

export async function svL(key, value) {
  try { localStorage.setItem('roofus_' + key, JSON.stringify(value)) } catch {}
}
