'use client'

import { useState } from 'react'
import type { Message } from '../../../types'

interface Props {
  mdEmail: string
  clientEmail: string
  clientFirstName: string
  onMessageSent: (msg: Message) => void
}

export default function MessageComposer({ mdEmail, clientEmail, clientFirstName, onMessageSent }: Props) {
  const [subject, setSubject] = useState('')
  const [body, setBody] = useState('')
  const [sending, setSending] = useState(false)
  const [error, setError] = useState('')

  async function handleSend(e: React.FormEvent) {
    e.preventDefault()
    if (!body.trim()) return
    setSending(true)
    setError('')

    try {
      const res = await fetch('/api/md/send-message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mdEmail, clientEmail, clientFirstName, subject: subject.trim() || undefined, body: body.trim() }),
      })

      if (!res.ok) throw new Error('Failed to send message')

      const { message } = await res.json() as { message: Message }
      onMessageSent(message)
      setSubject('')
      setBody('')
    } catch (err) {
      console.error('[MessageComposer]', err)
      setError('Failed to send message. Please try again.')
    } finally {
      setSending(false)
    }
  }

  return (
    <form onSubmit={handleSend} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      <input
        type="text"
        value={subject}
        onChange={e => setSubject(e.target.value)}
        placeholder="Subject (optional)"
        style={{
          border: '1px solid #E5E7EB',
          borderRadius: '8px',
          padding: '8px 12px',
          fontSize: '13px',
          color: '#0A1E3D',
          outline: 'none',
        }}
      />
      <textarea
        value={body}
        onChange={e => setBody(e.target.value)}
        placeholder={`Write a message to ${clientFirstName}…`}
        required
        rows={4}
        style={{
          border: '1px solid #E5E7EB',
          borderRadius: '8px',
          padding: '10px 12px',
          fontSize: '13px',
          color: '#0A1E3D',
          resize: 'vertical',
          outline: 'none',
          lineHeight: 1.6,
          minHeight: '120px',
        }}
      />
      {error && <p style={{ fontSize: '12px', color: '#DC2626', margin: 0 }}>{error}</p>}
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <button
          type="submit"
          disabled={sending || !body.trim()}
          style={{
            padding: '8px 20px',
            borderRadius: '8px',
            border: 'none',
            backgroundColor: (sending || !body.trim()) ? '#9A8E82' : '#0A1E3D',
            color: '#ffffff',
            fontSize: '13px',
            fontWeight: 600,
            cursor: (sending || !body.trim()) ? 'not-allowed' : 'pointer',
          }}
        >
          {sending ? 'Sending…' : 'Send Message →'}
        </button>
      </div>
    </form>
  )
}
