import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { Resend } from 'resend'
import { buildStage1RealtorEmailHtml, buildStage1CraigNotificationHtml } from '../../../services/emailService'

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !key) throw new Error('Supabase not configured')
  return createClient(url, key)
}

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get('token')
  if (!token) {
    return NextResponse.json({ error: 'Token required' }, { status: 400 })
  }

  const supabase = getSupabase()
  const { data } = await supabase
    .from('realtor_interest')
    .select('first_name, last_name, email, phone, market_specialty')
    .eq('token', token)
    .eq('token_used', false)
    .single()

  if (!data) {
    return NextResponse.json({ error: 'Invalid or expired token' }, { status: 404 })
  }

  return NextResponse.json({
    firstName: data.first_name,
    lastName: data.last_name,
    email: data.email,
    phone: data.phone ?? '',
    marketSpecialty: data.market_specialty ?? '',
  })
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { firstName, lastName, email, phone, marketSpecialty, referralSource } = body

    if (!firstName || !lastName || !email) {
      return NextResponse.json({ error: 'First name, last name, and email are required' }, { status: 400 })
    }

    const token = crypto.randomUUID()
    const supabase = getSupabase()

    await supabase.from('realtor_interest').insert({
      first_name: firstName,
      last_name: lastName,
      email: email.toLowerCase(),
      phone: phone || null,
      market_specialty: marketSpecialty || null,
      referral_source: referralSource || null,
      token,
    })

    const resendKey = process.env.RESEND_API_KEY
    if (resendKey) {
      const resend = new Resend(resendKey)

      try {
        await resend.emails.send({
          from: 'Craig Asbach, Founder - HavenQuest <craig.asbach@havenquest.co>',
          replyTo: 'craig.asbach@havenquest.co',
          to: email.toLowerCase(),
          subject: 'Your invitation to apply — HavenQuest Partner Network',
          html: buildStage1RealtorEmailHtml(firstName, token),
        })
      } catch (err) {
        console.error('Resend Stage 1 realtor email error:', err)
      }

      try {
        await resend.emails.send({
          from: 'HavenQuest <admin@send.havenquest.co>',
          to: 'craig.asbach@havenquest.co',
          subject: `New Realtor Interest — ${firstName} ${lastName}`,
          html: buildStage1CraigNotificationHtml({ firstName, lastName, email, phone, marketSpecialty, referralSource }),
        })
      } catch (err) {
        console.error('Resend Stage 1 Craig notification error:', err)
      }
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Realtor interest route error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
