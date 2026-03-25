// ═══════════════════════════════════════════════════════════════
// STORAGE ADAPTER — Supabase backend for Roofus Materials Portal
// ═══════════════════════════════════════════════════════════════
//
// This replaces Claude's window.storage with a real Supabase database.
// The app calls ld() and sv() — this file handles persistence.
//
// SETUP:
// 1. Create a free Supabase project at https://supabase.com
// 2. In SQL Editor, run the migration below
// 3. Copy your project URL and anon key into the .env file
//
// ═══════════════════════════════════════════════════════════════

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY in .env')
}

export const supabase = createClient(supabaseUrl || '', supabaseKey || '')

// ─── Key-value store (same interface as Claude's window.storage) ───
// The app stores everything as JSON blobs under string keys.
// This keeps the exact same pattern so the app code doesn't change.

const CACHE = {}  // in-memory cache to reduce reads

export async function ld(key, defaultValue) {
  // Check cache first
  if (CACHE[key] !== undefined) return CACHE[key]

  try {
    const { data, error } = await supabase
      .from('kv_store')
      .select('value')
      .eq('key', key)
      .single()

    if (error || !data) {
      CACHE[key] = defaultValue
      return defaultValue
    }

    const parsed = typeof data.value === 'string' ? JSON.parse(data.value) : data.value
    CACHE[key] = parsed
    return parsed
  } catch {
    return defaultValue
  }
}

export async function sv(key, value) {
  CACHE[key] = value

  try {
    const { error } = await supabase
      .from('kv_store')
      .upsert({
        key,
        value: JSON.stringify(value),
        updated_at: new Date().toISOString()
      }, { onConflict: 'key' })

    if (error) console.error('Save error:', key, error)
  } catch (e) {
    console.error('Save failed:', key, e)
  }
}

// Local storage (per-user session) — uses browser localStorage
export async function ldL(key, defaultValue) {
  try {
    const raw = localStorage.getItem('roofus_' + key)
    return raw ? JSON.parse(raw) : defaultValue
  } catch {
    return defaultValue
  }
}

export async function svL(key, value) {
  try {
    localStorage.setItem('roofus_' + key, JSON.stringify(value))
  } catch {}
}
