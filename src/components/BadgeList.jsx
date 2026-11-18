import { TIERS, TIER_ORDER } from '../constants/tiers.js'
import { badgePhoto, getIssuer, isEarned, progress } from '../lib/badges.js'
import BadgeImage from './BadgeImage.jsx'

const TABS = [
  { key: 'earned', label: 'Đã đạt được' },
  { key: 'locked', label: 'Chưa đạt được' },
]

/** Tab Đã đạt / Chưa đạt + bộ lọc cấp độ + lưới huy hiệu (giống trang hồ sơ Credly). */
export default function BadgeList({ data, tab, onTab, tier, onTier, onOpen }) {
  const earned = data.badges.filter(isEarned)
  const locked = data.badges.filter((b) => !isEarned(b))
  const counts = { earned: earned.length, locked: locked.length }

  const list = (tab === 'earned' ? earned : locked)
    .filter((b) => tier === 'all' || b.tier === tier)
    .sort((a, b) =>
      tab === 'earned'
        ? b.earnedAt.localeCompare(a.earnedAt)
        : progress(data, b).percent - progress(data, a).percent,
    )

  return (
    <>
      <div className="tabs">
        {TABS.map((t) => (
          <button key={t.key} className={`tab${tab === t.key ? ' on' : ''}`} onClick={() => onTab(t.key)}>
            {t.label} ({counts[t.key]})
          </button>
        ))}
      </div>

      <div className="toolbar">
        <div className="tot"><b>{list.length}</b> huy hiệu</div>
        <div className="sel">
          <select value={tier} onChange={(e) => onTier(e.target.value)}>
            <option value="all">Tất cả cấp độ</option>
            {TIER_ORDER.map((k) => <option key={k} value={k}>{TIERS[k].label}</option>)}
          </select>
        </div>
      </div>

      {list.length ? (
        <div className="grid">
          {list.map((b) => (
            <BadgeTile key={b.id} data={data} badge={b} onOpen={onOpen} />
          ))}
        </div>
      ) : (
        <div className="empty">
          {tab === 'earned'
            ? `Chưa có huy hiệu nào. Cố lên ${data.profile.name} ơi! 💪`
            : 'Không còn huy hiệu nào để cày. Quá đỉnh! 🏆'}
        </div>
      )}
    </>
  )
}

function BadgeTile({ data, badge, onOpen }) {
  const p = progress(data, badge)
  const issuer = getIssuer(data, badge)
  const photo = badgePhoto(data, badge)
  return (
    <button className="bi" onClick={() => onOpen(badge.id)}>
      <BadgeImage badge={badge} photo={photo} />
      <div className="bname">{badge.name}</div>
      <div className="biss">{issuer.name}</div>
      {!badge.earnedAt && (
        <>
          <div className="pbar"><i style={{ width: `${p.percent}%` }} /></div>
          <div className="bmeta">{p.done}/{p.total} tiêu chí</div>
        </>
      )}
    </button>
  )
}
