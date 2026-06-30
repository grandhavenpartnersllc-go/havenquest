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
import Section6Research from './sections/Section6Research'
import Section5Notes from './sections/Section5Notes'

const SECTION_COUNT = 7

function parseHouseholdSize(hs: string | undefined): number {
  if (!hs) return 1
  if (hs === '5+') return 5
  const m = hs.match(/\d+/)
  return m ? Math.min(10, Math.max(1, parseInt(m[0], 10))) : 1
}

// Quiz captures home status as one of these four buckets (Card7Situation) —
// 'keeping' is the only value that renames on the MM4 side.
function mapHomeStatusToOriginSituation(homeStatus: string | null | undefined): MM4Profile['origin_situation'] | undefined {
  switch (homeStatus) {
    case 'renting': return 'renting'
    case 'selling': return 'selling'
    case 'keeping': return 'own_no_sale'
    case 'other': return 'other'
    default: return undefined
  }
}

// Quiz's moving_timeline is a coarser range than MM4's timeline_flexibility —
// this is a lossy, one-directional mapping, not a true equivalence.
function mapMovingTimelineToFlexibility(movingTimeline: string | null | undefined): MM4Profile['timeline_flexibility'] | undefined {
  switch (movingTimeline) {
    case '0-3months': return 'hard_deadline'
    case '3-6months':
    case '6-12months': return 'flexible_few_months'
    case '12plus':
    case 'exploring': return 'very_flexible'
    default: return undefined
  }
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
  const [quizHouseholdSize, setQuizHouseholdSize] = useState<string | null>(null)
  const [quizMovingTimeline, setQuizMovingTimeline] = useState<string | null>(null)
  const [quizWorkSituation, setQuizWorkSituation] = useState<string | null>(null)

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

  // Pre-populate current_zip/city/state from sessionStorage (fallback only — Supabase values take priority in the load effect below)
  useEffect(() => {
    const zip = sessionStorage.getItem('hq_origin_zip')
    if (zip) setFormData(prev => ({ ...prev, current_zip: prev.current_zip || zip }))
    const city = sessionStorage.getItem('hq_origin_city')
    if (city) setFormData(prev => ({ ...prev, current_city: prev.current_city || city }))
    const state = sessionStorage.getItem('hq_origin_state')
    if (state) setFormData(prev => ({ ...prev, current_state: prev.current_state || state }))
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
            .select('chosen_communities, household_size, home_status, moving_timeline, annual_income_override, sandbox_profile, origin_city, origin_state, origin_zip, work_situation')
            .eq('email', email)
            .maybeSingle(),
        ])

        if (userData?.household_size) {
          setQuizHouseholdSize(userData.household_size)
        }
        if (userData?.moving_timeline) {
          setQuizMovingTimeline(userData.moving_timeline as string)
        }
        if (userData?.work_situation) {
          setQuizWorkSituation(userData.work_situation as string)
        }

        // A3: prefer MM3 override values over quiz values
        const sandboxProfile = userData?.sandbox_profile as Record<string, unknown> | null ?? null
        const mappedOriginSituation = mapHomeStatusToOriginSituation(
          (sandboxProfile?.homeStatus as string | undefined) ?? userData?.home_status
        )
        const mappedTimelineFlexibility = mapMovingTimelineToFlexibility(
          (sandboxProfile?.moveTimeline as string | undefined) ?? userData?.moving_timeline
        )
        const incomeFromSupabase = userData?.annual_income_override
          ? `$${userData.annual_income_override.toLocaleString('en-US')}`
          : null

        // A4: prefer Supabase origin city/state/zip over sessionStorage
        const originCityFromDb = userData?.origin_city as string | null ?? null
        const originStateFromDb = userData?.origin_state as string | null ?? null
        const originZipFromDb = userData?.origin_zip as string | null ?? null

        if (existing && !existing.submitted) {
          setFormData(prev => ({
            ...prev,
            ...existing,
            origin_situation: existing.origin_situation ?? mappedOriginSituation,
            timeline_flexibility: existing.timeline_flexibility ?? mappedTimelineFlexibility,
            income_range_confirmed: existing.income_range_confirmed || incomeFromSupabase || prev.income_range_confirmed,
            current_city: existing.current_city || originCityFromDb || prev.current_city,
            current_state: existing.current_state || originStateFromDb || prev.current_state,
            current_zip: existing.current_zip || originZipFromDb || prev.current_zip,
          }))
          profileSeedApplied.current = true
          const resumed = typeof existing.last_completed_section === 'number'
            ? Math.min(existing.last_completed_section, 6)
            : 0
          if (resumed > 0) {
            setCurrentSection(resumed)
            setAnimKey(k => k + 1)
          }
        } else if (mappedOriginSituation || mappedTimelineFlexibility || incomeFromSupabase || originCityFromDb) {
          setFormData(prev => ({
            ...prev,
            origin_situation: prev.origin_situation ?? mappedOriginSituation,
            timeline_flexibility: prev.timeline_flexibility ?? mappedTimelineFlexibility,
            income_range_confirmed: prev.income_range_confirmed || incomeFromSupabase || prev.income_range_confirmed,
            current_city: prev.current_city || originCityFromDb || prev.current_city,
            current_state: prev.current_state || originStateFromDb || prev.current_state,
            current_zip: prev.current_zip || originZipFromDb || prev.current_zip,
          }))
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
      await supabase.from('mm4_profiles').upsert(
        {
          ...formData,
          email: session.email.toLowerCase(),
          last_completed_section: completedSection,
          ...(supaSession?.user?.id ? { user_id: supaSession.user.id } : {}),
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
      const quizSessionId = typeof window !== 'undefined' ? localStorage.getItem('hq_session_id') : null
      const submitData: MM4Profile = {
        ...formData,
        email: session.email.toLowerCase(),
        submitted: true,
        submitted_at: now,
        last_completed_section: 7,
        ...(supaSession?.user?.id ? { user_id: supaSession.user.id } : {}),
        ...(quizSessionId ? { quiz_session_id: quizSessionId } : {}),
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

  const topMatchNames = matches.slice(0, 3).map(m => m.location.name)
  const isLastSection = currentSection === 6

  return (
    <div style={{ width: '100%', maxWidth: '860px' }}>

      {/* White card */}
      <div style={{
        backgroundColor: '#FFFFFF',
        border: '0.5px solid rgba(0,0,0,0.08)',
        borderRadius: '20px',
        width: '100%',
      }}>

        {/* Card header */}
        <div style={{ padding: '36px 40px 0' }}>
          {/* Step progress dots */}
          <div style={{ display: 'flex', gap: '7px', marginBottom: '28px' }}>
            {Array.from({ length: SECTION_COUNT }).map((_, i) => {
              const done = i < currentSection
              const active = i === currentSection
              return (
                <div
                  key={i}
                  style={{
                    width: active ? '22px' : '7px',
                    height: '7px',
                    borderRadius: active ? '4px' : '50%',
                    backgroundColor: active
                      ? '#0A1E3D'
                      : done
                        ? 'rgba(197,183,131,0.7)'
                        : 'rgba(10,30,61,0.15)',
                    transition: 'all 0.25s',
                  }}
                />
              )
            })}
          </div>

          {saving && (
            <p style={{ fontSize: '11px', color: 'rgba(10,30,61,0.4)', marginBottom: '8px', textAlign: 'right' }}>
              Saving…
            </p>
          )}
        </div>

        {/* Divider */}
        <div style={{ height: '0.5px', background: 'rgba(10,30,61,0.08)', margin: '24px 0 0' }} />

        {/* Card body */}
        <div style={{ padding: '32px 40px' }}>
          <div key={animKey} style={animStyle}>
            {currentSection === 0 && (
              <Section1Identity data={formData} onChange={handleChange} errors={errors} />
            )}
            {currentSection === 1 && (
              <Section2Household
                data={formData}
                onChange={handleChange}
                errors={errors}
                householdSize={quizHouseholdSize}
                movingTimeline={quizMovingTimeline}
              />
            )}
            {currentSection === 2 && (
              <Section2TheMove
                data={formData}
                onChange={handleChange}
                errors={errors}
                quizWorkSituation={quizWorkSituation}
              />
            )}
            {currentSection === 3 && (
              <Section3Employment
                data={formData}
                onChange={handleChange}
                errors={errors}
                quizWorkSituation={quizWorkSituation}
              />
            )}
            {currentSection === 4 && (
              <Section4TexasDirection
                data={formData}
                onChange={handleChange}
                errors={errors}
                chosenCommunities={chosenCommunities}
                topMatchNames={topMatchNames}
              />
            )}
            {currentSection === 5 && (
              <Section6Research
                data={formData}
                onChange={handleChange}
                errors={errors}
              />
            )}
            {currentSection === 6 && (
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

        {/* Card footer */}
        <div style={{
          padding: '20px 40px 32px',
          borderTop: '0.5px solid rgba(10,30,61,0.07)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          {/* Back button */}
          <button
            type="button"
            onClick={handleBack}
            disabled={currentSection === 0}
            style={{
              fontSize: '13px',
              color: currentSection === 0 ? 'rgba(10,30,61,0.15)' : 'rgba(10,30,61,0.3)',
              background: 'none',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              cursor: currentSection === 0 ? 'default' : 'pointer',
              padding: 0,
              fontFamily: 'inherit',
              transition: 'color 0.15s',
            }}
            onMouseEnter={e => {
              if (currentSection > 0) (e.currentTarget as HTMLButtonElement).style.color = 'rgba(10,30,61,0.6)'
            }}
            onMouseLeave={e => {
              if (currentSection > 0) (e.currentTarget as HTMLButtonElement).style.color = 'rgba(10,30,61,0.3)'
            }}
          >
            ← Back
          </button>

          {/* Step count */}
          <span style={{ fontSize: '12px', color: 'rgba(10,30,61,0.25)' }}>
            Step {currentSection + 1} of 7
          </span>

          {/* Continue button (hidden on last section — Section5Notes has its own submit) */}
          {!isLastSection ? (
            <button
              type="button"
              onClick={handleContinue}
              disabled={saving}
              style={{
                background: saving ? 'rgba(10,30,61,0.5)' : '#0A1E3D',
                color: '#C5B783',
                border: 'none',
                borderRadius: '10px',
                padding: '12px 28px',
                fontSize: '14px',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: '7px',
                cursor: saving ? 'not-allowed' : 'pointer',
                transition: 'background 0.15s',
                fontFamily: 'inherit',
              }}
              onMouseEnter={e => {
                if (!saving) (e.currentTarget as HTMLButtonElement).style.background = '#112954'
              }}
              onMouseLeave={e => {
                if (!saving) (e.currentTarget as HTMLButtonElement).style.background = '#0A1E3D'
              }}
            >
              {saving ? 'Saving…' : 'Continue →'}
            </button>
          ) : (
            <div style={{ width: '120px' }} />
          )}
        </div>
      </div>
    </div>
  )
}
