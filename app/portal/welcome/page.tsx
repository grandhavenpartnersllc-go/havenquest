'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '../../../lib/supabase/client'
import WelcomeVideo from '../../../components/portal/WelcomeVideo'

export default function WelcomePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function handleCTA() {
    setLoading(true)
    try {
      const supabase = createClient()
      const { data: { session } } = await supabase.auth.getSession()
      if (session?.user?.email) {
        await supabase
          .from('users')
          .update({ welcome_seen: true })
          .eq('email', session.user.email.toLowerCase())
      }
    } catch (err) {
      console.error('[Welcome] update failed:', err)
    }
    router.push('/portal/mm2')
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#F9FAFB',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px 24px',
      }}
    >
      {/* Logo */}
      <div style={{ marginBottom: '32px' }}>
        <p style={{ fontSize: '26px', fontWeight: 700, margin: 0, lineHeight: 1.1, letterSpacing: '-0.02em' }}>
          <span style={{ color: '#0A1E3D' }}>Haven</span>
          <span style={{ color: '#0076B6' }}>Quest</span>
        </p>
      </div>

      <div style={{ width: '100%', maxWidth: '720px' }}>
        {/* Heading */}
        <h1 style={{ fontSize: '28px', fontWeight: 700, color: '#0A1E3D', margin: '0 0 8px', lineHeight: 1.2 }}>
          Welcome to NAVIGATOR
        </h1>
        <p style={{ fontSize: '16px', color: '#6B7280', margin: '0 0 28px' }}>
          Your relocation journey starts here.
        </p>

        {/* Video */}
        <div style={{ marginBottom: '28px' }}>
          <WelcomeVideo />
        </div>

        {/* Orientation copy */}
        <p style={{ fontSize: '15px', color: '#374151', lineHeight: 1.7, margin: '0 0 32px' }}>
          You&apos;ve taken the first step. What you&apos;ll see next are your preliminary city
          matches — the communities that best fit everything you shared with us. Take your time
          exploring them. When you&apos;re ready, you&apos;ll refine your direction before
          connecting with your dedicated Market Director.
        </p>

        {/* CTA */}
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <button
            onClick={() => { void handleCTA() }}
            disabled={loading}
            style={{
              backgroundColor: '#0076B6',
              color: '#ffffff',
              border: 'none',
              borderRadius: '10px',
              padding: '14px 36px',
              fontSize: '16px',
              fontWeight: 600,
              cursor: loading ? 'wait' : 'pointer',
              opacity: loading ? 0.7 : 1,
              transition: 'opacity 0.15s',
            }}
          >
            {loading ? 'Loading…' : 'Explore my matches →'}
          </button>
        </div>
      </div>
    </div>
  )
}
