'use client'

import { useState } from 'react'
import Link from 'next/link'
import { createClient } from '../../../lib/supabase/client'
import JourneyHealthBadge from './JourneyHealthBadge'
import type { MDClientWithProfile } from '../../../types'

const MM_LABELS: Record<number, string> = {
  1: 'MM1 — Welcome',
  2: 'MM2 — Explore',
  3: 'MM3 — Discover',
  4: 'MM4 — Connect',
  5: 'MM5 — Your Texas Plan',
}

interface Props {
  clients: MDClientWithProfile[]
  mdEmail: string
}

export default function ClientRoster({ clients: initial, mdEmail }: Props) {
  const [clients, setClients] = useState(initial)

  async function updateHealth(clientEmail: string, health: 'on_track' | 'needs_attention' | 'at_risk') {
    const supabase = createClient()
    await supabase
      .from('md_clients')
      .update({ journey_health: health })
      .eq('md_email', mdEmail)
      .eq('client_email', clientEmail)

    setClients(prev => prev.map(c =>
      c.assignment.client_email === clientEmail
        ? { ...c, assignment: { ...c.assignment, journey_health: health } }
        : c
    ))
  }

  if (clients.length === 0) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 1, padding: '48px' }}>
        <div style={{ textAlign: 'center', maxWidth: '360px' }}>
          <p style={{ fontSize: '20px', fontWeight: 700, color: '#0A1E3D', marginBottom: '8px' }}>No active clients</p>
          <p style={{ fontSize: '14px', color: '#9A8E82', lineHeight: 1.65 }}>
            New clients will appear here when they complete their MM4 intake.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div style={{ padding: '32px 40px' }}>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '22px', fontWeight: 700, color: '#0A1E3D', margin: '0 0 4px' }}>Client Roster</h1>
        <p style={{ fontSize: '13px', color: '#9A8E82', margin: 0 }}>{clients.length} active client{clients.length !== 1 ? 's' : ''}</p>
      </div>

      <div style={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #E5E7EB', overflow: 'hidden' }}>
        {/* Header row */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '2fr 1.5fr 1.2fr 1.2fr 1fr 0.8fr 100px',
          padding: '10px 20px',
          backgroundColor: '#F9FAFB',
          borderBottom: '1px solid #E5E7EB',
        }}>
          {['Client', 'Target City', 'MileMarker', 'Journey Health', 'Submitted', 'Unread', ''].map(h => (
            <span key={h} style={{ fontSize: '11px', fontWeight: 700, color: '#6B7280', letterSpacing: '0.06em', textTransform: 'uppercase' }}>{h}</span>
          ))}
        </div>

        {clients.map((c, i) => {
          const name = [c.mm4Profile?.primary_first_name, c.mm4Profile?.primary_last_name].filter(Boolean).join(' ')
            || c.assignment.client_email
          const submittedAt = c.mm4Profile?.submitted_at
            ? new Date(c.mm4Profile.submitted_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
            : '—'
          const encodedEmail = encodeURIComponent(c.assignment.client_email)

          return (
            <div
              key={c.assignment.client_email}
              style={{
                display: 'grid',
                gridTemplateColumns: '2fr 1.5fr 1.2fr 1.2fr 1fr 0.8fr 100px',
                padding: '14px 20px',
                alignItems: 'center',
                borderBottom: i < clients.length - 1 ? '1px solid #F3F4F6' : 'none',
              }}
            >
              <div>
                <p style={{ fontSize: '14px', fontWeight: 600, color: '#0A1E3D', margin: 0 }}>{name}</p>
                <p style={{ fontSize: '11px', color: '#9A8E82', margin: '2px 0 0' }}>{c.assignment.client_email}</p>
              </div>
              <span style={{ fontSize: '13px', color: '#374151' }}>
                {c.mm4Profile?.confirmed_target_city ?? '—'}
              </span>
              <span style={{ fontSize: '12px', color: '#374151' }}>
                {MM_LABELS[c.currentMM] ?? `MM${c.currentMM}`}
              </span>
              <div>
                <JourneyHealthBadge
                  health={c.assignment.journey_health}
                  onClick={() => {
                    const next: ('on_track' | 'needs_attention' | 'at_risk')[] = ['on_track', 'needs_attention', 'at_risk']
                    const idx = next.indexOf(c.assignment.journey_health)
                    void updateHealth(c.assignment.client_email, next[(idx + 1) % 3])
                  }}
                />
              </div>
              <span style={{ fontSize: '12px', color: '#6B7280' }}>{submittedAt}</span>
              <span style={{ fontSize: '13px', fontWeight: c.unreadMessages > 0 ? 700 : 400, color: c.unreadMessages > 0 ? '#0076B6' : '#9A8E82' }}>
                {c.unreadMessages > 0 ? `${c.unreadMessages} new` : '—'}
              </span>
              <Link
                href={`/compass/meridian/clients/${encodedEmail}`}
                style={{
                  display: 'inline-block',
                  padding: '6px 14px',
                  borderRadius: '7px',
                  backgroundColor: '#0A1E3D',
                  color: '#ffffff',
                  fontSize: '12px',
                  fontWeight: 600,
                  textDecoration: 'none',
                  whiteSpace: 'nowrap',
                }}
              >
                View Profile
              </Link>
            </div>
          )
        })}
      </div>
    </div>
  )
}
