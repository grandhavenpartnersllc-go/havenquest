'use client'

type JourneyHealth = 'on_track' | 'needs_attention' | 'at_risk'

interface Props {
  health: JourneyHealth
  onClick?: () => void
}

const CONFIG: Record<JourneyHealth, { label: string; bg: string; color: string }> = {
  on_track:         { label: 'On Track',         bg: 'rgba(34,197,94,0.12)',  color: '#16A34A' },
  needs_attention:  { label: 'Needs Attention',  bg: 'rgba(245,158,11,0.12)', color: '#D97706' },
  at_risk:          { label: 'At Risk',           bg: 'rgba(239,68,68,0.12)',  color: '#DC2626' },
}

export default function JourneyHealthBadge({ health, onClick }: Props) {
  const { label, bg, color } = CONFIG[health] ?? CONFIG.on_track
  return (
    <span
      onClick={onClick}
      style={{
        display: 'inline-block',
        padding: '3px 10px',
        borderRadius: '20px',
        fontSize: '11px',
        fontWeight: 600,
        backgroundColor: bg,
        color,
        cursor: onClick ? 'pointer' : 'default',
        userSelect: 'none',
      }}
    >
      {label}
    </span>
  )
}
