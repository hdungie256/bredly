import { useId } from 'react'
import { getTier } from '../constants/tiers.js'

// Lục giác ngoài và viền chấm bên trong (viewBox 200×210)
const HEX = 'M100 10 L184 58 L184 152 L100 200 L16 152 L16 58 Z'
const HEX_INNER = 'M100 24 L171 65 L171 145 L100 186 L29 145 L29 65 Z'
const FONT = "'Baloo 2', sans-serif"

/** Hình huy hiệu: lục giác màu theo cấp độ, ảnh Vk Hơm ở giữa, ruy băng tên. */
export function BadgeArt({ badge, photo }) {
  const tier = getTier(badge.tier)
  const uid = useId().replace(/:/g, '')
  const gradientId = `grad${uid}`
  const clipId = `clip${uid}`
  const fontSize = Math.min(16, Math.floor(235 / Math.max(badge.name.length, 8)))

  return (
    <svg viewBox="0 0 200 210" fontFamily={FONT}>
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={tier.light} />
          <stop offset="1" stopColor={tier.main} />
        </linearGradient>
        <clipPath id={clipId}><circle cx="100" cy="92" r="38" /></clipPath>
      </defs>

      <path d={HEX} fill={`url(#${gradientId})`} stroke={`url(#${gradientId})`} strokeWidth="14" strokeLinejoin="round" />
      <path d={HEX_INNER} fill="none" stroke="#fff" strokeOpacity=".6" strokeWidth="2.2" strokeLinejoin="round" strokeDasharray="1 5" strokeLinecap="round" />
      <text x="100" y="44" textAnchor="middle" fontSize="10" fontWeight="800" letterSpacing="1.6" fill="#fff">bubu certified</text>
      <Sparkles />

      <circle cx="100" cy="92" r="43" fill="#fff" />
      {photo ? (
        <image href={photo} x="58" y="50" width="84" height="84" clipPath={`url(#${clipId})`} preserveAspectRatio="xMidYMid slice" />
      ) : (
        <PlaceholderFace clipId={clipId} />
      )}
      <circle cx="100" cy="92" r="38" fill="none" stroke={tier.light} strokeWidth="2" />

      {/* Ruy băng tên */}
      <path d="M10 136 L36 136 L36 162 L10 162 L19 149Z" fill={tier.dark} />
      <path d="M190 136 L164 136 L164 162 L190 162 L181 149Z" fill={tier.dark} />
      <rect x="24" y="130" width="152" height="28" rx="6" fill="#fff" />
      <text x="100" y={149 + (fontSize - 14) / 3} textAnchor="middle" fontSize={fontSize} fontWeight="800" fill={tier.dark}>
        {badge.name}
      </text>

      <text x="100" y="178" textAnchor="middle" fontSize="9.5" fontWeight="800" letterSpacing="1.8" fill="#fff">
        {tier.label.toUpperCase()}
      </text>
      <text x="100" y="192" textAnchor="middle" fontSize="9" fill="#fff" opacity=".9">♥</text>
    </svg>
  )
}

/** Huy hiệu chưa mở khoá: chỉ hiện ổ khoá, không lộ hình. */
export function LockedArt({ badge }) {
  const tier = getTier(badge.tier)
  return (
    <svg viewBox="0 0 200 210" fontFamily={FONT}>
      <path d={HEX} fill="#EBEBEB" stroke="#EBEBEB" strokeWidth="14" strokeLinejoin="round" />
      <path d={HEX_INNER} fill="none" stroke="#fff" strokeWidth="2.2" strokeLinejoin="round" strokeDasharray="1 5" strokeLinecap="round" />
      <text x="100" y="44" textAnchor="middle" fontSize="10" fontWeight="800" letterSpacing="1.6" fill="#B5B5B5">bubu certified</text>
      <circle cx="100" cy="100" r="40" fill="#fff" />
      <path d="M86 96 v-10 a14 14 0 0 1 28 0 v10" fill="none" stroke="#A8A8A8" strokeWidth="7" strokeLinecap="round" />
      <rect x="78" y="94" width="44" height="34" rx="8" fill="#A8A8A8" />
      <circle cx="100" cy="108" r="4.5" fill="#fff" />
      <rect x="98" y="110" width="4" height="9" rx="2" fill="#fff" />
      <text x="100" y="168" textAnchor="middle" fontSize="9.5" fontWeight="800" letterSpacing="1.8" fill={tier.main} opacity=".8">
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

function Sparkles() {
  return (
    <g fill="#fff">
      <path d="M44 82 l2 5 5 2 -5 2 -2 5 -2 -5 -5 -2 5 -2z" opacity=".85" />
      <path d="M156 76 l1.6 4 4 1.6 -4 1.6 -1.6 4 -1.6 -4 -4 -1.6 4 -1.6z" opacity=".85" />
      <path d="M152 104 c0-3 4-3 4 0 c0-3 4-3 4 0 c0 3-4 5-4 6 c0-1-4-3-4-6z" opacity=".8" />
    </g>
  )
}

/** Mặt cười tạm thời khi chưa có ảnh. */
function PlaceholderFace({ clipId }) {
  return (
    <g clipPath={`url(#${clipId})`}>
      <rect x="58" y="50" width="84" height="84" fill="#FFE6EE" />
      <path d="M62 92 Q64 52 100 52 Q136 52 138 92 Q130 70 100 68 Q72 70 62 92Z" fill="#5B3A4A" />
      <ellipse cx="88" cy="95" rx="3.6" ry="4.6" fill="#3A2533" />
      <ellipse cx="112" cy="95" rx="3.6" ry="4.6" fill="#3A2533" />
      <circle cx="89.3" cy="93.4" r="1.3" fill="#fff" />
      <circle cx="113.3" cy="93.4" r="1.3" fill="#fff" />
      <ellipse cx="80" cy="105" rx="6" ry="3.6" fill="#FF8FB1" opacity=".7" />
      <ellipse cx="120" cy="105" rx="6" ry="3.6" fill="#FF8FB1" opacity=".7" />
      <path d="M94 106 Q100 112 106 106" stroke="#3A2533" strokeWidth="2.4" fill="none" strokeLinecap="round" />
    </g>
  )
}
