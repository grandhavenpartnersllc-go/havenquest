import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { Resend } from 'resend'
import { buildRealtorApplicationHtml } from '../../../services/emailService'

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !key) throw new Error('Supabase not configured')
  return createClient(url, key)
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, phone, markets, yearsExperience, brokerage, profileUrl } = body

    if (!name || !email) {
      return NextResponse.json({ error: 'Name and email are required' }, { status: 400 })
    }

    const supabase = getSupabase()

    await supabase.from('realtor_applications').insert({
      name,
      email: email.toLowerCase(),
      phone: phone || null,
      markets: markets || null,
      years_experience: parseInt(yearsExperience, 10) || null,
      brokerage: brokerage || null,
      profile_url: profileUrl || null,
      status: 'pending',
    })

    const resendKey = process.env.RESEND_API_KEY
    const adminEmail = process.env.RESEND_ADMIN_EMAIL
    if (resendKey && adminEmail) {
      const resend = new Resend(resendKey)
      await resend.emails.send({
        from: 'HavenQuest <noreply@havenquest.co>',
        to: adminEmail,
        subject: `New realtor application — ${name} — ${markets || 'markets TBD'}`,
        html: buildRealtorApplicationHtml({ name, email, phone, markets, yearsExperience, brokerage, profileUrl }),
      }).catch(err => console.error('Resend error:', err))
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Realtor applications route error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
