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
  const authToken = cookieStore.get('hq_auth')?.value
  if (!authToken) redirect('/login')

  return (
    <ThemeProvider>
      {/* ── Mobile guard — shown below 1024 px via CSS ── */}
      <div className="portal-mobile-fallback">
        <div style={{ maxWidth: '320px' }}>
          <p style={{ fontSize: '22px', fontWeight: 700, margin: '0 0 4px', lineHeight: 1.1 }}>
            <span style={{ color: '#0A1E3D' }}>Haven</span>
            <span style={{ color: '#0076B6' }}>Quest</span>
          </p>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: '0 0 24px', letterSpacing: '0.05em' }}>
            Navigator Portal
          </p>
          <svg
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            stroke="var(--text-muted)"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ margin: '0 auto 20px', display: 'block' }}
          >
            <rect x="2" y="3" width="20" height="14" rx="2" />
            <path d="M8 21h8M12 17v4" />
          </svg>
          <h2 style={{ fontSize: '17px', fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 10px', lineHeight: 1.3 }}>
            Best viewed on desktop
          </h2>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.65, margin: 0 }}>
            The Navigator Portal is designed for a full desktop experience. Please open HavenQuest on a laptop or desktop computer to continue your journey.
          </p>
        </div>
      </div>

      {/* ── Portal shell — hidden below 1024 px via CSS ── */}
      <PortalDataProvider>
        <div
          className="portal-shell"
          style={{ backgroundColor: 'var(--portal-bg)' }}
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
