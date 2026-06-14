import { NextRequest, NextResponse } from 'next/server'
import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'
import { createServerClient } from '../../../../lib/supabase/server'

function getServiceClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) throw new Error('Supabase not configured')
  return createSupabaseClient(url, key, { auth: { persistSession: false } })
}

export async function PATCH(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const accessToken = cookieStore.get('hq_auth')?.value
    if (!accessToken) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const callerClient = createServerClient(accessToken)
    const { data: caller } = await callerClient.from('users').select('user_role, email').single()
    if (caller?.user_role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

    const body = await request.json() as { client_email: string; md_email: string | null }
    const { client_email, md_email } = body

    if (!client_email) return NextResponse.json({ error: 'client_email is required' }, { status: 400 })

    const supabase = getServiceClient()

    await supabase
      .from('md_clients')
      .update({ status: 'closed' })
      .eq('client_email', client_email.toLowerCase())
      .eq('status', 'active')

    if (md_email) {
      await supabase.from('md_clients').insert({
        md_email: md_email.toLowerCase(),
        client_email: client_email.toLowerCase(),
        status: 'active',
        journey_health: 'on_track',
      })
    }

    await supabase.from('admin_audit_log').insert({
      admin_email: caller.email,
      action: md_email ? 'assign_client' : 'unassign_client',
      target_email: client_email,
      details: { md_email: md_email ?? null },
    })

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[assign-client] error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
