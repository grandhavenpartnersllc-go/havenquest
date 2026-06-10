'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Menu, X } from 'lucide-react'

export default function Header() {
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50" style={{ background: '#0A1E3D', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
      <div className="max-w-[1080px] mx-auto px-6 md:px-10 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center font-bold text-[17px] text-white tracking-tight">
          Haven<span style={{ color: '#C5B783' }}>Quest</span>
          <span style={{
            fontSize: '10px',
            letterSpacing: '2px',
            textTransform: 'uppercase',
            color: '#C5B783',
            fontWeight: 500,
            marginLeft: '10px',
            paddingLeft: '10px',
            borderLeft: '1px solid rgba(197,183,131,0.4)',
            lineHeight: 1,
          }}>
            Texas
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-6 text-sm">
          <Link
            href="/portal"
            className="transition-colors text-[#C5B783] hover:text-white"
          >
            My Portal
          </Link>
          <Link
            href="/texas/texas-insider"
            className="hover:text-white transition-colors"
            style={{ color: 'rgba(255,255,255,0.65)' }}
          >
            Texas Insider
          </Link>
          <Link
            href="/begin"
            className="hover:bg-gray-100 transition-colors"
            style={{ background: '#fff', color: '#0A1E3D', borderRadius: '6px', padding: '8px 18px', fontSize: '14px', fontWeight: 500, textDecoration: 'none' }}
          >
            Begin My Journey
          </Link>
        </nav>

        <button
          className="md:hidden p-2 hover:text-white transition-colors"
          style={{ color: 'rgba(255,255,255,0.6)' }}
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {open && (
        <div className="md:hidden px-4 py-4 flex flex-col gap-4 text-sm" style={{ background: '#0A1E3D', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
          <Link
            href="/portal"
            className="transition-colors text-[#C5B783] hover:text-white"
            onClick={() => setOpen(false)}
          >
            My Portal
          </Link>
          <Link
            href="/texas/texas-insider"
            className="hover:text-white transition-colors"
            style={{ color: 'rgba(255,255,255,0.65)' }}
            onClick={() => setOpen(false)}
          >
            Texas Insider
          </Link>
          <Link
            href="/begin"
            className="px-4 py-3 rounded-xl font-bold text-center hover:bg-gray-100 transition-colors"
            style={{ background: '#fff', color: '#0A1E3D', textDecoration: 'none' }}
            onClick={() => setOpen(false)}
          >
            Begin My Journey →
          </Link>
        </div>
      )}
    </header>
  )
}
