'use client'

import { useState, useEffect, useRef } from 'react'
import { createClient } from '../../../../lib/supabase/client'
import { usePortalData } from '../../providers/PortalDataProvider'
import type { MM4Profile } from '../../../../types'
import Section1Identity from './sections/Section1Identity'
import Section2Household from './sections/Section2Household'
import Section2TheMove from './sections/Section2TheMove'
import Section3Employment from './sections/Section3Employment'
import Section4TexasDirection from './sections/Section4TexasDirection'
import Section5Notes from './sections/Section5Notes'

const SECTION_LABELS = [
  'Identity',
  'Household',
  'The Move',
  'Employment',
  'Direction',
  'Notes',
]

function parseHouseholdSize(hs: string | undefined): number {
  if (!hs) return 1
  if (hs === '5+') return 5
  const m = hs.match(/\d+/)
  return m ? Math.min(10, Math.max(1, parseInt(m[0], 10))) : 1
}

interface Props {
  onSubmitted: (data: MM4Profile) => void
}

export default function MM4IntakeForm({ onSubmitted }: Props) {
  const { session, profile, matches } = usePortalData()

  const [currentSection, setCurrentSection] = useState(0)
  const [direction, setDirection] = useState<'forward' | 'back'>('forward')
  const [animKey, setAnimKey] = useState(0)
  const [saving, setSaving] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [chosenCommunities, setChosenCommunities] = useState<string[]>([])

  const profileSeedApplied = useRef(false)

  const [formData, setFormData] = useState<MM4Profile>(() => ({
    email: session?.email ?? '',
    primary_first_name: session?.firstName ?? '',
    num_adults: parseHouseholdSize(profile?.householdSize),
    num_children: 0,
    has_pets: false,
    confirmed_target_city: matches[0]?.location?.name ?? '',
    income_range_confirmed: profile?.annualIncome
      ? `$${profile.annualIncome.toLocaleString('en-US')}`
      : '',
  }))

  // Seed num_adults and income from profile when it loads asynchronously
  useEffect(() => {
    if (!profile || profileSeedApplied.current) return
    profileSeedApplied.current = true
    setFormData(prev => ({
      ...prev,
      num_adults: prev.num_adults !== 1
        ? prev.num_adults
        : parseHouseholdSize(profile.householdSize),
      income_range_confirmed: prev.income_range_confirmed
        ? prev.income_range_confirmed
        : (profile.annualIncome ? `$${profile.annualIncome.toLocaleString('en-US')}` : ''),
    }))
  }, [profile])

  // Pre-populate current_zip from sessionStorage origin ZIP
  useEffect(() => {
    const zip = sessionStorage.getItem('hq_origin_zip')
    if (zip) {
      setFormData(prev => ({ ...prev, current_zip: prev.current_zip || zip }))
    }
  }, [])

  // Load existing partial record + chosen_communities on mount
  useEffect(() => {
    if (!session?.email) return
    const email = session.email.toLowerCase()
    const load = async () => {
      try {
        const supabase = createClient()

        const [{ data: existing }, { data: userData }] = await Promise.all([
          supabase
            .from('mm4_profiles')
            .select('*')
            .eq('email', email)
            .maybeSingle(),
          supabase
            .from('users')
            .select('chosen_communities')
            .eq('email', email)
            .maybeSingle(),
        ])

        if (existing && !existing.submitted) {
          setFormData(prev => ({ ...prev, ...existing }))
          profileSeedApplied.current = true
          const resumed = typeof existing.last_completed_section === 'number'
            ? Math.min(existing.last_completed_section, 5)
            : 0
          if (resumed > 0) {
            setCurrentSection(resumed)
            setAnimKey(k => k + 1)
          }
        }

        if (Array.isArray(userData?.chosen_communities) && userData.chosen_communities.length > 0) {
          setChosenCommunities(userData.chosen_communities)
        }
      } catch (err) {
        console.error('[MM4] load failed:', err)
      }
    }
    void load()
  }, [session?.email])

  function handleChange(updates: Partial<MM4Profile>) {
    setFormData(prev => ({ ...prev, ...updates }))
    setErrors(prev => {
      const next = { ...prev }
      Object.keys(updates).forEach(k => delete next[k])
      return next
    })
  }

  function validate(sectionIndex: number): Record<string, string> {
    const e: Record<string, string> = {}
    if (sectionIndex === 0) {
      if (!formData.primary_first_name?.trim()) e.primary_first_name = 'Required'
      if (!formData.primary_last_name?.trim()) e.primary_last_name = 'Required'
      if (!formData.phone?.trim()) e.phone = 'Required'
      if (!formData.preferred_contact) e.preferred_contact = 'Please select one'
    } else if (sectionIndex === 1) {
      if (!formData.num_adults || formData.num_adults < 1) e.num_adults = 'Required'
    } else if (sectionIndex === 2) {
      if (!formData.why_texas?.trim()) e.why_texas = 'Required'
      if (!formData.origin_situation) e.origin_situation = 'Please select one'
      if (!formData.timeline_flexibility) e.timeline_flexibility = 'Please select one'
    } else if (sectionIndex === 3) {
      if (!formData.employment_status) e.employment_status = 'Please select one'
      if (!formData.work_arrangement && formData.employment_status !== 'retired' && formData.employment_status !== 'other') {
        e.work_arrangement = 'Please select one'
      }
    } else if (sectionIndex === 4) {
      if (chosenCommunities.length === 0 && !formData.confirmed_target_city?.trim()) {
        e.confirmed_target_city = 'Required'
      }
    }
    return e
  }

  async function saveProgress(completedSection: number) {
    if (!session?.email) return
    setSaving(true)
    try {
      const supabase = createClient()
      const { data: { session: supaSession } } = await supabase.auth.getSession()
      if (!supaSession?.user?.id) return

      await supabase.from('mm4_profiles').upsert(
        {
          ...formData,
          email: session.email.toLowerCase(),
          user_id: supaSession.user.id,
          last_completed_section: completedSection,
        },
        { onConflict: 'email' }
      )
    } catch (err) {
      console.error('[MM4] save failed:', err)
    } finally {
      setSaving(false)
    }
  }

  async function handleContinue() {
    const errs = validate(currentSection)
    if (Object.keys(errs).length > 0) {
      setErrors(errs)
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }
    setErrors({})
    await saveProgress(currentSection + 1)
    setDirection('forward')
    setCurrentSection(s => s + 1)
    setAnimKey(k => k + 1)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function handleBack() {
    if (currentSection === 0) return
    setDirection('back')
    setCurrentSection(s => s - 1)
    setAnimKey(k => k + 1)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  async function handleSubmit() {
    if (!session?.email) return
    setSubmitting(true)
    setSubmitError(null)
    try {
      const supabase = createClient()

      // Attempt to get user_id from Supabase session — include it if available,
      // but do not block submission if the client-side session has expired.
      const { data: { session: supaSession } } = await supabase.auth.getSession()

      const now = new Date().toISOString()
      const submitData: MM4Profile = {
        ...formData,
        email: session.email.toLowerCase(),
        submitted: true,
        submitted_at: now,
        last_completed_section: 6,
        ...(supaSession?.user?.id ? { user_id: supaSession.user.id } : {}),
      }

      const { error: upsertError } = await supabase
        .from('mm4_profiles')
        .upsert(submitData, { onConflict: 'email' })
      if (upsertError) throw upsertError

      await supabase
        .from('users')
        .update({ current_milemarker: 4 })
        .eq('email', session.email.toLowerCase())
        .lt('current_milemarker', 4)

      // Send confirmation + MD notification emails — fire and forget
      void fetch('/api/mm4/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profile: submitData }),
      }).catch(err => console.error('[MM4] email route failed:', err))

      onSubmitted(submitData)
    } catch (err) {
      console.error('[MM4] submit failed:', err)
      setSubmitError('Something went wrong submitting your profile. Please try again — your progress is saved.')
    } finally {
      setSubmitting(false)
    }
  }

  const animStyle = {
    animation: `${direction === 'forward' ? 'mm4SlideInRight' : 'mm4SlideInLeft'} 280ms ease-out`,
  }

  const pct = ((currentSection) / 6) * 100

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>

      {/* Progress bar — full workspace width, above the inset card */}
      <div style={{ marginBottom: '28px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0', marginBottom: '16px' }}>
          {SECTION_LABELS.map((label, i) => {
            const done = i < currentSection
            const active = i === currentSection
            return (
              <div key={i} style={{ display: 'flex', alignItems: 'center', flex: i < 5 ? 1 : 'none' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                  <div style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '12px',
                    fontWeight: 600,
                    transition: 'all 0.25s',
                    backgroundColor: done ? '#0076B6' : active ? '#0076B6' : 'var(--card-bg)',
                    border: `2px solid ${done || active ? '#0076B6' : 'var(--card-border)'}`,
                    color: done || active ? '#ffffff' : 'var(--text-muted)',
                    flexShrink: 0,
                  }}>
                    {done ? '✓' : i + 1}
                  </div>
                  <span style={{
                    fontSize: '10px',
                    fontWeight: active ? 600 : 400,
                    color: active ? '#ffffff' : done ? 'rgba(255,255,255,0.65)' : 'rgba(255,255,255,0.4)',
                    whiteSpace: 'nowrap',
                    letterSpacing: '0.02em',
                    transition: 'color 0.25s',
                  }}>
                    {label}
                  </span>
                </div>
                {i < 5 && (
                  <div style={{
                    flex: 1,
                    height: '2px',
                    backgroundColor: done ? '#0076B6' : 'rgba(255,255,255,0.2)',
                    marginBottom: '22px',
                    marginLeft: '6px',
                    marginRight: '6px',
                    transition: 'background-color 0.25s',
                  }} />
                )}
              </div>
            )
          })}
        </div>

        <div style={{ height: '3px', backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: '2px', overflow: 'hidden' }}>
          <div style={{
            width: `${pct}%`,
            height: '100%',
            backgroundColor: '#0076B6',
            borderRadius: '2px',
            transition: 'width 0.35s ease',
          }} />
        </div>

        {saving && (
          <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)', marginTop: '6px', textAlign: 'right' }}>
            Saving…
          </p>
        )}
      </div>

      {/* Inset centered panel */}
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        width: '100%',
        backgroundColor: 'var(--card-bg)',
        border: '3px solid #0076B6',
        borderRadius: '16px',
        padding: '32px',
      }}>
        <div key={animKey} style={animStyle}>
          {currentSection === 0 && (
            <Section1Identity data={formData} onChange={handleChange} errors={errors} />
          )}
          {currentSection === 1 && (
            <Section2Household data={formData} onChange={handleChange} errors={errors} />
          )}
          {currentSection === 2 && (
            <Section2TheMove data={formData} onChange={handleChange} errors={errors} />
          )}
          {currentSection === 3 && (
            <Section3Employment data={formData} onChange={handleChange} errors={errors} />
          )}
          {currentSection === 4 && (
            <Section4TexasDirection
              data={formData}
              onChange={handleChange}
              errors={errors}
              chosenCommunities={chosenCommunities}
            />
          )}
          {currentSection === 5 && (
            <Section5Notes
              data={formData}
              onChange={handleChange}
              onSubmit={handleSubmit}
              submitting={submitting}
              submitError={submitError}
            />
          )}
        </div>
      </div>

      {/* Navigation buttons — below the inset panel, sticky at bottom */}
      {currentSection < 5 && (
        <div style={{
          position: 'sticky',
          bottom: 0,
          zIndex: 10,
          backgroundColor: 'var(--portal-bg)',
          borderTop: '1px solid rgba(255,255,255,0.12)',
          marginTop: '24px',
          padding: '16px 0',
        }}>
          <div style={{
            maxWidth: '1200px',
            margin: '0 auto',
            width: '100%',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
            <button
              type="button"
              onClick={handleBack}
              disabled={currentSection === 0}
              style={{
                padding: '10px 20px',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: 500,
                color: currentSection === 0 ? 'rgba(255,255,255,0.25)' : 'rgba(255,255,255,0.75)',
                backgroundColor: 'transparent',
                border: '1.5px solid rgba(255,255,255,0.25)',
                cursor: currentSection === 0 ? 'not-allowed' : 'pointer',
                transition: 'all 0.15s',
              }}
            >
              ← Back
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.55)' }}>
                Step {currentSection + 1} of 6
              </span>
              <button
                type="button"
                onClick={handleContinue}
                disabled={saving}
                style={{
                  padding: '10px 28px',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: 600,
                  color: '#ffffff',
                  backgroundColor: saving ? '#5BA8D0' : '#0076B6',
                  border: 'none',
                  cursor: saving ? 'not-allowed' : 'pointer',
                  transition: 'background-color 0.15s',
                  letterSpacing: '0.01em',
                }}
              >
                {saving ? 'Saving…' : 'Continue →'}
              </button>
            </div>
          </div>
        </div>
      )}

      {currentSection === 5 && (
        <div style={{
          maxWidth: '1200px',
          margin: '24px auto 0',
          width: '100%',
        }}>
          <button
            type="button"
            onClick={handleBack}
            style={{
              padding: '10px 20px',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: 500,
              color: 'rgba(255,255,255,0.75)',
              backgroundColor: 'transparent',
              border: '1.5px solid rgba(255,255,255,0.25)',
              cursor: 'pointer',
            }}
          >
            ← Back
          </button>
        </div>
      )}

    </div>
  )
}
