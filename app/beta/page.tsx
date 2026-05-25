'use client'

export default function BetaPage() {
  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#08101C',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundImage:
          'radial-gradient(ellipse 70% 50% at 50% 50%, rgba(26,95,168,0.15) 0%, transparent 65%)',
      }}
    >
      <a
        href="https://havenquest.co"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '14px 36px',
          borderRadius: 14,
          border: '1px solid rgba(255,255,255,0.1)',
          backgroundColor: 'rgba(255,255,255,0.05)',
          color: 'rgba(237,231,220,0.65)',
          fontSize: 14,
          fontWeight: 600,
          letterSpacing: '-0.01em',
          textDecoration: 'none',
          transition: 'all 0.2s',
        }}
        onMouseEnter={e => {
          const el = e.currentTarget
          el.style.backgroundColor = 'rgba(255,255,255,0.09)'
          el.style.borderColor = 'rgba(255,255,255,0.18)'
          el.style.color = 'rgba(237,231,220,0.9)'
        }}
        onMouseLeave={e => {
          const el = e.currentTarget
          el.style.backgroundColor = 'rgba(255,255,255,0.05)'
          el.style.borderColor = 'rgba(255,255,255,0.1)'
          el.style.color = 'rgba(237,231,220,0.65)'
        }}
      >
        Enter →
      </a>
    </div>
  )
}
