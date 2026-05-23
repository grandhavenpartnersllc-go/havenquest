import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(request: NextRequest) {
  const { userId, password } = await request.json()

  console.log('[set-password] userId received:', userId)
  console.log('[set-password] password length:', password?.length)

  if (!userId || !password || typeof password !== 'string' || password.length < 8) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  console.log('[set-password] SUPABASE_URL prefix:', url?.slice(0, 20))
  console.log('[set-password] SERVICE_ROLE_KEY present:', !!key)

  const supabase = createClient(url!, key!, {
    auth: { autoRefreshToken: false, persistSession: false },
  })

  const { error } = await supabase.auth.admin.updateUserById(userId, { password })

  if (error) {
    console.error('[set-password] FULL ERROR:', error.message, '| status:', error.status, '| name:', error.name)
    return NextResponse.json(
      { error: error.message, status: error.status, name: error.name },
      { status: 400 }
    )
  }

  console.log('[set-password] Password set successfully for userId:', userId)
  return NextResponse.json({ success: true })
}
