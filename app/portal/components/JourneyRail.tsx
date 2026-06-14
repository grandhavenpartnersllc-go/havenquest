'use client'

import { useState, type CSSProperties } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { PlayCircle, CheckCircle, Circle, Home, FileText, HelpCircle, User, LogOut } from 'lucide-react'
import { createClient } from '../../../lib/supabase/client'
import { usePortalData } from '../providers/PortalDataProvider'

type MMStatus = 'complete' | 'locked' | 'unlocked'

interface MMEntry {
  number: number
  name: string
  deliverable: string | null
}

const MILEMARKERS: MMEntry[] = [
  { number: 1,  name: 'Welcome',    deliverable: 'Journey Introduction'          },
  { number: 2,  name: 'Explore',    deliverable: 'Community Profile'             },
  { number: 3,  name: 'Discover',   deliverable: 'Committed Direction Package'   },
  { number: 4,  name: 'Connect',    deliverable: 'Relocation Roadmap'            },
  { number: 5,  name: 'Plan',       deliverable: null                            },
  { number: 6,  name: 'Prepare',    deliverable: null                            },
  { number: 7,  name: 'Match',      deliverable: null                            },
  { number: 8,  name: 'Engage',     deliverable: null                            },
  { number: 9,  name: 'Transition', deliverable: null                            },
  { number: 10, name: 'Home',       deliverable: null                            },
]

function getStatus(mmNumber: number, currentMM: number): MMStatus {
  if (mmNumber < currentMM) return 'complete'
  if (mmNumber <= currentMM) return 'unlocked'
  return 'locked'
}

function SkeletonRow() {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        padding: '10px 16px',
        minHeight: '38px',
      }}
    >
      <div
        style={{
          width: '15px',
          height: '15px',
          borderRadius: '50%',
          backgroundColor: 'var(--panel-border)',
          flexShrink: 0,
        }}
      />
      <div
        style={{
          height: '10px',
          flex: 1,
          maxWidth: '80px',
          borderRadius: '4px',
          backgroundColor: 'var(--panel-border)',
        }}
      />
    </div>
  )
}

interface MMRowProps {
  mm: MMEntry
  status: MMStatus
  isActive: boolean
  isCurrentMM: boolean
}

function MMRow({ mm, status, isActive, isCurrentMM }: MMRowProps) {
  const [hovered, setHovered] = useState(false)
  const isHome = mm.number === 10

  const icon: React.ReactNode = isHome ? (
    <Home size={15} style={{ color: '#C5B783', flexShrink: 0 }} />
  ) : status === 'complete' ? (
    <CheckCircle size={15} style={{ color: 'var(--success-color)', flexShrink: 0 }} />
  ) : isCurrentMM ? (
    <PlayCircle size={15} style={{ color: '#0076B6', flexShrink: 0 }} />
  ) : (
    <Circle size={15} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
  )

  const textColor: string = isHome
    ? '#C5B783'
    : isActive
    ? '#0076B6'
    : status === 'complete' || isCurrentMM
    ? 'var(--text-primary)'
    : 'var(--text-muted)'

  const rowBase: CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    paddingTop: '10px',
    paddingBottom: '10px',
    paddingRight: '12px',
    paddingLeft: isActive ? '13px' : '16px',
    borderLeft: isActive ? '3px solid #0076B6' : '3px solid transparent',
    backgroundColor:
      isActive
        ? 'var(--active-row-bg)'
        : hovered
        ? 'var(--accent-blue-light)'
        : 'transparent',
    cursor: 'pointer',
    textDecoration: 'none',
    userSelect: 'none',
    minHeight: '38px',
    transition: 'background-color 0.15s',
  }

  const label = (
    <>
      {icon}
      <span
        style={{
          flex: 1,
          fontSize: '12px',
          fontWeight: isActive ? 600 : status === 'complete' || isCurrentMM ? 500 : 400,
          color: textColor,
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          lineHeight: 1.3,
        }}
      >
        {mm.name}
      </span>
      {status === 'complete' && mm.deliverable && (
        <FileText
          size={12}
          style={{ color: 'var(--text-muted)', flexShrink: 0 }}
          aria-label={mm.deliverable}
        />
      )}
    </>
  )

  return (
    <Link
      href={`/portal/mm${mm.number}`}
      style={rowBase}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {label}
    </Link>
  )
}

function BottomItem({
  icon,
  label,
  href,
  onClick,
}: {
  icon: React.ReactNode
  label: string
  href?: string
  onClick?: () => void
}) {
  const [hovered, setHovered] = useState(false)

  const sharedStyle: CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    paddingTop: '10px',
    paddingBottom: '10px',
    paddingRight: '12px',
    paddingLeft: '16px',
    borderLeft: '3px solid transparent',
    backgroundColor: hovered ? 'var(--accent-blue-light)' : 'transparent',
    cursor: 'pointer',
    textDecoration: 'none',
    userSelect: 'none',
    minHeight: '38px',
    transition: 'background-color 0.15s',
    width: '100%',
    boxSizing: 'border-box',
  }

  const content = (
    <>
      <span style={{ color: 'var(--text-secondary)', display: 'flex', flexShrink: 0 }}>{icon}</span>
      <span style={{ fontSize: '12px', fontWeight: 400, color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>
        {label}
      </span>
    </>
  )

  if (href) {
    return (
      <a
        href={href}
        style={sharedStyle}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {content}
      </a>
    )
  }

  return (
    <button
      type="button"
      style={{ ...sharedStyle, border: 'none', textAlign: 'left' }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onClick}
    >
      {content}
    </button>
  )
}

export default function JourneyRail() {
  const { currentMM, ready } = usePortalData()
  const pathname = usePathname()
  const router = useRouter()
  const activeMMFromPath = (() => {
    const m = pathname.match(/\/portal\/mm(\d+)/)
    return m ? parseInt(m[1], 10) : null
  })()

  async function handleSignOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
  }

  return (
    <aside
      style={{
        width: '200px',
        minWidth: '200px',
        height: '100%',
        backgroundColor: 'var(--panel-bg)',
        borderRight: '0.5px solid var(--panel-border)',
        display: 'flex',
        flexDirection: 'column',
        overflowY: 'auto',
        flexShrink: 0,
      }}
    >
      <p
        style={{
          fontSize: '10px',
          fontWeight: 600,
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          color: 'var(--text-secondary)',
          padding: '16px 16px 10px',
          margin: 0,
          flexShrink: 0,
        }}
      >
        Your Journey
      </p>

      <div style={{ flex: 1 }}>
        {!ready
          ? Array.from({ length: 10 }, (_, i) => <SkeletonRow key={i} />)
          : MILEMARKERS.map(mm => (
              <MMRow
                key={mm.number}
                mm={mm}
                status={getStatus(mm.number, currentMM)}
                isActive={mm.number === (activeMMFromPath ?? currentMM)}
                isCurrentMM={mm.number === currentMM}
              />
            ))}
      </div>

      {/* Bottom utility items */}
      <div style={{ flexShrink: 0 }}>
        <div style={{ height: '1px', backgroundColor: 'var(--panel-border)', margin: '4px 0' }} />
        <BottomItem
          icon={<HelpCircle size={15} />}
          label="Help"
          href="mailto:craig.asbach@havenquest.co"
        />
        <BottomItem
          icon={<User size={15} />}
          label="My Profile"
          href="/portal/profile"
        />
        <BottomItem
          icon={<LogOut size={15} />}
          label="Sign Out"
          onClick={() => { void handleSignOut() }}
        />
      </div>
    </aside>
  )
}
