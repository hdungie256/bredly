import { today } from './date.js'
import { PERIOD_LABEL, streakInfo } from './periods.js'

export const isEarned = (badge) => Boolean(badge.earnedAt)

/* ---------- Tiêu chí đếm số lần ----------
 * Tracker không có period: cộng dồn tổng số lần (mặc định).
 * Tiêu chí trỏ tới một "tracker" dùng chung (data.trackers), nên một lần +1
 * được tính cho mọi cấp độ của cùng chuỗi huy hiệu.
 *   { t, tracker: 'dihoc', target: 5, streak: 2 }
 *   = mỗi kỳ ít nhất 5 lần, 2 kỳ liên tiếp
 */
export const isCounter = (req) => Boolean(req.tracker)

export function counterStatus(data, req) {
  const tracker = data.trackers?.[req.tracker] ?? { period: 'month', log: [] }
  const streak = req.streak ?? 1
  const info = streakInfo(tracker, req.target)
  return {
    tracker,
    target: req.target,
    streak,
    total: tracker.log?.length ?? 0,
    last: tracker.log?.at(-1),
    thisPeriod: info.thisPeriod,
    currentStreak: Math.min(info.current, streak),
    done: info.best >= streak,
  }
}

/** Mô tả mục tiêu, vd: "5 lần", "3 lần mỗi tháng" hoặc "3 lần mỗi tháng · 2 tháng liên tiếp (6 lần)" */
export function counterGoal(data, req) {
  const period = PERIOD_LABEL[data.trackers?.[req.tracker]?.period]
  if (!period) return `Cần ${req.target} lần`
  const streak = req.streak ?? 1
  const base = `${req.target} lần mỗi ${period}`
  return streak > 1 ? `${base} · ${streak} ${period} liên tiếp (${req.target * streak} lần)` : base
}

/* ---------- Chung ---------- */

export const isReqDone = (data, req) => (isCounter(req) ? counterStatus(data, req).done : Boolean(req.done))

/**
 * Tiến độ theo từng ô tiêu chí: tiêu chí đếm N lần được tính là N ô
 * (vd: rửa chén 8 lần = 8 tiêu chí), tiêu chí thường là 1 ô.
 */
export function progress(data, badge) {
  let done = 0
  let total = 0
  badge.reqs.forEach((r) => {
    if (isCounter(r)) {
      const s = counterStatus(data, r)
      total += s.target
      done += s.done ? s.target : Math.min(s.thisPeriod, s.target)
    } else {
      total += 1
      if (r.done) done += 1
    }
  })
  return { done, total, percent: total ? (done / total) * 100 : 0 }
}

/**
 * Cập nhật earnedAt theo các tiêu chí: đủ hết thì mở khoá, thiếu thì khoá lại
 * (trừ huy hiệu được Vk Hơm cấp trước – grantedEarly).
 * Trả về true nếu huy hiệu vừa được mở khoá.
 */
export function syncEarned(data, badge) {
  const allDone = badge.reqs.length > 0 && badge.reqs.every((r) => isReqDone(data, r))
  if (allDone && !badge.earnedAt) {
    badge.earnedAt = today()
    return true
  }
  if (!allDone && !badge.grantedEarly) badge.earnedAt = null
  return false
}

/** Đồng bộ mọi huy hiệu; trả về danh sách id vừa mở khoá. */
export function syncAll(data) {
  return data.badges.filter((b) => syncEarned(data, b)).map((b) => b.id)
}

/** Ảnh trên huy hiệu: ảnh riêng của chuỗi → ảnh riêng của huy hiệu → ảnh chung trong hồ sơ. */
export function badgePhoto(data, badge) {
  return (badge.series && data.seriesPhotos?.[badge.series]) || badge.photo || data.profile.photo
}

export function getIssuer(data, badge) {
  return data.issuers[badge.issuer] ?? { emoji: '💗', name: 'Vk Hơm', skills: [] }
}

/** Các cấp độ khác cùng chuỗi (vd: Bubu Tài Xế Foundational → Specialty). */
export function seriesOf(data, badge) {
  if (!badge.series) return []
  return data.badges.filter((b) => b.series === badge.series)
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

/* ---------- Chuyển tiêu chí <-> dòng chữ trong form sửa ----------
 * "Rửa chén | 8"                     → cộng dồn đủ 8 lần
 * "Chở vk đi chơi | 3 | thang"       → 3 lần mỗi tháng
 * "Chở vk đi học | 5 | hocki | 2"    → 5 lần mỗi học kì, 2 kì liên tiếp
 * "Ôm chào buổi sáng"                → tick một lần
 * Tiêu chí đếm cùng tên + cùng kỳ dùng chung một tracker.
 */
const PERIOD_WORDS = { month: 'thang', term: 'hocki' }

export function reqToLine(data, req) {
  if (!isCounter(req)) return req.t
  const period = PERIOD_WORDS[data.trackers?.[req.tracker]?.period]
  const parts = [req.t, req.target, period]
  if ((req.streak ?? 1) > 1) parts.push(req.streak)
  return parts.join(' | ')
}

/** Lưu ý: có thể thêm tracker mới vào data. */
export function lineToReq(data, line, oldReqs) {
  const [t, target, periodWord, streak] = line.split('|').map((s) => s.trim())
  const n = parseInt(target, 10)
  if (!(n > 0)) return { t, done: oldReqs.find((r) => r.t === t && !isCounter(r))?.done ?? null }

  const word = periodWord?.toLowerCase()
  const period = word === 'hocki' ? 'term' : word === 'thang' ? 'month' : undefined
  data.trackers ??= {}
  let key = Object.keys(data.trackers).find((k) => data.trackers[k].name === t && data.trackers[k].period === period)
  if (!key) {
    key = `t${Date.now().toString(36)}${Object.keys(data.trackers).length}`
    data.trackers[key] = { name: t, log: [], ...(period ? { period } : {}), ...(period === 'term' ? { terms: [today()] } : {}) }
  }
  const s = parseInt(streak, 10)
  return { t, tracker: key, target: n, ...(s > 1 ? { streak: s } : {}) }
}
