import type { ReactNode } from 'react'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { createServerClient } from '../../../lib/supabase/server'
import MDTopBar from '../components/MDTopBar'

export default async function MDPortalLayout({ children }: { children: ReactNode }) {
  const cookieStore = await cookies()
  const accessToken = cookieStore.get('hq_auth')?.value
  if (!accessToken) redirect('/compass/meridian/login')

  const supabase = createServerClient(accessToken)
  const { data: user } = await supabase
    .from('users')
    .select('user_role, first_name, email')
    .single()

  if (user?.user_role !== 'market_director') redirect('/compass/meridian/login')

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F5F5F5', display: 'flex', flexDirection: 'column' }}>
      <MDTopBar firstName={user.first_name ?? 'MD'} email={user.email ?? ''} />
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {children}
      </main>
    </div>
  )
}
