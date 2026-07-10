import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createClient as createSupabaseClient } from '@supabase/supabase-js'

function getServiceClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) throw new Error('Supabase not configured')
  return createSupabaseClient(url, key, { auth: { persistSession: false } })
}

function getEmailFromToken(token: string): string | null {
  try {
    const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')
    const payload = JSON.parse(Buffer.from(base64, 'base64').toString('utf8')) as Record<string, unknown>
    return typeof payload.email === 'string' ? payload.email : null
  } catch {
    return null
  }
}

// POST /api/portal/activity
// Append one MM3 activity event for the authenticated user.
//
// user_email is derived server-side from the hq_auth session and is NEVER read from the
// request body -- a client must never be able to attribute an event to another user.
//
// NOTE: this endpoint ships with zero call sites; instrumentation happens in later briefs,
// gated behind the Phase 4 consent/disclosure review. Batching multiple events per request
// is a later optimization -- intentionally not built here.
export async function POST(req: NextRequest) {
  try {
    const cookieStore = await cookies()
    const accessToken = cookieStore.get('hq_auth')?.value
    if (!accessToken) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const email = getEmailFromToken(accessToken)
    if (!email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = (await req.json().catch(() => null)) as
      | { event_type?: unknown; payload?: unknown }
      | null

    const eventType = body?.event_type
    if (typeof eventType !== 'string' || eventType.trim() === '') {
      return NextResponse.json({ error: 'event_type is required' }, { status: 400 })
    }

    const rawPayload = body?.payload
    if (
      rawPayload !== undefined &&
      (typeof rawPayload !== 'object' || rawPayload === null || Array.isArray(rawPayload))
    ) {
      return NextResponse.json({ error: 'payload must be an object' }, { status: 400 })
    }
    const payload = (rawPayload ?? {}) as Record<string, unknown>

    const supabase = getServiceClient()
    const { error: insertErr } = await supabase.from('mm3_activity_events').insert({
      user_email: email.toLowerCase(),
      event_type: eventType,
      payload,
    })

    if (insertErr) {
      console.error('[portal/activity] insert error:', insertErr)
      return NextResponse.json({ error: 'Failed to record event' }, { status: 500 })
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[portal/activity] error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
