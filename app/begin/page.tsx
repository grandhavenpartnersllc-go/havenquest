'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Header from '../../components/shared/Header'
import Footer from '../../components/shared/Footer'
import { ArrowRight, Map, MapPin } from 'lucide-react'

const LOCAL_SESSION_KEY = 'hq_session'

export default function BeginPage() {
  const router = useRouter()
  const [selectedPath, setSelectedPath] = useState<string | null>(null)
  const [firstName, setFirstName] = useState('')
  const [zip, setZip] = useState('')
  const [zipError, setZipError] = useState('')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!firstName.trim()) return
    if (!/^\d{5}$/.test(zip)) {
      setZipError('Please enter a valid 5-digit ZIP code')
      return
    }
    setZipError('')
    sessionStorage.setItem('hq_first_name', firstName.trim())
    sessionStorage.setItem('hq_origin_zip', zip.trim())
    const rawSession = localStorage.getItem(LOCAL_SESSION_KEY)
    if (rawSession) {
      try {
        const sess = JSON.parse(rawSession)
        localStorage.setItem(LOCAL_SESSION_KEY, JSON.stringify({ ...sess, firstName: firstName.trim() }))
      } catch {}
    }
    router.push(selectedPath!)
  }

  if (selectedPath) {
    return (
      <>
        <Header />
        <main className="flex-1 bg-surface">
          <div className="max-w-lg mx-auto px-4 py-20">
            <div className="text-center mb-10">
              <p className="text-xs font-bold uppercase tracking-widest mb-3"
                 style={{ color: '#B8912A', letterSpacing: '0.18em' }}>
                One last thing
              </p>
              <h1 className="text-3xl font-bold text-gray-900 tracking-tight mb-3">
                Before we begin — tell us a little about your move.
              </h1>
            </div>
            <form
              onSubmit={handleSubmit}
              className="bg-white rounded-2xl p-8 space-y-5"
              style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 8px 32px rgba(0,0,0,0.08)' }}
            >
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Your first name
                </label>
                <input
                  type="text"
                  value={firstName}
                  onChange={e => setFirstName(e.target.value)}
                  placeholder="Jennifer"
                  required
                  autoFocus
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  ZIP code you&apos;re moving from
                </label>
                <input
                  type="text"
                  value={zip}
                  onChange={e => { setZip(e.target.value); setZipError('') }}
                  placeholder="60614"
                  required
                  maxLength={5}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400"
                />
                {zipError && <p className="mt-1.5 text-xs text-red-500">{zipError}</p>}
              </div>
              <button
                type="submit"
                className="w-full py-3.5 rounded-xl font-bold text-sm text-white transition-opacity hover:opacity-90"
                style={{ backgroundColor: '#1A5FA8' }}
              >
                Let&apos;s Go →
              </button>
              <button
                type="button"
                onClick={() => setSelectedPath(null)}
                className="w-full text-sm text-gray-400 hover:text-gray-600 transition-colors font-medium"
              >
                ← Back
              </button>
            </form>
          </div>
        </main>
        <Footer />
      </>
    )
  }

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
              Where are you in your Texas journey?
            </h1>
            <p className="text-gray-500 text-lg max-w-md mx-auto leading-relaxed">
              Tell us where you are and we&apos;ll take it from there.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-5">

            {/* Path 1 — Explorer */}
            <button
              onClick={() => setSelectedPath('/explore')}
              className="relative bg-white rounded-2xl p-8 border border-gray-100 flex flex-col text-left transition-shadow hover:shadow-lg"
              style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 8px 32px rgba(0,0,0,0.08)' }}
            >
              <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-5"
                   style={{ backgroundColor: 'rgba(184,145,42,0.1)' }}>
                <Map size={22} strokeWidth={1.5} style={{ color: '#B8912A' }} />
              </div>
              <h2 className="text-xl font-bold text-gray-900 tracking-tight mb-3">
                I&apos;m still exploring
              </h2>
              <p className="text-gray-500 text-sm leading-relaxed flex-1 mb-6">
                Help me find the right Texas community based on my lifestyle, budget, and priorities.
              </p>
              <span className="inline-flex items-center gap-2 font-bold text-sm"
                    style={{ color: '#B8912A' }}>
                Find My Match <ArrowRight size={14} />
              </span>
            </button>

            {/* Path 2 — Metro */}
            <button
              onClick={() => setSelectedPath('/metro')}
              className="relative bg-white rounded-2xl p-8 border border-gray-100 flex flex-col text-left transition-shadow hover:shadow-lg"
              style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 8px 32px rgba(0,0,0,0.08)' }}
            >
              <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center mb-5">
                <MapPin size={22} strokeWidth={1.5} className="text-gray-500" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 tracking-tight mb-3">
                I know where I&apos;m headed
              </h2>
              <p className="text-gray-500 text-sm leading-relaxed flex-1 mb-6">
                I have a market in mind. Take me straight there.
              </p>
              <span className="inline-flex items-center gap-2 font-bold text-sm text-gray-700">
                Choose My Market <ArrowRight size={14} />
              </span>
            </button>

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
