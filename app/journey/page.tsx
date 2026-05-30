import Link from 'next/link'
import Header from '../../components/shared/Header'
import Footer from '../../components/shared/Footer'

const GOLD = '#B8912A'
const DARK = '#08101C'

export default function JourneyPage() {
  return (
    <>
      <Header />
      <main className="flex-1">

        {/* Dark header */}
        <div style={{ backgroundColor: DARK }} className="border-b border-white/8 px-4 py-16">
          <div className="max-w-2xl mx-auto text-center">
            <h1 className="text-[32px] md:text-[40px] font-bold text-white tracking-tight leading-tight mb-5">
              Two paths.{' '}
              <span style={{ color: GOLD }}>One destination.</span>
              <br />
              Let&apos;s find yours.
            </h1>
            <p className="text-base md:text-lg leading-relaxed max-w-xl mx-auto" style={{ color: 'rgba(255,255,255,0.45)' }}>
              Texas is calling — but the right community depends on who you are, what you value, and what you can afford.
            </p>
          </div>
        </div>

        {/* Light body */}
        <div className="bg-surface px-4 py-14">
          <div className="max-w-2xl mx-auto">

            <div className="grid sm:grid-cols-2 gap-5">

              {/* Card 1: Explore Texas */}
              <Link
                href="/explore-texas"
                className="group flex flex-col bg-white rounded-2xl p-8 transition-shadow hover:shadow-lg"
                style={{
                  boxShadow: '0 1px 3px rgba(0,0,0,0.05), 0 4px 20px rgba(0,0,0,0.07)',
                  borderTop: `3px solid ${GOLD}`,
                }}
              >
                <p
                  className="text-[10px] font-bold uppercase mb-4 tracking-widest"
                  style={{ color: GOLD }}
                >
                  Path 1
                </p>
                <h2 className="text-xl font-bold text-gray-900 tracking-tight mb-3">
                  Explore Texas
                </h2>
                <p className="text-sm text-gray-500 leading-relaxed mb-6 flex-1">
                  You&apos;re open to anywhere in the state. Tell us your lifestyle and budget and we&apos;ll match you to the right Texas community across 4 Texas metros and 101 cities.
                </p>
                <span
                  className="inline-flex items-center gap-1.5 text-sm font-bold mt-auto transition-colors group-hover:opacity-80"
                  style={{ color: GOLD }}
                >
                  Start here →
                </span>
              </Link>

              {/* Card 2: I Know My City */}
              <Link
                href="/metro-start"
                className="group flex flex-col bg-white rounded-2xl p-8 transition-shadow hover:shadow-lg"
                style={{
                  boxShadow: '0 1px 3px rgba(0,0,0,0.05), 0 4px 20px rgba(0,0,0,0.07)',
                  borderTop: `3px solid ${DARK}`,
                }}
              >
                <p
                  className="text-[10px] font-bold uppercase mb-4 tracking-widest"
                  style={{ color: 'rgba(8,16,28,0.45)' }}
                >
                  Path 2
                </p>
                <h2 className="text-xl font-bold text-gray-900 tracking-tight mb-3">
                  I Know My City
                </h2>
                <p className="text-sm text-gray-500 leading-relaxed mb-6 flex-1">
                  Already set on Austin, Dallas, Houston, or San Antonio? We&apos;ll zoom in and find the exact suburb or corridor within that metro that fits your life.
                </p>
                <span
                  className="inline-flex items-center gap-1.5 text-sm font-bold text-gray-700 mt-auto transition-colors group-hover:text-gray-900"
                >
                  Start here →
                </span>
              </Link>

            </div>
          </div>
        </div>

      </main>
      <Footer />
    </>
  )
}
