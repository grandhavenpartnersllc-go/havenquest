import type { ReactNode } from 'react'

export default function WorkspacePanel({ children }: { children: ReactNode }) {
  return (
    <main
      style={{
        flex: 1,
        minWidth: 0,
        overflowY: 'auto',
        backgroundColor: 'var(--portal-bg)',
      }}
    >
      {children}
    </main>
  )
}
