'use client'

import { createContext, useContext, useState, type CSSProperties, type ReactNode } from 'react'
import InvestorAccessModal from './InvestorAccessModal'

// Shared open-state for the Investor Access popup, so the three "Investor Access" buttons
// (HomeHeader desktop + mobile, HomeFooter) all drive one modal instance. Mounted once at the
// nearest shared boundary that wraps both header and footer (app/page.tsx). This is a client
// island: the home page and footer stay server components — only this provider, the header
// (already client), and the InvestorAccessButton island below are client.

type InvestorAccessCtx = { open: () => void }

// Default is a no-op so a stray consumer never crashes the page; the real opener comes from the provider.
const Ctx = createContext<InvestorAccessCtx>({ open: () => {} })

export function useInvestorAccess() {
  return useContext(Ctx)
}

export default function InvestorAccessProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)
  return (
    <Ctx.Provider value={{ open: () => setIsOpen(true) }}>
      {children}
      <InvestorAccessModal open={isOpen} onClose={() => setIsOpen(false)} />
    </Ctx.Provider>
  )
}

// Thin client island for server-component callers (HomeFooter) that can't use the hook directly.
// Renders a real <button> (keyboard-accessible) styled to match the link it replaces; the caller
// supplies the same className/inline style + children so the visible label and look are unchanged.
export function InvestorAccessButton({
  className,
  style,
  children,
}: {
  className?: string
  style?: CSSProperties
  children: ReactNode
}) {
  const { open } = useInvestorAccess()
  return (
    <button
      type="button"
      className={className}
      onClick={open}
      style={{ background: 'none', border: 'none', padding: 0, margin: 0, cursor: 'pointer', textAlign: 'left', ...style }}
    >
      {children}
    </button>
  )
}
