import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) throw new Error('Supabase not configured')
  return createClient(url, key, { auth: { persistSession: false } })
}

export async function POST(request: NextRequest) {
  try {
    const { firstName, originZip } = await request.json()
    if (!firstName || !originZip) {
      return NextResponse.json({ error: 'firstName and originZip required' }, { status: 400 })
    }
    const supabase = getSupabase()
    await supabase.from('quiz_sessions').insert({
      id: crypto.randomUUID(),
      first_name: String(firstName).trim(),
      origin_zip: String(originZip).trim(),
      last_step: 1,
      started_at: new Date().toISOString(),
      completed: false,
    })
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[quiz-sessions POST] error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const { originZip, completed, lastStep } = await request.json()
    if (!originZip) {
      return NextResponse.json({ error: 'originZip required' }, { status: 400 })
    }
    const supabase = getSupabase()
    const update: Record<string, unknown> = {}
    if (typeof completed === 'boolean') update.completed = completed
    if (typeof lastStep === 'number') update.last_step = lastStep
    await supabase
      .from('quiz_sessions')
      .update(update)
      .eq('origin_zip', originZip)
      .eq('completed', false)
      .order('started_at', { ascending: false })
      .limit(1)
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[quiz-sessions PATCH] error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
