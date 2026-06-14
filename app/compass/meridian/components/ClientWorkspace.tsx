'use client'

import { useState } from 'react'
import Link from 'next/link'
import JourneyHealthBadge from './JourneyHealthBadge'
import ClientProfile from './ClientProfile'
import MDNotes from './MDNotes'
import MessageThread from './MessageThread'
import MilemarkerAdvance from './MilemarkerAdvance'
import { createClient } from '../../../../lib/supabase/client'
import type { MDClientWithProfile, Message } from '../../../../types'

const MM_LABELS: Record<number, string> = {
  1: 'MM1 — Welcome',
  2: 'MM2 — Explore',
  3: 'MM3 — Discover',
  4: 'MM4 — Connect',
  5: 'MM5 — Your Texas Plan',
}

interface Props {
  client: MDClientWithProfile
  mdEmail: string
  mdFirstName: string
  messages: Message[]
  clientJoinedAt: string
}

export default function ClientWorkspace({ client: initialClient, mdEmail, mdFirstName, messages, clientJoinedAt }: Props) {
  const [client, setClient] = useState(initialClient)
  const [health, setHealth] = useState(initialClient.assignment.journey_health)

  const mm4 = client.mm4Profile
  const clientName = mm4
    ? [mm4.primary_first_name, mm4.primary_last_name].filter(Boolean).join(' ') || client.assignment.client_email
    : client.assignment.client_email
  const clientFirstName = mm4?.primary_first_name ?? client.assignment.client_email.split('@')[0]

  const daysInStage = Math.floor((Date.now() - new Date(client.assignment.assigned_at ?? clientJoinedAt).getTime()) / 86400000)
  const totalDays = Math.floor((Date.now() - new Date(clientJoinedAt).getTime()) / 86400000)

  async function updateHealth(newHealth: 'on_track' | 'needs_attention' | 'at_risk') {
    setHealth(newHealth)
    const supabase = createClient()
    await supabase
      .from('md_clients')
      .update({ journey_health: newHealth })
      .eq('md_email', mdEmail)
      .eq('client_email', client.assignment.client_email)
  }

  return (
    <div style={{ padding: '28px 40px', maxWidth: '1400px' }}>
      {/* Back link + header */}
      <Link href="/compass/meridian/clients" style={{ fontSize: '13px', color: '#0076B6', textDecoration: 'none', display: 'inline-block', marginBottom: '16px' }}>
        ← Back to Roster
      </Link>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '28px' }}>
        <div>
          <h1 style={{ fontSize: '22px', fontWeight: 700, color: '#0A1E3D', margin: '0 0 4px' }}>{clientName}</h1>
          <p style={{ fontSize: '13px', color: '#9A8E82', margin: 0 }}>{client.assignment.client_email}</p>
        </div>
        <JourneyHealthBadge
          health={health}
          onClick={() => {
            const order: ('on_track' | 'needs_attention' | 'at_risk')[] = ['on_track', 'needs_attention', 'at_risk']
            void updateHealth(order[(order.indexOf(health) + 1) % 3])
          }}
        />
      </div>

      {/* Two-column layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '28px', alignItems: 'start' }}>

        {/* Main — left */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

          {/* MM4 Profile */}
          {mm4 ? (
            <section style={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #E5E7EB', padding: '24px' }}>
              <h2 style={{ fontSize: '14px', fontWeight: 700, color: '#0A1E3D', margin: '0 0 16px', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                Client Profile — MM4 Intake
              </h2>
              <ClientProfile mm4={mm4} />
            </section>
          ) : (
            <section style={{ backgroundColor: '#F9FAFB', borderRadius: '12px', border: '1px solid #E5E7EB', padding: '24px', textAlign: 'center' }}>
              <p style={{ fontSize: '14px', color: '#9A8E82' }}>MM4 profile not yet submitted.</p>
            </section>
          )}

          {/* MileMarker Advance */}
          <section style={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #E5E7EB', padding: '24px' }}>
            <h2 style={{ fontSize: '14px', fontWeight: 700, color: '#0A1E3D', margin: '0 0 16px', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
              MileMarker Advancement
            </h2>
            <MilemarkerAdvance
              clientEmail={client.assignment.client_email}
              mdEmail={mdEmail}
              currentMM={client.currentMM}
              onAdvanced={newMM => setClient(prev => ({ ...prev, currentMM: newMM }))}
            />
          </section>

          {/* Messages */}
          <section style={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #E5E7EB', padding: '24px' }}>
            <h2 style={{ fontSize: '14px', fontWeight: 700, color: '#0A1E3D', margin: '0 0 16px', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
              Message Thread
            </h2>
            <MessageThread
              messages={messages}
              mdEmail={mdEmail}
              clientEmail={client.assignment.client_email}
              clientFirstName={clientFirstName}
            />
          </section>
        </div>

        {/* Sidebar — right */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', position: 'sticky', top: '24px' }}>

          {/* Quick stats */}
          <div style={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #E5E7EB', padding: '20px' }}>
            <p style={{ fontSize: '11px', fontWeight: 700, color: '#6B7280', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '12px' }}>Quick Stats</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <StatRow label="Current stage" value={MM_LABELS[client.currentMM] ?? `MM${client.currentMM}`} />
              <StatRow label="Days in stage" value={`${daysInStage}d`} />
              <StatRow label="Total in journey" value={`${totalDays}d`} />
              <StatRow label="Submission date" value={mm4?.submitted_at ? new Date(mm4.submitted_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—'} />
              <StatRow label="Target move date" value={mm4?.target_move_date ?? '—'} />
              <StatRow label="Target city" value={mm4?.confirmed_target_city ?? '—'} />
            </div>
          </div>

          {/* Notes */}
          <div style={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #E5E7EB', padding: '20px' }}>
            <p style={{ fontSize: '11px', fontWeight: 700, color: '#6B7280', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '16px' }}>MD Notes</p>
            <MDNotes
              mdEmail={mdEmail}
              clientEmail={client.assignment.client_email}
              initialInternal={client.assignment.internal_notes ?? ''}
              initialShared={client.assignment.shared_notes ?? ''}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

function StatRow({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
      <span style={{ fontSize: '12px', color: '#9A8E82' }}>{label}</span>
      <span style={{ fontSize: '13px', fontWeight: 500, color: '#0A1E3D' }}>{value}</span>
    </div>
  )
}
