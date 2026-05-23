import Link from 'next/link'
import { User, Sliders, MapPin, ArrowRight } from 'lucide-react'

const STEPS = [
  {
    number: '01',
    Icon: User,
    title: 'Tell us about your life',
    description:
      'Share your income, household size, housing preference, and moving timeline. Takes about 60 seconds and sets the foundation for your personalized matches.',
  },
  {
    number: '02',
    Icon: Sliders,
    title: 'Rank what matters to you',
    description:
      'Assign lifestyle categories to Must Have or Important to Me. Anything you leave out carries zero weight — so your results reflect exactly what you care about.',
  },
  {
    number: '03',
    Icon: MapPin,
    title: 'Discover your Texas match',
    description:
      'Get your top matched cities with verified scores, honest tradeoffs, real cost breakdowns, and vetted realtors ready to help you take the next step.',
  },
]

export default function HowItWorks() {
  return (
    <section style={{ backgroundColor: '#F8F7F4' }} className="py-20 px-4">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="text-center mb-14">
          <p
            className="text-xs font-bold uppercase mb-3"
            style={{ color: '#1A5FA8', letterSpacing: '0.18em' }}
          >
            Simple Process
          </p>
          <h2 className="text-4xl font-bold text-gray-900 tracking-tight mb-4">
            Three steps to find where you belong
          </h2>
          <p className="text-gray-500 text-lg max-w-lg mx-auto leading-relaxed">
            No guesswork. No generic lists. Just your life matched to the right Texas city.
          </p>
        </div>

        {/* Steps — desktop: row with arrow connectors; mobile: stacked */}
        <div className="flex flex-col md:flex-row items-stretch gap-4 md:gap-0 mb-12">
          {STEPS.map((step, i) => (
            <div key={step.number} className="contents">
              {/* Card */}
              <div
                className="flex-1 bg-white rounded-2xl p-7 flex flex-col"
                style={{
                  boxShadow: '0 1px 3px rgba(0,0,0,0.05), 0 8px 32px rgba(0,0,0,0.08)',
                  borderLeft: '3px solid #1A5FA8',
                }}
              >
                {/* Number badge */}
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center text-white text-base font-bold mb-5 shrink-0"
                  style={{ backgroundColor: '#0F172A' }}
                >
                  {step.number}
                </div>

                {/* Icon */}
                <step.Icon
                  size={22}
                  strokeWidth={1.5}
                  className="mb-4 shrink-0"
                  style={{ color: '#1A5FA8' }}
                />

                <h3 className="text-[17px] font-bold text-gray-900 tracking-tight mb-2">
                  {step.title}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed">
                  {step.description}
                </p>
              </div>

              {/* Arrow connector — desktop only, between cards */}
              {i < STEPS.length - 1 && (
                <div className="hidden md:flex items-center justify-center w-10 shrink-0 self-center">
                  <ArrowRight size={18} strokeWidth={1.5} style={{ color: '#93C5FD' }} />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center">
          <p className="text-gray-500 text-sm mb-4">Ready to find your city?</p>
          <Link
            href="/explore"
            className="inline-flex items-center gap-2 text-white font-bold px-8 py-3.5 rounded-xl text-sm transition-colors"
            style={{
              backgroundColor: '#1A5FA8',
              boxShadow: '0 2px 10px rgba(26,95,168,0.28)',
            }}
          >
            Start My Match →
          </Link>
        </div>

      </div>
    </section>
  )
}
