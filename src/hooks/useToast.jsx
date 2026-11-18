import { createContext, useCallback, useContext, useRef, useState } from 'react'

const ToastContext = createContext(() => {})

export function ToastProvider({ children }) {
  const [message, setMessage] = useState('')
  const [visible, setVisible] = useState(false)
  const timer = useRef()

  const notify = useCallback((text) => {
    setMessage(text)
    setVisible(true)
    clearTimeout(timer.current)
    timer.current = setTimeout(() => setVisible(false), 2600)
  }, [])

  return (
    <ToastContext.Provider value={notify}>
      {children}
      <div className={`toast${visible ? ' show' : ''}`}>{message}</div>
    </ToastContext.Provider>
  )
}

export const useToast = () => useContext(ToastContext)
