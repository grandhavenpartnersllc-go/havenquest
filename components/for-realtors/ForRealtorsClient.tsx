'use client'

import { useState } from 'react'
import { Check, Clock, UserCheck, Heart, ShieldCheck, FileText, Star } from 'lucide-react'
import { formatPhone } from '../../utils/formatters'

const GOLD = '#B8912A'
const DARK = '#08101C'


const MARKET_ZONES = [
  {
    group: 'AUSTIN METRO',
    zones: [
      'Urban Core Austin', 'Westlake / West Austin', 'Northwest Austin / Cedar Park / Leander',
      'Round Rock / Pflugerville / Hutto Corridor', 'South Austin', 'Southwest Austin / Dripping Springs',
      'Lake Travis / Hill Country Galleria', 'Georgetown / North Growth Corridor', 'East Austin',
      'Kyle / Buda / South Growth Corridor', 'Austin Hill Country',
    ],
  },
  {
    group: 'DALLAS-FORT WORTH METRO',
    zones: [
      'Urban Core Dallas', 'North Dallas / Platinum Corridor', 'Collin County Growth Corridor',
      'Luxury North Suburbs', 'Mid-Cities / Airport Corridor', 'Fort Worth Urban Core',
      'Alliance / North Fort Worth', 'West Fort Worth & Parker County', 'South Fort Worth / Mansfield Corridor',
      'Denton County Growth Belt', 'East Dallas & Lake Communities', 'Southern Sector / Best Southwest',
    ],
  },
  {
    group: 'HOUSTON METRO',
    zones: [
      'Inner Loop / Urban Core Houston', 'The Heights / Inner Northwest', 'West University / Bellaire / Memorial',
      'The Woodlands / North Houston', 'Spring / Klein / Champions Corridor',
      'Katy / Fulshear / West Houston Energy Corridor', 'Sugar Land / Fort Bend County',
      'Pearland / South Houston', 'Clear Lake / NASA / Southeast Houston', 'Cypress / Northwest Houston',
      'Kingwood / Lake Houston Corridor', 'Baytown / East Houston Industrial Corridor',
      'Galveston Island / Gulf Coast', 'Richmond / Rosenberg / Southwest Growth Corridor',
      'Conroe / Montgomery County North Growth Belt',
    ],
  },
  {
    group: 'SAN ANTONIO METRO',
    zones: [
      'Urban Core / Central San Antonio', 'Alamo Heights / Terrell Hills / Olmos Park',
      'North Central San Antonio', 'Stone Oak / Far North San Antonio',
      'The Dominion / I-10 Luxury Corridor', 'Northwest San Antonio / Helotes',
      'Boerne / Fair Oaks Ranch / Hill Country Corridor', 'San Antonio Hill Country',
      'New Braunfels / I-35 Northeast Growth Corridor', 'Schertz / Cibolo / Universal City',
      'South San Antonio / Mission Corridor', 'West San Antonio / Alamo Ranch',
      'East San Antonio / Converse Corridor',
    ],
  },
  {
    group: 'STANDALONE MARKETS',
    zones: ['Waco', 'Corpus Christi'],
  },
  {
    group: 'GULF COAST / BRAZOSPORT',
    zones: ['Brazosport / Gulf Coast South'],
  },
]

const whatYouReceive = [
  {
    title: 'A prepared client.',
    desc: 'They have already identified their target community, confirmed their financial picture, and committed to moving forward. You are not starting from scratch.',
  },
  {
    title: 'A personal introduction.',
    desc: 'Not a notification. Not a form submission. A warm, personal introduction — with context about who they are, what they need, and why they were matched to your market.',
  },
  {
    title: 'A clean engagement.',
    desc: 'One introduction. One agent. No competition, no auction, no pressure. Just the right professional at the right moment.',
  },
]

const commitments = [
  {
    icon: Clock,
    title: 'Respond within 24 hours.',
    desc: 'Every HavenQuest introduction is acknowledged within 24 hours. No exceptions.',
  },
  {
    icon: Heart,
    title: 'Honor the relationship.',
    desc: 'Our clients have been guided through a process built on trust. Every interaction you have with a HavenQuest family reflects the standard they were promised.',
  },
  {
    icon: UserCheck,
    title: 'You are here because you earned it. Honor that.',
    desc: 'You are selected because you are among the best in your market. Show up that way.',
  },
]

const minQualifications = [
  'Active Texas real estate license — verified directly through TREC',
  'Clean disciplinary record',
  'Verified transaction history — top production in your market',
  'Strong client satisfaction record — validated across third-party review platforms',
  '24-hour response commitment',
]

const verifications = [
  {
    icon: ShieldCheck,
    title: 'TREC License Verification',
    desc: 'Every license verified directly through the Texas Real Estate Commission before approval. No self-reporting accepted.',
  },
  {
    icon: FileText,
    title: 'Transaction History Confirmed',
    desc: 'Closed transaction records reviewed to confirm top production standards in your market.',
  },
  {
    icon: Star,
    title: 'Client Reviews Validated',
    desc: 'Third-party reviews on Zillow, Google, and Realtor.com checked to confirm a strong client satisfaction record.',
  },
  {
    icon: UserCheck,
    title: 'Personal Interview',
    desc: 'Every Select Agent is interviewed personally by our team. Standards are not just checked — they are confirmed.',
  },
]

export default function ForRealtorsClient() {
  const [formData, setFormData] = useState({
    firstName: '', lastName: '', email: '', phone: '', brokerage: '', marketSpecialty: '',
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const [zonesModalOpen, setZonesModalOpen] = useState(false)
  const [phoneDisplay, setPhoneDisplay] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(p => ({ ...p, [e.target.name]: e.target.value }))
  }

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const digits = e.target.value.replace(/\D/g, '').slice(0, 10)
    setFormData(p => ({ ...p, phone: digits }))
    setPhoneDisplay(formatPhone(digits))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.firstName || !formData.lastName || !formData.email) {
      setError('First name, last name, and email are required')
      return
    }
    if (!formData.marketSpecialty) {
      setError('Please select your primary market zone')
      return
    }
    if (!formData.phone) {
      setError('Phone number is required')
      return
    }
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/realtor-interest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      if (res.ok) {
        setSuccess(true)
      } else {
        const data = await res.json()
        setError(data.error || 'Something went wrong. Please try again.')
      }
    } catch {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      {/* Hero — dark banner */}
      <div className="bg-[#08101C] border-b border-white/8 px-4 py-14">
        <div className="max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 border border-white/10 bg-white/5 text-blue-300/70 text-[11px] font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-7">
            HavenQuest for Realtors
          </div>
          <h1 className="text-[42px] sm:text-5xl font-bold text-white leading-[1.06] tracking-tight mb-8">
            We don&apos;t send leads.<br />We make introductions.
          </h1>
          <div className="space-y-5 text-white/55 text-[15px] leading-relaxed max-w-2xl">
            <p>
              Every client HavenQuest introduces has already done serious work. They know their market. They know their budget. They know what matters most to their family. They have committed to a direction. By the time they meet a Select Agent, they are ready — not browsing.
            </p>
            <p>
              That is a different kind of client. And it requires a different kind of realtor.
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-12 space-y-12">

        {/* The HavenQuest Standard */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight mb-6">The HavenQuest Standard</h2>
          <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4 text-[15px] text-gray-600 leading-relaxed" style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 4px 16px rgba(0,0,0,0.06)' }}>
            <p>
              HavenQuest guides families through one of the most significant decisions of their lives. Our clients trust us with their financial picture, their priorities, their timeline, and their family&apos;s future. That trust does not end when we make an introduction.
            </p>
            <p>
              Every Select Agent in the HavenQuest network has been personally vetted — not just verified on paper. We review transaction history, client satisfaction records, and market expertise. We conduct a personal interview. We check TREC licensing and disciplinary records directly.
            </p>
            <p>
              The bar is high because the trust placed in us is high.
            </p>
          </div>
        </section>

        {/* What You Receive */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight mb-6">What You Receive</h2>
          <div className="grid sm:grid-cols-3 gap-4">
            {whatYouReceive.map(item => (
              <div key={item.title} className="bg-white rounded-2xl border border-gray-100 p-5" style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 4px 16px rgba(0,0,0,0.06)' }}>
                <h3 className="font-bold text-gray-900 tracking-tight mb-2">{item.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* What We Ask of You */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight mb-3">What We Ask of You</h2>
          <p className="text-gray-500 text-[15px] leading-relaxed mb-6">
            Joining the HavenQuest Select Agent network means committing to a standard — not just a transaction.
          </p>
          <div className="grid sm:grid-cols-3 gap-4">
            {commitments.map(item => (
              <div key={item.title} className="bg-white rounded-2xl border border-gray-100 p-5" style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 4px 16px rgba(0,0,0,0.06)' }}>
                <div className="w-9 h-9 rounded-full bg-blue-50 flex items-center justify-center mb-3">
                  <item.icon size={17} className="text-accent" />
                </div>
                <h3 className="font-bold text-gray-900 tracking-tight mb-1">{item.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Minimum Qualifications */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight mb-6">Minimum Qualifications</h2>
          <div className="bg-white rounded-2xl border border-gray-100 p-6" style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 4px 16px rgba(0,0,0,0.06)' }}>
            <p className="text-gray-500 text-sm mb-5">
              HavenQuest only partners with agents who meet our production, experience, and character standards. Every Select Agent passes:
            </p>
            <ul className="space-y-3 mb-5">
              {minQualifications.map(s => (
                <li key={s} className="flex items-center gap-3">
                  <Check size={15} className="text-green-500 shrink-0" />
                  <span className="text-sm text-gray-700">{s}</span>
                </li>
              ))}
            </ul>
            <p className="text-sm text-gray-400 italic">
              Partnership details and zone availability are discussed during the personal interview process.
            </p>
          </div>
        </section>

        {/* How to Apply */}
        <section id="apply" className="bg-white rounded-2xl border border-gray-100 p-6 sm:p-8" style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 4px 16px rgba(0,0,0,0.06)' }}>
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight mb-1">How to Apply</h2>
          <div className="space-y-3 text-gray-500 text-sm leading-relaxed mb-7">
            <p>
              If you believe you meet our standard and you want to be part of something built differently — we would like to hear from you.
            </p>
            <p>
              The process is simple. Submit your interest below. If your initial profile is a fit, we will send you a link to complete a full application. From there, qualified candidates are invited to a personal interview with our team.
            </p>
            <p>
              We review every application personally. You will hear from us within 48 hours.
            </p>
          </div>

          {success ? (
            <div className="bg-green-50 border border-green-100 rounded-2xl p-6 text-center">
              <h3 className="font-bold text-green-800 text-lg mb-2">Request received.</h3>
              <p className="text-green-700 text-sm leading-relaxed">
                Check your inbox — we&apos;ve sent you a private link to complete your application.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  First name <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="Jane"
                  className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm text-gray-900 outline-none focus:border-accent focus:ring-2 focus:ring-blue-100 transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Last name <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Smith"
                  className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm text-gray-900 outline-none focus:border-accent focus:ring-2 focus:ring-blue-100 transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Email address <span className="text-red-400">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="jane@brokerage.com"
                  className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm text-gray-900 outline-none focus:border-accent focus:ring-2 focus:ring-blue-100 transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Phone number <span className="text-red-400">*</span>
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={phoneDisplay}
                  onChange={handlePhoneChange}
                  placeholder="(555) 000-0000"
                  className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm text-gray-900 outline-none focus:border-accent focus:ring-2 focus:ring-blue-100 transition-all"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Brokerage
                </label>
                <input
                  type="text"
                  name="brokerage"
                  value={formData.brokerage}
                  onChange={handleChange}
                  placeholder="Keller Williams, Compass, etc."
                  className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm text-gray-900 outline-none focus:border-accent focus:ring-2 focus:ring-blue-100 transition-all"
                />
              </div>

              <div className="sm:col-span-2">
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-sm font-semibold text-gray-700">
                    Primary market zone
                  </label>
                  <button
                    type="button"
                    onClick={() => setZonesModalOpen(true)}
                    className="text-xs text-accent hover:underline"
                  >
                    View all market zones →
                  </button>
                </div>
                <select
                  name="marketSpecialty"
                  value={formData.marketSpecialty}
                  onChange={handleChange}
                  className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm text-gray-900 outline-none focus:border-accent focus:ring-2 focus:ring-blue-100 transition-all bg-white"
                >
                  <option value="">Select a market…</option>
                  <optgroup label="AUSTIN METRO">
                    <option value="Urban Core Austin">Urban Core Austin</option>
                    <option value="Westlake / West Austin">Westlake / West Austin</option>
                    <option value="Northwest Austin / Cedar Park / Leander">Northwest Austin / Cedar Park / Leander</option>
                    <option value="Round Rock / Pflugerville / Hutto Corridor">Round Rock / Pflugerville / Hutto Corridor</option>
                    <option value="South Austin">South Austin</option>
                    <option value="Southwest Austin / Dripping Springs">Southwest Austin / Dripping Springs</option>
                    <option value="Lake Travis / Hill Country Galleria">Lake Travis / Hill Country Galleria</option>
                    <option value="Georgetown / North Growth Corridor">Georgetown / North Growth Corridor</option>
                    <option value="East Austin">East Austin</option>
                    <option value="Kyle / Buda / South Growth Corridor">Kyle / Buda / South Growth Corridor</option>
                    <option value="Austin Hill Country">Austin Hill Country</option>
                  </optgroup>
                  <optgroup label="DALLAS-FORT WORTH METRO">
                    <option value="Urban Core Dallas">Urban Core Dallas</option>
                    <option value="North Dallas / Platinum Corridor">North Dallas / Platinum Corridor</option>
                    <option value="Collin County Growth Corridor">Collin County Growth Corridor</option>
                    <option value="Luxury North Suburbs">Luxury North Suburbs</option>
                    <option value="Mid-Cities / Airport Corridor">Mid-Cities / Airport Corridor</option>
                    <option value="Fort Worth Urban Core">Fort Worth Urban Core</option>
                    <option value="Alliance / North Fort Worth">Alliance / North Fort Worth</option>
                    <option value="West Fort Worth & Parker County">West Fort Worth &amp; Parker County</option>
                    <option value="South Fort Worth / Mansfield Corridor">South Fort Worth / Mansfield Corridor</option>
                    <option value="Denton County Growth Belt">Denton County Growth Belt</option>
                    <option value="East Dallas & Lake Communities">East Dallas &amp; Lake Communities</option>
                    <option value="Southern Sector / Best Southwest">Southern Sector / Best Southwest</option>
                  </optgroup>
                  <optgroup label="HOUSTON METRO">
                    <option value="Inner Loop / Urban Core Houston">Inner Loop / Urban Core Houston</option>
                    <option value="The Heights / Inner Northwest">The Heights / Inner Northwest</option>
                    <option value="West University / Bellaire / Memorial">West University / Bellaire / Memorial</option>
                    <option value="The Woodlands / North Houston">The Woodlands / North Houston</option>
                    <option value="Spring / Klein / Champions Corridor">Spring / Klein / Champions Corridor</option>
                    <option value="Katy / Fulshear / West Houston Energy Corridor">Katy / Fulshear / West Houston Energy Corridor</option>
                    <option value="Sugar Land / Fort Bend County">Sugar Land / Fort Bend County</option>
                    <option value="Pearland / South Houston">Pearland / South Houston</option>
                    <option value="Clear Lake / NASA / Southeast Houston">Clear Lake / NASA / Southeast Houston</option>
                    <option value="Cypress / Northwest Houston">Cypress / Northwest Houston</option>
                    <option value="Kingwood / Lake Houston Corridor">Kingwood / Lake Houston Corridor</option>
                    <option value="Baytown / East Houston Industrial Corridor">Baytown / East Houston Industrial Corridor</option>
                    <option value="Galveston Island / Gulf Coast">Galveston Island / Gulf Coast</option>
                    <option value="Richmond / Rosenberg / Southwest Growth Corridor">Richmond / Rosenberg / Southwest Growth Corridor</option>
                    <option value="Conroe / Montgomery County North Growth Belt">Conroe / Montgomery County North Growth Belt</option>
                  </optgroup>
                  <optgroup label="SAN ANTONIO METRO">
                    <option value="Urban Core / Central San Antonio">Urban Core / Central San Antonio</option>
                    <option value="Alamo Heights / Terrell Hills / Olmos Park">Alamo Heights / Terrell Hills / Olmos Park</option>
                    <option value="North Central San Antonio">North Central San Antonio</option>
                    <option value="Stone Oak / Far North San Antonio">Stone Oak / Far North San Antonio</option>
                    <option value="The Dominion / I-10 Luxury Corridor">The Dominion / I-10 Luxury Corridor</option>
                    <option value="Northwest San Antonio / Helotes">Northwest San Antonio / Helotes</option>
                    <option value="Boerne / Fair Oaks Ranch / Hill Country Corridor">Boerne / Fair Oaks Ranch / Hill Country Corridor</option>
                    <option value="San Antonio Hill Country">San Antonio Hill Country</option>
                    <option value="New Braunfels / I-35 Northeast Growth Corridor">New Braunfels / I-35 Northeast Growth Corridor</option>
                    <option value="Schertz / Cibolo / Universal City">Schertz / Cibolo / Universal City</option>
                    <option value="South San Antonio / Mission Corridor">South San Antonio / Mission Corridor</option>
                    <option value="West San Antonio / Alamo Ranch">West San Antonio / Alamo Ranch</option>
                    <option value="East San Antonio / Converse Corridor">East San Antonio / Converse Corridor</option>
                  </optgroup>
                  <optgroup label="STANDALONE MARKETS">
                    <option value="Waco">Waco</option>
                    <option value="Corpus Christi">Corpus Christi</option>
                  </optgroup>
                  <optgroup label="GULF COAST / BRAZOSPORT">
                    <option value="Brazosport / Gulf Coast South">Brazosport / Gulf Coast South</option>
                  </optgroup>
                </select>
              </div>

              {error && (
                <div className="sm:col-span-2 bg-red-50 border border-red-100 rounded-xl px-3.5 py-2.5">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}

              <div className="sm:col-span-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-accent text-white py-3.5 rounded-xl font-bold text-sm hover:bg-[#154d8a] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                  style={{ boxShadow: '0 2px 10px rgba(26,95,168,0.25)' }}
                >
                  {loading ? 'Submitting…' : 'Submit My Interest'}
                </button>
                <p className="text-center text-xs text-gray-400 mt-3 italic">
                  Applications are reviewed personally. We will follow up within 48 hours.
                </p>
              </div>
            </form>
          )}
        </section>

        {/* How We Verify Every Partner */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight text-center mb-6">How We Verify Every Partner</h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
            {verifications.map(item => (
              <div
                key={item.title}
                className="bg-white rounded-2xl border border-gray-100 p-6 text-center"
                style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 4px 16px rgba(0,0,0,0.06)' }}
              >
                <div className="flex justify-center mb-4">
                  <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center">
                    <item.icon size={22} className="text-accent" />
                  </div>
                </div>
                <h3 className="font-bold text-gray-900 tracking-tight mb-2">{item.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

      </div>

      {zonesModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
          onClick={() => setZonesModalOpen(false)}
        >
          <div
            className="bg-white rounded-2xl w-full max-w-lg max-h-[80vh] flex flex-col"
            style={{ boxShadow: '0 8px 40px rgba(0,0,0,0.2)' }}
            onClick={(e: React.MouseEvent) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h3 className="font-bold text-gray-900 tracking-tight">Texas Market Zones</h3>
              <button
                type="button"
                onClick={() => setZonesModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors text-2xl leading-none"
              >
                ×
              </button>
            </div>
            <div className="overflow-y-auto px-6 py-5 space-y-5">
              {MARKET_ZONES.map(metro => (
                <div key={metro.group}>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">{metro.group}</p>
                  <ul className="space-y-1.5">
                    {metro.zones.map(zone => (
                      <li key={zone} className="text-sm text-gray-700">{zone}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
