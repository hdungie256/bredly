export const TIERS = {
  f: { label: 'Foundational', sub: 'Cưng Practitioner', light: '#FFB8D2', main: '#FF6FA5', dark: '#D23D78' },
  a: { label: 'Associate', sub: 'Người Yêu Associate', light: '#FFCDAE', main: '#FF8B5A', dark: '#D35E2C' },
  p: { label: 'Professional', sub: 'Bạn Trai Professional', light: '#D3C4FF', main: '#8E6CF1', dark: '#6545D2' },
  s: { label: 'Specialty', sub: 'Đặc Biệt', light: '#FFE38F', main: '#F2A228', dark: '#B9740A' },
}

export const TIER_ORDER = ['f', 'a', 'p', 's']

export const getTier = (key) => TIERS[key] ?? TIERS.f
