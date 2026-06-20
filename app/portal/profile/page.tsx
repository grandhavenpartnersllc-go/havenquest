'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { usePortalData } from '../providers/PortalDataProvider'
import { createClient } from '../../../lib/supabase/client'
import { formatPhone } from '../../../utils/formatters'
import { Camera } from 'lucide-react'

interface ExtendedUserData {
  last_name: string | null
  phone: string | null
  origin_city: string | null
  origin_state: string | null
  partner_name: string | null
  profile_photo_url: string | null
  md_email: string | null
  md_name: string | null
  created_at: string | null
}

const HOUSEHOLD_OPTIONS = ['1', '2', '3-4', '5+']

const SECTION_LABEL: React.CSSProperties = {
  fontSize: '10px',
  fontWeight: 700,
  letterSpacing: '0.14em',
  textTransform: 'uppercase',
  color: '#C5B783',
  margin: '0 0 16px',
}

const FIELD_LABEL: React.CSSProperties = {
  fontSize: '11px',
  fontWeight: 600,
  color: '#8a93a0',
  marginBottom: '5px',
  letterSpacing: '0.02em',
  textTransform: 'uppercase',
}

const READ_ONLY_VALUE: React.CSSProperties = {
  fontSize: '14px',
  color: '#0A1E3D',
  backgroundColor: '#f4f6f8',
  border: '1px solid transparent',
  borderRadius: '8px',
  padding: '9px 12px',
  minHeight: '38px',
  display: 'flex',
  alignItems: 'center',
}

function inputStyle(dirty: boolean): React.CSSProperties {
  return {
    width: '100%',
    height: '38px',
    padding: '0 12px',
    fontSize: '14px',
    color: '#0A1E3D',
    backgroundColor: '#ffffff',
    border: `1.5px solid ${dirty ? '#0076B6' : '#e2e6ea'}`,
    borderRadius: '8px',
    outline: 'none',
    fontFamily: 'inherit',
    boxSizing: 'border-box',
    transition: 'border-color 0.15s',
  }
}

function selectStyle(dirty: boolean): React.CSSProperties {
  return {
    ...inputStyle(dirty),
    appearance: 'none' as const,
    cursor: 'pointer',
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%238a93a0' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'right 12px center',
    paddingRight: '32px',
  }
}


function mmBadgeLabel(mm: number): string {
  const names: Record<number, string> = {
    1: 'Welcome', 2: 'Explore', 3: 'Discover', 4: 'Connect',
    5: 'Plan', 6: 'Prepare', 7: 'Match', 8: 'Engage', 9: 'Transition', 10: 'Home'
  }
  return names[mm] ?? 'In Progress'
}

function formatDate(iso: string | null): string {
  if (!iso) return 'June 2026'
  return new Date(iso).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
}

export default function ProfilePage() {
  const { session, profile, matches, currentMM, ready } = usePortalData()

  const [extended, setExtended] = useState<ExtendedUserData>({
    last_name: null, phone: null, origin_city: null, origin_state: null,
    partner_name: null, profile_photo_url: null, md_email: null, md_name: null, created_at: null,
  })
  const [photoSignedUrl, setPhotoSignedUrl] = useState<string | null>(null)
  const [loadingExtended, setLoadingExtended] = useState(true)

  // Personal section state
  const [personal, setPersonal] = useState({ first_name: '', last_name: '', phone: '', partner_name: '' })
  const [personalDirty, setPersonalDirty] = useState(false)
  const [personalSaving, setPersonalSaving] = useState(false)
  const [personalSaved, setPersonalSaved] = useState(false)
  const [personalError, setPersonalError] = useState('')

  // Move section state
  const [move, setMove] = useState({ origin_city: '', origin_state: '', household_size: '', annual_income: '' })
  const [moveDirty, setMoveDirty] = useState(false)
  const [moveSaving, setMoveSaving] = useState(false)
  const [moveSaved, setMoveSaved] = useState(false)
  const [moveError, setMoveError] = useState('')

  // Photo upload state
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const loadExtended = useCallback(async () => {
    if (!session?.email) return
    try {
      const supabase = createClient()
      await supabase.auth.getSession()
      const email = session.email.toLowerCase()

      const [{ data }, { data: mm4 }] = await Promise.all([
        supabase
          .from('users')
          .select('first_name, household_size, annual_income, created_at, last_name, phone, origin_city, origin_state, partner_name, profile_photo_url, md_email')
          .eq('email', email)
          .single(),
        supabase
          .from('mm4_profiles')
          .select('primary_first_name, primary_last_name, phone, partner_first_name, partner_last_name, current_city, current_state')
          .eq('email', email)
          .maybeSingle(),
      ])

      if (!data) {
        setPersonal(p => ({ ...p, first_name: session.firstName ?? '' }))
        setMove(p => ({
          ...p,
          household_size: profile?.householdSize ?? '',
          annual_income: profile?.annualIncome ? String(profile.annualIncome) : '',
        }))
        return
      }

      // Merge: MM4 data takes precedence over users data where both exist
      const mm4FirstName = (mm4?.primary_first_name as string | null | undefined) || null
      const mm4LastName = (mm4?.primary_last_name as string | null | undefined) || null
      const mm4Phone = (mm4?.phone as string | null | undefined) || null
      const mm4PartnerName = mm4
        ? [mm4.partner_first_name, mm4.partner_last_name].filter(Boolean).join(' ') || null
        : null
      const mm4City = (mm4?.current_city as string | null | undefined) || null
      const mm4State = (mm4?.current_state as string | null | undefined) || null

      let mdName: string | null = null
      if (data.md_email) {
        const { data: staffRow } = await supabase
          .from('staff_accounts')
          .select('full_name')
          .eq('email', (data.md_email as string).toLowerCase())
          .single()
        mdName = (staffRow?.full_name as string | null) ?? null
      }

      const mergedLastName = mm4LastName ?? (data.last_name as string | null) ?? null
      const mergedPhone = mm4Phone ?? (data.phone as string | null) ?? null
      const mergedPartnerName = mm4PartnerName ?? (data.partner_name as string | null) ?? null
      const mergedCity = mm4City ?? (data.origin_city as string | null) ?? null
      const mergedState = mm4State ?? (data.origin_state as string | null) ?? null

      const ext: ExtendedUserData = {
        last_name: mergedLastName,
        phone: mergedPhone,
        origin_city: mergedCity,
        origin_state: mergedState,
        partner_name: mergedPartnerName,
        profile_photo_url: (data.profile_photo_url as string | null) ?? null,
        md_email: (data.md_email as string | null) ?? null,
        md_name: mdName,
        created_at: (data.created_at as string | null) ?? null,
      }
      setExtended(ext)

      if (data.profile_photo_url) {
        const stored = data.profile_photo_url as string
        // New uploads store the full signed URL; old records may store a path — display whatever is there
        setPhotoSignedUrl(stored)
      }

      setPersonal({
        first_name: mm4FirstName ?? (data.first_name as string | null) ?? session.firstName ?? '',
        last_name: mergedLastName ?? '',
        phone: mergedPhone ?? '',
        partner_name: mergedPartnerName ?? '',
      })
      setMove({
        origin_city: mergedCity ?? '',
        origin_state: mergedState ?? '',
        household_size: (data.household_size as string | null) ?? profile?.householdSize ?? '',
        annual_income: data.annual_income ? String(data.annual_income as number) : (profile?.annualIncome ? String(profile.annualIncome) : ''),
      })
    } catch (err) {
      console.error('[ProfilePage] load error:', err)
    } finally {
      setLoadingExtended(false)
    }
  }, [session, profile])

  useEffect(() => {
    if (ready && session?.email) {
      void loadExtended()
    }
  }, [ready, session?.email, loadExtended])

  async function savePersonal() {
    if (!session?.email) return
    setPersonalSaving(true)
    setPersonalError('')
    const changedFields: string[] = []
    if (personal.first_name !== session.firstName) changedFields.push('first name')
    if (personal.last_name !== (extended.last_name ?? '')) changedFields.push('last name')
    if (personal.phone !== (extended.phone ?? '')) changedFields.push('phone')
    if (personal.partner_name !== (extended.partner_name ?? '')) changedFields.push('partner name')

    try {
      const res = await fetch('/api/portal/update-profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          first_name: personal.first_name,
          last_name: personal.last_name || null,
          phone: personal.phone || null,
          partner_name: personal.partner_name || null,
          changed_fields: changedFields,
        }),
      })
      if (!res.ok) {
        const j = await res.json() as { error?: string }
        throw new Error(j.error ?? 'Save failed')
      }
      setPersonalDirty(false)
      setPersonalSaved(true)
      setTimeout(() => setPersonalSaved(false), 2000)
      setExtended(prev => ({ ...prev, last_name: personal.last_name || null, phone: personal.phone || null, partner_name: personal.partner_name || null }))
    } catch (err) {
      setPersonalError(err instanceof Error ? err.message : 'Failed to save')
    } finally {
      setPersonalSaving(false)
    }
  }

  async function saveMove() {
    if (!session?.email) return
    setMoveSaving(true)
    setMoveError('')
    const changedFields: string[] = []
    if (move.origin_city !== (extended.origin_city ?? '')) changedFields.push('origin city')
    if (move.origin_state !== (extended.origin_state ?? '')) changedFields.push('origin state')
    if (move.household_size !== (profile?.householdSize ?? '')) changedFields.push('household size')
    const incomeNum = move.annual_income ? parseInt(move.annual_income.replace(/\D/g, ''), 10) || null : null
    if (incomeNum !== (profile?.annualIncome ?? null)) changedFields.push('annual income')

    try {
      const res = await fetch('/api/portal/update-profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          origin_city: move.origin_city || null,
          origin_state: move.origin_state || null,
          household_size: move.household_size || null,
          annual_income: incomeNum,
          changed_fields: changedFields,
        }),
      })
      if (!res.ok) {
        const j = await res.json() as { error?: string }
        throw new Error(j.error ?? 'Save failed')
      }
      setMoveDirty(false)
      setMoveSaved(true)
      setTimeout(() => setMoveSaved(false), 2000)
      setExtended(prev => ({ ...prev, origin_city: move.origin_city || null, origin_state: move.origin_state || null }))
    } catch (err) {
      setMoveError(err instanceof Error ? err.message : 'Failed to save')
    } finally {
      setMoveSaving(false)
    }
  }

  async function handlePhotoSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file || !session?.email) return
    setUploadError('')

    if (!file.type.startsWith('image/')) {
      setUploadError('Please select an image file.')
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      setUploadError('Image must be under 5MB.')
      return
    }

    setUploading(true)
    try {
      const fd = new FormData()
      fd.append('file', file)

      const res = await fetch('/api/portal/upload-photo', { method: 'POST', body: fd })
      if (!res.ok) {
        const j = await res.json() as { error?: string }
        throw new Error(j.error ?? 'Upload failed')
      }

      const { signedUrl } = await res.json() as { signedUrl: string }
      setPhotoSignedUrl(signedUrl)
      setExtended(prev => ({ ...prev, profile_photo_url: signedUrl }))
    } catch (err) {
      console.error('[ProfilePage] photo upload error:', err)
      setUploadError(err instanceof Error ? err.message : 'Upload failed. Please try again.')
    } finally {
      setUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  const priorityLabels: Record<string, string> = {
    affordability: 'Affordability', schools: 'Schools', safety: 'Safety',
    walkability: 'Walkability', transit: 'Transit', nightlife: 'Nightlife',
    outdoors: 'Outdoors', familyFriendly: 'Family Friendly', remoteWork: 'Remote Work',
    lowTaxes: 'Low Taxes', weather: 'Weather', traffic: 'Traffic', healthcare: 'Healthcare',
  }

  if (!ready || loadingExtended) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
        <div style={{
          width: '24px', height: '24px', borderRadius: '50%',
          border: '2px solid #0076B6', borderTopColor: 'transparent',
          animation: 'spin 0.7s linear infinite',
        }} />
      </div>
    )
  }

  if (!session) return null

  const initials = `${session.firstName?.[0] ?? ''}${extended.last_name?.[0] ?? ''}`.toUpperCase() || session.email[0].toUpperCase()
  const displayName = [session.firstName, extended.last_name].filter(Boolean).join(' ') || session.email

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100%' }}>
      {/* Header */}
      <div style={{
        padding: '20px 24px 16px',
        borderBottom: '0.5px solid var(--panel-border)',
        backgroundColor: 'var(--panel-bg)',
        flexShrink: 0,
      }}>
        <p style={{ fontSize: '11px', color: 'var(--text-muted)', margin: '0 0 6px' }}>
          Navigator Portal <span style={{ margin: '0 5px' }}>›</span>
          <span style={{ color: 'var(--text-secondary)' }}>My Profile</span>
        </p>
        <h1 style={{ fontSize: '20px', fontWeight: 700, color: '#0A1E3D', margin: 0, lineHeight: 1.2 }}>
          My Profile
        </h1>
      </div>

      {/* Body */}
      <div style={{ flex: 1, padding: '24px', overflowY: 'auto' }}>
        <div style={{ display: 'flex', gap: '24px', alignItems: 'flex-start', maxWidth: '900px' }}>

          {/* LEFT COLUMN */}
          <div style={{ width: '220px', flexShrink: 0, display: 'flex', flexDirection: 'column', gap: '16px' }}>

            {/* Photo + name card */}
            <div style={{
              backgroundColor: 'var(--panel-bg)',
              border: '1px solid var(--panel-border)',
              borderRadius: '12px',
              padding: '24px 20px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              gap: '12px',
            }}>
              {/* Avatar */}
              <div style={{ position: 'relative' }}>
                <div
                  onClick={() => fileInputRef.current?.click()}
                  style={{
                    width: '96px', height: '96px', borderRadius: '50%',
                    backgroundColor: photoSignedUrl ? 'transparent' : '#0076B6',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: 'pointer', overflow: 'hidden', position: 'relative',
                    border: '3px solid var(--panel-border)',
                  }}
                >
                  {photoSignedUrl ? (
                    <img src={photoSignedUrl} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <span style={{ fontSize: '28px', fontWeight: 700, color: '#ffffff' }}>{initials}</span>
                  )}
                  {/* Upload overlay */}
                  <div style={{
                    position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.45)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    opacity: 0, transition: 'opacity 0.15s',
                  }}
                    onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.opacity = '1' }}
                    onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.opacity = '0' }}
                  >
                    <Camera size={20} color="#ffffff" />
                  </div>
                </div>
                {uploading && (
                  <div style={{
                    position: 'absolute', inset: 0, borderRadius: '50%',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    backgroundColor: 'rgba(255,255,255,0.8)',
                  }}>
                    <div style={{
                      width: '20px', height: '20px', borderRadius: '50%',
                      border: '2px solid #0076B6', borderTopColor: 'transparent',
                      animation: 'spin 0.7s linear infinite',
                    }} />
                  </div>
                )}
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={e => { void handlePhotoSelect(e) }}
                style={{ display: 'none' }}
              />

              {uploadError && (
                <p style={{ fontSize: '12px', color: '#DC2626', margin: 0, lineHeight: 1.4 }}>{uploadError}</p>
              )}

              <div>
                <p style={{ fontSize: '15px', fontWeight: 700, color: '#0A1E3D', margin: '0 0 2px', lineHeight: 1.25 }}>
                  {displayName}
                </p>
                <p style={{ fontSize: '12px', color: '#8a93a0', margin: 0 }}>{session.email}</p>
              </div>

              {/* MM badge */}
              <span style={{
                fontSize: '11px', fontWeight: 600, color: '#0076B6',
                backgroundColor: '#EBF5FB', padding: '4px 12px',
                borderRadius: '20px', whiteSpace: 'nowrap',
              }}>
                {mmBadgeLabel(currentMM)}
              </span>

              <p style={{ fontSize: '11px', color: '#b0b8c1', margin: 0, lineHeight: 1.4 }}>
                Click photo to upload a new image (max 5MB)
              </p>
            </div>

            {/* Account card */}
            <div style={{
              backgroundColor: 'var(--panel-bg)',
              border: '1px solid var(--panel-border)',
              borderRadius: '12px',
              padding: '20px',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
            }}>
              <p style={SECTION_LABEL}>Account</p>
              <div>
                <p style={FIELD_LABEL}>Email</p>
                <p style={{ fontSize: '13px', color: '#0A1E3D', margin: 0, wordBreak: 'break-all' }}>{session.email}</p>
              </div>
              <div>
                <p style={FIELD_LABEL}>Current MileMarker</p>
                <span style={{
                  fontSize: '11px', fontWeight: 600, color: '#0076B6',
                  backgroundColor: '#EBF5FB', padding: '3px 10px',
                  borderRadius: '20px', display: 'inline-block',
                }}>
                  {mmBadgeLabel(currentMM)}
                </span>
              </div>
              <div>
                <p style={FIELD_LABEL}>Member Since</p>
                <p style={{ fontSize: '13px', color: '#0A1E3D', margin: 0 }}>{formatDate(extended.created_at)}</p>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: '20px' }}>

            {/* PERSONAL INFORMATION */}
            <Section title="Personal Information">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <Field label="First Name">
                  <input
                    style={inputStyle(personalDirty && personal.first_name !== session.firstName)}
                    value={personal.first_name}
                    onChange={e => { setPersonal(p => ({ ...p, first_name: e.target.value })); setPersonalDirty(true) }}
                    placeholder="First name"
                  />
                </Field>
                <Field label="Last Name">
                  <input
                    style={inputStyle(personalDirty && personal.last_name !== (extended.last_name ?? ''))}
                    value={personal.last_name}
                    onChange={e => { setPersonal(p => ({ ...p, last_name: e.target.value })); setPersonalDirty(true) }}
                    placeholder="Last name"
                  />
                </Field>
                <Field label="Email Address">
                  <div style={READ_ONLY_VALUE}>
                    <span style={{ color: '#8a93a0', wordBreak: 'break-all' }}>{session.email}</span>
                  </div>
                </Field>
                <Field label="Phone Number">
                  <input
                    style={inputStyle(personalDirty && personal.phone !== (extended.phone ?? ''))}
                    value={personal.phone}
                    onChange={e => { setPersonal(p => ({ ...p, phone: formatPhone(e.target.value) })); setPersonalDirty(true) }}
                    placeholder="(555) 555-5555"
                    type="tel"
                  />
                </Field>
                <Field label="Partner / Spouse Name" span2>
                  <input
                    style={inputStyle(personalDirty && personal.partner_name !== (extended.partner_name ?? ''))}
                    value={personal.partner_name}
                    onChange={e => { setPersonal(p => ({ ...p, partner_name: e.target.value })); setPersonalDirty(true) }}
                    placeholder="Optional"
                  />
                </Field>
              </div>
              <SectionFooter
                dirty={personalDirty}
                saving={personalSaving}
                saved={personalSaved}
                error={personalError}
                onSave={() => { void savePersonal() }}
              />
            </Section>

            {/* YOUR MOVE */}
            <Section title="Your Move">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <Field label="Moving From — City">
                  <input
                    style={inputStyle(moveDirty && move.origin_city !== (extended.origin_city ?? ''))}
                    value={move.origin_city}
                    onChange={e => { setMove(p => ({ ...p, origin_city: e.target.value })); setMoveDirty(true) }}
                    placeholder="Current city"
                  />
                </Field>
                <Field label="Moving From — State">
                  <input
                    style={inputStyle(moveDirty && move.origin_state !== (extended.origin_state ?? ''))}
                    value={move.origin_state}
                    onChange={e => { setMove(p => ({ ...p, origin_state: e.target.value })); setMoveDirty(true) }}
                    placeholder="State abbreviation"
                    maxLength={2}
                  />
                </Field>
                <Field label="Household Size">
                  <select
                    style={selectStyle(moveDirty && move.household_size !== (profile?.householdSize ?? ''))}
                    value={move.household_size}
                    onChange={e => { setMove(p => ({ ...p, household_size: e.target.value })); setMoveDirty(true) }}
                  >
                    <option value="">Select…</option>
                    {HOUSEHOLD_OPTIONS.map(o => (
                      <option key={o} value={o}>{o === '5+' ? '5 or more' : o === '3-4' ? '3 – 4' : o}</option>
                    ))}
                  </select>
                </Field>
                <Field label="Annual Household Income">
                  <div style={{ position: 'relative' }}>
                    <span style={{
                      position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)',
                      fontSize: '14px', color: '#8a93a0', pointerEvents: 'none',
                    }}>$</span>
                    <input
                      style={{
                        ...inputStyle(moveDirty && move.annual_income !== (profile?.annualIncome ? String(profile.annualIncome) : '')),
                        paddingLeft: '22px',
                      }}
                      value={move.annual_income ? Number(move.annual_income).toLocaleString('en-US') : ''}
                      onChange={e => {
                        const digits = e.target.value.replace(/\D/g, '')
                        setMove(p => ({ ...p, annual_income: digits }))
                        setMoveDirty(true)
                      }}
                      placeholder="e.g. 125,000"
                      inputMode="numeric"
                    />
                  </div>
                </Field>
              </div>
              <SectionFooter
                dirty={moveDirty}
                saving={moveSaving}
                saved={moveSaved}
                error={moveError}
                onSave={() => { void saveMove() }}
              />
            </Section>

            {/* YOUR PRIORITIES */}
            <Section title="Your Priorities">
              {profile ? (
                <>
                  <PriorityGroup label="Must Have" keys={profile.mustHaves} labels={priorityLabels} color="#2e7d32" bg="#f0faf4" />
                  <PriorityGroup label="Important to Me" keys={profile.niceToHaves} labels={priorityLabels} color="#0076B6" bg="#EBF5FB" />
                  <PriorityGroup label="Would Be Nice" keys={profile.notPriorities} labels={priorityLabels} color="#8a93a0" bg="#f4f6f8" />
                  <p style={{ fontSize: '12px', color: '#b0b8c1', margin: '12px 0 0', lineHeight: 1.5 }}>
                    To update your priorities, visit MM2 — Explore.
                  </p>
                </>
              ) : (
                <p style={{ fontSize: '14px', color: '#8a93a0', margin: 0 }}>
                  Priority data is not available. Complete the quiz to set your priorities.
                </p>
              )}
            </Section>

            {/* YOUR MATCHES */}
            <Section title="Your Matches">
              {matches.length > 0 ? (
                <>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {matches.slice(0, 3).map((m, i) => (
                      <div key={m.location.id} style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        padding: '12px 16px', backgroundColor: '#f8f9fa',
                        borderRadius: '8px', border: '1px solid var(--panel-border)',
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <span style={{
                            width: '22px', height: '22px', borderRadius: '50%',
                            backgroundColor: '#0076B6', color: '#ffffff',
                            fontSize: '11px', fontWeight: 700,
                            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                          }}>
                            {i + 1}
                          </span>
                          <div>
                            <p style={{ fontSize: '14px', fontWeight: 600, color: '#0A1E3D', margin: 0 }}>{m.location.name}</p>
                            <p style={{ fontSize: '12px', color: '#8a93a0', margin: 0 }}>{m.location.state}</p>
                          </div>
                        </div>
                        <span style={{
                          fontSize: '13px', fontWeight: 700, color: '#2e7d32',
                          backgroundColor: '#f0faf4', padding: '3px 10px', borderRadius: '20px',
                        }}>
                          {m.matchScore}%
                        </span>
                      </div>
                    ))}
                  </div>
                  <p style={{ fontSize: '12px', color: '#b0b8c1', margin: '12px 0 0', lineHeight: 1.5 }}>
                    City matches are based on your priorities and financial profile.
                  </p>
                </>
              ) : (
                <p style={{ fontSize: '14px', color: '#8a93a0', margin: 0 }}>
                  No matches available yet. Complete your quiz to see your top Texas cities.
                </p>
              )}
            </Section>

            {/* YOUR JOURNEY TEAM */}
            <Section title="Your Journey Team">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <TeamMember
                  role="Market Director"
                  name={extended.md_name}
                  email={extended.md_email}
                  unlocked={currentMM >= 4}
                  pendingText="Pending assignment — completed at MM4"
                />
                <TeamMember
                  role="Select Agent"
                  name={null}
                  email={null}
                  unlocked={currentMM >= 7}
                  pendingText="Pending assignment — completed at MM7"
                />
                <TeamMember
                  role="Lender"
                  name={null}
                  email={null}
                  unlocked={currentMM >= 6}
                  pendingText="Pending assignment — completed at MM6"
                />
              </div>
            </Section>

          </div>
        </div>
      </div>
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{
      backgroundColor: 'var(--panel-bg)',
      border: '1px solid var(--panel-border)',
      borderRadius: '12px',
      padding: '24px',
    }}>
      <p style={SECTION_LABEL}>{title}</p>
      {children}
    </div>
  )
}

function Field({ label, children, span2 }: { label: string; children: React.ReactNode; span2?: boolean }) {
  return (
    <div style={span2 ? { gridColumn: '1 / -1' } : {}}>
      <p style={FIELD_LABEL}>{label}</p>
      {children}
    </div>
  )
}

function SectionFooter({
  dirty, saving, saved, error, onSave,
}: {
  dirty: boolean
  saving: boolean
  saved: boolean
  error: string
  onSave: () => void
}) {
  if (!dirty && !saved && !error) return null
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '20px', paddingTop: '16px', borderTop: '1px solid var(--panel-border)' }}>
      {dirty && (
        <button
          onClick={onSave}
          disabled={saving}
          style={{
            padding: '8px 20px', borderRadius: '8px', border: 'none',
            backgroundColor: saving ? '#93C5D8' : '#0076B6',
            color: '#ffffff', fontSize: '13px', fontWeight: 600,
            cursor: saving ? 'not-allowed' : 'pointer',
          }}
        >
          {saving ? 'Saving…' : 'Save Changes'}
        </button>
      )}
      {saved && !dirty && (
        <span style={{ fontSize: '13px', color: '#2e7d32', fontWeight: 500 }}>Saved ✓</span>
      )}
      {error && (
        <span style={{ fontSize: '13px', color: '#DC2626' }}>{error}</span>
      )}
    </div>
  )
}

function PriorityGroup({ label, keys, labels, color, bg }: {
  label: string
  keys: string[]
  labels: Record<string, string>
  color: string
  bg: string
}) {
  if (!keys.length) return null
  return (
    <div style={{ marginBottom: '12px' }}>
      <p style={{ fontSize: '11px', fontWeight: 600, color, margin: '0 0 6px' }}>{label}</p>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
        {keys.map(k => (
          <span key={k} style={{
            fontSize: '12px', color,
            backgroundColor: bg, padding: '3px 10px',
            borderRadius: '20px', fontWeight: 500,
          }}>
            {labels[k] ?? k}
          </span>
        ))}
      </div>
    </div>
  )
}

function TeamMember({ role, name, email, unlocked, pendingText }: {
  role: string
  name: string | null
  email: string | null
  unlocked: boolean
  pendingText: string
}) {
  const isAssigned = unlocked && name

  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '12px 16px',
      backgroundColor: isAssigned ? '#f8f9fa' : '#fafafa',
      border: `1px solid ${isAssigned ? 'var(--panel-border)' : '#f0f0f0'}`,
      borderRadius: '8px',
    }}>
      <div>
        <p style={{ fontSize: '11px', fontWeight: 600, color: '#C5B783', margin: '0 0 2px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
          {role}
        </p>
        {isAssigned ? (
          <>
            <p style={{ fontSize: '14px', fontWeight: 600, color: '#0A1E3D', margin: 0 }}>{name}</p>
            {email && <p style={{ fontSize: '12px', color: '#0076B6', margin: 0 }}>{email}</p>}
          </>
        ) : (
          <p style={{ fontSize: '13px', color: '#b0b8c1', margin: 0, fontStyle: 'italic' }}>{pendingText}</p>
        )}
      </div>
      {isAssigned && (
        <span style={{
          width: '8px', height: '8px', borderRadius: '50%',
          backgroundColor: '#2e7d32', flexShrink: 0,
        }} />
      )}
    </div>
  )
}

