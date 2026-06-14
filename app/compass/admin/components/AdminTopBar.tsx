'use client'

import { createClient } from '../../../../lib/supabase/client'

interface Props {
  email: string
}

export default function AdminTopBar({ email }: Props) {
  async function handleSignOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    await fetch('/api/auth/signout', { method: 'POST' }).catch(() => {})
    window.location.assign('/compass/admin/login')
  }

  return (
    <div style={{
      height: '48px',
      backgroundColor: '#0A1E3D',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 24px',
      flexShrink: 0,
      borderBottom: '1px solid rgba(255,255,255,0.08)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0' }}>
        <span style={{ fontSize: '15px', fontWeight: 700, color: '#ffffff', letterSpacing: '-0.01em' }}>
          Haven<span style={{ color: '#0076B6' }}>Quest</span>
        </span>
        <span style={{ margin: '0 12px', color: 'rgba(255,255,255,0.2)', fontSize: '14px' }}>|</span>
        <span style={{ fontSize: '12px', fontWeight: 600, letterSpacing: '0.14em', color: '#C5B783', textTransform: 'uppercase' }}>
          COMPASS Admin
        </span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)' }}>{email}</span>
        <button
          onClick={handleSignOut}
          style={{
            fontSize: '12px',
            color: 'rgba(255,255,255,0.5)',
            background: 'none',
            border: '1px solid rgba(255,255,255,0.15)',
            borderRadius: '6px',
            padding: '4px 10px',
            cursor: 'pointer',
          }}
        >
          Sign out
        </button>
      </div>
    </div>
  )
}
