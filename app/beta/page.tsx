'use client'

import { useState } from 'react'

export default function BetaPage() {
  const [stage, setStage] = useState<1 | 2>(1)
  const [agreed, setAgreed] = useState(false)

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#08101C',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px 16px',
        backgroundImage:
          'radial-gradient(ellipse 70% 50% at 50% 50%, rgba(26,95,168,0.13) 0%, transparent 65%)',
      }}
    >
      <div style={{ width: '100%', maxWidth: 480 }}>

        {/* Stage 1 — Agreement */}
        <div
          style={{
            transition: 'opacity 0.3s, transform 0.3s',
            opacity: stage === 1 ? 1 : 0,
            pointerEvents: stage === 1 ? 'auto' : 'none',
            position: stage === 2 ? 'absolute' : 'relative',
          }}
        >
          <p
            style={{
              color: 'rgba(255,255,255,0.2)',
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              marginBottom: 24,
              textAlign: 'center',
            }}
          >
            Confidentiality Agreement
          </p>

          <div
            style={{
              backgroundColor: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 14,
              padding: '24px 28px',
              marginBottom: 24,
            }}
          >
            <p
              style={{
                color: 'rgba(237,231,220,0.55)',
                fontSize: 13,
                lineHeight: 1.75,
                marginBottom: 16,
              }}
            >
              This access is granted on a strictly confidential basis. By proceeding, you agree that
              any information, features, materials, or content you encounter through this early access
              is proprietary and confidential.
            </p>
            <p
              style={{
                color: 'rgba(237,231,220,0.55)',
                fontSize: 13,
                lineHeight: 1.75,
                marginBottom: 16,
              }}
            >
              You agree not to disclose, share, reproduce, publish, or distribute any such
              information to any third party — in any form, by any means — without prior written
              consent from the party that granted this access.
            </p>
            <p
              style={{
                color: 'rgba(237,231,220,0.55)',
                fontSize: 13,
                lineHeight: 1.75,
              }}
            >
              This access may be revoked at any time without notice. Unauthorized disclosure may
              result in legal action and remedies available under applicable law.
            </p>
          </div>

          <label
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: 12,
              cursor: 'pointer',
              marginBottom: 28,
            }}
          >
            <div
              onClick={() => setAgreed(a => !a)}
              style={{
                width: 18,
                height: 18,
                minWidth: 18,
                borderRadius: 5,
                border: `1.5px solid ${agreed ? 'rgba(96,184,255,0.55)' : 'rgba(255,255,255,0.15)'}`,
                backgroundColor: agreed ? 'rgba(96,184,255,0.1)' : 'transparent',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginTop: 1,
                transition: 'all 0.15s',
                cursor: 'pointer',
                flexShrink: 0,
              }}
            >
              {agreed && (
                <svg width="11" height="9" viewBox="0 0 11 9" fill="none">
                  <path d="M1 4L4 7L10 1" stroke="rgba(96,184,255,0.85)" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </div>
            <span
              onClick={() => setAgreed(a => !a)}
              style={{ color: 'rgba(237,231,220,0.35)', fontSize: 12, lineHeight: 1.6 }}
            >
              I have read and agree to the terms of this confidentiality agreement.
            </span>
          </label>

          <button
            onClick={() => { if (agreed) setStage(2) }}
            disabled={!agreed}
            style={{
              width: '100%',
              padding: '13px 24px',
              borderRadius: 12,
              border: '1px solid rgba(255,255,255,0.08)',
              backgroundColor: agreed ? 'rgba(255,255,255,0.07)' : 'rgba(255,255,255,0.02)',
              color: agreed ? 'rgba(237,231,220,0.7)' : 'rgba(237,231,220,0.2)',
              fontSize: 13,
              fontWeight: 600,
              letterSpacing: '-0.01em',
              cursor: agreed ? 'pointer' : 'not-allowed',
              transition: 'all 0.2s',
            }}
          >
            Continue
          </button>
        </div>

        {/* Stage 2 — Access */}
        {stage === 2 && (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 20,
              animation: 'fadeIn 0.35s ease',
            }}
          >
            <style>{`@keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }`}</style>

            <p
              style={{
                color: 'rgba(255,255,255,0.2)',
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
              }}
            >
              Access Granted
            </p>

            <a
              href="https://havenquest.co"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '14px 48px',
                borderRadius: 14,
                border: '1px solid rgba(255,255,255,0.12)',
                backgroundColor: 'rgba(255,255,255,0.06)',
                color: 'rgba(237,231,220,0.75)',
                fontSize: 14,
                fontWeight: 600,
                letterSpacing: '-0.01em',
                textDecoration: 'none',
                transition: 'all 0.2s',
              }}
              onMouseEnter={e => {
                const el = e.currentTarget
                el.style.backgroundColor = 'rgba(255,255,255,0.1)'
                el.style.borderColor = 'rgba(255,255,255,0.2)'
                el.style.color = 'rgba(237,231,220,0.95)'
              }}
              onMouseLeave={e => {
                const el = e.currentTarget
                el.style.backgroundColor = 'rgba(255,255,255,0.06)'
                el.style.borderColor = 'rgba(255,255,255,0.12)'
                el.style.color = 'rgba(237,231,220,0.75)'
              }}
            >
              Proceed →
            </a>
          </div>
        )}

      </div>
    </div>
  )
}
