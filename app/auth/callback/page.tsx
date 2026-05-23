'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '../../../lib/supabase/client'

export default function AuthCallbackPage() {
  const router = useRouter()

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session?.access_token) {
        await fetch('/api/auth/session', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ access_token: session.access_token }),
        })
        router.replace('/portal')
      } else {
        router.replace('/login?error=expired')
      }
    })
  }, [router])

  return (
    <div className="min-h-screen bg-[#08101C] flex items-center justify-center">
      <div className="text-center">
        <div className="w-7 h-7 border-2 border-blue-400/20 border-t-blue-400 rounded-full animate-spin mx-auto mb-4" />
        <p className="text-white/40 text-sm">Setting up your portal…</p>
      </div>
    </div>
  )
}
