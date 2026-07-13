// Ask Amy — Part 1 shell (mechanism + identity only).
//
// This is the panel body for the dedicated right-side "Ask Amy" drawer. Part 1 is the SHELL
// only: Amy's avatar/identity header, a first-person scope intro, a DISABLED free-form box
// ("Soon"), and a footer scope line. There is intentionally NO curated Q&A, NO glossary, NO
// Market-Director handoff CTA, and NO activity logging here — those land in Part 2. The
// free-form box is deliberately disabled and wires NO AI call (that guardrail work is Phase 3).
//
// Rendered inside MM3Discover's right-side <aside> (desktop) and bottom-sheet (mobile); it is
// self-contained (own header + close) so Amy reads as her own distinct space, not a Refine drawer.

const NAVY = '#0A1E3D'
const GOLD = '#C5B783'
const INK = '#1c2430'
const MUTED = '#6a7180'
const LINE = '#dcdad2'

export default function AmyPanel({ onClose }: { onClose: () => void }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0 }}>
      {/* Header — Amy's identity + close (distinct from the Refine drawer's DRAWER_META header) */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '18px 20px 14px', borderBottom: '0.5px solid rgba(0,0,0,0.1)', flexShrink: 0 }}>
        <img
          src="/images/amy.jpg"
          alt="Amy"
          style={{ width: '44px', height: '44px', borderRadius: '50%', objectFit: 'cover', flexShrink: 0, border: `1.5px solid ${GOLD}` }}
        />
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ margin: 0, fontSize: '15px', fontWeight: 600, color: NAVY }}>Amy</p>
          <p style={{ margin: '2px 0 0', fontSize: '12px', color: MUTED }}>Your Texas relocation guide</p>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          style={{ width: '30px', height: '30px', flexShrink: 0, borderRadius: '8px', border: '0.5px solid rgba(0,0,0,0.1)', background: '#fff', color: MUTED, fontSize: '15px', lineHeight: 1, cursor: 'pointer' }}
        >
          ✕
        </button>
      </div>

      {/* Body */}
      <div style={{ flex: 1, overflowY: 'auto', minHeight: 0, padding: '18px 20px 20px' }}>
        {/* First-person scope intro — Amy's voice */}
        <p style={{ fontSize: '13px', color: INK, lineHeight: 1.6, margin: '0 0 12px' }}>
          Hi, I&rsquo;m Amy — your relocation guide. I can explain Texas terms and how the
          home-buying process works here, in plain language, right in this panel.
        </p>
        <p style={{ fontSize: '13px', color: INK, lineHeight: 1.6, margin: '0 0 18px' }}>
          For anything specific to your move — what you can afford, an offer, or anything legal —
          your Market Director is the right person, and I&rsquo;ll point you to them.
        </p>

        {/* Free-form box — present but DISABLED ("Soon"); no live call wired (Phase 3) */}
        <div style={{ position: 'relative', marginBottom: '8px' }}>
          <input
            type="text"
            disabled
            placeholder="Ask Amy anything…"
            style={{
              width: '100%', boxSizing: 'border-box', padding: '11px 62px 11px 13px',
              fontSize: '13px', fontFamily: 'inherit', color: MUTED,
              background: '#F7F7F5', border: `1px solid ${LINE}`, borderRadius: '10px',
              cursor: 'not-allowed',
            }}
          />
          <span
            style={{
              position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)',
              fontSize: '10px', fontWeight: 600, letterSpacing: '0.4px', textTransform: 'uppercase',
              color: NAVY, background: GOLD, borderRadius: '6px', padding: '3px 7px', pointerEvents: 'none',
            }}
          >
            Soon
          </span>
        </div>
        <p style={{ fontSize: '11px', color: MUTED, lineHeight: 1.5, margin: 0 }}>
          Free-form questions turn on once Amy&rsquo;s answer guardrails are in place.
        </p>
      </div>

      {/* Footer scope line */}
      <div style={{ borderTop: '0.5px solid rgba(0,0,0,0.08)', padding: '12px 20px', flexShrink: 0 }}>
        <p style={{ fontSize: '10.5px', color: MUTED, lineHeight: 1.5, margin: 0 }}>
          Amy shares general, educational info only. Your Market Director handles anything specific to your move.
        </p>
      </div>
    </div>
  )
}
