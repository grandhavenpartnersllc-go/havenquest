'use client'

import { useEffect, useState } from 'react'
import { CalendarDays } from 'lucide-react'
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
    <div style={{ width: '100%', maxWidth: '860px' }}>
      {/* White card */}
      <div style={{
        backgroundColor: '#FFFFFF',
        border: '0.5px solid rgba(0,0,0,0.08)',
        borderRadius: '20px',
        width: '100%',
      }}>
        {/* Card body */}
        <div style={{ padding: '48px 48px 0' }}>

          {/* Success header */}
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '20px', marginBottom: '36px' }}>
            {/* Gold checkmark circle */}
            <div style={{
              width: '52px',
              height: '52px',
              borderRadius: '50%',
              backgroundColor: 'rgba(197,183,131,0.15)',
              border: '1.5px solid rgba(197,183,131,0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              marginTop: '4px',
            }}>
              <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                <path d="M4 11l5 5 9-9" stroke="#C5B783" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div>
              <p style={{ fontSize: '10px', fontWeight: 600, letterSpacing: '1.5px', color: 'rgba(197,183,131,0.9)', textTransform: 'uppercase', margin: '0 0 8px' }}>
                Profile Submitted
              </p>
              <h1 style={{ fontSize: '24px', fontWeight: 500, color: '#0A1E3D', letterSpacing: '-0.5px', margin: '0 0 10px', lineHeight: 1.3 }}>
                Your Navigator journey is officially underway.
              </h1>
              <p style={{ fontSize: '14px', color: 'rgba(10,30,61,0.45)', margin: 0, lineHeight: 1.6 }}>
                {firstName ? `${firstName}, your` : 'Your'} Market Director has been notified and will be in touch within 24 hours.
              </p>
            </div>
          </div>

          {/* Summary block */}
          <div style={{
            background: 'rgba(197,183,131,0.12)',
            border: '0.5px solid rgba(197,183,131,0.4)',
            borderRadius: '12px',
            padding: '20px 24px',
            marginBottom: '32px',
            display: 'flex',
            gap: '40px',
            alignItems: 'flex-start',
            flexWrap: 'wrap',
          }}>
            {cityNames.length > 0 && (
              <div>
                <p style={{ fontSize: '11px', color: 'rgba(10,30,61,0.4)', margin: '0 0 10px', letterSpacing: '0.6px' }}>
                  Target {cityNames.length > 1 ? 'communities' : 'city'}
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {cityNames.map((name, i) => (
                    <span key={i} style={{
                      fontSize: '13px',
                      fontWeight: 500,
                      color: '#C5B783',
                      backgroundColor: '#0A1E3D',
                      borderRadius: '6px',
                      padding: '4px 12px',
                    }}>
                      {cityNames.length > 1 ? `#${i + 1} ${name}` : name}
                    </span>
                  ))}
                </div>
              </div>
            )}
            <div>
              <p style={{ fontSize: '11px', color: 'rgba(10,30,61,0.4)', margin: '0 0 10px', letterSpacing: '0.6px' }}>Profile sent to</p>
              <p style={{ fontSize: '14px', fontWeight: 500, color: '#0A1E3D', margin: 0 }}>{email}</p>
            </div>
          </div>

          {/* Divider */}
          <div style={{ height: '0.5px', background: 'rgba(10,30,61,0.07)', marginBottom: '32px' }} />

          {/* What happens next */}
          <div style={{ marginBottom: '32px' }}>
            <p style={{ fontSize: '10px', fontWeight: 600, letterSpacing: '1.5px', textTransform: 'uppercase', color: 'rgba(197,183,131,0.9)', margin: '0 0 20px' }}>
              What happens next
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {[
                'Your Market Director reviews your full profile — typically within 24 hours.',
                "You'll receive a personal introduction from them via email.",
                "Your consultation is a 60-minute Teams call — come ready to talk about the life you're building in Texas.",
                'After your consultation, your relocation plan begins.',
              ].map((step, i) => (
                <div key={i} style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                  <div style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    backgroundColor: '#0A1E3D',
                    color: '#C5B783',
                    fontSize: '13px',
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    marginTop: '1px',
                  }}>
                    {i + 1}
                  </div>
                  <p style={{ fontSize: '14px', color: 'rgba(10,30,61,0.6)', margin: 0, lineHeight: 1.65 }}>
                    {step}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Book button */}
          <div style={{ marginBottom: '32px' }}>
            <a
              href={BOOKINGS_URL}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
                padding: '14px 32px',
                borderRadius: '10px',
                backgroundColor: '#0A1E3D',
                color: '#C5B783',
                fontSize: '15px',
                fontWeight: 600,
                textDecoration: 'none',
                transition: 'background 0.15s',
                fontFamily: '-apple-system, "SF Pro Display", sans-serif',
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.backgroundColor = '#112954' }}
              onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.backgroundColor = '#0A1E3D' }}
            >
              <CalendarDays size={17} />
              Book My Consultation
            </a>
          </div>

          {/* What we'll cover */}
          <div style={{
            background: 'rgba(197,183,131,0.06)',
            border: '0.5px solid rgba(197,183,131,0.15)',
            borderRadius: '12px',
            padding: '20px 24px',
            marginBottom: '32px',
          }}>
            <p style={{ fontSize: '10px', fontWeight: 600, letterSpacing: '1.5px', textTransform: 'uppercase', color: 'rgba(197,183,131,0.9)', margin: '0 0 14px' }}>
              What we&apos;ll cover in your consultation
            </p>
            <ul style={{ margin: 0, paddingLeft: '18px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {[
                'Your target communities and what makes each one right for your family',
                'Your financial picture and what it means for your search',
                'The full Navigator journey — all 10 stages and what to expect',
                'Your timeline, concerns, and anything else on your mind',
                'The Navigator Activation — what it unlocks and what it means for your journey',
              ].map((item, i) => (
                <li key={i} style={{ fontSize: '14px', color: 'rgba(10,30,61,0.6)', lineHeight: 1.65 }}>
                  {item}
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/* Card footer */}
        <div style={{
          padding: '20px 48px 32px',
          borderTop: '0.5px solid rgba(10,30,61,0.07)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <span style={{ fontSize: '12px', color: 'rgba(10,30,61,0.25)' }}>
            HavenQuest · Navigator Portal
          </span>
        </div>
      </div>
    </div>
  )
}
