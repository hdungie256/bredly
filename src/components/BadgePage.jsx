import { useState } from 'react'
import { getTier } from '../constants/tiers.js'
import { formatLong, formatShort } from '../lib/date.js'
import { getIssuer, progress } from '../lib/badges.js'
import BadgeImage from './BadgeImage.jsx'
import NavBar from './NavBar.jsx'
import Footer from './Footer.jsx'
import { BackIcon, CheckIcon, ShieldIcon, TaskIcon } from './icons.jsx'

/** Trang chi tiết huy hiệu (giống trang badge của Credly). */
export default function BadgePage({ data, badge, isAdmin, onBack, onToggle, onEdit, onDelete, onVerify, onShare, navProps }) {
  const [confirmDelete, setConfirmDelete] = useState(false)
  const tier = getTier(badge.tier)
  const issuer = getIssuer(data, badge)
  const recipient = data.profile.name
  const earned = Boolean(badge.earnedAt)
  const p = progress(badge)

  return (
    <div className="sheet">
      <div className="wrap">
        <NavBar {...navProps} />
        <button className="crumb" onClick={onBack}><BackIcon /> Quay lại hồ sơ của {recipient}</button>

        <div className="bhero"><BadgeImage badge={badge} photo={data.profile.photo} /></div>

        <div className="bbody">
          <h1>{badge.name}</h1>
          <div className="issuedby">Cấp bởi <a>{issuer.name}</a></div>
          {earned && <div className="verified"><ShieldIcon /> Đã xác minh</div>}
        </div>

        <div className="ibox">
          {earned ? (
            <>
              <p>Huy hiệu này được cấp cho <b>{recipient}</b> vào {formatLong(badge.earnedAt)}</p>
              <div className="sub">Hết hạn: Không bao giờ (trừ khi Vk Hơm dỗi)</div>
              <div className="btns">
                <button className="b pri" onClick={onVerify}>Xác minh</button>
                <button className="b" onClick={onShare}>Chia sẻ</button>
              </div>
            </>
          ) : (
            <>
              <p>Huy hiệu này <b>chưa được cấp</b> cho {recipient}</p>
              <div className="sub">Hoàn thành tất cả tiêu chí bên dưới để nhận huy hiệu.</div>
              <div className="prog">
                <div className="pbar"><i style={{ width: `${p.percent}%` }} /></div>
                <span>{p.done}/{p.total}</span>
              </div>
            </>
          )}
        </div>

        <section className="blk">
          <h2>Mô tả</h2>
          <p className="desc">
            Người sở hữu huy hiệu <b>Bubu Certified: {badge.name} – {tier.label}</b> đã chứng minh năng lực vượt trội
            trong lĩnh vực này dưới sự giám sát gắt gao của {issuer.name}. Cấp độ {tier.label} ({tier.sub}).
          </p>
        </section>

        <section className="blk">
          <h2>Kỹ năng</h2>
          <div className="skills">
            {[tier.label, ...(issuer.skills ?? [])].map((s) => <span key={s} className="skill">{s}</span>)}
          </div>
        </section>

        <section className="blk">
          <h2>Tiêu chí đạt được</h2>
          {badge.reqs.map((req, i) => (
            <Criterion key={i} req={req} editable={isAdmin} onToggle={() => onToggle(i)} />
          ))}
        </section>

        {isAdmin && (
          <section className="blk">
            <div className="btns">
              <button className="b" onClick={onEdit}>Sửa huy hiệu</button>
              <button className="b danger" onClick={() => (confirmDelete ? onDelete() : setConfirmDelete(true))}>
                {confirmDelete ? 'Bấm lần nữa để xoá' : 'Xoá huy hiệu'}
              </button>
            </div>
          </section>
        )}

        <div className="spacer" />
        <Footer />
      </div>
    </div>
  )
}

function Criterion({ req, editable, onToggle }) {
  const Tag = editable ? 'button' : 'div'
  return (
    <Tag className={`crit${req.done ? ' done' : ''}${editable ? ' tap' : ''}`} onClick={editable ? onToggle : undefined}>
      <span className="cico">{req.done ? <CheckIcon /> : <TaskIcon />}</span>
      <span className="ctx">
        {req.t}
        {req.done && <span className="cdt">Hoàn thành {formatShort(req.done)}</span>}
      </span>
    </Tag>
  )
}
