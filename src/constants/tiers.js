// Huy hiệu lục giác kiểu chứng chỉ cloud: mỗi cấp một tông màu (nền gradient + viền sáng)
export const BADGE_ACCENT = '#FF9900'

export const TIERS = {
  f: { label: 'Foundational', from: '#5F7186', to: '#27323F', border: '#9AB0C6' },
  a: { label: 'Associate', from: '#3D46FF', to: '#1A1C8C', border: '#4C9DF5' },
  p: { label: 'Professional', from: '#0FA3A0', to: '#07535A', border: '#4FDAD0' },
}

export const TIER_ORDER = ['f', 'a', 'p']

export const getTier = (key) => TIERS[key] ?? TIERS.f
