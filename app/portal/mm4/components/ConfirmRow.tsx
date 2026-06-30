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
    background: 'rgba(197,183,131,0.12)',
    border: '0.5px solid rgba(197,183,131,0.4)',
    borderRadius: '12px',
    padding: '14px 18px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '28px',
  }

  if (editing) {
    return (
      <div style={containerStyle}>
        <div style={{ flex: 1, marginRight: '12px' }}>
          <p style={{ fontSize: '11px', color: 'rgba(10,30,61,0.4)', margin: '0 0 4px', letterSpacing: '0.6px' }}>{label}</p>
          <input
            type="text"
            value={draft}
            onChange={e => setDraft(e.target.value)}
            autoFocus
            style={{
              width: '100%',
              fontSize: '14px',
              fontWeight: 500,
              color: '#0A1E3D',
              background: 'transparent',
              border: 'none',
              outline: 'none',
              padding: 0,
              fontFamily: 'inherit',
            }}
          />
        </div>
        <button
          type="button"
          onClick={() => { onEdit?.(draft); setEditing(false) }}
          style={{
            fontSize: '12px',
            fontWeight: 500,
            color: '#0A1E3D',
            textDecoration: 'underline',
            cursor: 'pointer',
            background: 'none',
            border: 'none',
            padding: 0,
            flexShrink: 0,
            fontFamily: 'inherit',
          }}
        >
          Done
        </button>
      </div>
    )
  }

  return (
    <div style={containerStyle}>
      <div>
        <p style={{ fontSize: '11px', color: 'rgba(10,30,61,0.4)', margin: '0 0 2px', letterSpacing: '0.6px' }}>{label}</p>
        <p style={{ fontSize: '14px', fontWeight: 500, color: '#0A1E3D', margin: 0 }}>{value || '—'}</p>
      </div>
      {onEdit && (
        <button
          type="button"
          onClick={() => { setDraft(value); setEditing(true) }}
          style={{
            fontSize: '12px',
            fontWeight: 500,
            color: '#0A1E3D',
            textDecoration: 'underline',
            cursor: 'pointer',
            background: 'none',
            border: 'none',
            padding: 0,
            flexShrink: 0,
            marginLeft: '12px',
            fontFamily: 'inherit',
          }}
        >
          Edit
        </button>
      )}
    </div>
  )
}
