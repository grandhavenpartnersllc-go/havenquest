import type { Metadata } from 'next'
import Link from 'next/link'
import Header from '../../components/shared/Header'
import Footer from '../../components/shared/Footer'
import { ArrowRight, Map, MapPin } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Begin Your Journey — HavenQuest',
  description: 'Tell us where you are in your Texas relocation journey and we\'ll point you in the right direction.',
}

export default function BeginPage() {
  return (
    <>
      <Header />
      <main className="flex-1 bg-surface">

        <div className="max-w-3xl mx-auto px-4 py-20">

          <div className="text-center mb-12">
            <p className="text-xs font-bold uppercase tracking-widest mb-3"
               style={{ color: '#B8912A', letterSpacing: '0.18em' }}>
              Your Navigator Journey
            </p>
            <h1 className="text-4xl font-bold text-gray-900 tracking-tight mb-4">
              Where are you starting from?
            </h1>
            <p className="text-gray-500 text-lg max-w-md mx-auto leading-relaxed">
              Tell us where you are in your Texas journey and we&apos;ll take it from there.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-5">

            {/* Path 1 — Full quiz */}
            <div className="relative bg-white rounded-2xl p-8 border border-gray-100 flex flex-col"
                 style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 8px 32px rgba(0,0,0,0.08)' }}>
              <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-5"
                   style={{ backgroundColor: 'rgba(184,145,42,0.1)' }}>
                <Map size={22} strokeWidth={1.5} style={{ color: '#B8912A' }} />
              </div>
              <h2 className="text-xl font-bold text-gray-900 tracking-tight mb-3">
                I&apos;m not sure where in Texas yet
              </h2>
              <p className="text-gray-500 text-sm leading-relaxed flex-1 mb-6">
                Perfect. Tell us about your income, household, and what matters most to you — and we&apos;ll match you to the Texas communities where your life actually fits. Takes about 5 minutes.
              </p>
              <Link
                href="/explore"
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-bold text-sm transition-opacity hover:opacity-85 w-full"
                style={{ backgroundColor: '#B8912A', color: '#16120D' }}
              >
                Find My City <ArrowRight size={14} />
              </Link>
            </div>

            {/* Path 2 — Metro mode */}
            <div className="relative bg-white rounded-2xl p-8 border border-gray-100 flex flex-col"
                 style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 8px 32px rgba(0,0,0,0.08)' }}>
              <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center mb-5">
                <MapPin size={22} strokeWidth={1.5} className="text-gray-500" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 tracking-tight mb-3">
                I already know my metro
              </h2>
              <p className="text-gray-500 text-sm leading-relaxed flex-1 mb-6">
                Already set on Austin, DFW, Houston, or San Antonio? Dive straight into that metro and find the specific community within it that fits your life and budget.
              </p>
              <Link
                href="/metro"
                className="inline-flex items-center justify-center gap-2 border border-gray-200 text-gray-700 px-5 py-3 rounded-xl font-bold text-sm transition-all hover:border-gray-400 hover:text-gray-900 w-full"
              >
                Explore My Metro <ArrowRight size={14} />
              </Link>
            </div>

          </div>

          <p className="text-center text-xs text-gray-400 mt-8">
            Free to use · No account required to explore · Private portal included with your results
          </p>

        </div>
      </main>
      <Footer />
    </>
  )
}
