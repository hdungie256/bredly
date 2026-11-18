const encoder = new TextEncoder()

const fromBase64 = (s) => Uint8Array.from(atob(s), (c) => c.charCodeAt(0))

/** Mở khoá secret.json (AES-GCM, khoá sinh từ mật khẩu bằng PBKDF2). */
export async function openSecret(password) {
  try {
    const res = await fetch(`${import.meta.env.BASE_URL}secret.json?t=${Date.now()}`, { cache: 'no-store' })
    if (!res.ok) return ''
    const { salt, iv, iter, data } = await res.json()
    const base = await crypto.subtle.importKey('raw', encoder.encode(password), 'PBKDF2', false, ['deriveKey'])
    const key = await crypto.subtle.deriveKey(
      { name: 'PBKDF2', salt: fromBase64(salt), iterations: iter, hash: 'SHA-256' },
      base,
      { name: 'AES-GCM', length: 256 },
      false,
      ['decrypt'],
    )
    const plain = await crypto.subtle.decrypt({ name: 'AES-GCM', iv: fromBase64(iv) }, key, fromBase64(data))
    return new TextDecoder().decode(plain)
  } catch {
    return ''
  }
}
