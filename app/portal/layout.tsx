import type { ReactNode } from 'react'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import ThemeProvider from './providers/ThemeProvider'
import PortalDataProvider from './providers/PortalDataProvider'
import TopCommandBar from './components/TopCommandBar'
import JourneyRail from './components/JourneyRail'
import WorkspacePanel from './components/WorkspacePanel'
import CommandCenter from './components/CommandCenter'
import './portal.css'

export default async function PortalLayout({ children }: { children: ReactNode }) {
  const cookieStore = await cookies()
  if (!cookieStore.get('hq_auth')) redirect('/login')

  return (
    <ThemeProvider>
      <PortalDataProvider>
        <div
          style={{
            width: '100vw',
            height: '100vh',
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: 'var(--portal-bg)',
            overflow: 'hidden',
          }}
        >
          <TopCommandBar />
          <div
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'row',
              overflow: 'hidden',
            }}
          >
            <JourneyRail />
            <WorkspacePanel>{children}</WorkspacePanel>
            <CommandCenter />
          </div>
        </div>
      </PortalDataProvider>
    </ThemeProvider>
  )
}
