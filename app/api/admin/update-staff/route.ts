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

async function getAdminCaller(accessToken: string) {
  const callerClient = createServerClient(accessToken)
  const { data } = await callerClient.from('users').select('user_role, email').single()
  return data
}

export async function GET(_request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const accessToken = cookieStore.get('hq_auth')?.value
    if (!accessToken) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const caller = await getAdminCaller(accessToken)
    if (caller?.user_role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

    const supabase = getServiceClient()
    const { data: staff } = await supabase
      .from('staff_accounts')
      .select('*')
      .order('created_at', { ascending: false })

    return NextResponse.json({ staff: staff ?? [] })
  } catch (err) {
    console.error('[update-staff GET] error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const accessToken = cookieStore.get('hq_auth')?.value
    if (!accessToken) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const caller = await getAdminCaller(accessToken)
    if (caller?.user_role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

    const body = await request.json() as { email: string; status?: string; metro?: string | null; role?: string }
    const { email, status, metro, role } = body

    if (!email) return NextResponse.json({ error: 'email is required' }, { status: 400 })

    const supabase = getServiceClient()
    const updates: Record<string, unknown> = { updated_at: new Date().toISOString() }
    if (status !== undefined) updates.status = status
    if (metro !== undefined) updates.metro = metro
    if (role !== undefined) updates.role = role

    await supabase.from('staff_accounts').update(updates).eq('email', email.toLowerCase())

    if (role !== undefined) {
      await supabase.from('users').update({ user_role: role }).eq('email', email.toLowerCase())
    }

    await supabase.from('admin_audit_log').insert({
      admin_email: caller.email,
      action: 'update_staff',
      target_email: email,
      details: updates,
    })

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[update-staff PATCH] error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
