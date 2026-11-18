import { useEffect, useState } from 'react'
import { loadData, saveData } from '../lib/github.js'
import { lineToReq, syncAll, syncEarned } from '../lib/badges.js'

/** Toàn bộ dữ liệu huy hiệu + các thao tác sửa. Sửa xong phải gọi save() mới lên GitHub. */
export function useBadgeStore(auth) {
  const [data, setData] = useState(null)
  const [status, setStatus] = useState('loading') // loading | ready | error
  const [dirty, setDirty] = useState(false)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    loadData(auth)
      .then((d) => { setData(d); setStatus('ready') })
      .catch(() => setStatus('error'))
    // chỉ tải một lần khi mở trang
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Nhắc khi đóng trang mà chưa lưu
  useEffect(() => {
    if (!dirty) return
    const warn = (e) => { e.preventDefault(); e.returnValue = '' }
    window.addEventListener('beforeunload', warn)
    return () => window.removeEventListener('beforeunload', warn)
  }, [dirty])

  /** Sửa trên bản sao rồi thay vào state. Trả về kết quả của fn. */
  function update(fn) {
    const next = structuredClone(data)
    const result = fn(next)
    setData(next)
    setDirty(true)
    return result
  }

  const findIn = (d, id) => d.badges.find((b) => b.id === id)

  /** Tick/bỏ tick một tiêu chí thường. Trả về id các huy hiệu vừa mở khoá. */
  const toggleRequirement = (badgeId, index, date) =>
    update((d) => {
      const req = findIn(d, badgeId).reqs[index]
      req.done = req.done ? null : date
      return syncAll(d)
    })

  /** Tiêu chí đếm: +1 lần cho tracker (tính cho mọi cấp độ dùng chung). */
  const addCount = (trackerKey, date) =>
    update((d) => {
      d.trackers[trackerKey].log.push(date)
      return syncAll(d)
    })

  /** Tiêu chí đếm: bỏ lần gần nhất (lỡ bấm nhầm). */
  const removeCount = (trackerKey) =>
    update((d) => {
      d.trackers[trackerKey].log.pop()
      syncAll(d)
    })

  /** Bắt đầu học kì mới cho tracker theo học kì. */
  const startNewTerm = (trackerKey, date) =>
    update((d) => {
      const tr = d.trackers[trackerKey]
      tr.terms = [...(tr.terms ?? []).filter((x) => x !== date), date]
      syncAll(d)
    })

  /** Tạo mới (badgeId rỗng) hoặc sửa huy hiệu. Trả về id. */
  const upsertBadge = (badgeId, { name, tier, issuer, newIssuer, lines, photo }) =>
    update((d) => {
      let issuerKey = issuer
      if (newIssuer) {
        issuerKey = `i${Date.now()}`
        d.issuers[issuerKey] = newIssuer
      }
      let badge = badgeId && findIn(d, badgeId)
      if (!badge) {
        badge = { id: `b${Date.now().toString(36)}`, earnedAt: null, reqs: [] }
        d.badges.push(badge)
      }
      const old = badge.reqs
      badge.reqs = lines.map((line) => lineToReq(d, line, old))
      Object.assign(badge, { name, tier, issuer: issuerKey })
      if (photo) {
        // Ảnh dùng chung cho mọi cấp độ trong chuỗi
        if (badge.series) d.seriesPhotos = { ...d.seriesPhotos, [badge.series]: photo }
        else badge.photo = photo
      }
      syncEarned(d, badge)
      return badge.id
    })

  const deleteBadge = (badgeId) =>
    update((d) => { d.badges = d.badges.filter((b) => b.id !== badgeId) })

  const updateProfile = (changes) =>
    update((d) => { Object.assign(d.profile, changes) })

  async function save() {
    setSaving(true)
    try {
      await saveData(data, auth)
      setDirty(false)
    } finally {
      setSaving(false)
    }
  }

  return { data, status, dirty, saving, toggleRequirement, addCount, removeCount, startNewTerm, upsertBadge, deleteBadge, updateProfile, save }
}
