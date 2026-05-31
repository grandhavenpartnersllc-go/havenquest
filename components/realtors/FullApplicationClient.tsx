'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'

const CARD_SHADOW = '0 1px 3px rgba(0,0,0,0.04), 0 4px 16px rgba(0,0,0,0.06)'
const INPUT_CLASS = 'w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm text-gray-900 outline-none focus:border-accent focus:ring-2 focus:ring-blue-100 transition-all'
const LABEL_CLASS = 'block text-sm font-semibold text-gray-700 mb-1.5'

const HOUSTON_ZONES = new Set([
  'Inner Loop / Urban Core Houston',
  'The Heights / Inner Northwest',
  'West University / Bellaire / Memorial',
  'The Woodlands / North Houston',
  'Spring / Klein / Champions Corridor',
  'Katy / Fulshear / West Houston Energy Corridor',
  'Sugar Land / Fort Bend County',
  'Pearland / South Houston',
  'Clear Lake / NASA / Southeast Houston',
  'Cypress / Northwest Houston',
  'Kingwood / Lake Houston Corridor',
  'Baytown / East Houston Industrial Corridor',
  'Richmond / Rosenberg / Southwest Growth Corridor',
  'Conroe / Montgomery County North Growth Belt',
  'Galveston Island / Gulf Coast',
  'Brazosport / Gulf Coast South',
])

const MARKET_SEGMENTS = [
  { value: 'Starter', label: 'Starter — Under $325K' },
  { value: 'Mid-Market', label: 'Mid-Market — $325K to $650K' },
  { value: 'High', label: 'High — $650K to $1.3M' },
  { value: 'Luxury', label: 'Luxury — $1.3M to $2M' },
  { value: 'Estate', label: 'Estate — $2M+' },
]

const PARTNER_STANDARDS = [
  {
    heading: 'Who we serve',
    body: 'Every buyer who reaches HavenQuest has made a serious decision. They are relocating to Texas — many from out of state, many without the ability to tour homes in person. They are trusting us, and trusting you, with one of the most significant financial and personal decisions of their lives. We do not take that lightly, and we expect our partners to hold that same standard.',
  },
  {
    heading: 'Response time',
    body: 'You commit to responding to every HavenQuest introduction within 24 hours — no exceptions. Relocating buyers move quickly. A delayed response is not just poor service — it breaks trust with a buyer who is already navigating significant uncertainty. If you cannot commit to 24-hour response times, HavenQuest is not the right partnership for you.',
  },
  {
    heading: 'Buyer-first representation',
    body: 'HavenQuest buyers are your clients — not transactions. You commit to representing their interests fully, advising them honestly even when the honest answer is difficult, and never pressuring them toward a decision that serves your commission over their wellbeing.',
  },
  {
    heading: 'Relocation expertise',
    body: 'Relocating buyers need more than a standard buyer\'s agent. They need someone who can paint a picture of daily life in a neighborhood, who knows which school districts are genuinely excellent, who can close remotely, and who can be a trusted guide from a distance. You represent that you have this expertise and commit to delivering it.',
  },
  {
    heading: 'Production standards',
    body: 'HavenQuest partners are among the top 5% of Texas real estate agents in their market segment. We verify production as part of the application process. Partners are expected to maintain these standards throughout the relationship.',
  },
  {
    heading: 'Exclusivity and integrity',
    body: 'HavenQuest introductions are made in good faith. You commit to never soliciting additional referrals through a HavenQuest introduction, never circumventing the introduction process, and always representing your relationship with HavenQuest accurately to clients.',
  },
  {
    heading: 'The referral fee',
    body: 'HavenQuest operates on a referral fee model. On every closed transaction originating from a HavenQuest introduction, a referral fee is due to HavenQuest as agreed in the Partner Agreement. This is not optional and is not negotiable after the introduction is made.',
  },
  {
    heading: 'What you can expect from us',
    body: 'We commit to sending you qualified, matched buyers — not cold leads. Every buyer we introduce has completed our matching process, understands the market, and has a genuine intention to purchase. We will brief you on each buyer before the introduction. We will support you throughout the relationship. And we will hold this network to the standard that makes your participation valuable.',
  },
]

type TokenState = 'loading' | 'valid' | 'invalid'

interface FormData {
  firstName: string
  lastName: string
  email: string
  phone: string
  marketSpecialty: string
  brokerage: string
  yearsExperience: string
  trecLicenseNumber: string
  licenseType: string
  profileUrl: string
  marketSegments: string[]
  buyerTransactionCount: string
  buyerTransactionVolume: string
  sellerTransactionCount: string
  sellerTransactionVolume: string
  standardsAcknowledged: boolean
  whyJoin: string
}

const EMPTY_FORM: FormData = {
  firstName: '', lastName: '', email: '', phone: '',
  marketSpecialty: '', brokerage: '', yearsExperience: '',
  trecLicenseNumber: '', licenseType: '', profileUrl: '',
  marketSegments: [],
  buyerTransactionCount: '', buyerTransactionVolume: '',
  sellerTransactionCount: '', sellerTransactionVolume: '',
  standardsAcknowledged: false,
  whyJoin: '',
}

export default function FullApplicationClient() {
  const searchParams = useSearchParams()
  const token = searchParams.get('token') ?? ''

  const [tokenState, setTokenState] = useState<TokenState>('loading')
  const [formData, setFormData] = useState<FormData>(EMPTY_FORM)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!token) {
      setTokenState('invalid')
      return
    }
    fetch(`/api/realtor-interest?token=${encodeURIComponent(token)}`)
      .then(res => (res.ok ? res.json() : null))
      .then((data: { firstName: string; lastName: string; email: string; phone: string; marketSpecialty: string } | null) => {
        if (!data) {
          setTokenState('invalid')
          return
        }
        setFormData(prev => ({
          ...prev,
          firstName: data.firstName ?? '',
          lastName: data.lastName ?? '',
          email: data.email ?? '',
          phone: data.phone ?? '',
          marketSpecialty: data.marketSpecialty ?? '',
        }))
        setTokenState('valid')
      })
      .catch(() => setTokenState('invalid'))
  }, [token])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name } = e.target
    if (e.target instanceof HTMLInputElement && e.target.type === 'checkbox') {
      const checked = e.target.checked
      setFormData(prev => ({ ...prev, [name]: checked }))
    } else {
      setFormData(prev => ({ ...prev, [name]: e.target.value }))
    }
  }

  const handleSegmentChange = (value: string) => {
    setFormData(prev => {
      if (prev.marketSegments.includes(value)) {
        return { ...prev, marketSegments: prev.marketSegments.filter(s => s !== value) }
      }
      if (prev.marketSegments.length >= 2) return prev
      return { ...prev, marketSegments: [...prev.marketSegments, value] }
    })
  }

  const totalCount =
    (parseInt(formData.buyerTransactionCount) || 0) +
    (parseInt(formData.sellerTransactionCount) || 0)
  const totalVolume =
    (parseFloat(formData.buyerTransactionVolume) || 0) +
    (parseFloat(formData.sellerTransactionVolume) || 0)

  const formatVolume = (n: number) =>
    n > 0 ? `$${n.toLocaleString()}` : '—'

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.firstName || !formData.lastName || !formData.email) {
      setError('First name, last name, and email are required')
      return
    }
    if (!formData.brokerage) {
      setError('Brokerage name is required')
      return
    }
    if (!formData.yearsExperience) {
      setError('Years licensed in Texas is required')
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
    if (formData.marketSegments.length === 0) {
      setError('Please select at least one market segment')
      return
    }
    if (!formData.standardsAcknowledged) {
      setError('You must acknowledge the partner standards to submit')
      return
    }
    if (!formData.whyJoin.trim()) {
      setError('Please tell us what makes you the right fit for relocating buyers')
      return
    }
    if (HOUSTON_ZONES.has(formData.marketSpecialty) && !formData.profileUrl.trim()) {
      setError('HAR Profile URL is required for Houston metro applicants')
      return
    }

    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/realtor-applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          token,
          buyerTransactionCount: parseInt(formData.buyerTransactionCount) || 0,
          buyerTransactionVolume: parseFloat(formData.buyerTransactionVolume) || 0,
          sellerTransactionCount: parseInt(formData.sellerTransactionCount) || 0,
          sellerTransactionVolume: parseFloat(formData.sellerTransactionVolume) || 0,
        }),
      })
      if (res.ok) {
        setSuccess(true)
      } else {
        const data = await res.json() as { error?: string }
        setError(data.error || 'Something went wrong. Please try again.')
      }
    } catch {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (tokenState === 'loading') {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <p className="text-gray-400 text-sm">Loading your application…</p>
      </div>
    )
  }

  if (tokenState === 'invalid') {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="max-w-md text-center">
          <h2 className="text-xl font-bold text-gray-900 mb-3">This link has expired or is invalid.</h2>
          <p className="text-gray-500 text-sm leading-relaxed">
            Please visit{' '}
            <a href="/for-realtors" className="text-accent hover:underline">
              havenquest.co/for-realtors
            </a>{' '}
            to request a new invitation.
          </p>
        </div>
      </div>
    )
  }

  if (success) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="max-w-md text-center">
          <h2 className="text-xl font-bold text-gray-900 mb-3">Application received.</h2>
          <p className="text-gray-500 text-sm leading-relaxed">
            Craig will review your application personally and be in touch within 5 business days.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">

      {/* Section 1 — Header */}
      <div className="mb-2">
        <p className="text-xs font-bold uppercase tracking-widest text-accent mb-3">HavenQuest Partner Application</p>
      </div>

      {/* Section 2 — Welcome copy */}
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight mb-6">Thank you for taking the next step.</h1>
        <div className="space-y-4 text-[15px] text-gray-600 leading-relaxed">
          <p>Before you complete your application, please take a moment to read what it means to be a HavenQuest partner. We hold our network to a high standard — not to be exclusive for exclusivity&apos;s sake, but because the buyers we serve deserve the best.</p>
          <p>Every person who comes through HavenQuest has made a major life decision. They&apos;ve chosen Texas. They&apos;ve matched to a city. They trust us to connect them with someone who will take care of them.</p>
          <p>That someone is you — if you&apos;re the right fit.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">

        {/* Section 3 — Pre-populated fields */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6" style={{ boxShadow: CARD_SHADOW }}>
          <h2 className="font-bold text-gray-900 tracking-tight mb-4">Your information</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className={LABEL_CLASS}>First name <span className="text-red-400">*</span></label>
              <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} placeholder="Jane" className={INPUT_CLASS} />
            </div>
            <div>
              <label className={LABEL_CLASS}>Last name <span className="text-red-400">*</span></label>
              <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} placeholder="Smith" className={INPUT_CLASS} />
            </div>
            <div>
              <label className={LABEL_CLASS}>Email address <span className="text-red-400">*</span></label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="jane@brokerage.com" className={INPUT_CLASS} />
            </div>
            <div>
              <label className={LABEL_CLASS}>Phone number</label>
              <input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="(555) 000-0000" className={INPUT_CLASS} />
            </div>
            <div className="sm:col-span-2">
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-sm font-semibold text-gray-700">Primary market zone</label>
                <a href="/zones" target="_blank" rel="noopener noreferrer" className="text-xs text-accent hover:underline">View all market zones →</a>
              </div>
              <select name="marketSpecialty" value={formData.marketSpecialty} onChange={handleChange} className={INPUT_CLASS + ' bg-white'}>
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
          </div>
        </div>

        {/* Section 4 — Professional credentials */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6" style={{ boxShadow: CARD_SHADOW }}>
          <h2 className="font-bold text-gray-900 tracking-tight mb-4">Professional credentials</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className={LABEL_CLASS}>Brokerage name <span className="text-red-400">*</span></label>
              <input type="text" name="brokerage" value={formData.brokerage} onChange={handleChange} placeholder="Compass, Keller Williams, etc." className={INPUT_CLASS} />
            </div>
            <div>
              <label className={LABEL_CLASS}>Years licensed in Texas <span className="text-red-400">*</span></label>
              <input type="number" name="yearsExperience" value={formData.yearsExperience} onChange={handleChange} placeholder="e.g. 8" min="0" className={INPUT_CLASS} />
            </div>
            <div>
              <label className={LABEL_CLASS}>TREC license number <span className="text-red-400">*</span></label>
              <input type="text" name="trecLicenseNumber" value={formData.trecLicenseNumber} onChange={handleChange} placeholder="e.g. 123456" className={INPUT_CLASS} />
              <p className="text-xs text-gray-400 mt-1.5">Verified at trec.texas.gov</p>
            </div>
            <div>
              <label className={LABEL_CLASS}>License type <span className="text-red-400">*</span></label>
              <select name="licenseType" value={formData.licenseType} onChange={handleChange} className={INPUT_CLASS + ' bg-white'}>
                <option value="">Select…</option>
                <option value="Salesperson">Salesperson</option>
                <option value="Broker">Broker</option>
              </select>
            </div>
            <div>
              <label className={LABEL_CLASS}>
                Profile URL{HOUSTON_ZONES.has(formData.marketSpecialty) ? <span className="text-red-400"> *</span> : null}
              </label>
              <input type="text" name="profileUrl" value={formData.profileUrl} onChange={handleChange} placeholder="Zillow, HAR, Realtor.com, or personal site" className={INPUT_CLASS} />
              <p className="text-xs text-gray-400 mt-1.5">
                {HOUSTON_ZONES.has(formData.marketSpecialty)
                  ? 'HAR profile URL required for Houston metro applicants.'
                  : 'Zillow, HAR, Realtor.com, or personal site. HAR profile required if your market is in Houston Metro.'}
              </p>
            </div>
          </div>
        </div>

        {/* Section 5 — Market segment specialty */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6" style={{ boxShadow: CARD_SHADOW }}>
          <h2 className="font-bold text-gray-900 tracking-tight mb-1">Market segment specialty</h2>
          <p className="text-xs text-gray-400 mb-4">Select up to 2 segments that best represent your primary market. Adjacent segments only (e.g. Starter + Mid-Market, or High + Luxury).</p>
          <div className="flex flex-wrap gap-3">
            {MARKET_SEGMENTS.map(seg => {
              const checked = formData.marketSegments.includes(seg.value)
              const disabled = !checked && formData.marketSegments.length >= 2
              return (
                <label
                  key={seg.value}
                  className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl border text-sm cursor-pointer transition-all select-none ${
                    checked
                      ? 'border-accent bg-blue-50 text-accent font-semibold'
                      : disabled
                      ? 'border-gray-100 bg-gray-50 text-gray-300 cursor-not-allowed'
                      : 'border-gray-200 text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="checkbox"
                    className="sr-only"
                    checked={checked}
                    disabled={disabled}
                    onChange={() => handleSegmentChange(seg.value)}
                  />
                  {seg.label}
                </label>
              )
            })}
          </div>
        </div>

        {/* Section 6 — Transaction history */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6" style={{ boxShadow: CARD_SHADOW }}>
          <h2 className="font-bold text-gray-900 tracking-tight mb-1">Your production in the last 12 months</h2>
          <p className="text-xs text-gray-400 mb-5">We verify production as part of our review process. Please be accurate.</p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left">
                  <th className="text-xs font-semibold text-gray-400 uppercase tracking-wider pb-3 w-28"></th>
                  <th className="text-xs font-semibold text-gray-400 uppercase tracking-wider pb-3 pr-3">Transactions</th>
                  <th className="text-xs font-semibold text-gray-400 uppercase tracking-wider pb-3">Total dollar volume</th>
                </tr>
              </thead>
              <tbody className="space-y-2">
                <tr>
                  <td className="text-sm font-semibold text-gray-700 pr-4 py-2">Buyer side</td>
                  <td className="pr-3 py-2">
                    <input
                      type="number"
                      name="buyerTransactionCount"
                      value={formData.buyerTransactionCount}
                      onChange={handleChange}
                      placeholder="0"
                      min="0"
                      className={INPUT_CLASS}
                    />
                  </td>
                  <td className="py-2">
                    <input
                      type="number"
                      name="buyerTransactionVolume"
                      value={formData.buyerTransactionVolume}
                      onChange={handleChange}
                      placeholder="0"
                      min="0"
                      className={INPUT_CLASS}
                    />
                  </td>
                </tr>
                <tr>
                  <td className="text-sm font-semibold text-gray-700 pr-4 py-2">Seller side</td>
                  <td className="pr-3 py-2">
                    <input
                      type="number"
                      name="sellerTransactionCount"
                      value={formData.sellerTransactionCount}
                      onChange={handleChange}
                      placeholder="0"
                      min="0"
                      className={INPUT_CLASS}
                    />
                  </td>
                  <td className="py-2">
                    <input
                      type="number"
                      name="sellerTransactionVolume"
                      value={formData.sellerTransactionVolume}
                      onChange={handleChange}
                      placeholder="0"
                      min="0"
                      className={INPUT_CLASS}
                    />
                  </td>
                </tr>
                <tr className="border-t border-gray-100">
                  <td className="text-sm font-bold text-gray-900 pr-4 pt-3">Total</td>
                  <td className="pr-3 pt-3">
                    <div className="w-full border border-gray-100 rounded-xl px-3.5 py-2.5 text-sm text-gray-500 bg-gray-50 tabular-nums">
                      {totalCount > 0 ? totalCount : '—'}
                    </div>
                  </td>
                  <td className="pt-3">
                    <div className="w-full border border-gray-100 rounded-xl px-3.5 py-2.5 text-sm text-gray-500 bg-gray-50 tabular-nums">
                      {formatVolume(totalVolume)}
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Section 7 — Partner standards */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6" style={{ boxShadow: CARD_SHADOW }}>
          <h2 className="font-bold text-gray-900 tracking-tight mb-1">Our standards and your commitment</h2>
          <p className="text-xs text-gray-400 mb-5">Please read the following carefully before submitting.</p>

          <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 max-h-96 overflow-y-auto space-y-5">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-1">HavenQuest Partner Standards</p>
              <p className="text-xs text-gray-500 italic">What we expect. What we promise. What this partnership means.</p>
            </div>
            {PARTNER_STANDARDS.map(section => (
              <div key={section.heading}>
                <p className="text-sm font-bold text-gray-900 mb-1">{section.heading}</p>
                <p className="text-sm text-gray-600 leading-relaxed">{section.body}</p>
              </div>
            ))}
          </div>

          <label className="flex items-start gap-3 mt-5 cursor-pointer group">
            <input
              type="checkbox"
              name="standardsAcknowledged"
              checked={formData.standardsAcknowledged}
              onChange={handleChange}
              className="mt-0.5 h-4 w-4 rounded border-gray-300 text-accent focus:ring-accent shrink-0"
            />
            <span className="text-sm text-gray-700 leading-relaxed">
              I have read and understand the HavenQuest Partner Standards. I commit to upholding these standards in every interaction with HavenQuest buyers.
            </span>
          </label>
        </div>

        {/* Section 8 — Fit question */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6" style={{ boxShadow: CARD_SHADOW }}>
          <h2 className="font-bold text-gray-900 tracking-tight mb-1">What makes you the right fit for relocating buyers?</h2>
          <p className="text-xs text-gray-400 mb-4">This is your opportunity to tell us about yourself. Be specific — we read every response.</p>
          <textarea
            name="whyJoin"
            value={formData.whyJoin}
            onChange={handleChange}
            rows={5}
            placeholder="Tell us about your experience with relocation buyers, how you approach the buyer relationship, and what makes you different..."
            className={INPUT_CLASS + ' resize-none'}
          />
        </div>

        {error && (
          <div className="bg-red-50 border border-red-100 rounded-xl px-3.5 py-2.5">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-accent text-white py-3.5 rounded-xl font-bold text-sm hover:bg-[#154d8a] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          style={{ boxShadow: '0 2px 10px rgba(26,95,168,0.25)' }}
        >
          {loading ? 'Submitting…' : 'Submit My Application →'}
        </button>

      </form>
    </div>
  )
}
