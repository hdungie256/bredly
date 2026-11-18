export default function NavBar({ isAdmin, onLogin, onMenu }) {
  return (
    <>
      <div className="nav">
        <div className="logo">bredly</div>
        {isAdmin ? (
          <button className="signin on" onClick={onMenu}>Vk Hơm ▾</button>
        ) : (
          <button className="signin" onClick={onLogin}>Đăng nhập</button>
        )}
      </div>
      {isAdmin && <div className="abar">👑 Đang đăng nhập với quyền người cấp · mở badge để tick tiêu chí</div>}
    </>
  )
}
