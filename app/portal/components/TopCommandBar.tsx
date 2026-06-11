'use client'

import { useEffect, useState } from 'react'
import { Bell, MessageSquare, Calendar, FileText, HelpCircle } from 'lucide-react'
import { useTheme, type Theme } from '../providers/ThemeProvider'
import { LOCAL_SESSION_KEY } from '../../../utils/constants'
import type { UserSession } from '../../../types'

const ICON_BUTTONS: Array<{ icon: React.ComponentType<{ size?: number }>; label: string }> = [
  { icon: Bell,          label: 'Notifications' },
  { icon: MessageSquare, label: 'Messages'       },
  { icon: Calendar,      label: 'Calendar'       },
  { icon: FileText,      label: 'Documents'      },
  { icon: HelpCircle,    label: 'Help'           },
]

const THEMES: Theme[] = ['light', 'dark', 'system']

function getInitials(session: UserSession | null): string {
  if (!session) return '?'
  return session.firstName?.charAt(0).toUpperCase() || session.email.charAt(0).toUpperCase()
}

export default function TopCommandBar() {
  const { theme, setTheme } = useTheme()
  const [initials, setInitials] = useState('?')

  useEffect(() => {
    try {
      const raw = localStorage.getItem(LOCAL_SESSION_KEY)
      if (raw) {
        const sess = JSON.parse(raw) as UserSession
        setInitials(getInitials(sess))
      }
    } catch {
      // localStorage unavailable or invalid JSON — leave initials as '?'
    }
  }, [])

  return (
    <header
      style={{
        height: '48px',
        minHeight: '48px',
        backgroundColor: '#0A1E3D',
        display: 'flex',
        alignItems: 'center',
        paddingLeft: '20px',
        paddingRight: '16px',
        flexShrink: 0,
      }}
    >
      {/* Wordmark */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <span style={{ fontSize: '17px', fontWeight: 500, letterSpacing: '-0.01em', lineHeight: 1 }}>
          <span style={{ color: '#ffffff' }}>Haven</span>
          <span style={{ color: '#0076B6' }}>Quest</span>
        </span>
        <span
          aria-hidden="true"
          style={{ width: '1px', height: '16px', backgroundColor: 'rgba(255,255,255,0.2)', flexShrink: 0 }}
        />
        <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.45)' }}>
          Navigator Portal
        </span>
      </div>

      {/* Spacer */}
      <div style={{ flex: 1 }} />

      {/* Right side */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>

        {/* Theme toggle */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '2px', marginRight: '6px' }}>
          {THEMES.map(t => (
            <button
              key={t}
              onClick={() => { void setTheme(t) }}
              style={{
                fontSize: '11px',
                fontWeight: 500,
                padding: '3px 9px',
                borderRadius: '4px',
                border: 'none',
                cursor: 'pointer',
                backgroundColor: theme === t ? 'rgba(255,255,255,0.2)' : 'transparent',
                color: theme === t ? '#ffffff' : 'rgba(255,255,255,0.55)',
                textTransform: 'capitalize',
                lineHeight: 1.4,
              }}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Icon buttons */}
        {ICON_BUTTONS.map(({ icon: Icon, label }) => (
          <button
            key={label}
            aria-label={label}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '5px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'rgba(255,255,255,0.6)',
              borderRadius: '4px',
              transition: 'color 0.15s',
            }}
            onMouseEnter={e => { e.currentTarget.style.color = 'rgba(255,255,255,1.0)' }}
            onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.6)' }}
          >
            <Icon size={16} />
          </button>
        ))}

        {/* User avatar */}
        <div
          style={{
            width: '30px',
            height: '30px',
            borderRadius: '50%',
            backgroundColor: '#0076B6',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '12px',
            fontWeight: 600,
            color: '#ffffff',
            marginLeft: '6px',
            flexShrink: 0,
            userSelect: 'none',
          }}
        >
          {initials}
        </div>
      </div>
    </header>
  )
}
