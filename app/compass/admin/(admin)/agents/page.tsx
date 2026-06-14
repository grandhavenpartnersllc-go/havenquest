'use client'

import { useEffect, useState } from 'react'
import { createClient } from '../../../../../lib/supabase/client'
import AgentRow, { type AgentApplication } from '../../components/AgentRow'

export default function AgentsPage() {
  const [agents, setAgents] = useState<AgentApplication[]>([])
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState(false)
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all')

  useEffect(() => {
    void loadAgents()
  }, [])

  async function loadAgents() {
    setLoading(true)
    const supabase = createClient()
    const { data } = await supabase
      .from('realtor_applications')
      .select('id, email, first_name, last_name, metro, status, created_at')
      .order('created_at', { ascending: false })
    setAgents((data ?? []) as AgentApplication[])
    setLoading(false)
  }

  async function handleApprove(id: string, email: string) {
    if (!confirm(`Approve agent application for ${email}?`)) return
    setProcessing(true)
    const supabase = createClient()
    await supabase.from('realtor_applications').update({ status: 'approved' }).eq('id', id)
    void loadAgents()
    setProcessing(false)
  }

  async function handleReject(id: string) {
    if (!confirm('Reject this application?')) return
    setProcessing(true)
    const supabase = createClient()
    await supabase.from('realtor_applications').update({ status: 'rejected' }).eq('id', id)
    void loadAgents()
    setProcessing(false)
  }

  const filtered = agents.filter(a => {
    if (filter === 'all') return true
    if (filter === 'pending') return !a.status || a.status === 'pending'
    return a.status === filter
  })

  const pendingCount = agents.filter(a => !a.status || a.status === 'pending').length

  return (
    <div style={{ padding: '32px 40px' }}>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '22px', fontWeight: 700, color: '#0A1E3D', margin: '0 0 4px' }}>Select Agent Queue</h1>
        <p style={{ fontSize: '13px', color: '#9A8E82', margin: 0 }}>
          {pendingCount > 0 ? `${pendingCount} pending application${pendingCount !== 1 ? 's' : ''}` : 'No pending applications'}
        </p>
      </div>

      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
        {(['all', 'pending', 'approved', 'rejected'] as const).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            style={{
              padding: '7px 14px',
              borderRadius: '6px',
              fontSize: '12px',
              fontWeight: filter === f ? 600 : 400,
              backgroundColor: filter === f ? '#0A1E3D' : '#F3F4F6',
              color: filter === f ? '#ffffff' : '#374151',
              border: 'none',
              cursor: 'pointer',
              textTransform: 'capitalize',
            }}
          >
            {f}
          </button>
        ))}
      </div>

      <div style={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #E5E7EB', overflow: 'hidden' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '2fr 1.5fr 1fr 1fr 160px',
          padding: '10px 20px',
          backgroundColor: '#F9FAFB',
          borderBottom: '1px solid #E5E7EB',
        }}>
          {['Applicant', 'Metro', 'Applied', 'Status', ''].map(h => (
            <span key={h} style={{ fontSize: '11px', fontWeight: 700, color: '#6B7280', letterSpacing: '0.06em', textTransform: 'uppercase' }}>{h}</span>
          ))}
        </div>
        {loading ? (
          <p style={{ padding: '24px', fontSize: '14px', color: '#9A8E82' }}>Loading…</p>
        ) : filtered.length === 0 ? (
          <p style={{ padding: '24px', fontSize: '14px', color: '#9A8E82' }}>No applications found.</p>
        ) : (
          filtered.map(agent => (
            <AgentRow
              key={agent.id}
              agent={agent}
              onApprove={handleApprove}
              onReject={handleReject}
              processing={processing}
            />
          ))
        )}
      </div>
    </div>
  )
}
