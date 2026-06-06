'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Menu, X } from 'lucide-react'

export default function Header() {
  const [open, setOpen] = useState(false)

  return (
    <header className="bg-[#08101C]/95 backdrop-blur-md border-b border-white/8 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="font-bold text-[17px] text-white tracking-tight">
          Haven<span className="text-blue-400">Quest</span>
        </Link>

        <nav className="hidden md:flex items-center gap-6 text-sm text-white/55">
          <Link href="/portal" className="hover:text-white transition-colors">My Portal</Link>
          <Link href="/texas/texas-insider" className="hover:text-white transition-colors">Texas Insider</Link>
          <Link
            href="/begin"
            className="bg-white text-gray-950 px-4 py-2 rounded-lg text-sm font-bold hover:bg-gray-100 transition-colors"
            style={{ boxShadow: '0 0 0 1px rgba(255,255,255,0.12)' }}
          >
            Begin My Journey
          </Link>
        </nav>

        <button
          className="md:hidden p-2 text-white/60 hover:text-white transition-colors"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {open && (
        <div className="md:hidden bg-[#08101C] border-t border-white/8 px-4 py-4 flex flex-col gap-4 text-sm">
          <Link href="/portal" className="text-white/60 hover:text-white transition-colors" onClick={() => setOpen(false)}>My Portal</Link>
          <Link href="/texas/texas-insider" className="text-white/60 hover:text-white transition-colors" onClick={() => setOpen(false)}>Texas Insider</Link>
          <Link
            href="/begin"
            className="bg-white text-gray-950 px-4 py-3 rounded-xl font-bold text-center"
            onClick={() => setOpen(false)}
          >
            Begin My Journey →
          </Link>
        </div>
      )}
    </header>
  )
}
