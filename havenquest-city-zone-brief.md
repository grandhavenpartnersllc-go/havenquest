# HavenQuest — City Zone Assignment Brief
**Prepared by:** Claude (COO/Chief Editor)  
**Date:** May 29, 2026  
**Status:** Ready for Claude Code implementation  
**Priority:** P1 — Enables realtor routing and zone-based discovery

---

## Overview

This brief adds a `zone` field to every city entry in `data/cities.ts` and updates the Market Specialty dropdown in `components/for-realtors/ForRealtorsClient.tsx` to include 3 new zones.

**Total cities:** 101  
**Total zones:** 51 (was 48 — adding 3 new zones)

---

## Part 1 — Update ForRealtorsClient.tsx

### Add 3 new zones to the Market Specialty dropdown

In `components/for-realtors/ForRealtorsClient.tsx`, find the Houston `<optgroup>` section and add this option:

```html
<option value="Galveston Island / Gulf Coast">Galveston Island / Gulf Coast</option>
```

Add after "Baytown / East Houston Industrial Corridor".

Find the San Antonio `<optgroup>` section and add this option:

```html
<option value="Texas Hill Country">Texas Hill Country</option>
```

Add after "Boerne / Fair Oaks Ranch / Hill Country Corridor".

Add a new 5th `<optgroup>` for standalone Gulf Coast markets:

```html
<optgroup label="GULF COAST / BRAZOSPORT">
  <option value="Brazosport / Gulf Coast South">Brazosport / Gulf Coast South</option>
</optgroup>
```

---

## Part 2 — Add zone field to all 101 cities in data/cities.ts

Add a `zone` string field to every city object. The field goes after the `metroUsed` field.

**Format:** `zone: 'zone-value-here',`

### AUSTIN METRO (20 cities)

| City ID | zone value |
|---------|-----------|
| `austin-tx` | `'Austin Urban Core'` |
| `round-rock-tx` | `'Round Rock / Pflugerville / Hutto Corridor'` |
| `cedar-park-tx` | `'Northwest Austin / Cedar Park / Leander'` |
| `georgetown-tx` | `'Georgetown / North Growth Corridor'` |
| `kyle-tx` | `'Kyle / Buda / South Growth Corridor'` |
| `san-marcos-tx` | `'Kyle / Buda / South Growth Corridor'` |
| `leander-tx` | `'Northwest Austin / Cedar Park / Leander'` |
| `pflugerville-tx` | `'Round Rock / Pflugerville / Hutto Corridor'` |
| `buda-tx` | `'Kyle / Buda / South Growth Corridor'` |
| `hutto-tx` | `'Round Rock / Pflugerville / Hutto Corridor'` |
| `taylor-tx` | `'Round Rock / Pflugerville / Hutto Corridor'` |
| `liberty-hill-tx` | `'Northwest Austin / Cedar Park / Leander'` |
| `lakeway-tx` | `'Lake Travis / Hill Country Galleria'` |
| `bee-cave-tx` | `'Lake Travis / Hill Country Galleria'` |
| `dripping-springs-tx` | `'Southwest Austin / Dripping Springs'` |
| `manor-tx` | `'East Austin'` |
| `bastrop-tx` | `'Kyle / Buda / South Growth Corridor'` |
| `wimberley-tx` | `'Texas Hill Country'` |
| `lockhart-tx` | `'Kyle / Buda / South Growth Corridor'` |
| `marble-falls-tx` | `'Texas Hill Country'` |

### DALLAS-FORT WORTH METRO (37 cities)

| City ID | zone value |
|---------|-----------|
| `dallas-tx` | `'Urban Core Dallas'` |
| `fort-worth-tx` | `'Fort Worth Urban Core'` |
| `frisco-tx` | `'Collin County Growth Corridor'` |
| `plano-tx` | `'North Dallas / Platinum Corridor'` |
| `mckinney-tx` | `'Collin County Growth Corridor'` |
| `allen-tx` | `'Collin County Growth Corridor'` |
| `prosper-tx` | `'Collin County Growth Corridor'` |
| `flower-mound-tx` | `'Denton County Growth Belt'` |
| `southlake-tx` | `'Luxury North Suburbs'` |
| `keller-tx` | `'Luxury North Suburbs'` |
| `mansfield-tx` | `'South Fort Worth / Mansfield Corridor'` |
| `rockwall-tx` | `'East Dallas & Lake Communities'` |
| `coppell-tx` | `'Mid-Cities / Airport Corridor'` |
| `grapevine-tx` | `'Mid-Cities / Airport Corridor'` |
| `argyle-tx` | `'Denton County Growth Belt'` |
| `wylie-tx` | `'East Dallas & Lake Communities'` |
| `arlington-tx` | `'Mid-Cities / Airport Corridor'` |
| `irving-tx` | `'Mid-Cities / Airport Corridor'` |
| `richardson-tx` | `'North Dallas / Platinum Corridor'` |
| `denton-tx` | `'Denton County Growth Belt'` |
| `lewisville-tx` | `'Denton County Growth Belt'` |
| `carrollton-tx` | `'North Dallas / Platinum Corridor'` |
| `celina-tx` | `'Collin County Growth Corridor'` |
| `little-elm-tx` | `'Denton County Growth Belt'` |
| `midlothian-tx` | `'South Fort Worth / Mansfield Corridor'` |
| `forney-tx` | `'East Dallas & Lake Communities'` |
| `colleyville-tx` | `'Luxury North Suburbs'` |
| `trophy-club-tx` | `'Luxury North Suburbs'` |
| `heath-tx` | `'East Dallas & Lake Communities'` |
| `waxahachie-tx` | `'Southern Sector / Best Southwest'` |
| `garland-tx` | `'East Dallas & Lake Communities'` |
| `grand-prairie-tx` | `'Mid-Cities / Airport Corridor'` |
| `burleson-tx` | `'South Fort Worth / Mansfield Corridor'` |
| `mesquite-tx` | `'East Dallas & Lake Communities'` |
| `cedar-hill-tx` | `'Southern Sector / Best Southwest'` |
| `desoto-tx` | `'Southern Sector / Best Southwest'` |
| `anna-tx` | `'Collin County Growth Corridor'` |

### HOUSTON METRO (26 cities)

| City ID | zone value |
|---------|-----------|
| `houston-tx` | `'Inner Loop / Urban Core Houston'` |
| `the-woodlands-tx` | `'The Woodlands / North Houston'` |
| `sugar-land-tx` | `'Sugar Land / Fort Bend County'` |
| `katy-tx` | `'Katy / Fulshear / West Houston Energy Corridor'` |
| `pearland-tx` | `'Pearland / South Houston'` |
| `league-city-tx` | `'Clear Lake / NASA / Southeast Houston'` |
| `friendswood-tx` | `'Clear Lake / NASA / Southeast Houston'` |
| `conroe-tx` | `'Conroe / Montgomery County North Growth Belt'` |
| `cypress-tx` | `'Cypress / Northwest Houston'` |
| `missouri-city-tx` | `'Sugar Land / Fort Bend County'` |
| `tomball-tx` | `'Spring / Klein / Champions Corridor'` |
| `fulshear-tx` | `'Katy / Fulshear / West Houston Energy Corridor'` |
| `pasadena-tx` | `'Baytown / East Houston Industrial Corridor'` |
| `baytown-tx` | `'Baytown / East Houston Industrial Corridor'` |
| `humble-tx` | `'Kingwood / Lake Houston Corridor'` |
| `spring-tx` | `'Spring / Klein / Champions Corridor'` |
| `galveston-tx` | `'Galveston Island / Gulf Coast'` |
| `richmond-tx` | `'Richmond / Rosenberg / Southwest Growth Corridor'` |
| `rosenberg-tx` | `'Richmond / Rosenberg / Southwest Growth Corridor'` |
| `manvel-tx` | `'Pearland / South Houston'` |
| `deer-park-tx` | `'Baytown / East Houston Industrial Corridor'` |
| `texas-city-tx` | `'Galveston Island / Gulf Coast'` |
| `alvin-tx` | `'Brazosport / Gulf Coast South'` |
| `dickinson-tx` | `'Clear Lake / NASA / Southeast Houston'` |
| `lake-jackson-tx` | `'Brazosport / Gulf Coast South'` |
| `webster-tx` | `'Clear Lake / NASA / Southeast Houston'` |

### SAN ANTONIO METRO (16 cities)

| City ID | zone value |
|---------|-----------|
| `san-antonio-tx` | `'Urban Core / Central San Antonio'` |
| `new-braunfels-tx` | `'New Braunfels / I-35 Northeast Growth Corridor'` |
| `boerne-tx` | `'Boerne / Fair Oaks Ranch / Hill Country Corridor'` |
| `schertz-tx` | `'Schertz / Cibolo / Universal City'` |
| `cibolo-tx` | `'Schertz / Cibolo / Universal City'` |
| `helotes-tx` | `'Northwest San Antonio / Helotes'` |
| `converse-tx` | `'East San Antonio / Converse Corridor'` |
| `universal-city-tx` | `'Schertz / Cibolo / Universal City'` |
| `alamo-heights-tx` | `'Alamo Heights / Terrell Hills / Olmos Park'` |
| `seguin-tx` | `'New Braunfels / I-35 Northeast Growth Corridor'` |
| `fair-oaks-ranch-tx` | `'Boerne / Fair Oaks Ranch / Hill Country Corridor'` |
| `leon-valley-tx` | `'West San Antonio / Alamo Ranch'` |
| `canyon-lake-tx` | `'Texas Hill Country'` |
| `kerrville-tx` | `'Texas Hill Country'` |
| `fredericksburg-tx` | `'Texas Hill Country'` |
| `pleasanton-tx` | `'South San Antonio / Mission Corridor'` |

### OTHER TEXAS (2 cities)

| City ID | zone value |
|---------|-----------|
| `waco-tx` | `'Waco'` |
| `corpus-christi-tx` | `'Corpus Christi'` |

---

## Part 3 — TypeScript Interface Update

In `/types/index.ts`, add `zone: string` to the Location interface (or City interface — whichever defines the city object structure). Place it after `metroUsed`.

---

## Implementation Checklist for Claude Code

- [ ] Add 3 new zones to ForRealtorsClient.tsx dropdown
- [ ] Add `zone` field to Location/City interface in types/index.ts
- [ ] Add `zone` value to all 101 city objects in data/cities.ts
- [ ] Run `tsc --noEmit` — must be clean
- [ ] Commit with message: "data: add zone field to all 101 cities, add 3 new zones to realtor dropdown"
- [ ] Push to main

---

## What This Enables (Phase 2 Builds)

Once zone is in the data:
- Group city results by zone in the portal
- Filter cities by zone in Metro Mode
- Auto-route buyers to zone-specific realtors
- Show zone description alongside city match results
- Ambassador sees buyer's matched zone for realtor routing

---

*Brief prepared by Claude — HavenQuest COO/Chief Editor. May 29, 2026.*
