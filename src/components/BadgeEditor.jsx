import { useState } from 'react'
import { TIERS, TIER_ORDER } from '../constants/tiers.js'
import { useToast } from '../hooks/useToast.jsx'
import { badgePhoto, reqToLine } from '../lib/badges.js'
import { fileToSquareDataUrl } from '../lib/image.js'
import Modal from './Modal.jsx'

const NEW_ISSUER = '__new'

/** Form tạo mới / sửa huy hiệu. badge = null nghĩa là tạo mới. */
export default function BadgeEditor({ data, badge, onSave, onClose }) {
  const notify = useToast()
  const issuers = data.issuers
  const [name, setName] = useState(badge?.name ?? '')
  const [tier, setTier] = useState(badge?.tier ?? 'f')
  const [issuer, setIssuer] = useState(badge?.issuer ?? Object.keys(issuers)[0])
  const [issuerEmoji, setIssuerEmoji] = useState('💗')
  const [issuerName, setIssuerName] = useState('Vk Hơm ')
  const [issuerSkills, setIssuerSkills] = useState('')
  const [photo, setPhoto] = useState(null)
  const currentPhoto = photo ?? (badge ? badgePhoto(data, badge) : data.profile.photo)
  const [reqText, setReqText] = useState(badge?.reqs.map((r) => reqToLine(data, r)).join('\n') ?? '')

  function submit() {
    const lines = reqText.split('\n').map((s) => s.trim()).filter(Boolean)
    if (!name.trim()) return notify('Đặt tên cho huy hiệu đã nè')
    if (!lines.length) return notify('Thêm ít nhất 1 tiêu chí nha')

    let newIssuer = null
    if (issuer === NEW_ISSUER) {
      if (!issuerName.trim()) return notify('Nhập tên người cấp')
      newIssuer = {
        emoji: issuerEmoji.trim() || '💗',
        name: issuerName.trim(),
        skills: issuerSkills.split(',').map((s) => s.trim()).filter(Boolean),
      }
    }
    onSave({ name: name.trim(), tier, issuer, newIssuer, lines, photo })
  }

  return (
    <Modal
      title={badge ? 'Sửa huy hiệu' : 'Tạo huy hiệu mới'}
      onClose={onClose}
      footer={
        <>
          <button className="b" onClick={onClose}>Huỷ</button>
          <button className="b pri" onClick={submit}>Lưu</button>
        </>
      }
    >
      <div className="fld">
        <label>Tên huy hiệu</label>
        <input value={name} maxLength={24} placeholder="VD: Thánh Massage" onChange={(e) => setName(e.target.value)} />
      </div>
      <div className="fld">
        <label>Cấp độ</label>
        <select value={tier} onChange={(e) => setTier(e.target.value)}>
          {TIER_ORDER.map((k) => <option key={k} value={k}>{TIERS[k].label}</option>)}
        </select>
      </div>
      <div className="fld">
        <label>Người cấp</label>
        <select value={issuer} onChange={(e) => setIssuer(e.target.value)}>
          {Object.entries(issuers).map(([k, i]) => <option key={k} value={k}>{i.emoji} {i.name}</option>)}
          <option value={NEW_ISSUER}>＋ Người cấp mới…</option>
        </select>
      </div>
      {issuer === NEW_ISSUER && (
        <div className="fld">
          <label>Người cấp mới</label>
          <div className="row2">
            <input value={issuerEmoji} maxLength={4} onChange={(e) => setIssuerEmoji(e.target.value)} />
            <input value={issuerName} onChange={(e) => setIssuerName(e.target.value)} />
          </div>
          <input style={{ marginTop: 10 }} value={issuerSkills} placeholder="Kỹ năng, cách nhau bằng dấu phẩy" onChange={(e) => setIssuerSkills(e.target.value)} />
        </div>
      )}
      <div className="fld">
        <label>Ảnh trên huy hiệu{badge?.series ? ' (dùng cho mọi cấp độ)' : ''}</label>
        <label className="photo">
          <span className="pv">{currentPhoto ? <img src={currentPhoto} alt="" /> : '🙂'}</span>
          <span>Đổi ảnh</span>
          <input type="file" accept="image/*" onChange={async (e) => e.target.files?.[0] && setPhoto(await fileToSquareDataUrl(e.target.files[0]))} />
        </label>
      </div>
      <div className="fld">
        <label>Tiêu chí đạt được</label>
        <textarea value={reqText} placeholder={'Tiêu chí 1\nTiêu chí 2'} onChange={(e) => setReqText(e.target.value)} />
        <small>
          Mỗi dòng là một tiêu chí. Tiêu chí đếm số lần: <code>tên | số lần</code>, vd: <code>Rửa chén | 8</code>.
          Cùng tên thì dùng chung bộ đếm với các cấp độ khác
        </small>
      </div>
    </Modal>
  )
}
