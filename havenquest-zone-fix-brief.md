# HavenQuest — Zone Fix Brief
**Prepared by:** Claude (COO/Chief Editor)  
**Date:** May 29, 2026  
**Status:** Ready for Claude Code implementation  
**Priority:** P1 — Fixes zone discrepancies before realtor outreach

---

## Overview

Fixes three discrepancies between the zones page and the realtor application dropdown. Splits "Texas Hill Country" into two metro-oriented zones. Adds standalone market options to the dropdown.

---

## Changes Required

### 1. app/zones/page.tsx

**In the Austin Metro section — add new zone:**
Zone name: `Austin Hill Country`
Cities: Wimberley, Marble Falls

**In the San Antonio Metro section — replace "Texas Hill Country" with:**
Zone name: `San Antonio Hill Country`
Cities: Kerrville, Fredericksburg, Canyon Lake
Add note below zone name: *"Includes Hill Country cities with a San Antonio metro orientation"*

---

### 2. components/for-realtors/ForRealtorsClient.tsx

**In the Austin `<optgroup>` — add:**
```html
<option value="Austin Hill Country">Austin Hill Country</option>
```

**In the San Antonio `<optgroup>` — replace:**
```html
<!-- Remove this: -->
<option value="Texas Hill Country">Texas Hill Country</option>

<!-- Replace with: -->
<option value="San Antonio Hill Country">San Antonio Hill Country</option>
```

**After the San Antonio `<optgroup>` — add new optgroup:**
```html
<optgroup label="STANDALONE MARKETS">
  <option value="Waco">Waco</option>
  <option value="Corpus Christi">Corpus Christi</option>
</optgroup>
```

---

### 3. data/cities.ts

Update the `zone` field for these 7 cities:

| City ID | New zone value |
|---------|---------------|
| `wimberley-tx` | `'Austin Hill Country'` |
| `marble-falls-tx` | `'Austin Hill Country'` |
| `kerrville-tx` | `'San Antonio Hill Country'` |
| `fredericksburg-tx` | `'San Antonio Hill Country'` |
| `canyon-lake-tx` | `'San Antonio Hill Country'` |
| `waco-tx` | `'Waco'` |
| `corpus-christi-tx` | `'Corpus Christi'` |

---

## Implementation Checklist

- [ ] Update app/zones/page.tsx — split Texas Hill Country into two zones, add Austin Hill Country
- [ ] Update ForRealtorsClient.tsx — add Austin Hill Country, rename SA Hill Country, add Standalone Markets optgroup
- [ ] Update data/cities.ts — update zone field on 7 cities
- [ ] Run `tsc --noEmit` — must be clean
- [ ] Commit with message: "fix: split Texas Hill Country into Austin/SA zones, add standalone markets to dropdown"
- [ ] Push to main

---

## Result After This Fix

- Dropdown and zones page will be in perfect sync
- Realtors who work the Wimberley/Marble Falls market claim "Austin Hill Country"
- Realtors who work Kerrville/Fredericksburg claim "San Antonio Hill Country"
- Waco and Corpus Christi realtors have options in the dropdown
- Total zones: 52 (was 51 — Austin Hill Country is new)

---

*Brief prepared by Claude — HavenQuest COO/Chief Editor. May 29, 2026.*
