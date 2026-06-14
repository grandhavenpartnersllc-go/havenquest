import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { createServerClient } from '../../../../../../lib/supabase/server'
import ClientWorkspace from '../../../components/ClientWorkspace'
import type { MDClientWithProfile, Message } from '../../../../../../types'

interface Props {
  params: Promise<{ email: string }>
}

export default async function ClientWorkspacePage({ params }: Props) {
  const { email: encodedEmail } = await params
  const clientEmail = decodeURIComponent(encodedEmail)

  const cookieStore = await cookies()
  const accessToken = cookieStore.get('hq_auth')?.value
  if (!accessToken) redirect('/compass/meridian/login')

  const supabase = createServerClient(accessToken)

  const { data: mdUser } = await supabase
    .from('users')
    .select('email, first_name')
    .single()

  if (!mdUser?.email) redirect('/compass/meridian/login')

  const { data: assignment } = await supabase
    .from('md_clients')
    .select('*')
    .eq('md_email', mdUser.email)
    .eq('client_email', clientEmail)
    .single()

  if (!assignment) redirect('/compass/meridian/clients')

  const { data: userRow } = await supabase
    .from('users')
    .select('first_name, last_name, current_milemarker, annual_income, annual_income_override, created_at')
    .eq('email', clientEmail)
    .single()

  const { data: mm4 } = await supabase
    .from('mm4_profiles')
    .select('*')
    .eq('email', clientEmail)
    .maybeSingle()

  const { data: messages } = await supabase
    .from('messages')
    .select('*')
    .eq('client_email', clientEmail)
    .eq('md_email', mdUser.email)
    .order('created_at', { ascending: true })

  const { count: unread } = await supabase
    .from('messages')
    .select('id', { count: 'exact', head: true })
    .eq('client_email', clientEmail)
    .eq('md_email', mdUser.email)
    .eq('read', false)
    .eq('sender_role', 'client')

  const clientData: MDClientWithProfile = {
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
  }

  return (
    <ClientWorkspace
      client={clientData}
      mdEmail={mdUser.email}
      mdFirstName={mdUser.first_name ?? 'MD'}
      messages={(messages ?? []) as Message[]}
      clientJoinedAt={userRow?.created_at ?? assignment.assigned_at ?? ''}
    />
  )
}
