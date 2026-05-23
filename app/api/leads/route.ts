import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { Resend } from 'resend'
import { buildRealtorIntroHtml, buildLeadNotificationHtml } from '../../../services/emailService'

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !key) throw new Error('Supabase not configured')
  return createClient(url, key)
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      userId,
      city,
      realtorId,
      eventType = 'zillow_click',
      firstName,
      email,
      movingTimeline,
      realtorName,
      realtorPhone,
      realtorWebsite,
    } = body

    const supabase = getSupabase()

    const { error: insertError } = await supabase.from('leads').insert({
      user_id: userId || null,
      city,
      realtor_id: realtorId || null,
      event_type: eventType,
      status: 'new',
    })
    if (insertError) console.error('Lead insert error:', insertError)

    if (eventType === 'realtor_contact' && email && realtorName) {
      const resendKey = process.env.RESEND_API_KEY
      if (resendKey) {
        const resend = new Resend(resendKey)

        await resend.emails.send({
          from: 'HavenQuest <noreply@havenquest.co>',
          to: email,
          subject: `Your matched realtors in ${city}, ${firstName}`,
          html: buildRealtorIntroHtml({
            firstName: firstName || 'there',
            email,
            city,
            realtorName,
            realtorPhone: realtorPhone || 'See website',
            realtorWebsite: realtorWebsite || '',
          }),
        }).catch(err => console.error('Resend intro email error:', err))

        const adminEmail = process.env.RESEND_ADMIN_EMAIL
        if (adminEmail) {
          await resend.emails.send({
            from: 'HavenQuest <noreply@havenquest.co>',
            to: adminEmail,
            subject: `New HavenQuest lead — ${city} — ${movingTimeline || 'unknown'}`,
            html: buildLeadNotificationHtml({
              firstName: firstName || 'Unknown',
              city,
              profile: { movingTimeline, annualIncome: 0, householdSize: '1', housingPreference: 'rent2br', mustHaves: [], niceToHaves: [], notPriorities: [] },
              matchScore: 0,
              timeline: movingTimeline || 'unknown',
            }),
          }).catch(err => console.error('Resend lead notification error:', err))
        }
      }
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Leads route error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
