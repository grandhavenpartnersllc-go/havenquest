'use client'

import { useState, useEffect } from 'react'
import { createClient } from '../../lib/supabase/client'
import { LOCAL_NOTES_KEY } from '../../utils/constants'

export default function NotesArea() {
  const [notes, setNotes] = useState('')
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem(LOCAL_NOTES_KEY)
    if (stored) setNotes(stored)
    ;(async () => {
      try {
        const supabase = createClient()
        const { data: { session } } = await supabase.auth.getSession()
        if (!session?.user?.email) return
        const { data: ud } = await supabase
          .from('users')
          .select('portal_notes')
          .eq('email', session.user.email.toLowerCase())
          .single()
        if (ud?.portal_notes) setNotes(ud.portal_notes)
      } catch {}
    })()
  }, [])

  const handleBlur = async () => {
    localStorage.setItem(LOCAL_NOTES_KEY, notes)
    try {
      const supabase = createClient()
      const { data: { session } } = await supabase.auth.getSession()
      if (session?.user?.email) {
        await supabase
          .from('users')
          .update({ portal_notes: notes })
          .eq('email', session.user.email.toLowerCase())
      }
    } catch {}
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-sm" style={{ color: '#1C1814' }}>Private notes</h3>
        {saved && (
          <span
            className="text-[10px] font-bold uppercase px-2.5 py-1 rounded-full"
            style={{ backgroundColor: 'rgba(90,138,42,0.1)', color: '#5A8A2A', letterSpacing: '0.1em' }}
          >
            Saved
          </span>
        )}
      </div>
      <textarea
        value={notes}
        onChange={e => setNotes(e.target.value)}
        onBlur={handleBlur}
        placeholder="Neighborhoods to research, questions for realtors, things to compare…"
        rows={5}
        className="w-full rounded-xl px-4 py-3 text-sm resize-y outline-none transition-all"
        style={{
          backgroundColor: 'rgba(0,0,0,0.025)',
          border: '1.5px solid rgba(0,0,0,0.08)',
          color: '#1C1814',
        }}
        onFocus={e => { e.currentTarget.style.borderColor = '#B8912A'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(184,145,42,0.1)' }}
        onBlurCapture={e => { e.currentTarget.style.borderColor = 'rgba(0,0,0,0.08)'; e.currentTarget.style.boxShadow = 'none' }}
      />
      <p className="text-xs mt-1.5" style={{ color: '#9A8E82' }}>Saves automatically when you click away</p>
    </div>
  )
}
