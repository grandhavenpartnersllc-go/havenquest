'use client'

import { useEffect, useState } from 'react'
import { createClient } from '../../../../lib/supabase/client'

export default function AdminAccessGate({ children }: { children: React.ReactNode }) {
  const [verified, setVerified] = useState(false)

  useEffect(() => {
    if (sessionStorage.getItem('hq_admin_verified') === 'true') {
      setVerified(true)
    } else {
      createClient().auth.signOut().then(() => {
        window.location.replace('/compass/admin/login')
      })
    }
  }, [])

  if (!verified) return null
  return <>{children}</>
}
