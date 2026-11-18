/*
 * Kỳ đếm cho tiêu chí đếm số lần:
 *  - month: theo tháng dương lịch (tự sang kỳ mới)
 *  - term:  theo học kì, kì mới bắt đầu khi Vk Hơm bấm "Học kì mới" (lưu ở tracker.terms)
 */
import { today } from './date.js'

export const PERIOD_LABEL = { month: 'tháng', term: 'học kì' }

const monthKey = (date) => date.slice(0, 7)

function nextMonth(key) {
  let [y, m] = key.split('-').map(Number)
  m += 1
  if (m > 12) { m = 1; y += 1 }
  return `${y}-${String(m).padStart(2, '0')}`
}

/** Danh sách kỳ từ kỳ đầu tiên đến kỳ hiện tại, mỗi kỳ kèm số lần. */
export function periodCounts(tracker, now = today()) {
  const log = tracker.log ?? []

  if (tracker.period === 'month') {
    const first = log.length ? monthKey([...log].sort()[0]) : monthKey(now)
    const current = monthKey(now)
    const out = []
    for (let k = first; k <= current; k = nextMonth(k)) {
      out.push({ key: k, count: log.filter((d) => monthKey(d) === k).length })
    }
    return out
  }

  // term
  const starts = [...(tracker.terms ?? [])].sort()
  if (!starts.length) return [{ key: 'all', count: log.length }]
  return starts.map((start, i) => {
    const end = starts[i + 1]
    return { key: start, count: log.filter((d) => d >= start && (!end || d < end)).length }
  })
}

/**
 * Chuỗi kỳ liên tiếp đạt mục tiêu.
 * best: chuỗi dài nhất từng có. current: chuỗi tính đến kỳ hiện tại
 * (kỳ hiện tại chưa đủ thì chưa làm đứt chuỗi).
 */
export function streakInfo(tracker, target, now = today()) {
  const periods = periodCounts(tracker, now)
  let best = 0
  let run = 0
  periods.forEach((p) => {
    run = p.count >= target ? run + 1 : 0
    best = Math.max(best, run)
  })

  const last = periods.at(-1)
  let current = 0
  for (let i = periods.length - 1; i >= 0; i--) {
    if (periods[i].count >= target) current++
    else if (i === periods.length - 1) continue // kỳ đang diễn ra, chưa tính là đứt
    else break
  }

  return { best, current, thisPeriod: last?.count ?? 0 }
}
