'use client'

import { useEffect, useState, type CSSProperties } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { PlayCircle, CheckCircle, Circle, Home, FileText } from 'lucide-react'
import { createClient } from '../../../lib/supabase/client'

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
  ) : isActive || isCurrentMM ? (
    <PlayCircle size={15} style={{ color: '#0076B6', flexShrink: 0 }} />
  ) : status === 'complete' ? (
    <CheckCircle size={15} style={{ color: 'var(--success-color)', flexShrink: 0 }} />
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
        : status !== 'locked' && hovered
        ? 'var(--accent-blue-light)'
        : 'transparent',
    cursor: status === 'locked' ? 'default' : 'pointer',
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

  if (status === 'locked') {
    return <div style={rowBase}>{label}</div>
  }

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

export default function JourneyRail() {
  const [currentMM, setCurrentMM] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)
  const pathname = usePathname()
  const activeMMFromPath = (() => {
    const m = pathname.match(/\/portal\/mm(\d+)/)
    return m ? parseInt(m[1], 10) : null
  })()

  useEffect(() => {
    ;(async () => {
      try {
        const supabase = createClient()
        const { data: { session } } = await supabase.auth.getSession()
        if (!session?.user?.email) {
          setCurrentMM(2)
          return
        }
        const { data } = await supabase
          .from('users')
          .select('current_milemarker')
          .eq('email', session.user.email.toLowerCase())
          .single()
        const raw = (data as Record<string, unknown> | null)?.current_milemarker
        setCurrentMM(typeof raw === 'number' ? raw : 2)
      } catch (err) {
        console.error('[JourneyRail] failed to load MM state:', err)
        setCurrentMM(2)
      } finally {
        setLoading(false)
      }
    })()
  }, [])

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
        {loading || currentMM === null
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
    </aside>
  )
}
