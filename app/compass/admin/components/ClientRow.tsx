export interface AdminClientRow {
  email: string
  first_name: string | null
  last_name: string | null
  current_milemarker: number | null
  md_email: string | null
  created_at: string | null
}

interface Props {
  client: AdminClientRow
  marketDirectors: { email: string; full_name: string }[]
  onAssign: (clientEmail: string, mdEmail: string) => void
  assigning: boolean
}

export default function ClientRow({ client, marketDirectors, onAssign, assigning }: Props) {
  const name = [client.first_name, client.last_name].filter(Boolean).join(' ') || client.email
  const isUnassigned = !client.md_email

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: '2fr 1fr 1.5fr 2fr 100px',
      padding: '12px 20px',
      alignItems: 'center',
      borderBottom: '1px solid #F3F4F6',
      backgroundColor: isUnassigned ? '#FFFBEB' : 'transparent',
    }}>
      <div>
        <p style={{ fontSize: '14px', fontWeight: 600, color: '#0A1E3D', margin: 0 }}>{name}</p>
        <p style={{ fontSize: '11px', color: '#9A8E82', margin: '2px 0 0' }}>{client.email}</p>
      </div>
      <span style={{ fontSize: '13px', color: '#374151' }}>
        MM{client.current_milemarker ?? 1}
      </span>
      <span style={{ fontSize: '12px', color: isUnassigned ? '#dc2626' : '#374151', fontWeight: isUnassigned ? 600 : 400 }}>
        {client.md_email ?? 'Unassigned'}
      </span>
      <select
        defaultValue={client.md_email ?? ''}
        onChange={e => onAssign(client.email, e.target.value)}
        disabled={assigning}
        style={{
          fontSize: '13px',
          color: '#374151',
          border: '1px solid #E5E7EB',
          borderRadius: '6px',
          padding: '6px 10px',
          backgroundColor: '#ffffff',
          cursor: assigning ? 'not-allowed' : 'pointer',
          width: '100%',
        }}
      >
        <option value="">— Unassigned —</option>
        {marketDirectors.map(md => (
          <option key={md.email} value={md.email}>{md.full_name}</option>
        ))}
      </select>
      <span style={{ fontSize: '11px', color: '#9A8E82', textAlign: 'center' }}>
        {client.created_at
          ? new Date(client.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
          : '—'}
      </span>
    </div>
  )
}
