import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { Resend } from 'resend'
import { buildWelcomeEmailHtml } from '../../../services/emailService'
import { calculateFunctionalFitScore, buildClientBuckets } from '../../../services/matchingService'
import { getAllCities } from '../../../services/locationService'
import type { ArchetypeKey, DNAScores, DNABucket } from '../../../types'

// weightingProfile is identical for every city for one client (Brief 2a Part 5) —
// any city works as the throwaway argument; only the weightingProfile half of the
// return value is used here.
function computeWeightingProfile(
  archetype: string | undefined,
  mustHaves: (keyof DNAScores)[] | undefined,
  niceToHaves: (keyof DNAScores)[] | undefined,
  notPriorities: (keyof DNAScores)[] | undefined
) {
  const validArchetypes: ArchetypeKey[] = ['family', 'firsttime', 'executive', 'luxury', 'retiree', 'youngpro', 'general']
  const resolvedArchetype: ArchetypeKey = (validArchetypes as string[]).includes(archetype ?? '')
    ? (archetype as ArchetypeKey)
    : 'general'
  const buckets: Record<keyof DNAScores, DNABucket> = buildClientBuckets({
    annualIncome: 0,
    householdSize: '1',
    movingTimeline: 'exploring',
    mustHaves: mustHaves ?? [],
    niceToHaves: niceToHaves ?? [],
    notPriorities: notPriorities ?? [],
  })
  const anyCity = getAllCities()[0]
  return calculateFunctionalFitScore(anyCity, resolvedArchetype, buckets).weightingProfile
}

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) throw new Error('Supabase not configured')
  return createClient(url, key, { auth: { persistSession: false } })
}

async function sendWelcomeAndRespond(
  userId: string,
  firstName: string,
  email: string,
  topCityMatches: { cityName: string; matchScore: number }[] | undefined,
  setupLink: string | undefined,
  isReturningUser: boolean
) {
  const resendKey = process.env.RESEND_API_KEY
  if (resendKey && topCityMatches?.length) {
    try {
      const resend = new Resend(resendKey)
      const fakeMatches = topCityMatches.map(m => ({
        location: { name: m.cityName },
        matchScore: m.matchScore,
      }))
      await resend.emails.send({
        from: 'HavenQuest <admin@send.havenquest.co>',
        to: email,
        subject: `Your HavenQuest report is ready, ${firstName}`,
        html: buildWelcomeEmailHtml({ firstName, email, matches: fakeMatches as never, setupLink }),
      })
    } catch (err) {
      console.error('Resend error:', err)
    }
  }
  return NextResponse.json({ success: true, userId, setupLink, isReturningUser })
}

export async function PATCH(request: NextRequest) {
  try {
    const { email, topCityMatches, archetype, mustHaves, niceToHaves, notPriorities, personalityPreference } = await request.json()
    if (!email || !Array.isArray(topCityMatches)) {
      return NextResponse.json({ error: 'email and topCityMatches required' }, { status: 400 })
    }
    const weightingProfile = computeWeightingProfile(archetype, mustHaves, niceToHaves, notPriorities)
    const supabase = getSupabase()
    await supabase
      .from('users')
      .update({
        top_city_matches: topCityMatches,
        dna_weighting_profile: weightingProfile,
        ...(personalityPreference && {
          growth_profile: personalityPreference.growthProfile ?? null,
          pace: personalityPreference.pace ?? null,
          culture: personalityPreference.culture ?? null,
          environment: personalityPreference.environment ?? null,
          lifestyle_orientation: personalityPreference.lifestyleOrientation ?? null,
        }),
      })
      .eq('email', (email as string).toLowerCase())
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[users PATCH] error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      firstName,
      email,
      phone,
      movingTimeline,
      annualIncome,
      householdSize,
      housingPreference,
      mustHaves,
      niceToHaves,
      notPriorities,
      archetype,
      topCityMatches,
      buyerProfile,
      financialPicture,
      personalityPreference,
    } = body

    const isActiveBuyer =
      financialPicture?.purchase_timeline === '0-3months' ||
      financialPicture?.purchase_timeline === '3-6months'

    const weightingProfile = computeWeightingProfile(archetype, mustHaves, niceToHaves, notPriorities)

    if (!firstName || !email) {
      return NextResponse.json({ error: 'First name and email are required' }, { status: 400 })
    }

    const supabase = getSupabase()

    // Create Supabase auth account
    let authUserId: string | null = null
    let setupLink: string | undefined
    let isExistingAuthUser = false
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: email.toLowerCase(),
      email_confirm: true,
    })
    if (authError) {
      console.error('Auth user creation error:', authError.message)
      // User already exists in Auth — generateLink recovers their UUID and produces a setup link
      const { data: linkData, error: linkError } = await supabase.auth.admin.generateLink({
        type: 'recovery',
        email: email.toLowerCase(),
        options: { redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback` },
      })
      if (linkError) {
        console.error('Generate link (recovery) error:', linkError.message)
      } else {
        authUserId = linkData.user.id
        setupLink = linkData.properties.action_link
        isExistingAuthUser = true
      }
    } else {
      authUserId = authData.user?.id ?? null
      // Generate password-setup link
      const { data: linkData, error: linkError } = await supabase.auth.admin.generateLink({
        type: 'recovery',
        email: email.toLowerCase(),
        options: { redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback` },
      })
      if (linkError) {
        console.error('Generate link error:', linkError.message)
      } else {
        setupLink = linkData.properties.action_link
      }
    }

    // Distinguish partial account (auth exists, public record missing) from genuine returning user
    let isReturningUser = false
    if (isExistingAuthUser) {
      const { data: existingPublicUser } = await supabase
        .from('users')
        .select('email')
        .eq('email', email.toLowerCase())
        .single()
      isReturningUser = !!existingPublicUser
    }

    const { data, error } = await supabase
      .from('users')
      .upsert(
        {
          first_name: firstName,
          email: email.toLowerCase(),
          phone: phone || null,
          annual_income: annualIncome,
          household_size: householdSize,
          housing_preference: housingPreference,
          moving_timeline: movingTimeline,
          must_haves: mustHaves,
          nice_to_haves: niceToHaves,
          not_priorities: notPriorities,
          archetype: archetype ?? null,
          dna_weighting_profile: weightingProfile,
          top_city_matches: topCityMatches,
          buyer_profile: buyerProfile ?? null,
          financial_picture: financialPicture
            ? { ...financialPicture, is_active_buyer: isActiveBuyer }
            : null,
          ...(personalityPreference && {
            growth_profile: personalityPreference.growthProfile ?? null,
            pace: personalityPreference.pace ?? null,
            culture: personalityPreference.culture ?? null,
            environment: personalityPreference.environment ?? null,
            lifestyle_orientation: personalityPreference.lifestyleOrientation ?? null,
          }),
          ...(authUserId ? { auth_id: authUserId } : {}),
        },
        { onConflict: 'email', ignoreDuplicates: false }
      )
      .select('id')
      .single()

    if (error) {
      console.error('Upsert error:', error.code, error.message)
      // PostgREST PGRST204: auth_id column not in schema cache — retry without it
      if (error.code === 'PGRST204' && authUserId) {
        const { data: retryData, error: retryError } = await supabase
          .from('users')
          .upsert(
            {
              first_name: firstName,
              email: email.toLowerCase(),
              phone: phone || null,
              annual_income: annualIncome,
              household_size: householdSize,
              housing_preference: housingPreference,
              moving_timeline: movingTimeline,
              must_haves: mustHaves,
              nice_to_haves: niceToHaves,
              not_priorities: notPriorities,
              archetype: archetype ?? null,
              dna_weighting_profile: weightingProfile,
              top_city_matches: topCityMatches,
              buyer_profile: buyerProfile ?? null,
              financial_picture: financialPicture
                ? { ...financialPicture, is_active_buyer: isActiveBuyer }
                : null,
              ...(personalityPreference && {
                growth_profile: personalityPreference.growthProfile ?? null,
                pace: personalityPreference.pace ?? null,
                culture: personalityPreference.culture ?? null,
                environment: personalityPreference.environment ?? null,
                lifestyle_orientation: personalityPreference.lifestyleOrientation ?? null,
              }),
            },
            { onConflict: 'email', ignoreDuplicates: false }
          )
          .select('id')
          .single()
        if (retryError) {
          console.error('Retry insert error:', retryError.code, retryError.message)
          return NextResponse.json({ error: 'Failed to save your information. Please try again.' }, { status: 500 })
        }
        return await sendWelcomeAndRespond(authUserId ?? retryData.id, firstName, email, topCityMatches, setupLink, isReturningUser)
      }
      return NextResponse.json({ error: 'Failed to save your information. Please try again.' }, { status: 500 })
    }

    // Return authUserId (Supabase auth UUID) not data.id (Postgres row UUID) —
    // the client needs authUserId to call auth.admin.updateUserById for password creation.
    return await sendWelcomeAndRespond(authUserId ?? data.id, firstName, email, topCityMatches, setupLink, isReturningUser)
  } catch (err) {
    console.error('Users route error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
