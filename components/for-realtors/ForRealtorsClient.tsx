'use client'

import { useState } from 'react'
import { Check } from 'lucide-react'

const tiers = [
  {
    name: 'Standard',
    price: '$99/month',
    features: ['City-level territory', 'Standard placement', 'Lead notifications'],
    cta: 'Apply for Standard',
    featured: false,
  },
  {
    name: 'Professional',
    price: '$199/month',
    features: ['Zip code level territory', 'Priority placement', 'Lead notifications', 'Performance stats dashboard'],
    cta: 'Apply for Professional',
    featured: true,
  },
  {
    name: 'Elite',
    price: '$349/month',
    features: ['Exclusive zip (1–2 agents)', 'Featured with photo/bio', 'Lead notifications', 'Full analytics', 'Monthly co-branded market report'],
    cta: 'Apply for Elite',
    featured: false,
  },
]

const vettingStandards = [
  'Top 5% of Texas realtors only',
  'Verified transaction history',
  'Active Texas real estate license',
  'Clean TREC disciplinary record',
  '24-hour lead response commitment',
]

export default function ForRealtorsClient() {
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', markets: '',
    yearsExperience: '', brokerage: '', profileUrl: '',
    whyJoin: '', preferredTier: '',
    trecLicenseNumber: '', licenseType: '',
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(p => ({ ...p, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name || !formData.email) {
      setError('Name and email are required')
      return
    }
    if (!formData.trecLicenseNumber) {
      setError('TREC license number is required')
      return
    }
    if (!formData.licenseType) {
      setError('Please select a license type')
      return
    }
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/realtor-applications', {
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
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 border border-white/10 bg-white/5 text-blue-300/70 text-[11px] font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-7">
            HavenQuest for Realtors
          </div>
          <h1 className="text-[42px] sm:text-5xl font-bold text-white leading-[1.06] tracking-tight mb-4">
            The most qualified relocation leads in Texas
          </h1>
          <p className="text-white/45 text-lg max-w-xl mx-auto leading-relaxed">
            HavenQuest users tell us their income, budget, household size, lifestyle priorities,
            and timeline before they ever speak to a realtor. That&apos;s the lead you receive.
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-12 space-y-12">

        {/* Why leads are different */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight text-center mb-7">Why these leads are different</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              { icon: '💰', title: 'Income verified by user', desc: 'Annual household income entered by the user — not estimated or scraped.' },
              { icon: '⚖️', title: 'Lifestyle priorities documented', desc: '12 categories ranked — know what matters most before your first call.' },
              { icon: '📅', title: 'Timeline stated', desc: 'Within 3 months to just exploring — so you can prioritize the right leads.' },
              { icon: '📍', title: 'City match confirmed', desc: 'They selected your market. Not a general inquiry — a deliberate choice.' },
              { icon: '✅', title: 'Serious intent', desc: 'Completed a multi-step qualification process. Higher conversion by design.' },
            ].map(item => (
              <div key={item.title} className="card-city bg-white rounded-2xl border border-gray-100 p-5">
                <div className="text-2xl mb-2">{item.icon}</div>
                <h3 className="font-bold text-gray-900 tracking-tight mb-1">{item.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Subscription tiers */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight text-center mb-8">Subscription tiers</h2>
          <div className="grid md:grid-cols-3 gap-4">
            {tiers.map(tier => (
              <div
                key={tier.name}
                className={`bg-white rounded-2xl border p-6 flex flex-col transition-all ${
                  tier.featured ? 'border-accent' : 'border-gray-100'
                }`}
                style={{
                  boxShadow: tier.featured
                    ? '0 2px 4px rgba(0,0,0,0.04), 0 8px 24px rgba(26,95,168,0.14)'
                    : '0 1px 3px rgba(0,0,0,0.04), 0 4px 16px rgba(0,0,0,0.06)',
                }}
              >
                {tier.featured && (
                  <div className="bg-accent text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full self-start mb-3">
                    Most popular
                  </div>
                )}
                <h3 className="font-bold text-gray-900 tracking-tight text-lg mb-1">{tier.name}</h3>
                <p className="text-2xl font-bold text-accent tabular-nums mb-4">{tier.price}</p>
                <ul className="space-y-2 flex-1 mb-6">
                  {tier.features.map(f => (
                    <li key={f} className="flex items-center gap-2 text-sm text-gray-500">
                      <Check size={13} className="text-green-500 shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <a
                  href="#apply"
                  className={`block text-center py-3 rounded-xl font-bold text-sm transition-colors ${
                    tier.featured
                      ? 'bg-accent text-white hover:bg-[#154d8a]'
                      : 'border border-gray-200 text-gray-700 hover:border-accent hover:text-accent hover:bg-blue-50/50'
                  }`}
                >
                  {tier.cta}
                </a>
              </div>
            ))}
          </div>
        </section>

        {/* Vetting standards */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight text-center mb-6">Vetting standards</h2>
          <div className="bg-white rounded-2xl border border-gray-100 p-6" style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 4px 16px rgba(0,0,0,0.06)' }}>
            <p className="text-gray-400 text-sm mb-5">
              HavenQuest only partners with agents who meet our quality bar. Every realtor in our network passes:
            </p>
            <ul className="space-y-3">
              {vettingStandards.map(s => (
                <li key={s} className="flex items-center gap-3">
                  <Check size={15} className="text-green-500 shrink-0" />
                  <span className="text-sm text-gray-700">{s}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Application form */}
        <section id="apply" className="bg-white rounded-2xl border border-gray-100 p-6 sm:p-8" style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 4px 16px rgba(0,0,0,0.06)' }}>
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight mb-1">Apply to join HavenQuest</h2>
          <p className="text-gray-400 text-sm mb-7">
            We maintain strict quality standards to protect both our users and our realtor partners.
          </p>

          {success ? (
            <div className="bg-success-bg rounded-2xl p-6 text-center">
              <div className="text-4xl mb-3">✅</div>
              <h3 className="font-bold text-success-text text-lg mb-1">Application received!</h3>
              <p className="text-success-text text-sm">
                We&apos;ll review your application and reach out within 48 hours.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="grid sm:grid-cols-2 gap-4">
              {[
                { name: 'name', label: 'Full name', required: true, placeholder: 'Jane Smith' },
                { name: 'email', label: 'Email address', required: true, placeholder: 'jane@brokerage.com' },
                { name: 'phone', label: 'Phone number', placeholder: '(555) 000-0000' },
                { name: 'brokerage', label: 'Brokerage', placeholder: 'Compass, Keller Williams, etc.' },
                { name: 'yearsExperience', label: 'Years of experience', placeholder: '10' },
                { name: 'profileUrl', label: 'Zillow or Realtor.com profile URL', placeholder: 'zillow.com/profile/...' },
              ].map(field => (
                <div key={field.name}>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    {field.label} {field.required && <span className="text-red-400">*</span>}
                  </label>
                  <input
                    type="text"
                    name={field.name}
                    value={formData[field.name as keyof typeof formData]}
                    onChange={handleChange}
                    placeholder={field.placeholder}
                    className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm text-gray-900 outline-none focus:border-accent focus:ring-2 focus:ring-blue-100 transition-all"
                  />
                </div>
              ))}

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Texas Real Estate License Number (TREC) <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  name="trecLicenseNumber"
                  value={formData.trecLicenseNumber}
                  onChange={handleChange}
                  placeholder="e.g. 123456"
                  className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm text-gray-900 outline-none focus:border-accent focus:ring-2 focus:ring-blue-100 transition-all"
                />
                <p className="text-xs text-gray-400 mt-1.5">Your license will be verified at trec.texas.gov</p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  License Type <span className="text-red-400">*</span>
                </label>
                <select
                  name="licenseType"
                  value={formData.licenseType}
                  onChange={handleChange}
                  className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm text-gray-900 outline-none focus:border-accent focus:ring-2 focus:ring-blue-100 transition-all bg-white"
                >
                  <option value="">Select type…</option>
                  <option value="Sales Agent">Sales Agent</option>
                  <option value="Broker">Broker</option>
                  <option value="Broker Associate">Broker Associate</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  City/markets served <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  name="markets"
                  value={formData.markets}
                  onChange={handleChange}
                  placeholder="Austin, Cedar Park, Round Rock"
                  className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm text-gray-900 outline-none focus:border-accent focus:ring-2 focus:ring-blue-100 transition-all"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Preferred subscription tier
                </label>
                <select
                  name="preferredTier"
                  value={formData.preferredTier}
                  onChange={handleChange}
                  className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm text-gray-900 outline-none focus:border-accent focus:ring-2 focus:ring-blue-100 transition-all bg-white"
                >
                  <option value="">Select a tier…</option>
                  <option value="Standard">Standard — $99/month</option>
                  <option value="Professional">Professional — $199/month</option>
                  <option value="Elite">Elite — $349/month</option>
                  <option value="Unsure">Not sure yet</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Why do you want to join HavenQuest?
                </label>
                <textarea
                  name="whyJoin"
                  value={formData.whyJoin}
                  onChange={handleChange}
                  placeholder="Tell us a bit about your practice and why HavenQuest is a good fit…"
                  rows={4}
                  className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm text-gray-900 outline-none focus:border-accent focus:ring-2 focus:ring-blue-100 transition-all resize-none"
                />
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
                  {loading ? 'Submitting…' : 'Submit My Application'}
                </button>
                <p className="text-center text-xs text-gray-400 mt-3">
                  Applications are reviewed personally. We will follow up within 48 hours.
                </p>
              </div>
            </form>
          )}
        </section>

        {/* Trust section */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight text-center mb-6">How we verify every partner</h2>
          <div className="grid sm:grid-cols-3 gap-4">
            {[
              {
                icon: '🏛️',
                title: 'TREC License Verification',
                desc: 'We verify every license directly through the Texas Real Estate Commission (TREC) database before approval — no self-reporting accepted.',
              },
              {
                icon: '📋',
                title: 'Transaction History Confirmed',
                desc: 'We review closed transaction records to ensure partners meet our minimum production standards.',
              },
              {
                icon: '⭐',
                title: 'Client Reviews Validated',
                desc: 'Third-party reviews on Zillow, Google, and Realtor.com are checked to confirm a strong client satisfaction record.',
              },
            ].map(item => (
              <div
                key={item.title}
                className="bg-white rounded-2xl border border-gray-100 p-6 text-center"
                style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 4px 16px rgba(0,0,0,0.06)' }}
              >
                <div className="text-3xl mb-3">{item.icon}</div>
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
