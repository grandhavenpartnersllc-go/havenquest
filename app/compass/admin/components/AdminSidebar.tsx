'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const NAV_ITEMS = [
  { href: '/compass/admin', label: 'Dashboard', exact: true },
  { href: '/compass/admin/staff', label: 'Staff' },
  { href: '/compass/admin/clients', label: 'Clients' },
  { href: '/compass/admin/agents', label: 'Agents' },
  { href: '/compass/admin/system', label: 'System' },
]

export default function AdminSidebar() {
  const pathname = usePathname()

  return (
    <div style={{
      width: '200px',
      backgroundColor: '#0A1E3D',
      display: 'flex',
      flexDirection: 'column',
      padding: '24px 0',
      flexShrink: 0,
    }}>
      {NAV_ITEMS.map(item => {
        const active = item.exact ? pathname === item.href : pathname.startsWith(item.href)
        return (
          <Link
            key={item.href}
            href={item.href}
            style={{
              display: 'block',
              padding: '10px 20px',
              fontSize: '13px',
              fontWeight: active ? 600 : 400,
              color: active ? '#ffffff' : 'rgba(255,255,255,0.5)',
              textDecoration: 'none',
              backgroundColor: active ? 'rgba(0,118,182,0.25)' : 'transparent',
              borderLeft: active ? '3px solid #0076B6' : '3px solid transparent',
              transition: 'all 0.15s',
            }}
          >
            {item.label}
          </Link>
        )
      })}
    </div>
  )
}
