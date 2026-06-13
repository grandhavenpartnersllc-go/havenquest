'use client'

import { useState } from 'react'
import { createClient } from '../../../lib/supabase/client'

const MM_LABELS: Record<number, string> = {
  1: 'MM1 — Welcome',
  2: 'MM2 — Explore',
  3: 'MM3 — Discover',
  4: 'MM4 — Connect',
  5: 'MM5 — Your Texas Plan',
}

interface Props {
  clientEmail: string
  mdEmail: string
  currentMM: number
  onAdvanced: (newMM: number) => void
}

export default function MilemarkerAdvance({ clientEmail, mdEmail, currentMM, onAdvanced }: Props) {
  const [confirming, setConfirming] = useState(false)
  const [advancing, setAdvancing] = useState(false)
  const nextMM = currentMM + 1

  if (nextMM > 5) {
    return (
      <p style={{ fontSize: '13px', color: '#9A8E82' }}>Client has completed all MileMarkers.</p>
    )
  }

  async function handleAdvance() {
    setAdvancing(true)
    try {
      const supabase = createClient()
      await supabase
        .from('users')
        .update({ current_milemarker: nextMM })
        .eq('email', clientEmail)

      // Audit log via messages table
      await supabase.from('messages').insert({
        client_email: clientEmail,
        md_email: mdEmail,
        sender_role: 'system',
        subject: 'MileMarker Advanced',
        body: `Advanced to ${MM_LABELS[nextMM] ?? `MM${nextMM}`} by Market Director.`,
        read: true,
        notification_sent: false,
      })

      onAdvanced(nextMM)
      setConfirming(false)
    } catch (err) {
      console.error('[MilemarkerAdvance]', err)
    } finally {
      setAdvancing(false)
    }
  }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
        <span style={{ fontSize: '22px', fontWeight: 700, color: '#0A1E3D' }}>
          {MM_LABELS[currentMM] ?? `MM${currentMM}`}
        </span>
      </div>

      {!confirming ? (
        <button
          onClick={() => setConfirming(true)}
          style={{
            padding: '8px 16px',
            borderRadius: '8px',
            border: 'none',
            backgroundColor: '#0A1E3D',
            color: '#C5B783',
            fontSize: '13px',
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          Advance to {MM_LABELS[nextMM] ?? `MM${nextMM}`} →
        </button>
      ) : (
        <div style={{ padding: '14px', borderRadius: '10px', border: '1px solid #FDE68A', backgroundColor: '#FFFBEB' }}>
          <p style={{ fontSize: '13px', color: '#92400E', marginBottom: '12px', lineHeight: 1.5 }}>
            Advance this client to <strong>{MM_LABELS[nextMM]}</strong>? This cannot be undone.
          </p>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={() => void handleAdvance()}
              disabled={advancing}
              style={{
                padding: '7px 16px',
                borderRadius: '7px',
                border: 'none',
                backgroundColor: advancing ? '#5B7EA6' : '#0A1E3D',
                color: '#ffffff',
                fontSize: '12px',
                fontWeight: 600,
                cursor: advancing ? 'not-allowed' : 'pointer',
              }}
            >
              {advancing ? 'Advancing…' : 'Confirm'}
            </button>
            <button
              onClick={() => setConfirming(false)}
              style={{
                padding: '7px 16px',
                borderRadius: '7px',
                border: '1px solid #E5E7EB',
                backgroundColor: '#ffffff',
                color: '#4B5563',
                fontSize: '12px',
                cursor: 'pointer',
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
