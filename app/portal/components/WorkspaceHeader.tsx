interface WorkspaceHeaderProps {
  mmNumber: number
  name: string
  deliverable?: string
}

export default function WorkspaceHeader({ mmNumber, name, deliverable }: WorkspaceHeaderProps) {
  return (
    <div
      style={{
        padding: '20px 24px 16px',
        borderBottom: '0.5px solid var(--panel-border)',
        backgroundColor: 'var(--panel-bg)',
        flexShrink: 0,
      }}
    >
      <p style={{ fontSize: '11px', color: 'var(--text-muted)', margin: '0 0 6px', lineHeight: 1 }}>
        Your journey
        <span style={{ margin: '0 5px' }}>›</span>
        <span style={{ color: 'var(--text-secondary)' }}>MM{mmNumber} — {name}</span>
      </p>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: '16px' }}>
        <h1
          style={{
            fontSize: '20px',
            fontWeight: 700,
            color: 'var(--text-primary)',
            margin: 0,
            lineHeight: 1.2,
          }}
        >
          {name}
        </h1>
        {deliverable && (
          <span
            style={{
              fontSize: '11px',
              fontWeight: 500,
              color: 'var(--accent-blue)',
              backgroundColor: 'var(--accent-blue-light)',
              padding: '3px 10px',
              borderRadius: '20px',
              flexShrink: 0,
              whiteSpace: 'nowrap',
            }}
          >
            {deliverable}
          </span>
        )}
      </div>
    </div>
  )
}
