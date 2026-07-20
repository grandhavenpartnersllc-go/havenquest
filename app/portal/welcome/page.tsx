'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '../../../lib/supabase/client'
import WelcomeVideo from '../../../components/portal/WelcomeVideo'

// Continue button unlocks once the viewer reaches this playback position (2:30).
const UNLOCK_SECONDS = 150

export default function WelcomePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  // One-way latch: once the viewer passes 2:30 the button stays unlocked (even if they scrub back).
  const [unlocked, setUnlocked] = useState(false)
  const [showBubble, setShowBubble] = useState(false)

  function handleProgress(currentTime: number) {
    if (!unlocked && currentTime >= UNLOCK_SECONDS) setUnlocked(true)
  }

  async function handleCTA() {
    setLoading(true)
    try {
      const supabase = createClient()
      const { data: { session } } = await supabase.auth.getSession()
      if (session?.user?.email) {
        await supabase
          .from('users')
          .update({ welcome_seen: true, current_milemarker: 3 })
          .eq('email', session.user.email.toLowerCase())
      }
    } catch (err) {
      console.error('[Welcome] update failed:', err)
    }
    router.push('/portal/mm3')
  }

  function handleButtonClick() {
    if (loading) return
    if (!unlocked) {
      // Locked tap: surface the bubble, do NOT advance.
      setShowBubble(true)
      window.setTimeout(() => setShowBubble(false), 2200)
      return
    }
    void handleCTA()
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
        <div style={{ marginBottom: '10px' }}>
          <WelcomeVideo onProgress={handleProgress} />
        </div>

        {/* Watch-gate disclosure caption */}
        <p style={{ fontSize: '12px', color: '#9AA3AF', margin: '0 0 28px' }}>
          Runs 3:46 · you can continue after the 2:30 mark
        </p>

        {/* Orientation copy */}
        <p style={{ fontSize: '15px', color: '#374151', lineHeight: 1.7, margin: '0 0 32px' }}>
          You&apos;ve taken the first step. What you&apos;ll see next are your preliminary city
          matches — the communities that best fit everything you shared with us. Take your time
          exploring them. When you&apos;re ready, you&apos;ll refine your direction before
          connecting with your dedicated Market Director.
        </p>

        {/* CTA — grayed/inert until 2:30 (kept clickable so a locked tap can fire the bubble) */}
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <div style={{ position: 'relative', display: 'inline-block' }}>
            {showBubble && (
              <div
                role="status"
                style={{
                  position: 'absolute',
                  bottom: 'calc(100% + 10px)',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  background: '#0A1E3D',
                  color: '#ffffff',
                  fontSize: '13px',
                  fontWeight: 500,
                  padding: '9px 14px',
                  borderRadius: '8px',
                  whiteSpace: 'nowrap',
                  boxShadow: '0 6px 20px rgba(10,30,61,0.28)',
                  zIndex: 10,
                }}
              >
                Hang tight — this opens at the 2:30 mark
                {/* downward arrow pointer */}
                <span
                  aria-hidden="true"
                  style={{
                    position: 'absolute',
                    top: '100%',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: 0,
                    height: 0,
                    borderLeft: '6px solid transparent',
                    borderRight: '6px solid transparent',
                    borderTop: '6px solid #0A1E3D',
                  }}
                />
              </div>
            )}
            <button
              onClick={handleButtonClick}
              style={{
                backgroundColor: unlocked ? '#0076B6' : '#E3E6EA',
                color: unlocked ? '#ffffff' : '#9AA3AF',
                border: 'none',
                borderRadius: '10px',
                padding: '14px 36px',
                fontSize: '16px',
                fontWeight: 600,
                cursor: loading ? 'wait' : 'pointer',
                opacity: loading ? 0.7 : 1,
                transition: 'background-color 0.2s, color 0.2s, opacity 0.15s',
              }}
            >
              {unlocked ? (loading ? 'Loading…' : 'Explore my matches →') : 'Explore my matches'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
