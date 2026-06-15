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

export async function PATCH(req: NextRequest) {
  try {
    const cookieStore = await cookies()
    const accessToken = cookieStore.get('hq_auth')?.value
    if (!accessToken) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const email = getEmailFromToken(accessToken)
    if (!email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const supabase = getServiceClient()

    const { data: callerUser, error: callerErr } = await supabase
      .from('users')
      .select('email, first_name, md_email')
      .eq('email', email.toLowerCase())
      .single()

    if (callerErr || !callerUser?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json() as {
      first_name?: string
      last_name?: string
      phone?: string
      partner_name?: string
      origin_city?: string
      origin_state?: string
      household_size?: string
      annual_income?: number
      profile_photo_url?: string
      changed_fields?: string[]
    }

    const { changed_fields, ...updateFields } = body

    if (Object.keys(updateFields).length === 0) {
      return NextResponse.json({ error: 'No fields to update' }, { status: 400 })
    }

    const { error: updateErr } = await supabase
      .from('users')
      .update(updateFields)
      .eq('email', callerUser.email.toLowerCase())

    if (updateErr) {
      console.error('[update-profile] update error:', updateErr)
      return NextResponse.json({ error: 'Failed to save profile' }, { status: 500 })
    }

    if (callerUser.md_email && changed_fields?.length) {
      const clientFirstName = (updateFields.first_name ?? callerUser.first_name ?? 'Your client') as string
      const fieldList = changed_fields.join(', ')
      const messageBody = `Profile update: ${clientFirstName} updated their profile. Changed fields: ${fieldList}.`

      await supabase.from('messages').insert({
        client_email: callerUser.email.toLowerCase(),
        md_email: callerUser.md_email.toLowerCase(),
        sender_role: 'system',
        subject: 'Client profile updated',
        body: messageBody,
        read: false,
        notification_sent: false,
      })
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[update-profile] error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
