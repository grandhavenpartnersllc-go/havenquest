'use client'

import { usePathname } from 'next/navigation'
import type { ReactNode } from 'react'

export default function WorkspacePanel({ children }: { children: ReactNode }) {
  const pathname = usePathname()

  return (
    <main
      style={{
        flex: 1,
        minWidth: 0,
        overflowY: 'auto',
        backgroundColor: 'var(--portal-bg)',
      }}
    >
      <div
        key={pathname}
        style={{
          minHeight: '100%',
          animation: 'workspaceFadeIn 150ms ease-out',
        }}
      >
        {children}
      </div>
    </main>
  )
}
