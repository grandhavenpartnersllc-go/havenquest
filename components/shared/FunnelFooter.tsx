import { HQ, SANS } from '../home/theme'

// Shared funnel footer — a minimal navy bar for the results / create-portal pages (sibling
// to FunnelHeader). Centered wordmark + one muted line; no nav links, no columns, so the
// funnel stays free of wander-off doors. Colors/font come from the homepage theme tokens so
// it matches FunnelHeader exactly.
export default function FunnelFooter() {
  return (
    <footer
      style={{
        background: HQ.navy,
        borderTop: '1px solid rgba(201,169,97,0.18)',
        padding: '22px 24px',
        textAlign: 'center',
      }}
    >
      <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: '14px', letterSpacing: '-0.01em', lineHeight: 1 }}>
        <span style={{ color: HQ.offwhite }}>Haven</span>
        <span style={{ color: HQ.gold }}>Quest</span>
      </div>
      <p style={{ fontFamily: SANS, fontSize: '11px', color: HQ.slate2, margin: '8px 0 0' }}>
        © 2026 HavenQuest · Clarity. Confidence. Peace of mind.
      </p>
    </footer>
  )
}
