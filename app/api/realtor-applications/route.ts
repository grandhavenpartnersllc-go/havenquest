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
    const { name, email, phone, markets, yearsExperience, brokerage, profileUrl, trecLicenseNumber, licenseType, whyJoin, preferredTier } = body

    if (!name || !email) {
      return NextResponse.json({ error: 'Name and email are required' }, { status: 400 })
    }
    if (!trecLicenseNumber) {
      return NextResponse.json({ error: 'TREC license number is required' }, { status: 400 })
    }
    if (!licenseType) {
      return NextResponse.json({ error: 'License type is required' }, { status: 400 })
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
      trec_license_number: trecLicenseNumber,
      license_type: licenseType,
      why_join: whyJoin || null,
      preferred_tier: preferredTier || null,
      status: 'pending',
    })

    const resendKey = process.env.RESEND_API_KEY
    const adminEmail = process.env.RESEND_ADMIN_EMAIL
    if (resendKey && adminEmail) {
      const resend = new Resend(resendKey)
      await resend.emails.send({
        from: 'HavenQuest <admin@havenquest.co>',
        to: adminEmail,
        subject: `New realtor application — ${name} — ${markets || 'markets TBD'}`,
        html: buildRealtorApplicationHtml({ name, email, phone, markets, yearsExperience, brokerage, profileUrl, trecLicenseNumber, licenseType, whyJoin, preferredTier }),
      }).catch(err => console.error('Resend error:', err))
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Realtor applications route error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
