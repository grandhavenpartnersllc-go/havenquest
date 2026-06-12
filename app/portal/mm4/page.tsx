'use client'

import { useState, useEffect } from 'react'
import WorkspaceHeader from '../components/WorkspaceHeader'
import { usePortalData } from '../providers/PortalDataProvider'
import { createClient } from '../../../lib/supabase/client'
import MM4IntakeForm from './components/MM4IntakeForm'
import MM4Confirmation from './components/MM4Confirmation'
import type { MM4Profile } from '../../../types'

type PageState = 'loading' | 'form' | 'confirmation'

export default function MM4Page() {
  const { session, ready, error } = usePortalData()
  const [pageState, setPageState] = useState<PageState>('loading')
  const [submittedData, setSubmittedData] = useState<MM4Profile | null>(null)

  useEffect(() => {
    if (!ready || !session?.email) return
    const check = async () => {
      try {
        const supabase = createClient()
        const { data: existing } = await supabase
          .from('mm4_profiles')
          .select('submitted, primary_first_name, email')
          .eq('email', session.email.toLowerCase())
          .maybeSingle()

        if (existing?.submitted) {
          setSubmittedData(existing as MM4Profile)
          setPageState('confirmation')
        } else {
          setPageState('form')
        }
      } catch {
        setPageState('form')
      }
    }
    void check()
  }, [ready, session?.email])

  function handleSubmitted(data: MM4Profile) {
    setSubmittedData(data)
    setPageState('confirmation')
  }

  if (!ready || pageState === 'loading') {
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

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100%' }}>
      <WorkspaceHeader mmNumber={4} name="Connect" deliverable="Relocation Roadmap" />
      <div style={{ padding: '32px 28px', flex: 1, maxWidth: '760px' }}>
        {pageState === 'confirmation' ? (
          <MM4Confirmation
            data={submittedData ?? { email: session.email }}
            email={session.email}
          />
        ) : (
          <MM4IntakeForm onSubmitted={handleSubmitted} />
        )}
      </div>
    </div>
  )
}
