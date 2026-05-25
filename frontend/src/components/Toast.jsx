import { useEffect } from 'react'

export default function Toast({ message, onDismiss }) {
  useEffect(() => {
    const t = setTimeout(onDismiss, 6000)
    return () => clearTimeout(t)
  }, [message, onDismiss])

  return (
    <div className="toast toast-error" role="alert">
      <span className="toast-icon">⚠</span>
      <span className="toast-message">{message}</span>
      <button className="toast-close" onClick={onDismiss} aria-label="Dismiss">×</button>
    </div>
  )
}
