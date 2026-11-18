import { useState } from 'react'
import { getTier } from '../constants/tiers.js'
import { formatLong, formatShort } from '../lib/date.js'
import { badgePhoto, counterStatus, getIssuer, isCounter, progress, seriesOf } from '../lib/badges.js'
import BadgeImage from './BadgeImage.jsx'
import NavBar from './NavBar.jsx'
import Footer from './Footer.jsx'
import { BackIcon, CheckIcon, ShieldIcon, TaskIcon } from './icons.jsx'

/** Trang chi tiết huy hiệu (giống trang badge của Credly). */
export default function BadgePage({
  data, badge, isAdmin, navProps,
  onBack, onToggle, onAddCount, onRemoveCount, onNewTerm, onOpenBadge,
  onEdit, onDelete, onVerify, onShare,
}) {
  const [confirmDelete, setConfirmDelete] = useState(false)
  const tier = getTier(badge.tier)
  const issuer = getIssuer(data, badge)
  const recipient = data.profile.name
  const earned = Boolean(badge.earnedAt)
  const p = progress(data, badge)
  const series = seriesOf(data, badge)

  return (
    <div className="sheet">
      <div className="wrap">
        <NavBar {...navProps} />
        <button className="crumb" onClick={onBack}><BackIcon /> Quay lại hồ sơ của {recipient}</button>

        <div className="bhero"><BadgeImage badge={badge} photo={badgePhoto(data, badge)} /></div>

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
            trong lĩnh vực này dưới sự giám sát gắt gao của {issuer.name}. Cấp độ {tier.label}.
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
          {badge.reqs.map((req, i) =>
            isCounter(req) ? (
              <CounterCriterion
                key={i}
                data={data}
                req={req}
                editable={isAdmin}
                onAdd={() => onAddCount(req.tracker)}
                onRemove={() => onRemoveCount(req.tracker)}
              />
            ) : (
              <Criterion key={i} req={req} editable={isAdmin} onToggle={() => onToggle(i)} />
            ),
          )}
        </section>

        {series.length > 1 && (
          <section className="blk">
            <h2>Các cấp độ trong chuỗi</h2>
            <div className="series">
              {series.map((b) => (
                <button key={b.id} className={`sitem${b.id === badge.id ? ' on' : ''}`} onClick={() => b.id !== badge.id && onOpenBadge(b.id)}>
                  <BadgeImage badge={b} photo={badgePhoto(data, b)} />
                  <span>{getTier(b.tier).label}</span>
                </button>
              ))}
            </div>
          </section>
        )}

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

/** Tiêu chí tick một lần. */
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

/**
 * Tiêu chí đếm số lần, hiện thành N ô tick (vd: 8 lần = 8 ô).
 * Vk Hơm bấm ô trống để +1 (ngày hôm nay), bấm ô vừa tick gần nhất để bỏ.
 */
function CounterCriterion({ data, req, editable, onAdd, onRemove }) {
  const s = counterStatus(data, req)
  const filled = s.done ? s.target : Math.min(s.thisPeriod, s.target)
  const dates = s.tracker.period ? [] : [...(s.tracker.log ?? [])].sort()

  return (
    <div className="counter-group">
      <div className="cg-head">
        <span>{req.t}</span>
        <b>{filled}/{s.target}</b>
      </div>
      {Array.from({ length: s.target }, (_, i) => {
        const done = i < filled
        const isLast = i === filled - 1
        const isNext = i === filled
        const tappable = editable && (isNext || isLast)
        const Tag = editable ? 'button' : 'div'
        return (
          <Tag
            key={i}
            className={`crit${done ? ' done' : ''}${tappable ? ' tap' : ''}`}
            onClick={tappable ? (isNext ? onAdd : onRemove) : undefined}
          >
            <span className="cico">{done ? <CheckIcon /> : <TaskIcon />}</span>
            <span className="ctx">
              {req.t} · lần {i + 1}
              {done && dates[i] && <span className="cdt">Hoàn thành {formatShort(dates[i])}</span>}
              {editable && isNext && <span className="chint">Bấm để tick hôm nay</span>}
            </span>
          </Tag>
        )
      })}
    </div>
  )
}
