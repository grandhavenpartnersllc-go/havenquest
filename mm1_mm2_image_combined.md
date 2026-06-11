# Build Brief — MM1 Reorder + MM2 Report Enhancements + City Image Fallback
**Date:** June 5, 2026
**For:** Claude Code
**Type:** Execute — three files, multiple changes
**Priority:** Medium-High
**Report back:** Confirm all changes complete, commit and push to main

---

## Change 1 — MM1 Section Reorder
**File:** `components/portal/milemarkers/MM1Explore.tsx`

### Current order:
1. Personal Welcome
2. Your First Look (city matches)
3. Navigator Journey (mock portal)
4. What Makes This Different
5. Portal Ownership Statement
6. CTA

### New order:
1. Personal Welcome
2. Navigator Journey (mock portal) — moved up
3. Your First Look (city matches) — moved down
4. What Makes This Different
5. Portal Ownership Statement
6. CTA

### Why:
Client needs to understand MileMarkers before references to
"MileMarker 3" appear in the city teaser note. Seeing the
journey first makes the forward-looking note meaningful.

### Additional change — MM3 highlight in mock portal:
In the mock portal tab tour, add a subtle visual indicator
on the MM3 Discover tab to signal "this is where you're
headed next after exploring your matches." Style it with
a slightly warmer background or a small gold dot/indicator
compared to the other upcoming tabs. The Welcome tab remains
the active/selected tab. MM3 just gets a "coming soon"
visual cue — not active, just distinguished.

### Update the forward-looking note in city teaser:
The note currently reads:
"In MileMarker 3 — Discover — you'll dial these in."

Keep this wording — it now makes sense because the client
has just seen the mock portal and knows what MileMarker 3 is.

---

## Change 2 — MM2 Report Enhancements
**File:** `components/portal/milemarkers/MM2Discover.tsx`

### 2a — Budget Fit label + financial status next to city name

In each city report (rendered in the active tab panel),
find where the city name and location render at the top
of the FullReport component.

**Add "Budget Fit" label and status indicator next to the
city/state line:**

```jsx
{/* Next to "Corpus Christi, TX" */}
<div style={{ display: 'flex', alignItems: 'center',
  gap: '12px', flexWrap: 'wrap' }}>
  <div>
    <h1 style={{ fontSize: '24px', fontWeight: 700 }}>
      {location.name}, TX
    </h1>
    <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)' }}>
      {location.metroUsed} · {location.county}
    </p>
  </div>

  {/* Budget Fit indicator */}
  <div style={{
    display: 'flex', flexDirection: 'column',
    alignItems: 'center',
    padding: '6px 12px',
    borderRadius: '8px',
    border: '0.5px solid var(--color-border-tertiary)',
    background: 'var(--color-background-secondary)'
  }}>
    <p style={{
      fontSize: '9px', fontWeight: 600,
      color: 'var(--color-text-tertiary)',
      textTransform: 'uppercase', letterSpacing: '0.1em',
      marginBottom: '3px'
    }}>
      Budget Fit
    </p>
    <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
      <div style={{
        width: '8px', height: '8px', borderRadius: '50%',
        background: affordabilityStatus === 'Comfortable' ? '#1D9E75'
          : affordabilityStatus === 'Moderate' ? '#C9A84C'
          : '#E53E3E'
      }} />
      <span style={{
        fontSize: '12px', fontWeight: 500,
        color: 'var(--color-text-primary)'
      }}>
        {affordabilityStatus}
      </span>
    </div>
  </div>
</div>
```

The affordabilityStatus should be computed from the client's
financial profile against this city's median home price —
same logic already used elsewhere in the report. Pass it
down as a prop or compute it within the FullReport component.

### 2b — Download and Print buttons in tab report header

In the report content area (inside the tab panel, above
the FullReport component), add a small action bar with
Download and Print buttons in the upper right:

```jsx
<div style={{
  display: 'flex',
  justifyContent: 'flex-end',
  gap: '8px',
  marginBottom: '16px'
}}>
  <button
    onClick={() => window.print()}
    style={{
      padding: '6px 14px', fontSize: '12px', fontWeight: 500,
      border: '0.5px solid var(--color-border-tertiary)',
      borderRadius: '6px', background: 'transparent',
      color: 'var(--color-text-secondary)', cursor: 'pointer'
    }}
  >
    Print
  </button>
  <button
    onClick={() => window.open(
      `/report/${matches[activeReportIndex]?.location.id}`,
      '_blank'
    )}
    style={{
      padding: '6px 14px', fontSize: '12px', fontWeight: 500,
      border: 'none', borderRadius: '6px',
      background: '#B8912A', color: '#fff', cursor: 'pointer'
    }}
  >
    Download ↓
  </button>
</div>
```

No Email button — client can download and share themselves.

---

## Change 3 — City Image Fallback Fix
**Files:** `components/portal/SavedMatches.tsx`,
`components/results/CityMatchCard.tsx`,
`components/portal/milemarkers/MM1Explore.tsx`

### The problem:
The `onError` fallback to `/images/cities/default-tx.jpg`
may not be firing correctly for cities without images.

### Fix:
In every component that renders a city image, verify the
onError handler is correctly wired. Update to use this
reliable pattern:

```jsx
<Image
  src={`/images/cities/${cityId}.jpg`}
  alt={`${cityName}, Texas`}
  fill
  className="object-cover"
  onError={(e) => {
    const target = e.target as HTMLImageElement
    if (target.src !== window.location.origin + '/images/cities/default-tx.jpg') {
      target.src = '/images/cities/default-tx.jpg'
    }
  }}
/>
```

The guard `if (target.src !== ...default-tx.jpg)` prevents
an infinite error loop if the default image itself fails to load.

Also confirm `/public/images/cities/default-tx.jpg` exists
on disk. Run: `ls public/images/cities/default-tx.jpg`
If it does not exist, copy any existing city image and
rename it default-tx.jpg, then git add it.

Apply this pattern to every city image in:
- `components/portal/SavedMatches.tsx`
- `components/results/CityMatchCard.tsx`
- `components/portal/milemarkers/MM1Explore.tsx`
- Any other component found to have city images

---

## Acceptance Criteria

**MM1 reorder:**
- [ ] Navigator Journey section appears before city matches
- [ ] MM3 tab in mock portal has subtle visual distinction
- [ ] Forward-looking note still references MileMarker 3 Discover
- [ ] All other content and functionality unchanged

**MM2 report enhancements:**
- [ ] "Budget Fit" label appears above affordability indicator
- [ ] Affordability dot + status text appear next to city name
- [ ] Colors: green = Comfortable, gold = Moderate, red = Stretched
- [ ] Print and Download buttons in upper right of tab report area
- [ ] Download opens /report/[slug] in new tab
- [ ] Print triggers window.print()
- [ ] No Email button

**City image fallback:**
- [ ] default-tx.jpg exists in /public/images/cities/
- [ ] onError handler fires correctly for cities without images
- [ ] Default image shows for all cities without dedicated image
- [ ] No infinite error loop if default image also missing

**All:**
- [ ] tsc --noEmit clean

---

## Commit and Deploy

After all changes confirmed and tsc --noEmit clean:

```
git add components/portal/milemarkers/MM1Explore.tsx
git add components/portal/milemarkers/MM2Discover.tsx
git add components/portal/SavedMatches.tsx
git add components/results/CityMatchCard.tsx
git add public/images/cities/default-tx.jpg
git commit -m "feat: MM1 section reorder with MM3 highlight, MM2 budget fit label and report actions, city image fallback fix"
git push origin main
```

Confirm push — paste commit hash.
