export interface StaffAccount {
  id: string
  email: string
  full_name: string
  role: string
  metro: string | null
  status: string
  created_at: string
  microsoft_365_provisioned: boolean
  compass_walkthrough_complete: boolean
}

interface Props {
  staff: StaffAccount
  onEdit?: (staff: StaffAccount) => void
}

const METRO_LABELS: Record<string, string> = {
  austin: 'Austin',
  dfw: 'DFW',
  houston: 'Houston',
  san_antonio: 'San Antonio',
  all: 'All Metros',
}

const ROLE_LABELS: Record<string, string> = {
  market_director: 'Market Director',
  state_director: 'State Director',
  admin: 'Admin',
}

const STATUS_COLORS: Record<string, string> = {
  active: '#16a34a',
  inactive: '#9A8E82',
  suspended: '#dc2626',
}

export default function StaffCard({ staff, onEdit }: Props) {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: '2fr 1.5fr 1fr 1fr 1fr 100px',
      padding: '14px 20px',
      alignItems: 'center',
      borderBottom: '1px solid #F3F4F6',
    }}>
      <div>
        <p style={{ fontSize: '14px', fontWeight: 600, color: '#0A1E3D', margin: 0 }}>{staff.full_name}</p>
        <p style={{ fontSize: '11px', color: '#9A8E82', margin: '2px 0 0' }}>{staff.email}</p>
      </div>
      <span style={{ fontSize: '13px', color: '#374151' }}>{ROLE_LABELS[staff.role] ?? staff.role}</span>
      <span style={{ fontSize: '13px', color: '#374151' }}>
        {staff.metro ? (METRO_LABELS[staff.metro] ?? staff.metro) : '—'}
      </span>
      <span style={{
        fontSize: '11px',
        fontWeight: 600,
        color: STATUS_COLORS[staff.status] ?? '#374151',
        textTransform: 'uppercase',
        letterSpacing: '0.06em',
      }}>
        {staff.status}
      </span>
      <span style={{ fontSize: '12px', color: '#6B7280' }}>
        {new Date(staff.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
      </span>
      {onEdit && (
        <button
          onClick={() => onEdit(staff)}
          style={{
            padding: '6px 14px',
            borderRadius: '7px',
            backgroundColor: '#F3F4F6',
            color: '#0A1E3D',
            fontSize: '12px',
            fontWeight: 600,
            border: 'none',
            cursor: 'pointer',
          }}
        >
          Edit
        </button>
      )}
    </div>
  )
}
