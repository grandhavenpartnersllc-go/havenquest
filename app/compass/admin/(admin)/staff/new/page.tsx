'use client'

import { useState } from 'react'
import Link from 'next/link'

interface OnboardingChecklist {
  accountCreated: boolean
  roleSet: boolean
}

export default function NewStaffPage() {
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [metro, setMetro] = useState('')
  const [startDate, setStartDate] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [checklist, setChecklist] = useState<OnboardingChecklist | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!confirm(`Provision a new Market Director account for ${fullName} (${email})?`)) return
    setSubmitting(true)
    setError('')

    try {
      const res = await fetch('/api/admin/provision-staff', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ full_name: fullName, email, metro, start_date: startDate }),
      })
      const data = await res.json() as { ok?: boolean; error?: string; checklist?: OnboardingChecklist }
      if (!res.ok || !data.ok) {
        setError(data.error ?? 'Provisioning failed.')
        return
      }
      setChecklist(data.checklist ?? { accountCreated: true, roleSet: true })
    } catch {
      setError('An unexpected error occurred.')
    } finally {
      setSubmitting(false)
    }
  }

  if (checklist) {
    return (
      <div style={{ padding: '32px 40px', maxWidth: '560px' }}>
        <h1 style={{ fontSize: '22px', fontWeight: 700, color: '#0A1E3D', margin: '0 0 4px' }}>Account Provisioned</h1>
        <p style={{ fontSize: '13px', color: '#9A8E82', margin: '0 0 32px' }}>{fullName} · {email}</p>

        <div style={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #E5E7EB', padding: '24px', marginBottom: '24px' }}>
          <p style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#6B7280', margin: '0 0 16px' }}>
            Onboarding Checklist
          </p>
          {[
            { done: checklist.accountCreated, label: 'Supabase account created' },
            { done: checklist.roleSet, label: 'user_role set to market_director' },
            { done: false, label: 'Microsoft 365 account provisioned (manual — admin.microsoft.com)' },
            { done: false, label: 'Calendly calendar set up for new MD' },
            { done: false, label: 'First client assigned' },
            { done: false, label: 'COMPASS Meridian walkthrough completed' },
          ].map((item, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', marginBottom: '10px' }}>
              <span style={{ fontSize: '16px', flexShrink: 0, marginTop: '1px' }}>{item.done ? '✅' : '🔲'}</span>
              <span style={{ fontSize: '13px', color: item.done ? '#0A1E3D' : '#6B7280', lineHeight: 1.5 }}>{item.label}</span>
            </div>
          ))}
        </div>

        <p style={{ fontSize: '13px', color: '#6B7280', marginBottom: '24px', lineHeight: 1.6 }}>
          A welcome email has been sent to <strong>{email}</strong> with login credentials and a link to{' '}
          <strong>/compass/meridian/login</strong>.
        </p>

        <div style={{ display: 'flex', gap: '12px' }}>
          <Link href="/compass/admin/staff"
            style={{ padding: '10px 20px', borderRadius: '8px', backgroundColor: '#0A1E3D', color: '#ffffff', fontSize: '13px', fontWeight: 600, textDecoration: 'none' }}>
            ← Back to Staff Roster
          </Link>
          <button onClick={() => { setChecklist(null); setFullName(''); setEmail(''); setMetro(''); setStartDate('') }}
            style={{ padding: '10px 20px', borderRadius: '8px', backgroundColor: '#F3F4F6', color: '#374151', fontSize: '13px', fontWeight: 500, border: 'none', cursor: 'pointer' }}>
            Add Another
          </button>
        </div>
      </div>
    )
  }

  return (
    <div style={{ padding: '32px 40px', maxWidth: '560px' }}>
      <Link href="/compass/admin/staff"
        style={{ fontSize: '13px', color: '#0076B6', textDecoration: 'none', display: 'inline-block', marginBottom: '20px' }}>
        ← Back to Staff Roster
      </Link>
      <h1 style={{ fontSize: '22px', fontWeight: 700, color: '#0A1E3D', margin: '0 0 4px' }}>Add Market Director</h1>
      <p style={{ fontSize: '13px', color: '#9A8E82', margin: '0 0 32px' }}>
        Creates a Supabase Auth account, sets role, inserts staff record, and sends welcome email.
      </p>

      <div style={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #E5E7EB', padding: '28px' }}>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: '#4B5563', marginBottom: '6px', letterSpacing: '0.04em' }}>
              FULL NAME
            </label>
            <input type="text" value={fullName} onChange={e => setFullName(e.target.value)} required placeholder="Jane Smith"
              style={{ width: '100%', border: '1px solid #E5E7EB', borderRadius: '8px', padding: '10px 14px', fontSize: '14px', color: '#0A1E3D', outline: 'none', boxSizing: 'border-box' }} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: '#4B5563', marginBottom: '6px', letterSpacing: '0.04em' }}>
              EMAIL (@havenquest.co)
            </label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="jane.smith@havenquest.co"
              style={{ width: '100%', border: '1px solid #E5E7EB', borderRadius: '8px', padding: '10px 14px', fontSize: '14px', color: '#0A1E3D', outline: 'none', boxSizing: 'border-box' }} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: '#4B5563', marginBottom: '6px', letterSpacing: '0.04em' }}>
              ASSIGNED METRO
            </label>
            <select value={metro} onChange={e => setMetro(e.target.value)} required
              style={{ width: '100%', border: '1px solid #E5E7EB', borderRadius: '8px', padding: '10px 14px', fontSize: '14px', color: '#0A1E3D', boxSizing: 'border-box' }}>
              <option value="">— Select metro —</option>
              <option value="austin">Austin</option>
              <option value="dfw">DFW</option>
              <option value="houston">Houston</option>
              <option value="san_antonio">San Antonio</option>
              <option value="all">All Metros</option>
            </select>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: '#4B5563', marginBottom: '6px', letterSpacing: '0.04em' }}>
              START DATE
            </label>
            <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)}
              style={{ width: '100%', border: '1px solid #E5E7EB', borderRadius: '8px', padding: '10px 14px', fontSize: '14px', color: '#0A1E3D', outline: 'none', boxSizing: 'border-box' }} />
          </div>

          {error && <p style={{ fontSize: '13px', color: '#dc2626', margin: 0 }}>{error}</p>}

          <button type="submit" disabled={submitting}
            style={{
              padding: '12px',
              borderRadius: '8px',
              backgroundColor: submitting ? '#5B7EA6' : '#0A1E3D',
              color: '#ffffff',
              fontSize: '14px',
              fontWeight: 600,
              border: 'none',
              cursor: submitting ? 'not-allowed' : 'pointer',
              marginTop: '4px',
            }}>
            {submitting ? 'Provisioning…' : 'Provision Account →'}
          </button>
        </form>
      </div>
    </div>
  )
}
