'use client'

import { useRouter } from 'next/navigation'
import WorkspaceHeader from '../components/WorkspaceHeader'
import { usePortalData } from '../providers/PortalDataProvider'
import MM2Discover from '../../../components/portal/milemarkers/MM2Discover'

export default function MM2Page() {
  const router = useRouter()
  const { session, matches, profile, initialChecklist, initialNotes, ready, error } = usePortalData()

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

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100%', background: '#F2F1EE' }}>
      <WorkspaceHeader mmNumber={2} name="Discover" deliverable="Community Profile" />
      <div style={{ padding: '24px', flex: 1 }}>
        <MM2Discover
          matches={matches}
          profile={profile}
          initialChecklist={initialChecklist}
          initialNotes={initialNotes}
          onAdvanceToDiscover={() => router.push('/portal/mm3')}
          email={session?.email}
        />
      </div>
    </div>
  )
}
