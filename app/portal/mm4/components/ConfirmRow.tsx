'use client'

import { useState } from 'react'

interface Props {
  label: string
  value: string
  onEdit?: (newValue: string) => void
}

export default function ConfirmRow({ label, value, onEdit }: Props) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(value)

  const containerStyle: React.CSSProperties = {
    background: '#F5F5F7',
    borderRadius: '8px',
    padding: '12px 14px',
    marginBottom: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  }

  if (editing) {
    return (
      <div style={containerStyle}>
        <div style={{ flex: 1, marginRight: '12px' }}>
          <p style={{ fontSize: '11px', color: '#86868b', margin: '0 0 4px' }}>{label}</p>
          <input
            type="text"
            value={draft}
            onChange={e => setDraft(e.target.value)}
            autoFocus
            style={{ width: '100%', fontSize: '15px', color: '#1d1d1f', background: 'transparent', border: 'none', outline: 'none', padding: 0 }}
          />
        </div>
        <button
          type="button"
          onClick={() => { onEdit?.(draft); setEditing(false) }}
          style={{ fontSize: '13px', color: '#0076B6', cursor: 'pointer', background: 'none', border: 'none', padding: 0, flexShrink: 0 }}
        >
          Done
        </button>
      </div>
    )
  }

  return (
    <div style={containerStyle}>
      <div>
        <p style={{ fontSize: '11px', color: '#86868b', margin: '0 0 2px' }}>{label}</p>
        <p style={{ fontSize: '15px', color: '#1d1d1f', margin: 0 }}>{value || '—'}</p>
      </div>
      {onEdit && (
        <button
          type="button"
          onClick={() => { setDraft(value); setEditing(true) }}
          style={{ fontSize: '13px', color: '#0076B6', cursor: 'pointer', background: 'none', border: 'none', padding: 0, flexShrink: 0, marginLeft: '12px' }}
        >
          Edit
        </button>
      )}
    </div>
  )
}
