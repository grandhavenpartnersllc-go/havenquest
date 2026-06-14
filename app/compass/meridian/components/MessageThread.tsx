'use client'

import { useState } from 'react'
import { createClient } from '../../../../lib/supabase/client'
import MessageComposer from './MessageComposer'
import type { Message } from '../../../../types'

interface Props {
  messages: Message[]
  mdEmail: string
  clientEmail: string
  clientFirstName: string
}

export default function MessageThread({ messages: initial, mdEmail, clientEmail, clientFirstName }: Props) {
  const [messages, setMessages] = useState(initial)
  const [composing, setComposing] = useState(false)

  function handleMessageSent(msg: Message) {
    setMessages(prev => [...prev, msg])
    setComposing(false)
  }

  async function markRead(msgId: string) {
    const supabase = createClient()
    await supabase.from('messages').update({ read: true }).eq('id', msgId)
    setMessages(prev => prev.map(m => m.id === msgId ? { ...m, read: true } : m))
  }

  return (
    <div>
      {/* Thread */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '16px' }}>
        {messages.length === 0 && (
          <p style={{ fontSize: '13px', color: '#9A8E82', textAlign: 'center', padding: '24px 0' }}>
            No messages yet. Send the first message below.
          </p>
        )}
        {messages.map(msg => {
          const isMD = msg.sender_role === 'md' || msg.sender_role === 'system'
          const ts = msg.created_at
            ? new Date(msg.created_at).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })
            : ''

          return (
            <div
              key={msg.id}
              style={{ display: 'flex', justifyContent: isMD ? 'flex-end' : 'flex-start' }}
              onClick={() => !msg.read && msg.id && msg.sender_role === 'client' ? void markRead(msg.id) : undefined}
            >
              <div style={{
                maxWidth: '75%',
                borderRadius: '10px',
                padding: '10px 14px',
                backgroundColor: isMD ? '#0A1E3D' : '#EFF6FF',
                border: isMD ? 'none' : '1px solid #BFDBFE',
              }}>
                {msg.subject && (
                  <p style={{ fontSize: '11px', fontWeight: 700, color: isMD ? '#C5B783' : '#0076B6', margin: '0 0 4px', letterSpacing: '0.04em' }}>
                    {msg.subject}
                  </p>
                )}
                <p style={{ fontSize: '13px', color: isMD ? '#ffffff' : '#0A1E3D', margin: 0, lineHeight: 1.55, whiteSpace: 'pre-wrap' }}>
                  {msg.body}
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '6px' }}>
                  <span style={{ fontSize: '10px', color: isMD ? 'rgba(255,255,255,0.4)' : '#9A8E82' }}>{ts}</span>
                  {!isMD && !msg.read && (
                    <span style={{ fontSize: '10px', fontWeight: 600, color: '#0076B6', backgroundColor: 'rgba(0,118,182,0.1)', padding: '1px 6px', borderRadius: '4px' }}>NEW</span>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Compose toggle */}
      {!composing ? (
        <button
          onClick={() => setComposing(true)}
          style={{
            padding: '8px 18px',
            borderRadius: '8px',
            border: 'none',
            backgroundColor: '#0A1E3D',
            color: '#ffffff',
            fontSize: '13px',
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          + New Message
        </button>
      ) : (
        <div style={{ marginTop: '8px', padding: '16px', border: '1px solid #E5E7EB', borderRadius: '10px', backgroundColor: '#FAFAFA' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ fontSize: '13px', fontWeight: 600, color: '#0A1E3D' }}>New Message</span>
            <button onClick={() => setComposing(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '16px', color: '#9A8E82' }}>×</button>
          </div>
          <MessageComposer
            mdEmail={mdEmail}
            clientEmail={clientEmail}
            clientFirstName={clientFirstName}
            onMessageSent={handleMessageSent}
          />
        </div>
      )}
    </div>
  )
}
