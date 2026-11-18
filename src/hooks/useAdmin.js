import { useState } from 'react'
import { openSecret } from '../lib/crypto.js'

const ADMIN_KEY = 'bredly_admin'
const AUTH_KEY = 'bredly_auth'

// Nhớ đăng nhập trên máy này cho đến khi bấm Đăng xuất
const storage = {
  get: (k) => { try { return localStorage.getItem(k) ?? '' } catch { return '' } },
  set: (k, v) => { try { localStorage.setItem(k, v) } catch { /* bỏ qua */ } },
  clear: (k) => { try { localStorage.removeItem(k) } catch { /* bỏ qua */ } },
}

/** Đăng nhập Vk Hơm: mật khẩu đúng khi mở khoá được secret.json. */
export function useAdmin() {
  const [auth, setAuth] = useState(() => storage.get(AUTH_KEY))
  const [isAdmin, setIsAdmin] = useState(() => storage.get(ADMIN_KEY) === '1' && Boolean(storage.get(AUTH_KEY)))

  async function login(password) {
    const secret = await openSecret(password)
    if (!secret) return false
    setAuth(secret)
    setIsAdmin(true)
    storage.set(AUTH_KEY, secret)
    storage.set(ADMIN_KEY, '1')
    return true
  }

  function logout() {
    setIsAdmin(false)
    setAuth('')
    storage.clear(ADMIN_KEY)
    storage.clear(AUTH_KEY)
  }

  return { isAdmin, auth, login, logout }
}
