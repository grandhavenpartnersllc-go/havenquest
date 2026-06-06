const NAVY = '#002868'
const RED = '#BF0A30'
const MUTED = '#6B7280'
const BORDER = 'rgba(0,0,0,0.08)'

const STEPS = [
  { label: '01 · Discover', title: 'Tell us about your life', desc: 'Income, household, and what matters most to you in a community.' },
  { label: '02 · Match', title: 'Get your Texas matches', desc: 'Your top communities ranked by your priorities and budget.' },
  { label: '03 · Explore', title: 'Go deeper in your portal', desc: 'Full reports, financial breakdown, and community intelligence.' },
  { label: '04 · Connect', title: 'Meet your Market Director', desc: 'A real guide steps in — then introduces your Select Agent.' },
]

export default function HowItWorks() {
  return (
    <section style={{ padding: '28px 32px' }}>
      <p style={{ fontSize: '11px', letterSpacing: '2px', textTransform: 'uppercase', color: MUTED, marginBottom: '16px' }}>
        HOW IT WORKS
      </p>
      <div
        className="grid grid-cols-2 md:grid-cols-4"
        style={{ gap: '10px' }}
      >
        {STEPS.map(step => (
          <div
            key={step.label}
            style={{
              border: `0.5px solid ${BORDER}`,
              borderTop: `2px solid ${NAVY}`,
              borderRadius: '8px',
              padding: '14px',
              background: '#fff',
            }}
          >
            <p style={{ fontSize: '11px', color: RED, fontWeight: 500, marginBottom: '6px' }}>{step.label}</p>
            <p style={{ fontSize: '13px', fontWeight: 500, color: NAVY, marginBottom: '4px' }}>{step.title}</p>
            <p style={{ fontSize: '11px', color: MUTED, lineHeight: 1.5, margin: 0 }}>{step.desc}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
