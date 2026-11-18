import { useMemo } from 'react'
import { BadgeArt } from './BadgeImage.jsx'

const EMOJIS = ['💖', '🎉', '✨', '💕', '🌸', '⭐', '🎀']

/** Popup chúc mừng + mưa emoji khi vừa mở khoá huy hiệu. */
export default function Celebration({ badge, issuer, recipient, photo, onClose }) {
  const confetti = useMemo(
    () =>
      Array.from({ length: 36 }, (_, i) => ({
        emoji: EMOJIS[i % EMOJIS.length],
        left: `${Math.random() * 100}vw`,
        size: `${18 + Math.random() * 18}px`,
        duration: `${2.2 + Math.random() * 2}s`,
        delay: `${i * 0.06}s`,
      })),
    [],
  )

  return (
    <div className="cele" onClick={onClose}>
      <div className="cbox">
        <div className="eyebrow">Chúc mừng!</div>
        <div className="bimg" style={{ marginTop: 12 }}><BadgeArt badge={badge} photo={photo} /></div>
        <h2>{recipient} vừa nhận được huy hiệu mới</h2>
        <p>{badge.name} · cấp bởi {issuer.name}</p>
        <button className="b pri" style={{ width: '100%' }}>Tuyệt vời!</button>
      </div>
      {confetti.map((c, i) => (
        <div
          key={i}
          className="fall"
          style={{ left: c.left, fontSize: c.size, animationDuration: c.duration, animationDelay: c.delay }}
        >
          {c.emoji}
        </div>
      ))}
    </div>
  )
}
