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

export async function POST(req: NextRequest) {
  try {
    const cookieStore = await cookies()
    const accessToken = cookieStore.get('hq_auth')?.value
    if (!accessToken) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const email = getEmailFromToken(accessToken)
    if (!email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const formData = await req.formData()
    const file = formData.get('file') as File | null
    if (!file) return NextResponse.json({ error: 'No file provided' }, { status: 400 })

    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: 'File must be an image' }, { status: 400 })
    }
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: 'Image must be under 5MB' }, { status: 400 })
    }

    const supabase = getServiceClient()
    const path = `${email.toLowerCase()}/avatar.jpg`
    const buffer = Buffer.from(await file.arrayBuffer())

    const { error: uploadErr } = await supabase.storage
      .from('profile-photos')
      .upload(path, buffer, { upsert: true, contentType: file.type })

    if (uploadErr) {
      console.error('[upload-photo] storage error:', uploadErr)
      return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
    }

    const { data: signedData, error: signErr } = await supabase.storage
      .from('profile-photos')
      .createSignedUrl(path, 31536000) // 1 year

    if (signErr || !signedData?.signedUrl) {
      console.error('[upload-photo] signed URL error:', signErr)
      return NextResponse.json({ error: 'Upload succeeded but could not generate URL' }, { status: 500 })
    }

    await supabase
      .from('users')
      .update({ profile_photo_url: signedData.signedUrl })
      .eq('email', email.toLowerCase())

    return NextResponse.json({ signedUrl: signedData.signedUrl })
  } catch (err) {
    console.error('[upload-photo] error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
