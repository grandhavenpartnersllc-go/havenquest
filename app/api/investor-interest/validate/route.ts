import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Token validation + visit stamping for the private investor slug. SERVICE-ROLE, server-side only —
// the token list and any PII are NEVER shipped to the client; the response is just { valid: boolean }.
// Called by BetaGate when /investor-9k2x7q is loaded with a ?token=. A valid token records the visit
// (first_visited_at once, last_visited_at = now, visit_count++) and returns { valid: true }; a missing/
// unknown token — or any error (e.g. env not configured) — returns { valid: false } so access fails safe.

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
    if (!token) return NextResponse.json({ valid: false })

    const supabase = getSupabaseServiceRole()
    const { data } = await supabase
      .from('investor_interest')
      .select('id, first_visited_at, visit_count')
      .eq('token', token)
      .single()

    if (!data) return NextResponse.json({ valid: false })

    const now = new Date().toISOString()
    await supabase
      .from('investor_interest')
      .update({
        first_visited_at: data.first_visited_at ?? now,
        last_visited_at: now,
        visit_count: (data.visit_count ?? 0) + 1,
      })
      .eq('token', token)

    return NextResponse.json({ valid: true })
  } catch (err) {
    console.error('Investor validate route error:', err)
    return NextResponse.json({ valid: false })
  }
}
