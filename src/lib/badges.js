import { today } from './date.js'

export const isEarned = (badge) => Boolean(badge.earnedAt)

export function progress(badge) {
  const done = badge.reqs.filter((r) => r.done).length
  const total = badge.reqs.length
  return { done, total, percent: total ? (done / total) * 100 : 0 }
}

/**
 * Cập nhật earnedAt theo các tiêu chí: đủ hết thì mở khoá, thiếu thì khoá lại.
 * Trả về true nếu huy hiệu vừa được mở khoá.
 */
export function syncEarned(badge) {
  const allDone = badge.reqs.length > 0 && badge.reqs.every((r) => r.done)
  if (allDone && !badge.earnedAt) {
    badge.earnedAt = today()
    return true
  }
  if (!allDone) badge.earnedAt = null
  return false
}

export function getIssuer(data, badge) {
  return data.issuers[badge.issuer] ?? { emoji: '💗', name: 'Vk Hơm', skills: [] }
}

export function initials(name) {
  const parts = name.trim().split(/\s+/)
  const first = parts[0]?.[0] ?? ''
  const last = parts.length > 1 ? parts[parts.length - 1][0] : ''
  return (first + last).toUpperCase()
}

export function verificationCode(badge) {
  return `BRD-${badge.id.toUpperCase()}-${badge.earnedAt.replaceAll('-', '')}`
}
