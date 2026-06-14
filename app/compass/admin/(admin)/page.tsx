import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { createServerClient } from '../../../../lib/supabase/server'

export default async function AdminDashboardPage() {
  const cookieStore = await cookies()
  const accessToken = cookieStore.get('hq_auth')?.value
  if (!accessToken) redirect('/compass/admin/login')

  const supabase = createServerClient(accessToken)

  const [
    { count: totalClients },
    { count: totalStaff },
    { count: pendingAgents },
    { count: unassignedClients },
  ] = await Promise.all([
    supabase.from('users').select('*', { count: 'exact', head: true }).neq('user_role', 'admin').neq('user_role', 'market_director'),
    supabase.from('staff_accounts').select('*', { count: 'exact', head: true }).eq('status', 'active'),
    supabase.from('realtor_applications').select('*', { count: 'exact', head: true }).is('status', null),
    supabase.from('users').select('*', { count: 'exact', head: true }).gte('current_milemarker', 4).not('email', 'in', `(select client_email from md_clients where status = 'active')`),
  ])

  const stats = [
    { label: 'Active Navigator Clients', value: totalClients ?? 0, color: '#0076B6' },
    { label: 'Active Staff', value: totalStaff ?? 0, color: '#16a34a' },
    { label: 'Pending Agent Applications', value: pendingAgents ?? 0, color: '#d97706' },
    { label: 'Clients Needing MD Assignment', value: unassignedClients ?? 0, color: '#dc2626' },
  ]

  return (
    <div style={{ padding: '32px 40px' }}>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '22px', fontWeight: 700, color: '#0A1E3D', margin: '0 0 4px' }}>
          Platform Dashboard
        </h1>
        <p style={{ fontSize: '13px', color: '#9A8E82', margin: 0 }}>COMPASS Admin — Platform Health Overview</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '40px' }}>
        {stats.map(stat => (
          <div
            key={stat.label}
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '12px',
              border: '1px solid #E5E7EB',
              padding: '20px 24px',
            }}
          >
            <p style={{ fontSize: '28px', fontWeight: 700, color: stat.color, margin: '0 0 6px' }}>
              {stat.value}
            </p>
            <p style={{ fontSize: '12px', color: '#6B7280', margin: 0, lineHeight: 1.4 }}>
              {stat.label}
            </p>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        <div style={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #E5E7EB', padding: '24px' }}>
          <h2 style={{ fontSize: '14px', fontWeight: 700, color: '#0A1E3D', margin: '0 0 16px', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
            Quick Actions
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {[
              { href: '/compass/admin/staff/new', label: '+ Provision New Market Director' },
              { href: '/compass/admin/clients', label: '→ Assign Unassigned Clients' },
              { href: '/compass/admin/agents', label: '→ Review Agent Applications' },
              { href: '/compass/admin/system', label: '⚙ System Configuration' },
            ].map(action => (
              <a
                key={action.href}
                href={action.href}
                style={{
                  display: 'block',
                  padding: '10px 14px',
                  borderRadius: '8px',
                  backgroundColor: '#F9FAFB',
                  border: '1px solid #E5E7EB',
                  fontSize: '13px',
                  fontWeight: 500,
                  color: '#0076B6',
                  textDecoration: 'none',
                }}
              >
                {action.label}
              </a>
            ))}
          </div>
        </div>

        <div style={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #E5E7EB', padding: '24px' }}>
          <h2 style={{ fontSize: '14px', fontWeight: 700, color: '#0A1E3D', margin: '0 0 16px', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
            Platform Status
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {[
              { label: 'Client Portal', status: 'Live', ok: true },
              { label: 'Meridian MD Portal', status: 'Live', ok: true },
              { label: 'COMPASS Admin', status: 'Live', ok: true },
              { label: 'SARAH Agent Portal', status: 'Not Built', ok: false },
            ].map(item => (
              <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid #F3F4F6' }}>
                <span style={{ fontSize: '13px', color: '#374151' }}>{item.label}</span>
                <span style={{
                  fontSize: '11px',
                  fontWeight: 600,
                  color: item.ok ? '#16a34a' : '#9A8E82',
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                }}>
                  {item.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
