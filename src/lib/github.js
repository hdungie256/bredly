import { GITHUB } from '../config.js'

const { owner, repo, branch, dataPath } = GITHUB
const CONTENTS_URL = `https://api.github.com/repos/${owner}/${repo}/contents/${dataPath}`
const RAW_URL = `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/${dataPath}`

const toBase64 = (text) => {
  const bytes = new TextEncoder().encode(text)
  let bin = ''
  for (let i = 0; i < bytes.length; i += 0x8000) bin += String.fromCharCode(...bytes.subarray(i, i + 0x8000))
  return btoa(bin)
}
const fromBase64 = (b64) => new TextDecoder().decode(Uint8Array.from(atob(b64.replace(/\n/g, '')), (c) => c.charCodeAt(0)))

const headers = (auth) => ({
  Accept: 'application/vnd.github+json',
  ...(auth ? { Authorization: `Bearer ${auth}` } : {}),
})

export class SaveError extends Error {
  constructor(code) {
    super(code)
    this.code = code
  }
}

async function getFile(auth) {
  const res = await fetch(`${CONTENTS_URL}?ref=${branch}&t=${Date.now()}`, { headers: headers(auth), cache: 'no-store' })
  if (res.status === 401) throw new SaveError('auth')
  if (!res.ok) throw new SaveError(`http${res.status}`)
  return res.json()
}

/** Tải dữ liệu mới nhất. Lỗi API thì lấy bản raw (có thể trễ vài phút). */
export async function loadData(auth) {
  try {
    const file = await getFile(auth)
    if (file.content) return JSON.parse(fromBase64(file.content))
  } catch {
    /* thử cách dưới */
  }
  const res = await fetch(`${RAW_URL}?t=${Date.now()}`, { cache: 'no-store' })
  if (!res.ok) throw new Error('load_failed')
  return res.json()
}

/** Ghi data.json thành một commit mới trên GitHub. */
export async function saveData(data, auth) {
  if (!auth) throw new SaveError('auth')
  const { sha } = await getFile(auth)
  const res = await fetch(CONTENTS_URL, {
    method: 'PUT',
    headers: headers(auth),
    body: JSON.stringify({
      message: `Vk Hơm cập nhật huy hiệu 💖 ${new Date().toLocaleString('vi-VN')}`,
      content: toBase64(JSON.stringify(data, null, 1) + '\n'),
      branch,
      sha,
    }),
  })
  if (res.status === 401 || res.status === 403) throw new SaveError('auth')
  if (res.status === 409) throw new SaveError('conflict')
  if (!res.ok) throw new SaveError(`http${res.status}`)
}
