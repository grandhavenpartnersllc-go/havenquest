// apply_personality_sliders.js — MM3 personality sliders brief implementation
const fs = require('fs')
const file = 'C:/Users/user/havenquest/components/portal/milemarkers/MM3Discover.tsx'
let c = fs.readFileSync(file, 'utf8')
const original = c

// ── 1. Expand SELECT to include personality columns ──────────────────────────
c = c.replace(
  `.select('sandbox_committed,sandbox_profile,sandbox_committed_at,chosen_communities,home_status,exact_home_proceeds,available_funds,annual_income_override,loan_term_preference,origin_city,origin_state,origin_zip')`,
  `.select('sandbox_committed,sandbox_profile,sandbox_committed_at,chosen_communities,home_status,exact_home_proceeds,available_funds,annual_income_override,loan_term_preference,origin_city,origin_state,origin_zip,growth_profile,lifestyle_orientation,environment,pace')`
)

// ── 2. Add personalityPreference state + debounce ref after incomeTimerRef ───
c = c.replace(
  `  const incomeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)`,
  `  const incomeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const personalityDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const [personalityPreference, setPersonalityPreference] = useState<{
    growthProfile: number
    pace: number
    culture: number
    environment: number
    lifestyleOrientation: number
  }>({
    growthProfile: 5,
    pace: 5,
    culture: 5,
    environment: 5,
    lifestyleOrientation: 5,
  })`
)

// ── 3. Set personality from DB inside load(), after sandbox_committed check ──
c = c.replace(
  `      if (data.sandbox_committed) { onAdvanceToConnect(); return }`,
  `      if (data.sandbox_committed) { onAdvanceToConnect(); return }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const d = data as any
      setPersonalityPreference({
        growthProfile: d.growth_profile ?? 5,
        pace: d.pace ?? 5,
        culture: 5,
        environment: d.environment ?? 5,
        lifestyleOrientation: d.lifestyle_orientation ?? 5,
      })`
)

// ── 4. Replace hardcoded personalityPreference in sandboxProfile ─────────────
c = c.replace(
  `    personalityPreference: profile?.personalityPreference ?? { growthProfile: 5, pace: 5, culture: 5, environment: 5, lifestyleOrientation: 5 },`,
  `    personalityPreference,`
)

// ── 5. Update activeProfile to always merge personalityPreference state ───────
c = c.replace(
  `  const activeProfile = (!sandboxTouched && profile) ? profile : sandboxProfile`,
  `  const baseProfile = (!sandboxTouched && profile) ? profile : sandboxProfile
  const activeProfile: UserProfile = { ...baseProfile, personalityPreference }`
)

// ── 6. Add handlePersonalityChange before pinCity ────────────────────────────
c = c.replace(
  `  async function pinCity(cityId: string) {`,
  `  async function handlePersonalityChange(key: string, value: number) {
    setPersonalityPreference(prev => ({ ...prev, [key]: value }))
    if (personalityDebounceRef.current) clearTimeout(personalityDebounceRef.current)
    personalityDebounceRef.current = setTimeout(async () => {
      try {
        const supabase = createClient()
        const { data: { session: s } } = await supabase.auth.getSession()
        if (!s?.user?.email) return
        const colMap: Record<string, string> = {
          growthProfile: 'growth_profile',
          lifestyleOrientation: 'lifestyle_orientation',
          environment: 'environment',
          pace: 'pace',
        }
        const col = colMap[key]
        if (col) {
          await supabase.from('users').update({ [col]: value }).eq('email', s.user.email.toLowerCase())
        }
      } catch {}
    }, 800)
  }

  async function pinCity(cityId: string) {`
)

// ── 7. Add SliderRow as a module-level component (before interface Props) ─────
c = c.replace(
  `interface Props {`,
  `const SliderRow = ({
  leftLabel,
  rightLabel,
  value,
  onChange,
}: {
  leftLabel: string
  rightLabel: string
  value: number
  onChange: (v: number) => void
}) => (
  <div style={{
    display: 'grid',
    gridTemplateColumns: '80px 1fr 80px',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '10px',
  }}>
    <span style={{ fontSize: '10px', color: '#888', textAlign: 'right', lineHeight: 1.3 }}>
      {leftLabel}
    </span>
    <div style={{ position: 'relative', height: '20px', display: 'flex', alignItems: 'center' }}>
      <input
        type="range"
        min={1}
        max={10}
        step={1}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        style={{ width: '100%', accentColor: '#0A1E3D', cursor: 'pointer' }}
      />
    </div>
    <span style={{ fontSize: '10px', color: '#888', textAlign: 'left', lineHeight: 1.3 }}>
      {rightLabel}
    </span>
  </div>
)

interface Props {`
)

// ── 8. Add personality sliders below the 3-column priorities grid ─────────────
// Targets the closing div of the 3-col grid immediately before the NUMBERS PANEL comment
c = c.replace(
  `              </div>
            </div>

            {/* NUMBERS PANEL */}`,
  `              </div>

              {/* Personality sliders */}
              <div style={{
                borderTop: '0.5px solid rgba(0,0,0,0.08)',
                padding: '12px 12px 4px',
                marginTop: '4px',
              }}>
                <p style={{
                  fontSize: '9px',
                  fontWeight: 600,
                  letterSpacing: '0.08em',
                  color: '#666',
                  textTransform: 'uppercase',
                  marginBottom: '10px',
                }}>
                  Your personality
                </p>
                {([
                  { key: 'growthProfile', left: 'Established', right: 'Up-and-Coming' },
                  { key: 'lifestyleOrientation', left: 'Practical', right: 'Upscale & Aspirational' },
                  { key: 'environment', left: 'Urban', right: 'Rural' },
                  { key: 'pace', left: 'Relaxed', right: 'Fast-paced' },
                ] as const).map(({ key, left, right }) => (
                  <SliderRow
                    key={key}
                    leftLabel={left}
                    rightLabel={right}
                    value={personalityPreference[key]}
                    onChange={(v) => handlePersonalityChange(key, v)}
                  />
                ))}
              </div>
            </div>

            {/* NUMBERS PANEL */}`
)

// ── Verify all replacements landed ───────────────────────────────────────────
const checks = [
  ['SELECT includes growth_profile', c.includes('growth_profile,lifestyle_orientation,environment,pace\')')],
  ['personalityPreference state', c.includes('const [personalityPreference, setPersonalityPreference]')],
  ['personalityDebounceRef', c.includes('personalityDebounceRef')],
  ['DB load sets personality', c.includes('d.growth_profile ?? 5')],
  ['sandboxProfile uses state', c.includes('    personalityPreference,\n  }')],
  ['activeProfile merges state', c.includes('const activeProfile: UserProfile = { ...baseProfile, personalityPreference }')],
  ['handlePersonalityChange', c.includes('async function handlePersonalityChange')],
  ['SliderRow component', c.includes('const SliderRow = (')],
  ['Sliders UI rendered', c.includes('Your personality')],
]

let allOk = true
for (const [name, ok] of checks) {
  if (!ok) { console.error('FAILED:', name); allOk = false }
  else console.log('OK:', name)
}

if (!allOk) {
  console.error('\nOne or more replacements failed — file NOT written.')
  process.exit(1)
}

fs.writeFileSync(file, c, 'utf8')
console.log('\nFile written successfully.')
