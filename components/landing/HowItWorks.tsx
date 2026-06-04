const CARDS = [
  {
    label: 'CLARITY',
    headline: 'Find where you belong.',
    copy: 'Tell us about your life — your income, your household, and what matters most to you. Our intelligence platform matches you to the Texas communities where your life genuinely fits. No guesswork. No endless tabs. Just clarity.',
  },
  {
    label: 'CONFIDENCE',
    headline: 'Meet your Market Director.',
    copy: "When you're ready to go deeper, your personal Market Director steps in. A real person who knows your destination market, knows your profile, and guides you from community discovery through closing day. You'll always know who to call.",
  },
  {
    label: 'PEACE OF MIND',
    headline: 'Every step. Handled.',
    copy: 'From your neighborhood search to your moving checklist, your Market Director keeps every piece of your relocation organized, tracked, and moving forward. Nothing falls through the cracks. You arrive prepared, connected, and at home.',
  },
]

const GOLD = '#B8912A'

export default function HowItWorks() {
  return (
    <section style={{ backgroundColor: '#F8F7F4' }} className="py-20 px-4">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="text-center mb-14">
          <p
            className="text-xs font-bold uppercase mb-4"
            style={{ color: GOLD, letterSpacing: '0.18em' }}
          >
            Your Journey With HavenQuest
          </p>
          <h2 className="text-4xl font-bold text-gray-900 tracking-tight">
            Three promises. One journey.
          </h2>
        </div>

        {/* Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          {CARDS.map(card => (
            <div
              key={card.label}
              className="bg-white rounded-2xl p-8 flex flex-col"
              style={{
                boxShadow: '0 1px 3px rgba(0,0,0,0.05), 0 8px 32px rgba(0,0,0,0.07)',
                borderTop: `3px solid ${GOLD}`,
              }}
            >
              <p
                className="text-[10px] font-bold uppercase mb-4 tracking-widest"
                style={{ color: GOLD }}
              >
                {card.label}
              </p>
              <h3 className="text-[18px] font-bold text-gray-900 tracking-tight mb-3">
                {card.headline}
              </h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                {card.copy}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}
