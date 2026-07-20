import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// "Keep me updated" opt-in for the investor overview. SERVICE-ROLE, server-side only. POST { token }
// flips email_opt_in = true on that row. Returns { success: true, optedIn: true } for a matched token,
// 404 { success: false } for an unknown token, 400 for a missing token. Token is unguessable (uuid),
// so possession of it is the authorization; the token list is never exposed to the client.

function getSupabaseServiceRole() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) throw new Error('Supabase not configured')
  return createClient(url, key, { auth: { persistSession: false } })
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}))
    const token = typeof body?.token === 'string' ? body.token : ''
    if (!token) return NextResponse.json({ success: false }, { status: 400 })

    const supabase = getSupabaseServiceRole()
    const { data, error } = await supabase
      .from('investor_interest')
      .update({ email_opt_in: true })
      .eq('token', token)
      .select('id')

    if (error) throw error
    if (!data || data.length === 0) return NextResponse.json({ success: false }, { status: 404 })

    return NextResponse.json({ success: true, optedIn: true })
  } catch (err) {
    console.error('Investor opt-in route error:', err)
    return NextResponse.json({ success: false }, { status: 500 })
  }
}
