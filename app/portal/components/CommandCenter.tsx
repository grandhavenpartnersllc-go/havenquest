'use client'

export default function CommandCenter() {
  return (
    <aside
      style={{
        width: '240px',
        minWidth: '240px',
        height: '100%',
        backgroundColor: 'var(--panel-bg)',
        borderLeft: '0.5px solid var(--panel-border)',
        display: 'flex',
        flexDirection: 'column',
        overflowY: 'auto',
        flexShrink: 0,
      }}
    >
      <p
        style={{
          fontSize: '10px',
          fontWeight: 600,
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          color: 'var(--text-secondary)',
          padding: '16px 16px 8px',
          margin: 0,
        }}
      >
        Command Center
      </p>
    </aside>
  )
}
