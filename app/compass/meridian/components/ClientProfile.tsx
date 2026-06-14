'use client'

import type { MM4Profile } from '../../../../types'

interface Props {
  mm4: MM4Profile
}

function Section({ title }: { title: string }) {
  return (
    <p style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#0076B6', borderBottom: '1px solid #E5E7EB', paddingBottom: '6px', marginBottom: '12px', marginTop: '24px' }}>
      {title}
    </p>
  )
}

function Row({ label, value }: { label: string; value: string | number | boolean | undefined | null }) {
  const display = value === null || value === undefined || value === '' ? '—' : String(value)
  return (
    <div style={{ display: 'flex', gap: '12px', marginBottom: '8px' }}>
      <span style={{ fontSize: '12px', color: '#9A8E82', width: '180px', flexShrink: 0 }}>{label}</span>
      <span style={{ fontSize: '13px', color: '#0A1E3D', lineHeight: 1.5 }}>{display}</span>
    </div>
  )
}

export default function ClientProfile({ mm4 }: Props) {
  return (
    <div>
      <Section title="Section 1 — Identity & Household" />
      <Row label="Primary contact" value={[mm4.primary_first_name, mm4.primary_last_name].filter(Boolean).join(' ')} />
      <Row label="Partner / Spouse" value={[mm4.partner_first_name, mm4.partner_last_name].filter(Boolean).join(' ')} />
      <Row label="Current address" value={[mm4.current_address, mm4.current_city, mm4.current_state, mm4.current_zip].filter(Boolean).join(', ')} />
      <Row label="Phone" value={mm4.phone} />
      <Row label="Email" value={mm4.email} />
      <Row label="Preferred contact" value={mm4.preferred_contact} />
      <Row label="Best time to reach" value={mm4.best_time_to_reach} />
      <Row label="Adults in household" value={mm4.num_adults} />
      <Row label="Children" value={mm4.num_children ? `${mm4.num_children} (ages: ${mm4.children_ages ?? '—'})` : '0'} />
      <Row label="Pets" value={mm4.has_pets ? `Yes — ${mm4.pet_details ?? ''}` : 'No'} />

      <Section title="Section 2 — The Move" />
      <Row label="Why Texas?" value={mm4.why_texas} />
      <Row label="Why now?" value={mm4.why_now} />
      <Row label="Target move date" value={mm4.target_move_date} />
      <Row label="Timeline flexibility" value={mm4.timeline_flexibility} />
      <Row label="Current situation" value={mm4.origin_situation} />
      {mm4.origin_situation === 'selling' && <>
        <Row label="Home listed?" value={mm4.home_listed ? 'Yes' : 'Not yet'} />
        <Row label="Approximate equity" value={mm4.approximate_equity} />
        <Row label="Purchase contingent?" value={mm4.purchase_contingent} />
      </>}

      <Section title="Section 3 — Employment & Finances" />
      <Row label="Employment status" value={mm4.employment_status} />
      {mm4.employment_status === 'employer_relocation' && (
        <Row label="Relocation package?" value={mm4.relocation_package ? 'Yes' : 'No'} />
      )}
      <Row label="Work arrangement" value={mm4.work_arrangement} />
      <Row label="Annual household income" value={mm4.income_range_confirmed} />

      <Section title="Section 4 — Texas Direction" />
      <Row label="Confirmed target city" value={mm4.confirmed_target_city} />
      <Row label="Ruled-out cities" value={mm4.ruled_out_cities} />
      <Row label="Areas researched" value={mm4.areas_researched} />
      <Row label="Additional must-haves" value={mm4.additional_must_haves} />
      <Row label="Deal-breakers" value={mm4.deal_breakers} />

      <Section title="Section 5 — Notes" />
      <Row label="Notes for MD" value={mm4.special_notes} />
    </div>
  )
}
