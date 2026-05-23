import type { Metadata } from 'next'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import StarterPortal from '../../components/portal/StarterPortal'

export const metadata: Metadata = {
  title: 'Your Portal — HavenQuest',
  description: 'Your private Texas relocation intelligence portal.',
}

export default async function PortalPage() {
  const cookieStore = await cookies()
  if (!cookieStore.get('hq_auth')) redirect('/login')

  return <StarterPortal />
}
