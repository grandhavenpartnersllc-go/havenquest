'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
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
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', backgroundColor: '#E8E4DA' }}>
        <div
          style={{
            width: '24px',
            height: '24px',
            borderRadius: '50%',
            border: '2px solid #C5B783',
            borderTopColor: 'transparent',
            animation: 'spin 0.7s linear infinite',
          }}
        />
      </div>
    )
  }

  if (error) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', padding: '24px', backgroundColor: '#E8E4DA' }}>
        <div style={{ textAlign: 'center', maxWidth: '320px' }}>
          <p style={{ fontSize: '14px', color: '#DC2626', marginBottom: '12px' }}>{error}</p>
          <a href="/login" style={{ fontSize: '13px', color: '#0A1E3D' }}>Log in again →</a>
        </div>
      </div>
    )
  }

  if (!session) return null

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', backgroundColor: '#E8E4DA', overflowY: 'auto' }}>

      {/* Nav bar */}
      <div style={{
        backgroundColor: '#0A1E3D',
        height: '56px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 28px',
        borderBottom: '0.5px solid rgba(197,183,131,0.2)',
        flexShrink: 0,
      }}>
        <span style={{ fontSize: '18px', fontWeight: 500, fontFamily: '-apple-system, "SF Pro Display", sans-serif' }}>
          <span style={{ color: '#FFFFFF' }}>Haven</span>
          <span style={{ color: '#C5B783' }}>Quest</span>
        </span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)' }}>Navigator Portal</span>
          <Link
            href="/portal"
            style={{
              fontSize: '12px',
              color: '#C5B783',
              border: '0.5px solid rgba(197,183,131,0.5)',
              borderRadius: '20px',
              padding: '5px 14px',
              textDecoration: 'none',
              fontWeight: 500,
            }}
          >
            Relocation Roadmap
          </Link>
        </div>
      </div>

      {/* Page body */}
      <div style={{
        flex: 1,
        padding: '56px 32px 80px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}>
        {pageState === 'confirmation' ? (
          <div style={{ width: '100%', maxWidth: '860px' }}>
            <MM4Confirmation
              data={submittedData ?? { email: session.email }}
              email={session.email}
            />
          </div>
        ) : (
          <MM4IntakeForm onSubmitted={handleSubmitted} />
        )}
      </div>
    </div>
  )
}
