import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) throw new Error('Supabase not configured')
  return createClient(url, key, { auth: { persistSession: false } })
}

// Soft lead capture for Quiz UI Fix Batch 2 — inserts a bare email/first-name
// row into public.users if one doesn't already exist for that email, with no
// auth account and no welcome email. Distinct from POST /api/users, which
// creates the full portal account at the end of the quiz flow.
export async function POST(request: NextRequest) {
  try {
    const { firstName, email } = await request.json()
    if (!email) {
      return NextResponse.json({ error: 'email required' }, { status: 400 })
    }
    const supabase = getSupabase()
    await supabase.from('users').upsert(
      { email: String(email).toLowerCase(), first_name: firstName || null },
      { onConflict: 'email', ignoreDuplicates: true }
    )
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[quiz-lead POST] error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
