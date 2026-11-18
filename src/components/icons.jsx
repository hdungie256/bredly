const stroke = { fill: 'none', stroke: 'currentColor', strokeLinecap: 'round', strokeLinejoin: 'round' }

export const CheckIcon = () => (
  <svg viewBox="0 0 24 24" {...stroke} strokeWidth="3"><path d="M5 12.5l4.5 4.5L19 7.5" /></svg>
)

export const TaskIcon = () => (
  <svg viewBox="0 0 24 24" {...stroke} strokeWidth="2">
    <rect x="5" y="4" width="14" height="17" rx="2" />
    <path d="M9 4V3h6v1M9 11h6M9 15h4" />
  </svg>
)

export const BackIcon = () => (
  <svg viewBox="0 0 24 24" {...stroke} strokeWidth="2.4"><path d="M15 5l-7 7 7 7" /></svg>
)

export const ShieldIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2l8 3v6c0 5-3.5 9.5-8 11-4.5-1.5-8-6-8-11V5l8-3zm-1.2 13.6l6-6-1.4-1.4-4.6 4.6-2.2-2.2-1.4 1.4 3.6 3.6z" />
  </svg>
)

export const PinIcon = () => (
  <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
    <path d="M12 2a7 7 0 00-7 7c0 5 7 13 7 13s7-8 7-13a7 7 0 00-7-7zm0 9.5A2.5 2.5 0 1112 6.5a2.5 2.5 0 010 5z" />
  </svg>
)
