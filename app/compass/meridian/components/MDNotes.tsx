'use client'

import { useState, useRef } from 'react'
import { createClient } from '../../../lib/supabase/client'

interface Props {
  mdEmail: string
  clientEmail: string
  initialInternal: string
  initialShared: string
}

export default function MDNotes({ mdEmail, clientEmail, initialInternal, initialShared }: Props) {
  const [internal, setInternal] = useState(initialInternal)
  const [shared, setShared] = useState(initialShared)
  const [savingInternal, setSavingInternal] = useState(false)
  const [savingShared, setSavingShared] = useState(false)
  const [sharedSaved, setSharedSaved] = useState(false)
  const internalTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  async function saveInternal(value: string) {
    setSavingInternal(true)
    try {
      const supabase = createClient()
      await supabase
        .from('md_clients')
        .update({ internal_notes: value })
        .eq('md_email', mdEmail)
        .eq('client_email', clientEmail)
    } catch (err) {
      console.error('[MDNotes] internal save error:', err)
    } finally {
      setSavingInternal(false)
    }
  }

  function handleInternalBlur() {
    if (internalTimer.current) clearTimeout(internalTimer.current)
    void saveInternal(internal)
  }

  async function handleSaveShared() {
    setSavingShared(true)
    try {
      const supabase = createClient()
      await supabase
        .from('md_clients')
        .update({ shared_notes: shared })
        .eq('md_email', mdEmail)
        .eq('client_email', clientEmail)
      setSharedSaved(true)
      setTimeout(() => setSharedSaved(false), 2500)
    } catch (err) {
      console.error('[MDNotes] shared save error:', err)
    } finally {
      setSavingShared(false)
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Internal notes */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
          <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#EF4444' }} />
          <span style={{ fontSize: '11px', fontWeight: 700, color: '#4B5563', letterSpacing: '0.04em' }}>
            INTERNAL NOTES — NOT VISIBLE TO CLIENT
          </span>
        </div>
        <textarea
          value={internal}
          onChange={e => setInternal(e.target.value)}
          onBlur={handleInternalBlur}
          placeholder="Private notes about this client — only visible to you."
          rows={4}
          style={{
            width: '100%',
            border: '1px solid #FECACA',
            borderRadius: '8px',
            padding: '10px 12px',
            fontSize: '13px',
            color: '#0A1E3D',
            backgroundColor: '#FFF7F7',
            resize: 'vertical',
            outline: 'none',
            boxSizing: 'border-box',
            lineHeight: 1.6,
          }}
        />
        {savingInternal && <p style={{ fontSize: '11px', color: '#9A8E82', marginTop: '4px' }}>Saving…</p>}
      </div>

      {/* Shared notes */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
          <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#0076B6' }} />
          <span style={{ fontSize: '11px', fontWeight: 700, color: '#4B5563', letterSpacing: '0.04em' }}>
            SHARED NOTES — VISIBLE TO CLIENT
          </span>
        </div>
        <textarea
          value={shared}
          onChange={e => setShared(e.target.value)}
          placeholder="Notes you want the client to see in their portal."
          rows={4}
          style={{
            width: '100%',
            border: '1px solid #BFDBFE',
            borderRadius: '8px',
            padding: '10px 12px',
            fontSize: '13px',
            color: '#0A1E3D',
            backgroundColor: '#EFF6FF',
            resize: 'vertical',
            outline: 'none',
            boxSizing: 'border-box',
            lineHeight: 1.6,
          }}
        />
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '10px', marginTop: '8px' }}>
          {sharedSaved && <span style={{ fontSize: '12px', color: '#0076B6' }}>Saved ✓</span>}
          <button
            onClick={() => void handleSaveShared()}
            disabled={savingShared}
            style={{
              padding: '7px 16px',
              borderRadius: '7px',
              border: 'none',
              backgroundColor: savingShared ? '#5BA8D0' : '#0076B6',
              color: '#ffffff',
              fontSize: '12px',
              fontWeight: 600,
              cursor: savingShared ? 'not-allowed' : 'pointer',
            }}
          >
            {savingShared ? 'Saving…' : 'Save & Share'}
          </button>
        </div>
      </div>
    </div>
  )
}
