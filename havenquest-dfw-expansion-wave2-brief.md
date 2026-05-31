# HavenQuest — DFW Expansion Brief Wave 2: 4 New Cities
**Prepared by:** Claude (COO/Chief Editor)  
**Date:** May 28, 2026  
**Status:** Ready for Claude Code implementation  
**Priority:** P1 — Pre-beta expansion

---

## Summary

Adds 4 additional DFW cities to `data/cities.ts`. All entries are complete and ready to insert. Each city has been researched with city-level data sourced from Redfin, Zillow, Orchard, Movoto, TEA (August 2025 ratings), and local market reports.

Cities added:
1. Coppell (Dallas County — tier2)
2. Grapevine (Tarrant County — tier2)
3. Argyle (Denton County — tier2)
4. Wylie (Collin County — tier2)

---

## Implementation Instructions for Claude Code

Append all 4 city objects to the `texasCities` array in `data/cities.ts`, after the 7 cities added in the DFW Wave 1 brief (after Rockwall). Do not modify any existing entries. Run `tsc --noEmit` after insertion. Commit and push.

---

## City Data — Complete Entries

### 1. COPPELL, TX

```typescript
{
  id: 'coppell-tx',
  name: 'Coppell',
  state: 'TX',
  county: 'Dallas',
  type: 'city',
  tier: 'tier2',
  parentId: null,
  hasNeighborhoodData: false,
  lastUpdated: '05/2026',
  metroUsed: 'Dallas, TX metro area',
  scores: {
    affordability: 3,
    schools: 10,
    safety: 10,
    walkability: 3,
    transit: 2,
    nightlife: 3,
    outdoors: 6,
    familyFriendly: 10,
    remoteWork: 9,
    lowTaxes: 7,
    weather: 5,
    traffic: 7,
  },
  housing: {
    avgRent1BR: 1600,
    avgRent2BR: 1950,
    avgRent3BR: 2450,
    starterHomePrice: 430000,
    medianHomePrice: 632000,
    propertyTaxRate: 0.0195,
    pricePerSqFt: 254,
    monthlyUtilities: 220,
    monthlyGroceries: 435,
    monthlyTransportation: 450,
  },
  market: {
    daysOnMarket: 32,
    saleToListRatio: 98.0,
    priceYOY: 4.7,
    marketCondition: 'Sellers Market',
    redfinMedianPrice: 632000,
    redfinDataSource: 'Zillow ZHVI city-level — Coppell, TX. Date: 05/2026',
  },
  school: {
    teaRating: 'A',
    primaryISD: 'Coppell ISD',
  },
  description: 'Coppell is the most complete suburb in the Dallas-Fort Worth Metroplex — Coppell ISD earned a 93/100 A from TEA in 2025, the city has maintained a top-10 national safety ranking for over a decade, and its location at the intersection of SH-121 and Belt Line Road puts DFW Airport, Las Colinas, and downtown Dallas all within 20 minutes. For families who want the absolute best schools and safety without Southlake\'s $1.3M price tag, Coppell is the answer.',
  strengths: [
    'Coppell ISD rated A (93/100) — one of the highest-scoring districts in North Texas',
    'Top 10 safest city in America — consistent national ranking for over a decade',
    'DFW Airport 15 minutes — best airport access of any top-rated school suburb in DFW',
  ],
  weaknesses: [
    'Premium pricing — median $632K with limited inventory as a largely built-out city',
    'Largely built out — most new construction requires going to adjacent communities',
    'Car-dependent — Walk Score 28, no meaningful transit outside DFW Airport corridor',
  ],
},
```

---

### 2. GRAPEVINE, TX

```typescript
{
  id: 'grapevine-tx',
  name: 'Grapevine',
  state: 'TX',
  county: 'Tarrant',
  type: 'city',
  tier: 'tier2',
  parentId: null,
  hasNeighborhoodData: false,
  lastUpdated: '05/2026',
  metroUsed: 'Dallas, TX metro area',
  scores: {
    affordability: 3,
    schools: 7,
    safety: 8,
    walkability: 5,
    transit: 2,
    nightlife: 7,
    outdoors: 8,
    familyFriendly: 7,
    remoteWork: 8,
    lowTaxes: 7,
    weather: 5,
    traffic: 7,
  },
  housing: {
    avgRent1BR: 1550,
    avgRent2BR: 1900,
    avgRent3BR: 2400,
    starterHomePrice: 380000,
    medianHomePrice: 585000,
    propertyTaxRate: 0.0185,
    pricePerSqFt: 250,
    monthlyUtilities: 218,
    monthlyGroceries: 430,
    monthlyTransportation: 445,
  },
  market: {
    daysOnMarket: 53,
    saleToListRatio: 98.4,
    priceYOY: -2.9,
    marketCondition: 'Balanced Market',
    redfinMedianPrice: 585000,
    redfinDataSource: 'Redfin city-level — Grapevine, TX. Date: 10/2025',
  },
  school: {
    teaRating: 'B',
    primaryISD: 'Grapevine-Colleyville ISD',
  },
  description: 'Grapevine is the most characterful suburb in DFW — a genuine historic Main Street with wine tasting rooms, boutique shops, and live music venues, Grapevine Lake with 8,000 acres of recreation, and DFW Airport literally on its border. It\'s the rare Texas suburb that doesn\'t feel like a suburb, attracting buyers who want community identity and outdoor access alongside strong schools and an easy commute.',
  strengths: [
    'Historic Main Street — boutiques, wine tasting, restaurants, and live music in a genuine downtown',
    'Grapevine Lake — 8,000 acres, 26 miles of shoreline, marinas, and Northshore Trail',
    'DFW Airport adjacent — unmatched access for frequent travelers and airport corridor workers',
  ],
  weaknesses: [
    'Grapevine-Colleyville ISD rated B — solid but below the A-rated Collin County districts',
    'Premium pricing — median $585K for a suburb without an A-rated ISD',
    'Tourism traffic — Main Street and DFW proximity can create congestion on weekends',
  ],
},
```

---

### 3. ARGYLE, TX

```typescript
{
  id: 'argyle-tx',
  name: 'Argyle',
  state: 'TX',
  county: 'Denton',
  type: 'city',
  tier: 'tier2',
  parentId: null,
  hasNeighborhoodData: false,
  lastUpdated: '05/2026',
  metroUsed: 'Dallas, TX metro area',
  scores: {
    affordability: 3,
    schools: 10,
    safety: 10,
    walkability: 1,
    transit: 1,
    nightlife: 1,
    outdoors: 7,
    familyFriendly: 10,
    remoteWork: 7,
    lowTaxes: 6,
    weather: 5,
    traffic: 6,
  },
  housing: {
    avgRent1BR: 1600,
    avgRent2BR: 1950,
    avgRent3BR: 2500,
    starterHomePrice: 430000,
    medianHomePrice: 596000,
    propertyTaxRate: 0.0215,
    pricePerSqFt: 199,
    monthlyUtilities: 215,
    monthlyGroceries: 430,
    monthlyTransportation: 445,
  },
  market: {
    daysOnMarket: 64,
    saleToListRatio: 95.2,
    priceYOY: -10.8,
    marketCondition: 'Buyers Market',
    redfinMedianPrice: 596000,
    redfinDataSource: 'Orchard city-level — Argyle, TX. Date: 05/2026',
  },
  school: {
    teaRating: 'A',
    primaryISD: 'Argyle ISD',
  },
  description: 'Argyle is where families move when they\'ve done the research and decided Southlake\'s price isn\'t necessary to get the same school quality. Argyle ISD earned a 97/100 A from TEA — ranked No. 1 in Denton County — with a 98% graduation rate and a violent crime rate 70% below the Texas average. The trade is real: limited local amenities, acreage-lot lifestyle, and a commute that demands patience. For the right family, no suburb in DFW offers this combination.',
  strengths: [
    'Argyle ISD ranked No. 1 in Denton County — 97/100 TEA score, 98% graduation rate',
    'Violent crime 70% below Texas average — 1.27 per 1,000 residents',
    'Acreage lots available — rare in DFW suburbs, exceptional for families wanting space',
  ],
  weaknesses: [
    'Minimal local amenities — dining, retail, and entertainment require 15-25 min drive',
    'MUD/PID tax districts in master-planned communities can add $4,000–$7,000/year to tax burden',
    'Growing pains — US 377 and FM 407 road construction ongoing through multiple years',
  ],
},
```

---

### 4. WYLIE, TX

```typescript
{
  id: 'wylie-tx',
  name: 'Wylie',
  state: 'TX',
  county: 'Collin',
  type: 'city',
  tier: 'tier2',
  parentId: null,
  hasNeighborhoodData: false,
  lastUpdated: '05/2026',
  metroUsed: 'Dallas, TX metro area',
  scores: {
    affordability: 6,
    schools: 9,
    safety: 8,
    walkability: 2,
    transit: 1,
    nightlife: 2,
    outdoors: 6,
    familyFriendly: 8,
    remoteWork: 7,
    lowTaxes: 8,
    weather: 5,
    traffic: 7,
  },
  housing: {
    avgRent1BR: 1300,
    avgRent2BR: 1600,
    avgRent3BR: 2000,
    starterHomePrice: 270000,
    medianHomePrice: 387000,
    propertyTaxRate: 0.0190,
    pricePerSqFt: 189,
    monthlyUtilities: 210,
    monthlyGroceries: 415,
    monthlyTransportation: 435,
  },
  market: {
    daysOnMarket: 41,
    saleToListRatio: 96.8,
    priceYOY: -4.5,
    marketCondition: 'Buyers Market',
    redfinMedianPrice: 387000,
    redfinDataSource: 'Redfin city-level / Dunnican Team — Wylie, TX. Date: 03/2026',
  },
  school: {
    teaRating: 'A',
    primaryISD: 'Wylie ISD',
  },
  description: 'Wylie is the best value play in Collin County — Wylie ISD earned an A from TEA in 2025, median home prices sit well below McKinney and Allen, and Lavon Lake provides genuine outdoor recreation minutes from residential neighborhoods. It\'s the answer for families who want the Collin County school quality and safety without paying the Frisco or Plano premium, and are willing to trade some commute time for meaningful savings.',
  strengths: [
    'Wylie ISD rated A by TEA in 2025 — best value A-rated school district in Collin County',
    'Most affordable A-rated school district suburb in DFW — median $387K',
    'Lavon Lake access — boating, fishing, and trails within city limits',
  ],
  weaknesses: [
    'East Collin County location — longer commute to Dallas, Plano, and Frisco employment',
    'Limited local amenities — retail and dining concentrated in newer commercial corridors',
    'Car-dependent — no transit, limited walkability outside town center',
  ],
},
```

---

## Implementation Checklist for Claude Code

- [ ] Append all 4 city objects to `texasCities` array in `data/cities.ts`
- [ ] Insert after the Rockwall entry (last city from Wave 1 brief)
- [ ] Do not modify any existing city entries
- [ ] Run `tsc --noEmit` to verify no TypeScript errors
- [ ] Commit with message noting all 4 cities added
- [ ] Push to main

---

## Score Notes

- Coppell affordability 3/10 — median $632K, premium market, correct
- Grapevine affordability 3/10 — median $585K, premium for a B-rated ISD
- Argyle affordability 3/10 — median $596K plus MUD/PID tax exposure
- Wylie affordability 6/10 — median $387K, genuinely accessible for Collin County
- Argyle nightlife 1/10 — intentional, essentially no local nightlife
- Coppell schools 10/10 — 93/100 TEA, justified
- Argyle schools 10/10 — 97/100 TEA, No. 1 Denton County, justified
- Wylie schools 9/10 — TEA A but smaller district than Coppell/Frisco, 9 is correct

---

*Brief prepared by Claude — HavenQuest COO/Chief Editor. May 28, 2026. Data sourced from Redfin, Zillow, Orchard, Movoto, TEA (Aug 2025), and local market reports including The Dunnican Team and TK Realty.*
