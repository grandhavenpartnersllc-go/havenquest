import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { createServerClient } from '../../lib/supabase/server'

export const dynamic = 'force-dynamic'

interface CurrentMMRow {
  current_milemarker: number | null
  welcome_seen: boolean | null
}

export default async function PortalPage() {
  const cookieStore = await cookies()
  const accessToken = cookieStore.get('hq_auth')?.value

  if (!accessToken) redirect('/login')

  const supabase = createServerClient(accessToken)

  const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken)

  if (authError || !user?.email) redirect('/login')

  const { data } = await supabase
    .from('users')
    .select('current_milemarker, welcome_seen')
    .eq('email', user.email.toLowerCase())
    .single()

  const row = data as CurrentMMRow | null

  if (!row?.welcome_seen) redirect('/portal/welcome')

  const mm = row?.current_milemarker

  if (typeof mm === 'number' && mm >= 1 && mm <= 10) {
    redirect(`/portal/mm${mm}`)
  }

  redirect('/portal/mm1')
}
