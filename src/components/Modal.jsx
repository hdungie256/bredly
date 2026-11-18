/** Hộp thoại giữa màn hình, kiểu Credly. */
export default function Modal({ title, onClose, footer, children }) {
  return (
    <div className="modal">
      <div className="ov" onClick={onClose} />
      <div className="mbox">
        <div className="mh">
          {title}
          <button onClick={onClose} aria-label="Đóng">×</button>
        </div>
        <div className="mb">{children}</div>
        {footer && <div className="mf">{footer}</div>}
      </div>
    </div>
  )
}
