'use client'

import { useState } from 'react'
import { Check, Clock, UserCheck, Shield, Heart, ShieldCheck, FileText, Star } from 'lucide-react'

const GOLD = '#B8912A'
const DARK = '#08101C'

const REFERRAL_SOURCE_OPTIONS = [
  'Google search',
  'Social media',
  'Referral from another agent',
  'HavenQuest outreach',
  'Real estate association or event',
  'Other',
]

const commitments = [
  {
    icon: Clock,
    title: '24-Hour Response',
    desc: 'Every HavenQuest introduction is acknowledged within 24 hours. No exceptions.',
  },
  {
    icon: UserCheck,
    title: 'Personal Introduction',
    desc: 'Every buyer is introduced personally — not delivered as a cold lead. You will know who they are and why they chose your market before the first conversation.',
  },
  {
    icon: Shield,
    title: 'One Partner Per Market',
    desc: 'You are not competing with other agents for the same buyer. HavenQuest maintains exclusive placement per buyer pool per market.',
  },
  {
    icon: Heart,
    title: 'People First Standard',
    desc: 'Every interaction with a Future Texan reflects the standard they were promised. Their experience is always the priority.',
  },
]

const introSteps = [
  {
    number: '01',
    desc: 'The Future Texan confirms their city match and selects their realtor from a curated anonymous profile. They choose based on experience and fit — not a photo or a sales pitch.',
  },
  {
    number: '02',
    desc: 'HavenQuest makes a warm personal introduction. Both parties receive context before the first conversation.',
  },
  {
    number: '03',
    desc: 'You take it from there. They are prepared, qualified, and ready. Your job is to be the professional they were promised.',
  },
]

const partnerTiers = [
  {
    name: 'Market Partner',
    description: 'For realtors in primary Texas metros.',
  },
  {
    name: 'Growth Partner',
    description: 'For realtors in secondary and suburban markets.',
  },
  {
    name: 'Community Partner',
    description: 'For realtors in smaller and emerging markets.',
  },
]

const minQualifications = [
  'Personally interviewed and approved by HavenQuest',
  'Verified transaction history',
  'Active Texas real estate license',
  'Clean TREC disciplinary record',
  '24-hour introduction response commitment',
]

export default function ForRealtorsClient() {
  const [formData, setFormData] = useState({
    firstName: '', lastName: '', email: '', phone: '',
    marketSpecialty: '', referralSource: '',
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(p => ({ ...p, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.firstName || !formData.lastName || !formData.email) {
      setError('First name, last name, and email are required')
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
      {/* Dark banner */}
      <div className="bg-[#08101C] border-b border-white/8 px-4 py-14">
        <div className="max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 border border-white/10 bg-white/5 text-blue-300/70 text-[11px] font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-7">
            HavenQuest for Realtors
          </div>
          <h1 className="text-[42px] sm:text-5xl font-bold text-white leading-[1.06] tracking-tight mb-8">
            The best realtors don&apos;t chase leads. They earn introductions.
          </h1>
          <div className="space-y-5 text-white/55 text-[15px] leading-relaxed max-w-2xl">
            <p>
              At HavenQuest, the people we serve come first. Always.
            </p>
            <p>
              Future Texans — the people who trust us to guide one of the biggest decisions of their lives — have done serious work to get to this moment. They have studied the cities. They have done the math on their budget. They have told us what matters most to them. They have confirmed where they want to build their next chapter.
            </p>
            <p>
              When they are ready for a realtor, we do not send them a list. We make one introduction. One trusted professional, personally selected for their market, their price point, and their situation. No competition. No pressure. Just the right person at the right time.
            </p>
            <p>
              That is the standard we hold our partners to — because that is the standard every Future Texan deserves.
            </p>
            <p>
              We are building that partner network across Texas now. The bar is high because the trust placed in us is high. If you are among the best in your market and you believe every person relocating to Texas deserves a world class experience — we would like to hear from you.
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-12 space-y-12">

        {/* What Our Partners Commit To */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight text-center mb-7">What Our Partners Commit To</h2>
          <div className="grid sm:grid-cols-2 gap-4">
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

        {/* Partnership tiers */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight text-center mb-2">Partnership Tiers</h2>
          <p className="text-gray-500 text-sm text-center max-w-lg mx-auto mb-8">
            HavenQuest partners with realtors across three tiers based on market size and experience level. Partnership details and pricing are finalized during the personal interview process.
          </p>
          <div className="grid md:grid-cols-3 gap-4">
            {partnerTiers.map(tier => (
              <div
                key={tier.name}
                className="bg-white rounded-2xl border border-gray-100 p-6 flex flex-col"
                style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 4px 16px rgba(0,0,0,0.06)' }}
              >
                <div className="inline-flex self-start items-center bg-gray-100 text-gray-400 text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full mb-4">
                  Details discussed in interview
                </div>
                <h3 className="font-bold text-gray-900 tracking-tight text-lg mb-2">{tier.name}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{tier.description}</p>
              </div>
            ))}
          </div>
          <p className="text-sm text-gray-400 text-center mt-6 max-w-xl mx-auto leading-relaxed">
            We are currently onboarding our founding partner class. Partnership structure details are provided during the personal interview. Apply below to start the conversation.
          </p>
        </section>

        {/* How the Introduction Works */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight text-center mb-8">How the Introduction Works</h2>
          <div className="space-y-4">
            {introSteps.map(step => (
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
                <p className="text-sm text-gray-600 leading-relaxed self-center">{step.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Trust statement + Minimum qualifications */}
        <section>
          <p className="text-gray-600 text-[15px] leading-relaxed text-center max-w-2xl mx-auto mb-10">
            Every realtor in the HavenQuest network has been personally interviewed by our team — not just verified on paper. Every Future Texan deserves to know that the person guiding them home has been held to a standard, not just checked against a database.
          </p>
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight text-center mb-6">Minimum Qualifications</h2>
          <div className="bg-white rounded-2xl border border-gray-100 p-6" style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 4px 16px rgba(0,0,0,0.06)' }}>
            <p className="text-gray-400 text-sm mb-5">
              HavenQuest only partners with agents who meet our quality bar. Every realtor in our network passes:
            </p>
            <ul className="space-y-3">
              {minQualifications.map(s => (
                <li key={s} className="flex items-center gap-3">
                  <Check size={15} className="text-green-500 shrink-0" />
                  <span className="text-sm text-gray-700">{s}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Interest form */}
        <section id="apply" className="bg-white rounded-2xl border border-gray-100 p-6 sm:p-8" style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 4px 16px rgba(0,0,0,0.06)' }}>
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight mb-1">Request to apply</h2>
          <p className="text-gray-400 text-sm mb-7">
            Tell us a little about yourself. If it looks like a good fit, we&apos;ll send you a private link to complete the full application.
          </p>

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
                  Phone number <span className="text-gray-400 font-normal">(optional)</span>
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="(555) 000-0000"
                  className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm text-gray-900 outline-none focus:border-accent focus:ring-2 focus:ring-blue-100 transition-all"
                />
              </div>

              <div className="sm:col-span-2">
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-sm font-semibold text-gray-700">
                    Primary market zone
                  </label>
                  <a href="/zones" target="_blank" rel="noopener noreferrer" className="text-xs text-accent hover:underline">
                    View all market zones →
                  </a>
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

              <div className="sm:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  How did you hear about HavenQuest?
                </label>
                <select
                  name="referralSource"
                  value={formData.referralSource}
                  onChange={handleChange}
                  className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm text-gray-900 outline-none focus:border-accent focus:ring-2 focus:ring-blue-100 transition-all bg-white"
                >
                  <option value="">Select…</option>
                  {REFERRAL_SOURCE_OPTIONS.map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
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
                  {loading ? 'Submitting…' : 'Request to Apply →'}
                </button>
                <p className="text-center text-xs text-gray-400 mt-3 italic">
                  We review every application personally. Submitting this form does not guarantee acceptance.
                </p>
              </div>
            </form>
          )}
        </section>

        {/* How we verify every partner */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight text-center mb-6">How we verify every partner</h2>
          <div className="grid sm:grid-cols-3 gap-4">
            {[
              {
                icon: ShieldCheck,
                title: 'TREC License Verification',
                desc: 'We verify every license directly through the Texas Real Estate Commission (TREC) database before approval — no self-reporting accepted.',
              },
              {
                icon: FileText,
                title: 'Transaction History Confirmed',
                desc: 'We review closed transaction records to ensure partners meet our minimum production standards.',
              },
              {
                icon: Star,
                title: 'Client Reviews Validated',
                desc: 'Third-party reviews on Zillow, Google, and Realtor.com are checked to confirm a strong client satisfaction record.',
              },
            ].map(item => (
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
    </div>
  )
}
