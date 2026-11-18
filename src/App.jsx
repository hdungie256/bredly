import { useState } from 'react'
import { useAdmin } from './hooks/useAdmin.js'
import { useBadgeRoute } from './hooks/useBadgeRoute.js'
import { useBadgeStore } from './hooks/useBadgeStore.js'
import { useToast } from './hooks/useToast.jsx'
import { getIssuer } from './lib/badges.js'
import { today } from './lib/date.js'
import NavBar from './components/NavBar.jsx'
import ProfileHeader from './components/ProfileHeader.jsx'
import BadgeList from './components/BadgeList.jsx'
import BadgePage from './components/BadgePage.jsx'
import Footer from './components/Footer.jsx'
import LoginModal from './components/LoginModal.jsx'
import AdminMenu from './components/AdminMenu.jsx'
import BadgeEditor from './components/BadgeEditor.jsx'
import VerifyModal from './components/VerifyModal.jsx'
import Celebration from './components/Celebration.jsx'

const SAVE_ERRORS = {
  auth: 'Không có quyền lưu, cần cấu hình lại',
  conflict: 'Dữ liệu vừa bị sửa ở nơi khác, tải lại trang rồi thử lại',
}

export default function App() {
  const admin = useAdmin()
  const store = useBadgeStore(admin.auth)
  const route = useBadgeRoute()
  const notify = useToast()

  const [tab, setTab] = useState('earned')
  const [tier, setTier] = useState('all')
  // modal: null | 'login' | 'menu' | 'verify' | { edit: badgeId | null }
  const [modal, setModal] = useState(null)
  const [celebrating, setCelebrating] = useState(null)

  if (store.status !== 'ready') {
    return (
      <div className="wrap">
        <div className="nav"><div className="logo">bredly</div></div>
        <div className="empty">
          {store.status === 'loading' ? 'Đang tải huy hiệu…' : 'Không tải được dữ liệu 😢 thử tải lại trang nha'}
        </div>
      </div>
    )
  }

  const { data } = store
  const badge = data.badges.find((b) => b.id === route.badgeId)
  const navProps = {
    isAdmin: admin.isAdmin,
    onLogin: () => setModal('login'),
    onMenu: () => setModal('menu'),
  }

  function toggleRequirement(index) {
    const unlocked = store.toggleRequirement(badge.id, index, today())
    if (unlocked) setCelebrating(badge.id)
  }

  function saveBadge(form) {
    const id = store.upsertBadge(modal.edit, form)
    setModal(null)
    if (!modal.edit) route.open(id)
    notify('Nhớ bấm Lưu thay đổi nha')
  }

  function deleteBadge() {
    store.deleteBadge(badge.id)
    route.close()
    notify('Đã xoá, nhớ Lưu nha')
  }

  function logout() {
    admin.logout()
    setModal(null)
    if (store.dirty) notify('Có thay đổi chưa lưu đó nha!')
  }

  async function save() {
    notify('Đang lưu…')
    try {
      await store.save()
      notify(`Đã lưu ✓ ${data.profile.name} sẽ thấy ngay khi mở lại trang`)
    } catch (e) {
      notify(SAVE_ERRORS[e.code] ?? 'Lưu lỗi rồi, thử lại nhé')
    }
  }

  async function share() {
    const text = `${data.profile.name} vừa nhận được huy hiệu "${badge.name}" từ ${getIssuer(data, badge).name} trên Bredly 🎉`
    try {
      await navigator.clipboard.writeText(text)
      notify('Đã sao chép để chia sẻ ✓')
    } catch {
      notify(text)
    }
  }

  const celebratedBadge = data.badges.find((b) => b.id === celebrating)

  const showSaveBar = admin.isAdmin && store.dirty

  return (
    <div className={showSaveBar ? 'has-savebar' : ''}>
      <div className="wrap">
        <NavBar {...navProps} />
        <ProfileHeader profile={data.profile} badges={data.badges} />
        <BadgeList data={data} tab={tab} onTab={setTab} tier={tier} onTier={setTier} onOpen={route.open} />
        <Footer />
      </div>

      {badge && (
        <BadgePage
          key={badge.id}
          data={data}
          badge={badge}
          isAdmin={admin.isAdmin}
          navProps={navProps}
          onBack={route.close}
          onToggle={toggleRequirement}
          onEdit={() => setModal({ edit: badge.id })}
          onDelete={deleteBadge}
          onVerify={() => setModal('verify')}
          onShare={share}
        />
      )}

      {showSaveBar && (
        <div className="savebar">
          <button onClick={save} disabled={store.saving}>{store.saving ? 'Đang lưu…' : 'Lưu thay đổi'}</button>
        </div>
      )}

      {modal === 'login' && <LoginModal onLogin={admin.login} onClose={() => setModal(null)} />}
      {modal === 'menu' && (
        <AdminMenu
          profile={data.profile}
          onUpdateProfile={store.updateProfile}
          onNewBadge={() => setModal({ edit: null })}
          onLogout={logout}
          onClose={() => setModal(null)}
        />
      )}
      {modal?.edit !== undefined && (
        <BadgeEditor
          badge={data.badges.find((b) => b.id === modal.edit) ?? null}
          issuers={data.issuers}
          onSave={saveBadge}
          onClose={() => setModal(null)}
        />
      )}
      {modal === 'verify' && badge?.earnedAt && (
        <VerifyModal badge={badge} issuer={getIssuer(data, badge)} recipient={data.profile.name} onClose={() => setModal(null)} />
      )}

      {celebratedBadge && (
        <Celebration
          badge={celebratedBadge}
          issuer={getIssuer(data, celebratedBadge)}
          recipient={data.profile.name}
          photo={data.profile.photo}
          onClose={() => setCelebrating(null)}
        />
      )}
    </div>
  )
}
