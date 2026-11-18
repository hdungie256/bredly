import { useEffect, useRef, useState } from 'react'

const readHash = () => location.hash.match(/^#badge-(.+)$/)?.[1] ?? null

/** Trang chi tiết huy hiệu nằm trên URL (#badge-b2) để nút Back của điện thoại hoạt động. */
export function useBadgeRoute() {
  const [badgeId, setBadgeId] = useState(readHash)
  const openedHere = useRef(false)

  useEffect(() => {
    const onChange = () => setBadgeId(readHash())
    window.addEventListener('hashchange', onChange)
    return () => window.removeEventListener('hashchange', onChange)
  }, [])

  function open(id) {
    openedHere.current = true
    location.hash = `badge-${id}`
  }

  function close() {
    if (openedHere.current) {
      openedHere.current = false
      history.back()
    } else {
      history.replaceState(null, '', location.pathname + location.search)
      setBadgeId(null)
    }
  }

  return { badgeId, open, close }
}
