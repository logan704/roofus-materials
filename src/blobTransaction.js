import { loadSnapshot, commitSnapshot } from './storage.js'

// Generic atomic read/transform/commit for the legacy blob architecture.
// The transform MUST be pure: calculate next values from the supplied snapshot only.
// If another writer changes ANY touched blob before commit, the entire transaction is
// rejected and nothing is partially written.
export async function transactBlobs(keys, defaults, transform) {
  const snapshot = await loadSnapshot(keys, defaults)
  const current = Object.fromEntries(keys.map(k => [k, snapshot[k].value]))
  const next = await transform(current)

  if (!next || typeof next !== 'object') {
    throw new Error('Blob transaction transform returned no result')
  }

  for (const key of keys) {
    if (!Object.prototype.hasOwnProperty.call(next, key)) {
      throw new Error('Blob transaction did not return key: ' + key)
    }
  }

  await commitSnapshot(snapshot, next)
  return next
}
