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

export async function DELETE(req: NextRequest) {
  try {
    const cookieStore = await cookies()
    const accessToken = cookieStore.get('hq_auth')?.value
    if (!accessToken) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const callerClient = createServerClient(accessToken)
    const { data: caller } = await callerClient
      .from('users')
      .select('user_role, email')
      .single()

    if (caller?.user_role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { email, userId } = await req.json() as { email: string; userId?: string | null }
    if (!email) return NextResponse.json({ error: 'email is required' }, { status: 400 })

    const supabase = getServiceClient()

    await supabase.from('staff_accounts').delete().eq('email', email.toLowerCase())
    await supabase.from('users').delete().eq('email', email.toLowerCase())

    if (userId) {
      await supabase.auth.admin.deleteUser(userId)
    }

    await supabase.from('admin_audit_log').insert({
      admin_email: caller.email,
      action: 'delete_staff',
      target_email: email,
      details: { deleted_at: new Date().toISOString() },
    })

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[delete-staff] error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
