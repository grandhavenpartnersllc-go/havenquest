export interface AgentApplication {
  id: string
  email: string
  first_name: string | null
  last_name: string | null
  metro: string | null
  status: string | null
  created_at: string | null
}

interface Props {
  agent: AgentApplication
  onApprove: (id: string, email: string) => void
  onReject: (id: string) => void
  processing: boolean
}

const METRO_LABELS: Record<string, string> = {
  austin: 'Austin',
  dfw: 'DFW',
  houston: 'Houston',
  san_antonio: 'San Antonio',
}

export default function AgentRow({ agent, onApprove, onReject, processing }: Props) {
  const name = [agent.first_name, agent.last_name].filter(Boolean).join(' ') || agent.email
  const isPending = !agent.status || agent.status === 'pending'

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: '2fr 1.5fr 1fr 1fr 160px',
      padding: '12px 20px',
      alignItems: 'center',
      borderBottom: '1px solid #F3F4F6',
    }}>
      <div>
        <p style={{ fontSize: '14px', fontWeight: 600, color: '#0A1E3D', margin: 0 }}>{name}</p>
        <p style={{ fontSize: '11px', color: '#9A8E82', margin: '2px 0 0' }}>{agent.email}</p>
      </div>
      <span style={{ fontSize: '13px', color: '#374151' }}>
        {agent.metro ? (METRO_LABELS[agent.metro] ?? agent.metro) : '—'}
      </span>
      <span style={{ fontSize: '12px', color: '#6B7280' }}>
        {agent.created_at
          ? new Date(agent.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
          : '—'}
      </span>
      <span style={{
        fontSize: '11px',
        fontWeight: 600,
        color: agent.status === 'approved' ? '#16a34a' : agent.status === 'rejected' ? '#dc2626' : '#d97706',
        textTransform: 'uppercase',
        letterSpacing: '0.06em',
      }}>
        {agent.status ?? 'pending'}
      </span>
      {isPending ? (
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={() => onApprove(agent.id, agent.email)}
            disabled={processing}
            style={{
              padding: '5px 12px',
              borderRadius: '6px',
              backgroundColor: '#0076B6',
              color: '#ffffff',
              fontSize: '12px',
              fontWeight: 600,
              border: 'none',
              cursor: processing ? 'not-allowed' : 'pointer',
              opacity: processing ? 0.6 : 1,
            }}
          >
            Approve
          </button>
          <button
            onClick={() => onReject(agent.id)}
            disabled={processing}
            style={{
              padding: '5px 12px',
              borderRadius: '6px',
              backgroundColor: '#F3F4F6',
              color: '#374151',
              fontSize: '12px',
              fontWeight: 600,
              border: 'none',
              cursor: processing ? 'not-allowed' : 'pointer',
              opacity: processing ? 0.6 : 1,
            }}
          >
            Reject
          </button>
        </div>
      ) : (
        <span style={{ fontSize: '12px', color: '#9A8E82' }}>—</span>
      )}
    </div>
  )
}
