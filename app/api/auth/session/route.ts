import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function POST(request: NextRequest) {
  const { access_token } = await request.json()
  if (!access_token) {
    return NextResponse.json({ error: 'Missing token' }, { status: 400 })
  }

  const cookieStore = await cookies()
  cookieStore.set('hq_auth', access_token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7,
    path: '/',
  })

  return NextResponse.json({ success: true })
}

export async function DELETE() {
  const cookieStore = await cookies()
  cookieStore.delete('hq_auth')
  return NextResponse.json({ success: true })
}
