import Link from 'next/link'
import { Check } from 'lucide-react'
import Header from '../../components/shared/Header'
import Footer from '../../components/shared/Footer'

const GOLD = '#B8912A'
const DARK = '#08101C'

const STEPS = [
  {
    number: '01',
    title: 'Choose your metro',
    description:
      'Select Austin, Dallas-Fort Worth, Houston, or San Antonio. We\'ll focus your results entirely within that metro — matching you to the specific suburbs and corridors that fit your life.',
  },
  {
    number: '02',
    title: 'Tell us about your household',
    description:
      'Your annual income, household size, and housing preference — whether you\'re buying a starter home, a median home, or something in the luxury range. This anchors your affordability match to real numbers.',
  },
  {
    number: '03',
    title: 'Tell us about your commute and lifestyle',
    description:
      'How far are you willing to travel, and how do you want to live day-to-day? Your timeline and lifestyle context help us find the right corridor — not just the right city.',
  },
  {
    number: '04',
    title: 'Rank what matters to you',
    description:
      'Choose your Must Haves, Important to Me, and Would Be Nice across 12 lifestyle categories — schools, safety, affordability, walkability, remote work, and more. Anything you leave unranked carries zero weight in your results.',
  },
]

const WHAT_YOU_GET = [
  'Your matched submarket within your chosen metro',
  'School districts, commute realities, and lifestyle scores',
  'Honest local knowledge about each corridor',
  'A private portal with your complete report',
]

export default function MetroStartPage() {
  return (
    <>
      <Header />
      <main className="flex-1">

        {/* Dark header */}
        <div style={{ backgroundColor: DARK }} className="border-b border-white/8 px-4 py-14">
          <div className="max-w-2xl mx-auto">
            <p
              className="text-[10px] font-bold uppercase mb-4"
              style={{ color: GOLD, letterSpacing: '0.18em' }}
            >
              Metro Mode
            </p>
            <h1 className="text-[32px] font-bold text-white tracking-tight leading-tight mb-4">
              You know where you&apos;re going. Let&apos;s find exactly where you belong.
            </h1>
            <p className="text-base leading-relaxed" style={{ color: 'rgba(255,255,255,0.45)' }}>
              Already decided on Austin, Dallas, Houston, or San Antonio? We&apos;ll narrow it down
              to the right part of that metro for your life and budget.
            </p>
          </div>
        </div>

        {/* Light body */}
        <div className="bg-surface px-4 py-12">
          <div className="max-w-2xl mx-auto">

            {/* Steps */}
            <p
              className="text-[10px] font-bold uppercase mb-5"
              style={{ color: GOLD, letterSpacing: '0.18em' }}
            >
              How it works
            </p>
            <div className="space-y-4 mb-12">
              {STEPS.map((step) => (
                <div
                  key={step.number}
                  className="bg-white rounded-2xl p-6 flex gap-5"
                  style={{
                    boxShadow: '0 1px 3px rgba(0,0,0,0.05), 0 4px 20px rgba(0,0,0,0.07)',
                    borderLeft: `3px solid ${GOLD}`,
                  }}
                >
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5"
                    style={{ backgroundColor: DARK, color: GOLD }}
                  >
                    {step.number}
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 tracking-tight mb-1.5">
                      {step.title}
                    </h3>
                    <p className="text-sm text-gray-500 leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* What you get */}
            <p
              className="text-[10px] font-bold uppercase mb-5"
              style={{ color: GOLD, letterSpacing: '0.18em' }}
            >
              What you get
            </p>
            <ul className="space-y-3 mb-8">
              {WHAT_YOU_GET.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <div
                    className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                    style={{ backgroundColor: 'rgba(184,145,42,0.12)' }}
                  >
                    <Check size={11} strokeWidth={2.5} style={{ color: GOLD }} />
                  </div>
                  <span className="text-[15px] text-gray-700 leading-snug">{item}</span>
                </li>
              ))}
            </ul>

            {/* Bottom line + CTA */}
            <p className="text-sm text-gray-400 mb-6">
              About 3 minutes. Free. No commitment.
            </p>
            <Link
              href="/metro"
              className="inline-flex items-center gap-2 text-white font-bold px-8 py-4 rounded-xl text-sm transition-colors hover:bg-[#154d8a]"
              style={{
                backgroundColor: '#1A5FA8',
                boxShadow: '0 2px 10px rgba(26,95,168,0.28)',
              }}
            >
              Start Metro Match →
            </Link>
            <p className="text-sm text-gray-400 text-center mt-5">
              Not sure where you want to live?{' '}
              <Link href="/journey" className="text-gray-400 underline-offset-2 hover:text-gray-600 transition-colors" style={{ textDecoration: 'none' }}>
                Explore both options
              </Link>
            </p>

          </div>
        </div>

      </main>
      <Footer />
    </>
  )
}
