'use client'

import { useEffect, useState } from 'react'
import { createClient } from '../../../../../lib/supabase/client'
import ClientRow, { type AdminClientRow } from '../../components/ClientRow'

export default function AdminClientsPage() {
  const [clients, setClients] = useState<AdminClientRow[]>([])
  const [mds, setMds] = useState<{ email: string; full_name: string }[]>([])
  const [loading, setLoading] = useState(true)
  const [assigning, setAssigning] = useState(false)
  const [filter, setFilter] = useState<'all' | 'unassigned'>('all')

  useEffect(() => {
    void loadData()
  }, [])

  async function loadData() {
    setLoading(true)
    const supabase = createClient()

    const [{ data: users }, { data: assignments }, { data: staffData }] = await Promise.all([
      supabase.from('users').select('email, first_name, last_name, current_milemarker, created_at')
        .not('user_role', 'in', '("admin","market_director","state_director")')
        .order('created_at', { ascending: false }),
      supabase.from('md_clients').select('client_email, md_email').eq('status', 'active'),
      supabase.from('staff_accounts').select('email, full_name').eq('role', 'market_director').eq('status', 'active'),
    ])

    const assignmentMap = new Map((assignments ?? []).map(a => [a.client_email, a.md_email]))

    const rows: AdminClientRow[] = (users ?? []).map(u => ({
      email: u.email,
      first_name: u.first_name,
      last_name: u.last_name,
      current_milemarker: u.current_milemarker,
      md_email: assignmentMap.get(u.email) ?? null,
      created_at: u.created_at,
    }))

    setClients(rows)
    setMds((staffData ?? []) as { email: string; full_name: string }[])
    setLoading(false)
  }

  async function handleAssign(clientEmail: string, mdEmail: string) {
    setAssigning(true)
    await fetch('/api/admin/assign-client', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ client_email: clientEmail, md_email: mdEmail || null }),
    })
    void loadData()
    setAssigning(false)
  }

  const filtered = filter === 'unassigned'
    ? clients.filter(c => !c.md_email)
    : clients

  const unassignedCount = clients.filter(c => !c.md_email).length

  return (
    <div style={{ padding: '32px 40px' }}>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '22px', fontWeight: 700, color: '#0A1E3D', margin: '0 0 4px' }}>Navigator Clients</h1>
        <p style={{ fontSize: '13px', color: '#9A8E82', margin: 0 }}>
          {clients.length} total · {unassignedCount > 0 && (
            <span style={{ color: '#dc2626', fontWeight: 600 }}>{unassignedCount} unassigned</span>
          )}
        </p>
      </div>

      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
        {([['all', 'All Clients'], ['unassigned', 'Unassigned Only']] as const).map(([val, label]) => (
          <button
            key={val}
            onClick={() => setFilter(val)}
            style={{
              padding: '7px 14px',
              borderRadius: '6px',
              fontSize: '12px',
              fontWeight: filter === val ? 600 : 400,
              backgroundColor: filter === val ? '#0A1E3D' : '#F3F4F6',
              color: filter === val ? '#ffffff' : '#374151',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            {label}
          </button>
        ))}
      </div>

      <div style={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #E5E7EB', overflow: 'hidden' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '2fr 1fr 1.5fr 2fr 100px',
          padding: '10px 20px',
          backgroundColor: '#F9FAFB',
          borderBottom: '1px solid #E5E7EB',
        }}>
          {['Client', 'MileMarker', 'Assigned MD', 'Reassign', 'Joined'].map(h => (
            <span key={h} style={{ fontSize: '11px', fontWeight: 700, color: '#6B7280', letterSpacing: '0.06em', textTransform: 'uppercase' }}>{h}</span>
          ))}
        </div>
        {loading ? (
          <p style={{ padding: '24px', fontSize: '14px', color: '#9A8E82' }}>Loading…</p>
        ) : filtered.length === 0 ? (
          <p style={{ padding: '24px', fontSize: '14px', color: '#9A8E82' }}>No clients found.</p>
        ) : (
          filtered.map(client => (
            <ClientRow
              key={client.email}
              client={client}
              marketDirectors={mds}
              onAssign={handleAssign}
              assigning={assigning}
            />
          ))
        )}
      </div>
    </div>
  )
}
