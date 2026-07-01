'use client'

import { useRouter } from 'next/navigation'
import { usePortalData } from '../providers/PortalDataProvider'
import MM3Discover from '../../../components/portal/milemarkers/MM3Discover'
import { createClient } from '../../../lib/supabase/client'

export default function MM3Page() {
  const router = useRouter()
  const { session, profile, matches, ready, error } = usePortalData()

  if (!ready) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
        <div
          style={{
            width: '24px',
            height: '24px',
            borderRadius: '50%',
            border: '2px solid var(--accent-blue)',
            borderTopColor: 'transparent',
            animation: 'spin 0.7s linear infinite',
          }}
        />
      </div>
    )
  }

  if (error) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', padding: '24px' }}>
        <div style={{ textAlign: 'center', maxWidth: '320px' }}>
          <p style={{ fontSize: '14px', color: '#DC2626', marginBottom: '12px' }}>{error}</p>
          <a href="/login" style={{ fontSize: '13px', color: 'var(--accent-blue)' }}>Log in again →</a>
        </div>
      </div>
    )
  }

  if (!session) return null

  const sessionMetro = typeof window !== 'undefined' ? sessionStorage.getItem('hq_metro') : null

  // hq_metro stores lowercase IDs ('austin', 'dallas', 'houston', 'sanAntonio')
  // Map to the display labels used by METRO_FILTERS tab values in MM3Discover
  const METRO_ID_TO_LABEL: Record<string, string> = {
    austin: 'Austin',
    dallas: 'Dallas',
    houston: 'Houston',
    sanAntonio: 'San Antonio',
  }

  let initialMetro: string
  if (sessionMetro && METRO_ID_TO_LABEL[sessionMetro]) {
    initialMetro = METRO_ID_TO_LABEL[sessionMetro]
  } else {
    const topMetro = matches[0]?.location?.metroUsed ?? ''
    initialMetro = ['Dallas', 'Houston', 'San Antonio', 'Austin'].find(v => topMetro.includes(v)) ?? 'Austin'
  }

  return (
    <div style={{ display: 'flex', flex: 1, minHeight: '100%' }}>
      <MM3Discover
          matches={matches}
          profile={profile}
          session={session}
          onAdvanceToConnect={async () => {
              if (session?.email) {
                try {
                  const supabase = createClient()
                  await supabase
                    .from('users')
                    .update({ current_milemarker: 4 })
                    .eq('email', session.email.toLowerCase())
                } catch {}
              }
              router.push('/portal/mm4')
            }}
          initialMetro={initialMetro}
          initialCityIndex={0}
        />
    </div>
  )
}
