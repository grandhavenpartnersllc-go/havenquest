'use client'

import { useState, useEffect } from 'react'
import { Phone } from 'lucide-react'
import { UserSession, FamilyProfile } from '../../../types'
import { createClient } from '../../../lib/supabase/client'

const WARM_DARK = '#16120D'
const GOLD = '#B8912A'
const CARD_BG = '#FDFCFA'
const CARD_SHADOW = '0 1px 3px rgba(0,0,0,0.05), 0 4px 20px rgba(0,0,0,0.07)'

interface MM4ConnectProps {
  session: UserSession
}

export default function MM4Connect({ session }: MM4ConnectProps) {
  const [familyProfile, setFamilyProfile] = useState<FamilyProfile>({
    family_members: [],
    family_names: '',
    children_ages: [],
    special_needs: '',
    work_situation: '',
    commute_destination: '',
    school_preference: [],
    faith_community: '',
    activities: '',
    move_motivation: '',
    biggest_concern: '',
    additional_notes: '',
  })
  const [saved, setSaved] = useState(false)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getSession().then(({ data: { session: s } }) => {
      if (!s?.user?.email) return
      supabase
        .from('users')
        .select('family_profile')
        .eq('email', s.user.email.toLowerCase())
        .single()
        .then(({ data }) => {
          if (data?.family_profile && Object.keys(data.family_profile).length > 0) {
            setFamilyProfile(data.family_profile)
            setSaved(true)
          }
        })
    })
  }, [])

  async function handleSave() {
    setSaving(true)
    try {
      const supabase = createClient()
      const { data: { session: s } } = await supabase.auth.getSession()
      if (!s?.user?.email) return
      await supabase
        .from('users')
        .update({ family_profile: familyProfile })
        .eq('email', s.user.email.toLowerCase())
      setSaved(true)
    } catch {}
    finally { setSaving(false) }
  }

  return (
    <div>

      {/* Section 1 — The Welcome Moment */}
      <div className="mb-8">
        <p className="text-[10px] font-bold uppercase mb-3"
           style={{ color: GOLD, letterSpacing: '0.18em' }}>
          You&apos;re Connected
        </p>
        <h2 className="text-[22px] font-bold tracking-tight mb-3"
            style={{ color: WARM_DARK }}>
          {session.firstName}, someone is now in your corner.
        </h2>
        <p className="text-sm leading-relaxed" style={{ color: '#6B7280' }}>
          You&apos;ve done the hard work — explored your options, run your numbers, and committed
          your direction. Now something different begins. A real person who knows your market,
          has read your full report, and is ready to walk alongside you every step of the way.
          This is where your HavenQuest journey gets personal.
        </p>
      </div>

      {/* Section 2 — Meet Your Market Director */}
      <div className="rounded-2xl p-6 mb-8"
           style={{ backgroundColor: CARD_BG, boxShadow: CARD_SHADOW, border: `1.5px solid ${GOLD}22` }}>
        <p className="text-[10px] font-bold uppercase mb-4"
           style={{ color: GOLD, letterSpacing: '0.18em' }}>
          Your Market Director
        </p>

        <div className="flex items-start gap-4">
          <div
            className="w-16 h-16 rounded-full shrink-0 flex items-center justify-center font-bold text-xl"
            style={{ backgroundColor: GOLD, color: '#16120D' }}
          >
            HQ
          </div>

          <div className="flex-1">
            <h3 className="font-bold text-base mb-0.5" style={{ color: WARM_DARK }}>
              Your HavenQuest Market Director
            </h3>
            <p className="text-xs font-medium mb-3" style={{ color: GOLD }}>
              Texas Relocation Specialist
            </p>
            <p className="text-sm leading-relaxed" style={{ color: '#4B5563' }}>
              Your Market Director has already reviewed your full profile — your priorities,
              your financial picture, your top city matches, and everything you shared in
              your Refine session. Your first conversation won&apos;t start with
              &ldquo;tell me about yourself.&rdquo; It starts with real guidance from someone who
              already knows your situation.
            </p>
          </div>
        </div>

        <div className="mt-4 pt-4 flex items-center gap-3"
             style={{ borderTop: '1px solid #F0EDE6' }}>
          <div className="rounded-xl px-4 py-2 text-sm font-semibold"
               style={{ backgroundColor: '#F7F6F3', color: '#4B5563' }}>
            <Phone size={14} style={{ verticalAlign: 'middle', marginRight: 4 }} /> Reaching out within 24 hours
          </div>
        </div>
      </div>

      {/* Section 3 — Your Family Profile */}
      <div className="mb-8">
        <p className="text-[10px] font-bold uppercase mb-4"
           style={{ color: GOLD, letterSpacing: '0.18em' }}>
          Your Family Profile
        </p>

        {/* Nudge */}
        <div className="rounded-xl p-4 mb-6"
             style={{ backgroundColor: '#FBF3E3', border: `1px solid ${GOLD}44` }}>
          <p className="text-sm font-medium mb-1" style={{ color: '#7A5A1A' }}>
            Help your Market Director prepare
          </p>
          <p className="text-xs leading-relaxed" style={{ color: '#9A7830' }}>
            The more your Market Director knows about your family before your first conversation,
            the better they can help. This takes about 3 minutes and is completely optional —
            but the families who share the most get the most out of their first call.
          </p>
        </div>

        {/* Form */}
        <div className="space-y-6">

          {/* Who's moving */}
          <div>
            <label className="block text-sm font-semibold mb-2" style={{ color: WARM_DARK }}>
              Who&apos;s making this move with you?
            </label>
            <p className="text-xs mb-3" style={{ color: '#9A8E82' }}>Select all that apply</p>
            <div className="flex flex-wrap gap-2">
              {[
                { key: 'partner', label: 'Partner / Spouse' },
                { key: 'children', label: 'Children' },
                { key: 'parents', label: 'Parents / In-laws' },
                { key: 'pets', label: 'Pets' },
              ].map(opt => (
                <button
                  key={opt.key}
                  type="button"
                  onClick={() => {
                    const current = familyProfile.family_members
                    const updated = current.includes(opt.key)
                      ? current.filter(k => k !== opt.key)
                      : [...current, opt.key]
                    setFamilyProfile(p => ({ ...p, family_members: updated }))
                  }}
                  className="px-3 py-1.5 rounded-full text-xs font-semibold border transition-all"
                  style={{
                    backgroundColor: familyProfile.family_members.includes(opt.key) ? GOLD : 'transparent',
                    color: familyProfile.family_members.includes(opt.key) ? '#16120D' : '#6B7280',
                    borderColor: familyProfile.family_members.includes(opt.key) ? GOLD : '#E5E7EB',
                  }}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Family names — optional */}
          <div>
            <label className="block text-sm font-semibold mb-1" style={{ color: WARM_DARK }}>
              Would you like to share your family members&apos; names?{' '}
              <span style={{ color: '#9A8E82', fontWeight: 400 }}>(optional)</span>
            </label>
            <p className="text-xs mb-2" style={{ color: '#9A8E82' }}>
              First names only — helps your Market Director personalize the conversation.
              Example: &ldquo;Sarah, Jake (14), Emma (11)&rdquo;
            </p>
            <input
              type="text"
              value={familyProfile.family_names ?? ''}
              onChange={e => setFamilyProfile(p => ({ ...p, family_names: e.target.value }))}
              placeholder="e.g. Sarah, Jake (14), Emma (11)"
              className="w-full rounded-xl border px-4 py-2.5 text-sm"
              style={{ borderColor: '#E5E7EB', color: WARM_DARK }}
            />
          </div>

          {/* Children's ages — conditional */}
          {familyProfile.family_members.includes('children') && (
            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: WARM_DARK }}>
                Children&apos;s age ranges
              </label>
              <div className="flex flex-wrap gap-2">
                {[
                  { key: 'under5', label: 'Under 5' },
                  { key: '5-10', label: '5 – 10' },
                  { key: '11-14', label: '11 – 14' },
                  { key: '15-18', label: '15 – 18' },
                  { key: '18plus', label: '18+' },
                ].map(opt => (
                  <button
                    key={opt.key}
                    type="button"
                    onClick={() => {
                      const current = familyProfile.children_ages
                      const updated = current.includes(opt.key)
                        ? current.filter(k => k !== opt.key)
                        : [...current, opt.key]
                      setFamilyProfile(p => ({ ...p, children_ages: updated }))
                    }}
                    className="px-3 py-1.5 rounded-full text-xs font-semibold border transition-all"
                    style={{
                      backgroundColor: familyProfile.children_ages.includes(opt.key) ? GOLD : 'transparent',
                      color: familyProfile.children_ages.includes(opt.key) ? '#16120D' : '#6B7280',
                      borderColor: familyProfile.children_ages.includes(opt.key) ? GOLD : '#E5E7EB',
                    }}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Special needs */}
          <div>
            <label className="block text-sm font-semibold mb-1" style={{ color: WARM_DARK }}>
              Any special needs, considerations, or specific programs you&apos;re looking for?{' '}
              <span style={{ color: '#9A8E82', fontWeight: 400 }}>(optional)</span>
            </label>
            <p className="text-xs mb-2" style={{ color: '#9A8E82' }}>
              Elite athletics, special education, medical proximity, accessibility needs,
              specific extracurriculars — anything that matters to your family.
            </p>
            <textarea
              value={familyProfile.special_needs}
              onChange={e => setFamilyProfile(p => ({ ...p, special_needs: e.target.value }))}
              placeholder="e.g. Our son plays elite football — looking for strong high school programs..."
              rows={3}
              className="w-full rounded-xl border px-4 py-2.5 text-sm resize-none"
              style={{ borderColor: '#E5E7EB', color: WARM_DARK }}
            />
          </div>

          {/* Work situation */}
          <div>
            <label className="block text-sm font-semibold mb-2" style={{ color: WARM_DARK }}>
              What does your work situation look like?
            </label>
            <div className="flex flex-wrap gap-2">
              {[
                { key: 'remote', label: 'Fully Remote' },
                { key: 'hybrid', label: 'Hybrid' },
                { key: 'office', label: 'In-Office' },
                { key: 'self-employed', label: 'Self-Employed' },
                { key: 'retired', label: 'Retired' },
                { key: 'other', label: 'Other' },
              ].map(opt => (
                <button
                  key={opt.key}
                  type="button"
                  onClick={() => setFamilyProfile(p => ({ ...p, work_situation: opt.key }))}
                  className="px-3 py-1.5 rounded-full text-xs font-semibold border transition-all"
                  style={{
                    backgroundColor: familyProfile.work_situation === opt.key ? GOLD : 'transparent',
                    color: familyProfile.work_situation === opt.key ? '#16120D' : '#6B7280',
                    borderColor: familyProfile.work_situation === opt.key ? GOLD : '#E5E7EB',
                  }}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* School preference */}
          <div>
            <label className="block text-sm font-semibold mb-2" style={{ color: WARM_DARK }}>
              School preference
            </label>
            <div className="flex flex-wrap gap-2">
              {[
                { key: 'public', label: 'Public school' },
                { key: 'private', label: 'Private school' },
                { key: 'homeschool', label: 'Homeschool' },
                { key: 'open', label: 'Open to all' },
              ].map(opt => (
                <button
                  key={opt.key}
                  type="button"
                  onClick={() => {
                    const current = familyProfile.school_preference
                    const updated = current.includes(opt.key)
                      ? current.filter(k => k !== opt.key)
                      : [...current, opt.key]
                    setFamilyProfile(p => ({ ...p, school_preference: updated }))
                  }}
                  className="px-3 py-1.5 rounded-full text-xs font-semibold border transition-all"
                  style={{
                    backgroundColor: familyProfile.school_preference.includes(opt.key) ? GOLD : 'transparent',
                    color: familyProfile.school_preference.includes(opt.key) ? '#16120D' : '#6B7280',
                    borderColor: familyProfile.school_preference.includes(opt.key) ? GOLD : '#E5E7EB',
                  }}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* What's driving this move */}
          <div>
            <label className="block text-sm font-semibold mb-2" style={{ color: WARM_DARK }}>
              What&apos;s driving this move?
            </label>
            <div className="flex flex-wrap gap-2">
              {[
                { key: 'job', label: 'Job / Career' },
                { key: 'family', label: 'Family' },
                { key: 'lifestyle', label: 'Lifestyle' },
                { key: 'cost', label: 'Cost of living' },
                { key: 'retirement', label: 'Retirement' },
                { key: 'other', label: 'Other' },
              ].map(opt => (
                <button
                  key={opt.key}
                  type="button"
                  onClick={() => setFamilyProfile(p => ({ ...p, move_motivation: opt.key }))}
                  className="px-3 py-1.5 rounded-full text-xs font-semibold border transition-all"
                  style={{
                    backgroundColor: familyProfile.move_motivation === opt.key ? GOLD : 'transparent',
                    color: familyProfile.move_motivation === opt.key ? '#16120D' : '#6B7280',
                    borderColor: familyProfile.move_motivation === opt.key ? GOLD : '#E5E7EB',
                  }}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Biggest concern */}
          <div>
            <label className="block text-sm font-semibold mb-1" style={{ color: WARM_DARK }}>
              What worries you most about this move?{' '}
              <span style={{ color: '#9A8E82', fontWeight: 400 }}>(optional)</span>
            </label>
            <p className="text-xs mb-2" style={{ color: '#9A8E82' }}>
              Your Market Director has heard it all — and knowing what&apos;s on your mind
              helps them address it in your first conversation.
            </p>
            <textarea
              value={familyProfile.biggest_concern}
              onChange={e => setFamilyProfile(p => ({ ...p, biggest_concern: e.target.value }))}
              placeholder="e.g. Finding the right neighborhood before we visit, managing the timing with our home sale..."
              rows={3}
              className="w-full rounded-xl border px-4 py-2.5 text-sm resize-none"
              style={{ borderColor: '#E5E7EB', color: WARM_DARK }}
            />
          </div>

          {/* Anything else */}
          <div>
            <label className="block text-sm font-semibold mb-1" style={{ color: WARM_DARK }}>
              Anything else your Market Director should know?{' '}
              <span style={{ color: '#9A8E82', fontWeight: 400 }}>(optional)</span>
            </label>
            <textarea
              value={familyProfile.additional_notes}
              onChange={e => setFamilyProfile(p => ({ ...p, additional_notes: e.target.value }))}
              placeholder="Anything at all — the more context, the better your first conversation will be."
              rows={3}
              className="w-full rounded-xl border px-4 py-2.5 text-sm resize-none"
              style={{ borderColor: '#E5E7EB', color: WARM_DARK }}
            />
          </div>

          {/* Save button */}
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="w-full py-3 rounded-xl font-bold text-sm transition-opacity hover:opacity-90 disabled:opacity-50"
            style={{ backgroundColor: GOLD, color: '#16120D' }}
          >
            {saving ? 'Saving...' : saved ? '✓ Profile Saved' : 'Save My Family Profile'}
          </button>

          {saved && (
            <p className="text-xs text-center" style={{ color: '#2D7D4E' }}>
              Your Market Director will receive this before your first conversation.
            </p>
          )}

        </div>
      </div>

      {/* Section 4 — What Happens Next */}
      <div className="mt-8 rounded-xl p-5" style={{ backgroundColor: '#F7F6F3' }}>
        <p className="text-[10px] font-bold uppercase mb-3"
           style={{ color: GOLD, letterSpacing: '0.18em' }}>
          What to Expect
        </p>
        <div className="space-y-3">
          {[
            { step: '1', text: 'Your Market Director reviews your full profile — everything from your quiz, your sandbox session, and your family profile.' },
            { step: '2', text: 'They reach out within 24 hours to schedule your strategy session.' },
            { step: '3', text: 'Your strategy session covers your target city and zone, timeline, financing readiness, and any questions you have.' },
            { step: '4', text: "By the end of the call, you'll have a clear direction and someone who knows exactly how to get you there." },
          ].map(item => (
            <div key={item.step} className="flex gap-3">
              <div
                className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-xs font-bold"
                style={{ backgroundColor: GOLD, color: '#16120D' }}
              >
                {item.step}
              </div>
              <p className="text-sm leading-relaxed" style={{ color: '#4B5563' }}>
                {item.text}
              </p>
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}
