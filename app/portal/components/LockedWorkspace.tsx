import { Lock, Check } from 'lucide-react'
import type React from 'react'

type IconComponent = React.ComponentType<{ size?: number; style?: React.CSSProperties }>

interface LockedWorkspaceProps {
  mmNumber: number
  name: string
  StageIcon: IconComponent
  description: string
  features: string[]
  unlockCondition: string
}

export default function LockedWorkspace({
  mmNumber,
  name,
  StageIcon,
  description,
  features,
  unlockCondition,
}: LockedWorkspaceProps) {
  const isHome = mmNumber === 10

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div
        style={{
          padding: '20px 24px 16px',
          borderBottom: '0.5px solid var(--panel-border)',
          backgroundColor: 'var(--panel-bg)',
          flexShrink: 0,
        }}
      >
        <p style={{ fontSize: '11px', color: 'var(--text-muted)', margin: 0, lineHeight: 1 }}>
          Your journey
          <span style={{ margin: '0 5px' }}>›</span>
          <span style={{ color: 'var(--text-secondary)' }}>
            MM{mmNumber} — {name}
          </span>
        </p>
      </div>

      <div
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '40px 24px',
          overflowY: 'auto',
        }}
      >
        <div
          style={{
            maxWidth: '560px',
            width: '100%',
            backgroundColor: 'var(--card-bg)',
            border: '1px solid var(--card-border)',
            borderRadius: '16px',
            padding: '40px 36px',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '14px',
              marginBottom: '20px',
            }}
          >
            <Lock size={26} style={{ color: 'var(--text-muted)' }} />
            <StageIcon
              size={26}
              style={{ color: isHome ? '#C5B783' : 'var(--text-secondary)' }}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '12px' }}>
            <span
              style={{
                backgroundColor: '#0A1E3D',
                color: '#ffffff',
                fontSize: '10px',
                fontWeight: 700,
                padding: '3px 12px',
                borderRadius: '20px',
                letterSpacing: '0.07em',
              }}
            >
              MM{mmNumber}
            </span>
          </div>

          <h2
            style={{
              fontSize: '26px',
              fontWeight: 700,
              textAlign: 'center',
              color: isHome ? '#C5B783' : 'var(--text-primary)',
              margin: '0 0 14px',
              lineHeight: 1.2,
            }}
          >
            {name}
          </h2>

          <p
            style={{
              fontSize: '14px',
              lineHeight: 1.7,
              color: 'var(--text-secondary)',
              textAlign: 'center',
              margin: '0 0 28px',
            }}
          >
            {description}
          </p>

          <div style={{ borderTop: '1px solid var(--card-border)', marginBottom: '18px' }} />

          <p
            style={{
              fontSize: '10px',
              fontWeight: 600,
              letterSpacing: '0.08em',
              color: 'var(--text-muted)',
              margin: '0 0 12px',
              textTransform: 'uppercase',
            }}
          >
            What happens in this stage
          </p>

          <ul
            style={{
              margin: '0 0 24px',
              padding: 0,
              listStyle: 'none',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
            }}
          >
            {features.map((f) => (
              <li key={f} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                <Check size={14} style={{ color: 'var(--success-color)', flexShrink: 0, marginTop: '2px' }} />
                <span style={{ fontSize: '13px', color: 'var(--text-primary)', lineHeight: 1.5 }}>{f}</span>
              </li>
            ))}
          </ul>

          <div
            style={{
              backgroundColor: 'var(--accent-blue-light)',
              borderRadius: '10px',
              padding: '10px 14px',
              marginBottom: '16px',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '8px',
            }}
          >
            <Lock size={12} style={{ color: 'var(--accent-blue)', flexShrink: 0, marginTop: '2px' }} />
            <span style={{ fontSize: '12px', color: 'var(--accent-blue)', lineHeight: 1.5 }}>
              <strong>Unlocks: </strong>
              {unlockCondition}
            </span>
          </div>

          <p
            style={{
              textAlign: 'center',
              fontSize: '11px',
              color: 'var(--text-muted)',
              margin: 0,
              fontStyle: 'italic',
            }}
          >
            Coming in your journey
          </p>
        </div>
      </div>
    </div>
  )
}
