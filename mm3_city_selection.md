# Build Brief — MM3 City Selection + Confirmation Checkbox Gate
**Date:** June 4, 2026
**For:** Claude Code
**Type:** Execute — UI and state changes to MM3Discover
**Priority:** High — core UX flow change
**Report back:** Confirm all changes complete, commit and push to main

---

## Overview

MM3 currently has "Choose" buttons on each city card in the Live City
Rankings. These need to be wired to state so the user can select up
to 2 cities. A confirmation checkbox and a gated advance button are
added at the bottom of MM3. The advance button only activates when
at least 1 city is chosen AND the checkbox is checked.

---

## Change 1 — City Selection State

**File:** `components/portal/milemarkers/MM3Discover.tsx`

Add a new state variable to track chosen cities:
```javascript
const [chosenCities, setChosenCities] = useState<string[]>([])
// Stores city IDs of chosen cities, max 2
```

---

## Change 2 — Wire the Choose Buttons

Find the "Choose" button on each city card in the rankings list.
Currently it likely does nothing or has a placeholder handler.

Update the onClick to:
```javascript
onClick={() => {
  const cityId = match.location.id
  if (chosenCities.includes(cityId)) {
    // Deselect — remove from chosen
    setChosenCities(prev => prev.filter(id => id !== cityId))
  } else if (chosenCities.length < 2) {
    // Select — add to chosen
    setChosenCities(prev => [...prev, cityId])
  }
  // If already 2 chosen and this city is not one of them — do nothing
}}
```

**Button visual states:**
- Default (not chosen): existing "Choose" styling
- Chosen: change button label to "✓ Chosen" — use gold #B8912A text,
  gold border, light gold background (#FAEEDA). Apply to the button
  when chosenCities.includes(match.location.id)
- Disabled (2 already chosen, this city not one of them): muted
  opacity-40, cursor-not-allowed

**City card highlight:**
When a city is chosen, add a subtle gold left border or background
tint to the entire city card row — same treatment as the existing
"Financial panel showing this city" highlight but in gold.

**Maximum 2 cities:**
If user tries to choose a 3rd city, do not add it. The button should
appear disabled (opacity-40, cursor-not-allowed) for unchosen cities
when chosenCities.length === 2.

---

## Change 3 — Confirmation Checkbox

Add a confirmation section at the bottom of MM3, below the sandbox
controls and above the advance button. Only show this section when
at least 1 city has been chosen (chosenCities.length > 0).

```jsx
{chosenCities.length > 0 && (
  <div style={{
    marginTop: '2rem',
    padding: '1.25rem',
    borderRadius: '12px',
    border: '0.5px solid rgba(184,145,42,0.3)',
    background: '#FAEEDA'
  }}>
    {/* Selected cities summary */}
    <p style={{ fontSize: '13px', color: '#633806', marginBottom: '12px', fontWeight: 500 }}>
      Your selected {chosenCities.length === 1 ? 'community' : 'communities'} for
      your Market Director:
    </p>
    <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', flexWrap: 'wrap' }}>
      {chosenCities.map(cityId => {
        const city = getAllCities().find(c => c.id === cityId)
        return city ? (
          <span key={cityId} style={{
            background: '#B8912A', color: '#fff',
            padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 500
          }}>
            {city.name}
          </span>
        ) : null
      })}
    </div>

    {/* Confirmation checkbox */}
    <label style={{
      display: 'flex', alignItems: 'flex-start', gap: '10px', cursor: 'pointer'
    }}>
      <input
        type="checkbox"
        checked={confirmed}
        onChange={e => setConfirmed(e.target.checked)}
        style={{ marginTop: '2px', accentColor: '#B8912A', width: '16px', height: '16px', flexShrink: 0 }}
      />
      <span style={{ fontSize: '13px', color: '#633806', lineHeight: 1.5 }}>
        I'm ready to connect with a Market Director and take the
        next step toward my Lone Star Lifestyle.
      </span>
    </label>
  </div>
)}
```

Add the confirmed state variable:
```javascript
const [confirmed, setConfirmed] = useState(false)
```

---

## Change 4 — Gated Advance Button

Find the existing advance/commit button at the bottom of MM3
(the button that advances to MM4 or sends the plan email).

Gate it behind both conditions:
```javascript
const canAdvance = chosenCities.length >= 1 && confirmed
```

Apply to the advance button:
- When `canAdvance === false`: disabled styling — opacity-40,
  cursor-not-allowed, do not fire onClick
- When `canAdvance === true`: full styling, onClick fires normally

Add helper text below the button when not yet ready:
```jsx
{!canAdvance && (
  <p style={{ fontSize: '12px', color: 'var(--color-text-tertiary)',
    textAlign: 'center', marginTop: '8px' }}>
    {chosenCities.length === 0
      ? 'Choose at least one community above to continue.'
      : 'Check the box above to continue.'}
  </p>
)}
```

---

## Change 5 — Write Chosen Cities to Supabase

When the user advances (clicks the now-active advance button),
write their chosen cities to the database alongside the existing
advance logic.

Find where current_milemarker is written to Supabase on MM3 advance.
In the same update call, also write:

```javascript
chosen_communities: chosenCities // array of city IDs
```

This field needs to exist on public.users. Check if it exists.
If not, add it as text[] type.

The Market Director will see these chosen communities in their
dashboard when the client arrives at MM4.

---

## Acceptance Criteria

- [ ] Choose buttons toggle between "Choose" and "✓ Chosen" states
- [ ] Maximum 2 cities can be chosen — 3rd choice is blocked
- [ ] Chosen city cards show visual highlight (gold border/tint)
- [ ] Confirmation section appears only after at least 1 city chosen
- [ ] Selected city names shown as gold pills in confirmation section
- [ ] Checkbox activates when clicked
- [ ] Advance button grayed out until both conditions met
- [ ] Helper text guides user toward missing condition
- [ ] On advance: chosen_communities written to Supabase
- [ ] tsc --noEmit clean

---

## Commit and Deploy

After all changes confirmed and tsc --noEmit clean:

```
git add components/portal/milemarkers/MM3Discover.tsx
git add [any migration files if public.users schema updated]
git commit -m "feat: MM3 city selection (max 2), confirmation checkbox, gated advance button"
git push origin main
```

Confirm push — paste commit hash.
