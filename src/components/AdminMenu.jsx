import { useState } from 'react'
import { initials } from '../lib/badges.js'
import { fileToSquareDataUrl } from '../lib/image.js'
import { useToast } from '../hooks/useToast.jsx'
import Modal from './Modal.jsx'

export default function AdminMenu({ profile, onUpdateProfile, onNewBadge, onLogout, onClose }) {
  const notify = useToast()
  const [name, setName] = useState(profile.name)

  async function pickPhoto(field, file) {
    if (!file) return
    onUpdateProfile({ [field]: await fileToSquareDataUrl(file) })
    notify('Đã cập nhật ảnh, nhớ Lưu nha')
  }

  function done() {
    const trimmed = name.trim()
    if (trimmed && trimmed !== profile.name) onUpdateProfile({ name: trimmed })
    onClose()
  }

  return (
    <Modal title="Quản lý (Vk Hơm)" onClose={onClose} footer={<button className="b pri" onClick={done}>Xong</button>}>
      <div className="fld">
        <label>Tên người nhận</label>
        <input value={name} onChange={(e) => setName(e.target.value)} />
      </div>
      <PhotoField
        label="Ảnh mặt Vk Hơm (giữa huy hiệu)"
        src={profile.photo}
        fallback="🙂"
        onPick={(f) => pickPhoto('photo', f)}
      />
      <PhotoField
        label={`Ảnh đại diện của ${profile.name}`}
        src={profile.avatar}
        fallback={initials(profile.name)}
        onPick={(f) => pickPhoto('avatar', f)}
      />
      <div className="mlist">
        <button onClick={onNewBadge}>＋ Tạo huy hiệu mới</button>
        <button onClick={onLogout}>Đăng xuất</button>
      </div>
    </Modal>
  )
}

function PhotoField({ label, src, fallback, onPick }) {
  return (
    <div className="fld">
      <label>{label}</label>
      <label className="photo">
        <span className="pv">{src ? <img src={src} alt="" /> : fallback}</span>
        <span>Tải ảnh lên</span>
        <input type="file" accept="image/*" onChange={(e) => onPick(e.target.files?.[0])} />
      </label>
    </div>
  )
}
