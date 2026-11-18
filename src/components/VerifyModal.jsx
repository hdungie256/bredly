import { useEffect, useState } from 'react'
import { formatShort } from '../lib/date.js'
import { verificationCode } from '../lib/badges.js'
import { CheckIcon } from './icons.jsx'
import Modal from './Modal.jsx'

/** Hiệu ứng "Xác minh" của Credly: tick lần lượt từng dòng. */
export default function VerifyModal({ badge, issuer, recipient, onClose }) {
  const rows = [
    ['Người nhận', recipient],
    ['Cấp bởi', issuer.name],
    ['Ngày cấp', formatShort(badge.earnedAt)],
    ['Trạng thái', 'Còn hiệu lực'],
  ]
  const [checked, setChecked] = useState(0)

  useEffect(() => {
    if (checked >= rows.length) return
    const t = setTimeout(() => setChecked((c) => c + 1), 450)
    return () => clearTimeout(t)
  }, [checked, rows.length])

  return (
    <Modal title="Xác minh huy hiệu" onClose={onClose}>
      {rows.map(([label, value], i) => (
        <div key={label} className={`vrow${i < checked ? ' ok' : ''}`}>
          <span className={`vi${i === checked ? ' spin' : ''}`}><CheckIcon /></span>
          <span className="vl">{label}</span>
          <span className="vv">{value}</span>
        </div>
      ))}
      {checked >= rows.length && <div className="vdone">✓ Huy hiệu hợp lệ · Mã: {verificationCode(badge)}</div>}
    </Modal>
  )
}
