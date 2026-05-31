import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { Resend } from 'resend'
import { buildRealtorApplicationHtml, buildRealtorConfirmationHtml } from '../../../services/emailService'

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
      firstName, lastName, email, phone, marketSpecialty, token,
      brokerage, yearsExperience, trecLicenseNumber, licenseType, profileUrl,
      marketSegments,
      buyerTransactionCount, buyerTransactionVolume,
      sellerTransactionCount, sellerTransactionVolume,
      standardsAcknowledged, whyJoin,
    } = body

    if (!firstName || !lastName || !email) {
      return NextResponse.json({ error: 'Name and email are required' }, { status: 400 })
    }
    if (!trecLicenseNumber) {
      return NextResponse.json({ error: 'TREC license number is required' }, { status: 400 })
    }
    if (!licenseType) {
      return NextResponse.json({ error: 'License type is required' }, { status: 400 })
    }
    if (standardsAcknowledged !== true) {
      return NextResponse.json({ error: 'You must acknowledge the partner standards' }, { status: 400 })
    }
    if (!token) {
      return NextResponse.json({ error: 'Invalid application link' }, { status: 400 })
    }

    const supabase = getSupabase()

    const { data: interestRecord } = await supabase
      .from('realtor_interest')
      .select('id')
      .eq('token', token)
      .eq('token_used', false)
      .single()

    if (!interestRecord) {
      return NextResponse.json({ error: 'This application link has expired or is invalid.' }, { status: 400 })
    }

    await supabase.from('realtor_applications').insert({
      name: `${firstName} ${lastName}`,
      email: email.toLowerCase(),
      phone: phone || null,
      market_specialty: marketSpecialty || null,
      years_experience: parseInt(yearsExperience, 10) || null,
      brokerage: brokerage || null,
      profile_url: profileUrl || null,
      trec_license_number: trecLicenseNumber,
      license_type: licenseType,
      why_join: whyJoin || null,
      buyer_transaction_count: buyerTransactionCount || null,
      buyer_transaction_volume: buyerTransactionVolume || null,
      seller_transaction_count: sellerTransactionCount || null,
      seller_transaction_volume: sellerTransactionVolume || null,
      market_segments: marketSegments || null,
      standards_acknowledged: standardsAcknowledged,
      interest_token: token,
      status: 'pending',
    })

    await supabase
      .from('realtor_interest')
      .update({ token_used: true })
      .eq('token', token)

    const resendKey = process.env.RESEND_API_KEY
    if (resendKey) {
      const resend = new Resend(resendKey)

      try {
        await resend.emails.send({
          from: 'Craig Asbach, Founder - HavenQuest <craig.asbach@havenquest.co>',
          replyTo: 'craig.asbach@havenquest.co',
          to: email.toLowerCase(),
          subject: 'Application received — HavenQuest Partner Network',
          html: buildRealtorConfirmationHtml(firstName),
        })
      } catch (err) {
        console.error('Resend confirmation error:', err)
      }

      try {
        await resend.emails.send({
          from: 'HavenQuest <admin@send.havenquest.co>',
          to: 'craig.asbach@havenquest.co',
          subject: `New Realtor Application — ${firstName} ${lastName} — ${marketSpecialty || 'No market specified'}`,
          html: buildRealtorApplicationHtml({
            firstName, lastName, email, phone, marketSpecialty,
            brokerage, trecLicenseNumber, licenseType,
            yearsExperience, profileUrl, marketSegments,
            buyerTransactionCount, buyerTransactionVolume,
            sellerTransactionCount, sellerTransactionVolume,
            whyJoin, standardsAcknowledged,
          }),
        })
      } catch (err) {
        console.error('Resend admin notification error:', err)
      }
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Realtor applications route error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
