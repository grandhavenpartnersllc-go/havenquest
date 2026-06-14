import type { ReactNode } from 'react'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { createServerClient } from '../../../../lib/supabase/server'
import AdminTopBar from '../components/AdminTopBar'
import AdminSidebar from '../components/AdminSidebar'
import AdminAccessGate from '../components/AdminAccessGate'

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const cookieStore = await cookies()
  const accessToken = cookieStore.get('hq_auth')?.value
  if (!accessToken) redirect('/compass/admin/login')

  const supabase = createServerClient(accessToken)
  const { data: user } = await supabase
    .from('users')
    .select('user_role, email')
    .single()

  if (user?.user_role !== 'admin') redirect('/compass/admin/login')

  return (
    <AdminAccessGate>
      <div style={{ minHeight: '100vh', backgroundColor: '#F5F5F5', display: 'flex', flexDirection: 'column' }}>
        <AdminTopBar email={user.email ?? ''} />
        <div style={{ display: 'flex', flex: 1 }}>
          <AdminSidebar />
          <main style={{ flex: 1, overflow: 'auto' }}>
            {children}
          </main>
        </div>
      </div>
    </AdminAccessGate>
  )
}
