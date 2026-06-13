import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { createServerClient } from '../../../lib/supabase/server'
import ClientRoster from '../components/ClientRoster'
import type { MDClientWithProfile } from '../../../types'

export default async function ClientsPage() {
  const cookieStore = await cookies()
  const accessToken = cookieStore.get('hq_auth')?.value
  if (!accessToken) redirect('/md/login')

  const supabase = createServerClient(accessToken)

  const { data: mdUser } = await supabase
    .from('users')
    .select('email')
    .single()

  if (!mdUser?.email) redirect('/md/login')

  const { data: assignments } = await supabase
    .from('md_clients')
    .select('*')
    .eq('md_email', mdUser.email)
    .eq('status', 'active')
    .order('assigned_at', { ascending: false })

  const clients: MDClientWithProfile[] = []

  for (const assignment of assignments ?? []) {
    const { data: userRow } = await supabase
      .from('users')
      .select('first_name, last_name, current_milemarker, annual_income, annual_income_override')
      .eq('email', assignment.client_email)
      .single()

    const { data: mm4 } = await supabase
      .from('mm4_profiles')
      .select('*')
      .eq('email', assignment.client_email)
      .maybeSingle()

    const { count: unread } = await supabase
      .from('messages')
      .select('id', { count: 'exact', head: true })
      .eq('client_email', assignment.client_email)
      .eq('md_email', mdUser.email)
      .eq('read', false)
      .eq('sender_role', 'client')

    clients.push({
      assignment,
      profile: {
        annualIncome: userRow?.annual_income_override ?? userRow?.annual_income ?? 0,
        householdSize: '1',
        movingTimeline: 'exploring',
        mustHaves: [],
        niceToHaves: [],
        notPriorities: [],
      },
      mm4Profile: mm4 ?? undefined,
      currentMM: userRow?.current_milemarker ?? 1,
      unreadMessages: unread ?? 0,
    })
  }

  return <ClientRoster clients={clients} mdEmail={mdUser.email} />
}
