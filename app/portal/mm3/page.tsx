'use client'

import { useRouter } from 'next/navigation'
import WorkspaceHeader from '../components/WorkspaceHeader'
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

  // Preserve the hq_path routing logic from MileMarkerContent
  const hqPath = typeof window !== 'undefined'
    ? sessionStorage.getItem('hq_path')
    : null

  let initialMetro: string | undefined
  if (hqPath === 'explore') {
    initialMetro = 'State'
  } else {
    const topMetro = matches[0]?.location.metroUsed ?? ''
    initialMetro = ['Dallas', 'Houston', 'San Antonio', 'Austin'].find(v => topMetro.includes(v))
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100%' }}>
      <WorkspaceHeader mmNumber={3} name="Refine" deliverable="Committed Direction Package" />
      <div style={{ padding: '24px', flex: 1 }}>
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
    </div>
  )
}
