'use client'

import { useEffect, useState } from 'react'
import { CheckCircle, CalendarDays } from 'lucide-react'
import { createClient } from '../../../../lib/supabase/client'
import { getAllCities } from '../../../../services/locationService'
import type { MM4Profile } from '../../../../types'

const BOOKINGS_URL =
  'https://calendly.com/craig-asbach-havenquest/havenquest-consultation'

interface Props {
  data: MM4Profile
  email: string
}

export default function MM4Confirmation({ data, email }: Props) {
  const firstName = data.primary_first_name ?? ''
  const [cityNames, setCityNames] = useState<string[]>(
    data.confirmed_target_city ? [data.confirmed_target_city] : []
  )

  useEffect(() => {
    const supabase = createClient()
    void supabase
      .from('users')
      .select('chosen_communities')
      .eq('email', email.toLowerCase())
      .maybeSingle()
      .then(({ data: userData }) => {
        if (Array.isArray(userData?.chosen_communities) && userData.chosen_communities.length > 0) {
          const allCities = getAllCities()
          const names = (userData.chosen_communities as string[])
            .slice(0, 3)
            .map(id => allCities.find(c => c.id === id)?.name)
            .filter((n): n is string => Boolean(n))
          if (names.length > 0) setCityNames(names)
        }
      })
  }, [email])

  return (
    <div style={{ maxWidth: '700px', margin: '0 auto', padding: '8px 0 48px' }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px', marginBottom: '36px' }}>
        <div style={{
          width: '52px',
          height: '52px',
          borderRadius: '50%',
          backgroundColor: 'rgba(0,118,182,0.1)',
          border: '1.5px solid rgba(0,118,182,0.25)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          marginTop: '4px',
        }}>
          <CheckCircle size={28} style={{ color: '#0076B6' }} />
        </div>
        <div>
          <p style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.12em', color: '#C5B783', textTransform: 'uppercase', margin: '0 0 8px' }}>
            Profile Submitted
          </p>
          <h1 style={{ fontSize: '26px', fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 10px', lineHeight: 1.25 }}>
            Your Navigator journey is officially underway.
          </h1>
          <p style={{ fontSize: '15px', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.6 }}>
            {firstName ? `${firstName}, your` : 'Your'} Market Director has been notified and will be in touch within 24 hours.
          </p>
        </div>
      </div>

      {/* Profile summary */}
      <div style={{
        backgroundColor: 'var(--card-bg)',
        border: '1px solid var(--card-border)',
        borderRadius: '12px',
        padding: '20px 24px',
        marginBottom: '32px',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
      }}>
        {cityNames.length > 0 && (
          <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)', width: '120px', flexShrink: 0, paddingTop: '3px' }}>
              Target {cityNames.length > 1 ? 'communities' : 'city'}
            </span>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {cityNames.map((name, i) => (
                <span key={i} style={{
                  fontSize: '13px',
                  fontWeight: 500,
                  color: '#0076B6',
                  backgroundColor: 'rgba(0,118,182,0.08)',
                  border: '1px solid rgba(0,118,182,0.2)',
                  borderRadius: '6px',
                  padding: '3px 10px',
                }}>
                  {cityNames.length > 1 ? `#${i + 1} ${name}` : name}
                </span>
              ))}
            </div>
          </div>
        )}
        {data.target_move_date && (
          <div style={{ display: 'flex', gap: '12px', alignItems: 'baseline' }}>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)', width: '120px', flexShrink: 0 }}>Target date</span>
            <span style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text-primary)' }}>
              {data.target_move_date}
            </span>
          </div>
        )}
        <div style={{ display: 'flex', gap: '12px', alignItems: 'baseline' }}>
          <span style={{ fontSize: '12px', color: 'var(--text-muted)', width: '120px', flexShrink: 0 }}>Profile sent to</span>
          <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{email}</span>
        </div>
        {data.why_texas && (
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', fontStyle: 'italic', margin: 0, lineHeight: 1.6 }}>
            In your own words: &ldquo;{data.why_texas}&rdquo;
          </p>
        )}
      </div>

      <p style={{ fontSize: '12px', color: 'var(--text-muted)', fontStyle: 'italic', margin: '0 0 32px' }}>
        These selections reflect everything you&apos;ve shared so far — your Market Director may refine them as your conversation goes deeper.
      </p>

      {/* What happens next */}
      <div style={{ marginBottom: '32px' }}>
        <p style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-muted)', margin: '0 0 16px' }}>
          What happens next
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {[
            'Your Market Director reviews your full profile — typically within 24 hours.',
            "You'll receive a personal introduction from them via email.",
            "Your consultation is a 60-minute Teams call — come ready to talk about the life you're building in Texas.",
            'After your consultation, MM5 unlocks and your relocation plan begins.',
          ].map((step, i) => (
            <div key={i} style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
              <div style={{
                width: '26px',
                height: '26px',
                borderRadius: '50%',
                backgroundColor: '#0076B6',
                color: '#ffffff',
                fontSize: '12px',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                marginTop: '2px',
              }}>
                {i + 1}
              </div>
              <p style={{ fontSize: '14px', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.65 }}>
                {step}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Book button */}
      <div style={{ marginBottom: '36px' }}>
        <a
          href={BOOKINGS_URL}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '10px',
            padding: '14px 32px',
            borderRadius: '8px',
            backgroundColor: '#C5B783',
            color: '#0A1E3D',
            fontSize: '15px',
            fontWeight: 700,
            textDecoration: 'none',
            letterSpacing: '0.01em',
            transition: 'opacity 0.15s',
          }}
          onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.opacity = '0.85' }}
          onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.opacity = '1' }}
        >
          <CalendarDays size={17} />
          Book My Consultation
        </a>
      </div>

      {/* What we'll cover */}
      <div style={{
        backgroundColor: 'var(--card-bg)',
        border: '1px solid var(--card-border)',
        borderRadius: '12px',
        padding: '20px 24px',
        marginBottom: '32px',
      }}>
        <p style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-muted)', margin: '0 0 14px' }}>
          What we'll cover in your consultation
        </p>
        <ul style={{ margin: 0, paddingLeft: '18px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {[
            'Your target communities and what makes each one right for your family',
            'Your financial picture and what it means for your search',
            'The full Navigator journey — all 10 stages and what to expect',
            'Your timeline, concerns, and anything else on your mind',
            'The Navigator Activation — what it unlocks and what it means for your journey',
          ].map((item, i) => (
            <li key={i} style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.65 }}>
              {item}
            </li>
          ))}
        </ul>
      </div>

      {/* Closing */}
      <p style={{ fontSize: '15px', color: 'var(--text-secondary)', lineHeight: 1.7, margin: 0, fontStyle: 'italic' }}>
        This is where the real work begins — and you won't be doing it alone.
      </p>

    </div>
  )
}
