// Pure transforms for the legacy blob model. These functions do not touch React or
// Supabase. They calculate the next `items` + `orders` state from ONE fresh snapshot.
// Pair them with transactBlobs(["items","orders"], ...).
//
// NOTE (Claude): production items may use options[] WITHOUT a materialized variants
// object; variantsOf() below does NOT understand that shape and will throw
// VARIANT_NOT_FOUND. The live approve() handler therefore uses the app's own
// getVariants() logic instead of importing this module. Kept for reference/tests.

function variantsOf(it) {
  if (it?.variants && Object.keys(it.variants).length) return it.variants
  return { _default: { qty: Number(it?.qtyOnHand || 0), wac: Number(it?.wacCost || 0) } }
}

function lineKey(line) {
  return String(line.itemId) + '::' + String(line.option || '_default')
}

function aggregateLines(lines = []) {
  const out = new Map()
  for (const line of lines) {
    const qty = Number(line.qty || 0)
    if (!(qty > 0)) throw new Error('INVALID_LINE_QTY')
    const key = lineKey(line)
    const prev = out.get(key)
    if (prev) prev.qty += qty
    else out.set(key, { ...line, qty })
  }
  return out
}

function applyMovement(items, lines, direction) {
  const grouped = aggregateLines(lines)
  const found = new Set()
  const nextItems = items.map(it => {
    const v = { ...variantsOf(it) }
    let changed = false
    for (const [key, line] of grouped.entries()) {
      if (line.itemId !== it.id) continue
      const opt = line.option || '_default'
      const cur = v[opt]
      if (!cur) throw new Error('VARIANT_NOT_FOUND:' + key)
      found.add(key)
      const before = Number(cur.qty || 0)
      const after = before + direction * Number(line.qty || 0)
      if (after < 0) throw new Error('INSUFFICIENT_STOCK:' + key)
      v[opt] = { ...cur, qty: after }
      changed = true
    }
    if (!changed) return it
    return { ...it, variants: v, qtyOnHand: Object.values(v).reduce((s, x) => s + Number(x.qty || 0), 0) }
  })
  for (const key of grouped.keys()) {
    if (!found.has(key)) throw new Error('ITEM_NOT_FOUND:' + key)
  }
  return nextItems
}

function lockLineCosts(items, lines) {
  return lines.map(line => {
    const it = items.find(x => x.id === line.itemId)
    if (!it) throw new Error('ITEM_NOT_FOUND:' + line.itemId)
    const v = variantsOf(it)
    const opt = line.option || '_default'
    const vd = v[opt]
    if (!vd) throw new Error('VARIANT_NOT_FOUND:' + lineKey(line))
    const wac = Number(vd.wac ?? it.wacCost ?? 0)
    const markup = Number(it.markup || 0)
    const sell = markup >= 100 ? wac : wac / (1 - markup / 100)
    return { ...line, unitCost: wac, markupCost: sell, supplierCost: Number(it.supplierCost || 0) }
  })
}

function assertReturnWithinApprovedJobHistory(orders, returningOrder) {
  if (returningOrder.type !== 'return') return
  if (!returningOrder.jnJobId) throw new Error('RETURN_NOT_LINKED_TO_JOB')
  const issued = new Map()
  const returned = new Map()
  for (const o of orders) {
    if (o.jnJobId !== returningOrder.jnJobId || o.status !== 'approved') continue
    const target = o.type === 'return' ? returned : issued
    if (o.id === returningOrder.id) continue
    for (const l of o.lines || []) {
      const k = lineKey(l)
      target.set(k, (target.get(k) || 0) + Number(l.qty || 0))
    }
  }
  for (const [k, l] of aggregateLines(returningOrder.lines || []).entries()) {
    const remaining = (issued.get(k) || 0) - (returned.get(k) || 0)
    if (Number(l.qty || 0) > remaining) throw new Error('EXCESS_RETURN:' + k)
  }
}

export function approveOrderState({ items, orders }, orderId) {
  const ord = orders.find(o => o.id === orderId)
  if (!ord) throw new Error('ORDER_NOT_FOUND')
  if (ord.status !== 'pending') throw new Error('ORDER_NOT_PENDING')
  assertReturnWithinApprovedJobHistory(orders, ord)
  const lockedLines = lockLineCosts(items, ord.lines || [])
  const nextItems = applyMovement(items, lockedLines, ord.type === 'return' ? +1 : -1)
  const approved = { ...ord, lines: lockedLines, status: 'approved', approvedDate: new Date().toISOString() }
  const nextOrders = orders.map(o => o.id === ord.id ? approved : o)
  return { items: nextItems, orders: nextOrders, approvedOrder: approved }
}

export function deleteOrderState({ items, orders }, orderId) {
  const ord = orders.find(o => o.id === orderId)
  if (!ord) throw new Error('ORDER_NOT_FOUND')
  let nextItems = items
  if (ord.status === 'approved') {
    nextItems = applyMovement(items, ord.lines || [], ord.type === 'return' ? -1 : +1)
  }
  return { items: nextItems, orders: orders.filter(o => o.id !== orderId), deletedOrder: ord }
}

export function assertOrderEditable(order) {
  if (!order) throw new Error('ORDER_NOT_FOUND')
  if (order.status !== 'pending') throw new Error('APPROVED_ORDER_EDIT_DISABLED')
}
