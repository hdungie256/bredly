import { useState } from 'react'
import Modal from './Modal.jsx'

export default function LoginModal({ onLogin, onClose }) {
  const [password, setPassword] = useState('')
  const [checking, setChecking] = useState(false)
  const [wrong, setWrong] = useState(false)

  async function submit(e) {
    e.preventDefault()
    if (!password || checking) return
    setChecking(true)
    const ok = await onLogin(password)
    setChecking(false)
    if (ok) return onClose()
    setWrong(true)
    setPassword('')
  }

  return (
    <Modal title="Đăng nhập người cấp" onClose={onClose}>
      <form onSubmit={submit}>
        <div className="fld">
          <label>Mật khẩu của Vk Hơm</label>
          <input
            type="password"
            value={password}
            autoFocus
            autoComplete="current-password"
            onChange={(e) => { setPassword(e.target.value); setWrong(false) }}
          />
          {wrong && <small className="err">Sai mật khẩu rồi 🙅</small>}
        </div>
        <button className="b pri" style={{ width: '100%' }} disabled={checking}>
          {checking ? 'Đang kiểm tra…' : 'Đăng nhập'}
        </button>
        <p className="hint" style={{ marginTop: 12 }}>Đăng nhập một lần, máy này sẽ nhớ.</p>
      </form>
    </Modal>
  )
}
