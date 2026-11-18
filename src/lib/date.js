const pad = (n) => String(n).padStart(2, '0')

/** Ngày hôm nay dạng YYYY-MM-DD (giờ máy) */
export function today() {
  const d = new Date()
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}

/** 2026-11-18 → 18/11/2026 */
export function formatShort(iso) {
  if (!iso) return ''
  const [y, m, d] = iso.split('-')
  return `${d}/${m}/${y}`
}

/** 2026-11-18 → ngày 18 tháng 11, 2026 */
export function formatLong(iso) {
  if (!iso) return ''
  const [y, m, d] = iso.split('-')
  return `ngày ${+d} tháng ${+m}, ${y}`
}
