'use client'

interface DiscoveryEmailCaptureProps {
  onUnlock: () => void
}

export default function DiscoveryEmailCapture({ onUnlock }: DiscoveryEmailCaptureProps) {
  return (
    <div style={{ textAlign: 'center', maxWidth: '480px', margin: '32px auto 0' }}>
      <p style={{ fontSize: '18px', fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: '6px' }}>
        Want your full Texas Match Report?
      </p>
      <p style={{ fontSize: '14px', color: 'var(--color-text-secondary)', marginBottom: '20px', lineHeight: 1.6 }}>
        Enter your email to unlock detailed reports, affordability breakdowns, and school data for each community.
      </p>
      <button
        onClick={onUnlock}
        className="bg-accent text-white px-10 py-4 rounded-xl font-bold text-sm hover:bg-[#154d8a] transition-colors"
        style={{ boxShadow: '0 2px 10px rgba(26,95,168,0.28)' }}
      >
        Unlock My Full Report →
      </button>
    </div>
  )
}
