import { initials, progress } from '../lib/badges.js'
import { PinIcon } from './icons.jsx'

export default function ProfileHeader({ profile, badges }) {
  const earned = badges.filter((b) => b.earnedAt).length
  const totals = badges.reduce(
    (acc, b) => {
      const p = progress(b)
      return { done: acc.done + p.done, total: acc.total + p.total }
    },
    { done: 0, total: 0 },
  )

  return (
    <div className="phead">
      <div className="prow">
        <div className="ava">{profile.avatar ? <img src={profile.avatar} alt="" /> : initials(profile.name)}</div>
        <div>
          <h1 className="pname">{profile.name}</h1>
          <div className="ptitle">Người yêu toàn thời gian tại Nhà Vk Hơm</div>
          <div className="ploc"><PinIcon /> Trong tim Vk Hơm</div>
        </div>
      </div>
      <div className="pcount">
        <div><b>{earned}</b>Huy hiệu</div>
        <div><b>{badges.length - earned}</b>Chưa đạt</div>
        <div><b>{totals.done}/{totals.total}</b>Tiêu chí</div>
      </div>
    </div>
  )
}
