import { useEffect, useState } from 'react'
import { loadData, saveData } from '../lib/github.js'
import { syncEarned } from '../lib/badges.js'

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

  /** Tick/bỏ tick một tiêu chí. Trả về true nếu huy hiệu vừa được mở khoá. */
  const toggleRequirement = (badgeId, index, date) =>
    update((d) => {
      const badge = findIn(d, badgeId)
      const req = badge.reqs[index]
      req.done = req.done ? null : date
      return syncEarned(badge)
    })

  /** Tạo mới (badgeId rỗng) hoặc sửa huy hiệu. Trả về id. */
  const upsertBadge = (badgeId, { name, tier, issuer, newIssuer, lines }) =>
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
      badge.reqs = lines.map((t) => ({ t, done: old.find((r) => r.t === t)?.done ?? null }))
      Object.assign(badge, { name, tier, issuer: issuerKey })
      syncEarned(badge)
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

  return { data, status, dirty, saving, toggleRequirement, upsertBadge, deleteBadge, updateProfile, save }
}
