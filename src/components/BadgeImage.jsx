import { useId } from 'react'
import { BADGE_ACCENT, getTier } from '../constants/tiers.js'

// Lục giác đỉnh nhọn, viewBox 200×220
const HEX = 'M100 8 L186 58 L186 162 L100 212 L14 162 L14 58 Z'
const FONT = "Inter, 'Helvetica Neue', Arial, sans-serif"

/** Chia tên dài thành 2 dòng cho vừa khung. */
function splitName(name) {
  if (name.length <= 14) return [name]
  const words = name.split(' ')
  let best = [name]
  let bestDiff = Infinity
  for (let i = 1; i < words.length; i++) {
    const a = words.slice(0, i).join(' ')
    const b = words.slice(i).join(' ')
    const diff = Math.abs(a.length - b.length)
    if (diff < bestDiff) { bestDiff = diff; best = [a, b] }
  }
  return best
}

const Heart = ({ x, y, s = 1, fill }) => (
  <path
    transform={`translate(${x} ${y}) scale(${s})`}
    d="M0 6 C-5.5 2-7.5-0.6-7.5-3.2 a3.9 3.9 0 0 1 7.5-1.4 a3.9 3.9 0 0 1 7.5 1.4 C7.5-0.6 5.5 2 0 6z"
    fill={fill}
  />
)

/** Hình huy hiệu: lục giác gradient theo cấp, "bubu certified", ảnh, tên, cấp độ. */
export function BadgeArt({ badge, photo }) {
  const tier = getTier(badge.tier)
  const uid = useId().replace(/:/g, '')
  const grad = `g${uid}`
  const clip = `c${uid}`
  const lines = splitName(badge.name)

  return (
    <svg viewBox="0 0 200 220" fontFamily={FONT}>
      <defs>
        <linearGradient id={grad} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={tier.from} />
          <stop offset="1" stopColor={tier.to} />
        </linearGradient>
        <clipPath id={clip}><circle cx="100" cy="86" r="23.5" /></clipPath>
      </defs>

      <path d={HEX} fill={`url(#${grad})`} stroke={tier.border} strokeWidth="8" strokeLinejoin="round" />

      {/* bubu ♥ certified */}
      <text x="93" y="41" textAnchor="middle" fontSize="19" fontWeight="700" fill="#fff" letterSpacing="-.3">bubu</text>
      <Heart x={126} y={33} s={0.95} fill={BADGE_ACCENT} />
      <text x="100" y="55" textAnchor="middle" fontSize="13" fontWeight="400" fill="#fff">certified</text>

      {/* Ảnh */}
      <circle cx="100" cy="86" r="26" fill="#fff" />
      {photo ? (
        <image href={photo} x="76.5" y="62.5" width="47" height="47" clipPath={`url(#${clip})`} preserveAspectRatio="xMidYMid slice" />
      ) : (
        <PlaceholderFace clipId={clip} />
      )}

      <line x1="44" y1="120" x2="156" y2="120" stroke="#fff" strokeOpacity=".75" strokeWidth="1" />
      {lines.map((line, i) => (
        <text key={i} x="100" y={(lines.length === 1 ? 147 : 138) + i * 16} textAnchor="middle" fontSize={lines.length === 1 ? 15 : 14} fontWeight="800" fill="#fff">
          {line}
        </text>
      ))}
      <line x1="56" y1="164" x2="144" y2="164" stroke="#fff" strokeOpacity=".75" strokeWidth="1" />

      <text x="100" y="180" textAnchor="middle" fontSize="8.6" fontWeight="800" letterSpacing="1.4" fill="#fff">
        {tier.label.toUpperCase()}
      </text>
    </svg>
  )
}

/** Huy hiệu chưa mở khoá: chỉ hiện ổ khoá, không lộ hình. */
export function LockedArt({ badge }) {
  const tier = getTier(badge.tier)
  return (
    <svg viewBox="0 0 200 220" fontFamily={FONT}>
      <path d={HEX} fill="#E6E9ED" stroke="#D3D8DE" strokeWidth="8" strokeLinejoin="round" />
      <text x="93" y="41" textAnchor="middle" fontSize="19" fontWeight="700" fill="#AEB6C0" letterSpacing="-.3">bubu</text>
      <Heart x={126} y={33} s={0.95} fill="#C3CAD2" />
      <text x="100" y="55" textAnchor="middle" fontSize="13" fill="#AEB6C0">certified</text>
      <circle cx="100" cy="110" r="30" fill="#fff" />
      <path d="M89 108 v-8 a11 11 0 0 1 22 0 v8" fill="none" stroke="#A9B1BB" strokeWidth="5.5" strokeLinecap="round" />
      <rect x="83" y="106" width="34" height="26" rx="6" fill="#A9B1BB" />
      <circle cx="100" cy="117" r="3.6" fill="#fff" />
      <rect x="98.4" y="118" width="3.2" height="7" rx="1.6" fill="#fff" />
      <text x="100" y="180" textAnchor="middle" fontSize="8.6" fontWeight="800" letterSpacing="1.4" fill={tier.to} opacity=".55">
        {tier.label.toUpperCase()}
      </text>
    </svg>
  )
}

/** Tự chọn hình mở hay khoá. */
export default function BadgeImage({ badge, photo, className = 'bimg' }) {
  return (
    <div className={className}>
      {badge.earnedAt ? <BadgeArt badge={badge} photo={photo} /> : <LockedArt badge={badge} />}
    </div>
  )
}

/** Mặt cười tạm thời khi chưa có ảnh. */
function PlaceholderFace({ clipId }) {
  return (
    <g clipPath={`url(#${clipId})`}>
      <rect x="70" y="56" width="60" height="60" fill="#FFE6EE" />
      <g transform="translate(100 86) scale(0.8) translate(-100 -86)">
        <path d="M72 86 Q73 57 100 57 Q127 57 128 86 Q122 69 100 68 Q78 69 72 86Z" fill="#5B3A4A" />
        <ellipse cx="91" cy="89" rx="2.8" ry="3.5" fill="#3A2533" />
        <ellipse cx="109" cy="89" rx="2.8" ry="3.5" fill="#3A2533" />
        <ellipse cx="85" cy="97" rx="4.5" ry="2.7" fill="#FF8FB1" opacity=".7" />
        <ellipse cx="115" cy="97" rx="4.5" ry="2.7" fill="#FF8FB1" opacity=".7" />
        <path d="M95.5 98 Q100 102.5 104.5 98" stroke="#3A2533" strokeWidth="2" fill="none" strokeLinecap="round" />
      </g>
    </g>
  )
}
