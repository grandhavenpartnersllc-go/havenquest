'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { createClient } from '../../../../../lib/supabase/client'
import StaffCard, { type StaffAccount } from '../../components/StaffCard'

const ROLE_OPTIONS = ['all', 'market_director', 'state_director']
const METRO_OPTIONS = ['all', 'austin', 'dfw', 'houston', 'san_antonio']

const ROLE_LABELS: Record<string, string> = {
  all: 'All Roles',
  market_director: 'Market Director',
  state_director: 'State Director',
}

const METRO_LABELS: Record<string, string> = {
  all: 'All Metros',
  austin: 'Austin',
  dfw: 'DFW',
  houston: 'Houston',
  san_antonio: 'San Antonio',
}

export default function StaffRosterPage() {
  const [staff, setStaff] = useState<StaffAccount[]>([])
  const [loading, setLoading] = useState(true)
  const [roleFilter, setRoleFilter] = useState('all')
  const [metroFilter, setMetroFilter] = useState('all')
  const [editing, setEditing] = useState<StaffAccount | null>(null)
  const [saving, setSaving] = useState(false)
  const [editStatus, setEditStatus] = useState('')
  const [editMetro, setEditMetro] = useState('')
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [deleteError, setDeleteError] = useState('')

  useEffect(() => {
    void loadStaff()
  }, [])

  async function loadStaff() {
    setLoading(true)
    const res = await fetch('/api/admin/update-staff?list=1')
    if (res.ok) {
      const data = await res.json() as { staff: StaffAccount[] }
      setStaff(data.staff ?? [])
    }
    setLoading(false)
  }

  function openEdit(s: StaffAccount) {
    setEditing(s)
    setEditStatus(s.status)
    setEditMetro(s.metro ?? '')
    setShowDeleteConfirm(false)
    setDeleteError('')
  }

  async function handleDelete() {
    if (!editing) return
    setDeleting(true)
    setDeleteError('')
    try {
      const res = await fetch('/api/admin/delete-staff', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: editing.email, userId: editing.auth_user_id }),
      })
      if (!res.ok) {
        const data = await res.json() as { error?: string }
        setDeleteError(data.error ?? 'Failed to delete staff member.')
        setDeleting(false)
        return
      }
      setEditing(null)
      setShowDeleteConfirm(false)
      void loadStaff()
    } catch {
      setDeleteError('An unexpected error occurred.')
      setDeleting(false)
    }
  }

  async function saveEdit() {
    if (!editing) return
    setSaving(true)
    await fetch('/api/admin/update-staff', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: editing.email, status: editStatus, metro: editMetro || null }),
    })
    setSaving(false)
    setEditing(null)
    void loadStaff()
  }

  async function resetPassword(email: string) {
    if (!confirm(`Send a password reset email to ${email}?`)) return
    const supabase = createClient()
    await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    })
    alert('Password reset email sent.')
  }

  const filtered = staff.filter(s => {
    if (roleFilter !== 'all' && s.role !== roleFilter) return false
    if (metroFilter !== 'all' && s.metro !== metroFilter) return false
    return true
  })

  return (
    <div style={{ padding: '32px 40px' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '22px', fontWeight: 700, color: '#0A1E3D', margin: '0 0 4px' }}>Staff Roster</h1>
          <p style={{ fontSize: '13px', color: '#9A8E82', margin: 0 }}>{filtered.length} staff member{filtered.length !== 1 ? 's' : ''}</p>
        </div>
        <Link
          href="/compass/admin/staff/new"
          style={{
            padding: '10px 20px',
            borderRadius: '8px',
            backgroundColor: '#0A1E3D',
            color: '#ffffff',
            fontSize: '13px',
            fontWeight: 600,
            textDecoration: 'none',
          }}
        >
          + Add Staff
        </Link>
      </div>

      <div style={{ display: 'flex', gap: '12px', marginBottom: '20px' }}>
        {[
          { value: roleFilter, setValue: setRoleFilter, options: ROLE_OPTIONS, labels: ROLE_LABELS },
          { value: metroFilter, setValue: setMetroFilter, options: METRO_OPTIONS, labels: METRO_LABELS },
        ].map((filter, i) => (
          <select
            key={i}
            value={filter.value}
            onChange={e => filter.setValue(e.target.value)}
            style={{ fontSize: '13px', border: '1px solid #E5E7EB', borderRadius: '6px', padding: '7px 12px', color: '#374151', backgroundColor: '#ffffff' }}
          >
            {filter.options.map(opt => (
              <option key={opt} value={opt}>{filter.labels[opt] ?? opt}</option>
            ))}
          </select>
        ))}
      </div>

      <div style={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #E5E7EB', overflow: 'hidden' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '2fr 1.5fr 1fr 1fr 1fr 100px',
          padding: '10px 20px',
          backgroundColor: '#F9FAFB',
          borderBottom: '1px solid #E5E7EB',
        }}>
          {['Name', 'Role', 'Metro', 'Status', 'Created', ''].map(h => (
            <span key={h} style={{ fontSize: '11px', fontWeight: 700, color: '#6B7280', letterSpacing: '0.06em', textTransform: 'uppercase' }}>{h}</span>
          ))}
        </div>
        {loading ? (
          <p style={{ padding: '24px', fontSize: '14px', color: '#9A8E82' }}>Loading…</p>
        ) : filtered.length === 0 ? (
          <p style={{ padding: '24px', fontSize: '14px', color: '#9A8E82' }}>No staff found.</p>
        ) : (
          filtered.map(s => (
            <StaffCard key={s.id} staff={s} onEdit={openEdit} />
          ))
        )}
      </div>

      {editing && (
        <div style={{
          position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50,
        }}>
          <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', padding: '32px', width: '400px', boxShadow: '0 8px 48px rgba(0,0,0,0.2)' }}>
            {showDeleteConfirm ? (
              <>
                <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#dc2626', margin: '0 0 12px' }}>Confirm Deletion</h2>
                <p style={{ fontSize: '14px', color: '#374151', lineHeight: 1.6, margin: '0 0 24px' }}>
                  Are you sure you want to permanently delete <strong>{editing.full_name}</strong>? This cannot be undone.
                </p>
                {deleteError && (
                  <p style={{ fontSize: '13px', color: '#dc2626', marginBottom: '16px' }}>{deleteError}</p>
                )}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <button
                    onClick={() => { void handleDelete() }}
                    disabled={deleting}
                    style={{ width: '100%', padding: '11px', borderRadius: '8px', backgroundColor: deleting ? '#f87171' : '#dc2626', color: '#ffffff', fontSize: '14px', fontWeight: 600, border: 'none', cursor: deleting ? 'not-allowed' : 'pointer' }}
                  >
                    {deleting ? 'Deleting…' : 'Yes, Delete Permanently'}
                  </button>
                  <button
                    onClick={() => { setShowDeleteConfirm(false); setDeleteError('') }}
                    disabled={deleting}
                    style={{ width: '100%', padding: '10px', borderRadius: '8px', backgroundColor: 'transparent', color: '#374151', fontSize: '14px', fontWeight: 500, border: '1.5px solid #E5E7EB', cursor: 'pointer' }}
                  >
                    Cancel
                  </button>
                </div>
              </>
            ) : (
              <>
                <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#0A1E3D', margin: '0 0 4px' }}>Edit Staff</h2>
                <p style={{ fontSize: '13px', color: '#9A8E82', margin: '0 0 24px' }}>{editing.full_name}</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: '#4B5563', marginBottom: '6px', letterSpacing: '0.04em' }}>STATUS</label>
                    <select value={editStatus} onChange={e => setEditStatus(e.target.value)}
                      style={{ width: '100%', border: '1px solid #E5E7EB', borderRadius: '8px', padding: '9px 12px', fontSize: '14px', color: '#0A1E3D' }}>
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                      <option value="suspended">Suspended</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: '#4B5563', marginBottom: '6px', letterSpacing: '0.04em' }}>METRO</label>
                    <select value={editMetro} onChange={e => setEditMetro(e.target.value)}
                      style={{ width: '100%', border: '1px solid #E5E7EB', borderRadius: '8px', padding: '9px 12px', fontSize: '14px', color: '#0A1E3D' }}>
                      <option value="">— None —</option>
                      <option value="austin">Austin</option>
                      <option value="dfw">DFW</option>
                      <option value="houston">Houston</option>
                      <option value="san_antonio">San Antonio</option>
                      <option value="all">All Metros</option>
                    </select>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
                  <button onClick={saveEdit} disabled={saving}
                    style={{ flex: 1, padding: '10px', borderRadius: '8px', backgroundColor: '#0A1E3D', color: '#ffffff', fontSize: '14px', fontWeight: 600, border: 'none', cursor: saving ? 'not-allowed' : 'pointer' }}>
                    {saving ? 'Saving…' : 'Save Changes'}
                  </button>
                  <button onClick={() => setEditing(null)}
                    style={{ padding: '10px 20px', borderRadius: '8px', backgroundColor: '#F3F4F6', color: '#374151', fontSize: '14px', fontWeight: 500, border: 'none', cursor: 'pointer' }}>
                    Cancel
                  </button>
                </div>
                <button onClick={() => resetPassword(editing.email)}
                  style={{ marginTop: '12px', width: '100%', padding: '9px', borderRadius: '8px', backgroundColor: 'transparent', color: '#0076B6', fontSize: '13px', fontWeight: 500, border: '1px solid #0076B6', cursor: 'pointer' }}>
                  Send Password Reset Email
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  style={{ width: '100%', padding: '10px', backgroundColor: 'transparent', border: '1.5px solid #dc2626', borderRadius: '6px', color: '#dc2626', cursor: 'pointer', marginTop: '8px', fontSize: '14px' }}
                >
                  Delete Staff Member
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
