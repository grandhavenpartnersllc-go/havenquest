# HavenQuest — DFW Expansion Brief: 7 New Cities
**Prepared by:** Claude (COO/Chief Editor)  
**Date:** May 28, 2026  
**Status:** Ready for Claude Code implementation  
**Priority:** P1 — Pre-beta expansion

---

## Summary

Adds 7 new DFW cities to `data/cities.ts`. All entries are complete and ready to insert. Each city has been researched with city-level data sourced from Redfin, Zillow, Orchard, Movoto, and TEA (August 2025 ratings).

Cities added:
1. Allen (Collin County — tier2)
2. Prosper (Collin County — tier2)
3. Flower Mound (Denton County — tier2)
4. Southlake (Tarrant County — tier2)
5. Keller (Tarrant County — tier2)
6. Mansfield (Tarrant County — tier2)
7. Rockwall (Rockwall County — tier2)

---

## Implementation Instructions for Claude Code

Append all 7 city objects to the `texasCities` array in `data/cities.ts`, before the closing `]`. Insert them after the existing Corpus Christi entry. Do not modify any existing entries. Run `tsc --noEmit` after insertion. Commit and push.

---

## City Data — Complete entries

### 1. ALLEN, TX

```typescript
{
  id: 'allen-tx',
  name: 'Allen',
  state: 'TX',
  county: 'Collin',
  type: 'city',
  tier: 'tier2',
  parentId: null,
  hasNeighborhoodData: false,
  lastUpdated: '05/2026',
  metroUsed: 'Dallas, TX metro area',
  scores: {
    affordability: 4,
    schools: 9,
    safety: 9,
    walkability: 2,
    transit: 1,
    nightlife: 3,
    outdoors: 5,
    familyFriendly: 9,
    remoteWork: 9,
    lowTaxes: 7,
    weather: 5,
    traffic: 6,
  },
  housing: {
    avgRent1BR: 1450,
    avgRent2BR: 1800,
    avgRent3BR: 2250,
    starterHomePrice: 340000,
    medianHomePrice: 485000,
    propertyTaxRate: 0.0190,
    pricePerSqFt: 211,
    monthlyUtilities: 215,
    monthlyGroceries: 425,
    monthlyTransportation: 445,
  },
  market: {
    daysOnMarket: 74,
    saleToListRatio: 97.0,
    priceYOY: -1.0,
    marketCondition: 'Buyers Market',
    redfinMedianPrice: 485000,
    redfinDataSource: 'Redfin city-level — Allen, TX. Date: 10/2025',
  },
  school: {
    teaRating: 'A',
    primaryISD: 'Allen ISD',
  },
  description: 'Allen is the quiet achiever of Collin County — a largely built-out suburb that delivers A-rated schools, exceptional safety, and a polished community feel without Frisco\'s price premium. Craig Ranch and Twin Creeks are among the most well-regarded master-planned neighborhoods in North Texas, and Allen\'s proximity to the US 75 corridor makes the Plano and Dallas commute genuinely manageable.',
  strengths: [
    'Allen ISD rated A by TEA — 19 of 22 campuses earned A ratings in 2025',
    'Among the safest cities in Texas — consistently top 10 nationally',
    'Craig Ranch and Twin Creeks — master-planned communities with resort amenities',
  ],
  weaknesses: [
    'Largely built out — limited new construction inventory',
    'Car-dependent — Walk Score 35, no meaningful transit',
    'US 75 corridor traffic — peak hour commutes to Dallas can stretch significantly',
  ],
},
```

---

### 2. PROSPER, TX

```typescript
{
  id: 'prosper-tx',
  name: 'Prosper',
  state: 'TX',
  county: 'Collin',
  type: 'city',
  tier: 'tier2',
  parentId: null,
  hasNeighborhoodData: false,
  lastUpdated: '05/2026',
  metroUsed: 'Dallas, TX metro area',
  scores: {
    affordability: 2,
    schools: 9,
    safety: 10,
    walkability: 1,
    transit: 1,
    nightlife: 2,
    outdoors: 5,
    familyFriendly: 9,
    remoteWork: 8,
    lowTaxes: 7,
    weather: 5,
    traffic: 5,
  },
  housing: {
    avgRent1BR: 1800,
    avgRent2BR: 2200,
    avgRent3BR: 2800,
    starterHomePrice: 550000,
    medianHomePrice: 850000,
    propertyTaxRate: 0.0190,
    pricePerSqFt: 242,
    monthlyUtilities: 230,
    monthlyGroceries: 445,
    monthlyTransportation: 460,
  },
  market: {
    daysOnMarket: 40,
    saleToListRatio: 93.3,
    priceYOY: 6.3,
    marketCondition: 'Buyers Market',
    redfinMedianPrice: 850000,
    redfinDataSource: 'Orchard city-level — Prosper, TX. Date: 05/2026',
  },
  school: {
    teaRating: 'A',
    primaryISD: 'Prosper ISD',
  },
  description: 'Prosper is where DFW\'s most affluent families are planting flags — the fastest-growing city in Texas by percentage, with a median household income of $187,000, brand-new master-planned neighborhoods, and Prosper ISD consistently ranked among the top districts in the state. If your budget reaches $800K+, Prosper offers a level of newness and prestige that no other North Texas suburb currently matches.',
  strengths: [
    'Prosper ISD rated A — among the top-performing districts in North Texas',
    'Fastest-growing city in Texas — new infrastructure, new amenities, new everything',
    'Median household income $187,000 — one of the wealthiest communities in the state',
  ],
  weaknesses: [
    'Premium pricing — median $850K makes it one of the most expensive cities in the database',
    'Still developing — some areas lack established retail, dining, and services',
    'Long commute — 32+ minutes average to Dallas employment centers',
  ],
},
```

---

### 3. FLOWER MOUND, TX

```typescript
{
  id: 'flower-mound-tx',
  name: 'Flower Mound',
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
    schools: 8,
    safety: 10,
    walkability: 2,
    transit: 1,
    nightlife: 3,
    outdoors: 9,
    familyFriendly: 9,
    remoteWork: 8,
    lowTaxes: 7,
    weather: 5,
    traffic: 6,
  },
  housing: {
    avgRent1BR: 1600,
    avgRent2BR: 1950,
    avgRent3BR: 2450,
    starterHomePrice: 420000,
    medianHomePrice: 620000,
    propertyTaxRate: 0.0185,
    pricePerSqFt: 232,
    monthlyUtilities: 220,
    monthlyGroceries: 435,
    monthlyTransportation: 450,
  },
  market: {
    daysOnMarket: 25,
    saleToListRatio: 96.6,
    priceYOY: -4.6,
    marketCondition: 'Sellers Market',
    redfinMedianPrice: 620000,
    redfinDataSource: 'Redfin city-level — Flower Mound, TX. Date: 03/2026',
  },
  school: {
    teaRating: 'B',
    primaryISD: 'Lewisville ISD',
  },
  description: 'Flower Mound is consistently ranked one of the best places to live in America — Livability.com\'s No. 1 Best Place in the Southwest in 2025 — and it earns that reputation. Fifty-seven parks, 60 miles of trails, Grapevine Lake access, violent crime at 0.76 per 1,000, and both high schools earning TEA A grades. For outdoor-focused families who want a genuine lifestyle suburb with DFW Airport proximity, nothing in the metro comes close.',
  strengths: [
    'Ranked No. 1 Best Place to Live in the Southwest — Livability.com 2025',
    '57 parks and 60+ miles of trails — best outdoor infrastructure in DFW suburbs',
    'Violent crime 0.76 per 1,000 — among the safest communities in Texas',
  ],
  weaknesses: [
    'Premium pricing — median $620K, entry level $420K',
    'Fully car-dependent — Walk Score 26, no transit',
    'Lewisville ISD rated B — solid but below the A-rated Collin County districts',
  ],
},
```

---

### 4. SOUTHLAKE, TX

```typescript
{
  id: 'southlake-tx',
  name: 'Southlake',
  state: 'TX',
  county: 'Tarrant',
  type: 'city',
  tier: 'tier2',
  parentId: null,
  hasNeighborhoodData: false,
  lastUpdated: '05/2026',
  metroUsed: 'Dallas, TX metro area',
  scores: {
    affordability: 1,
    schools: 10,
    safety: 10,
    walkability: 3,
    transit: 1,
    nightlife: 4,
    outdoors: 6,
    familyFriendly: 10,
    remoteWork: 8,
    lowTaxes: 7,
    weather: 5,
    traffic: 6,
  },
  housing: {
    avgRent1BR: 2000,
    avgRent2BR: 2500,
    avgRent3BR: 3200,
    starterHomePrice: 800000,
    medianHomePrice: 1300000,
    propertyTaxRate: 0.0175,
    pricePerSqFt: 373,
    monthlyUtilities: 235,
    monthlyGroceries: 450,
    monthlyTransportation: 460,
  },
  market: {
    daysOnMarket: 25,
    saleToListRatio: 97.5,
    priceYOY: -0.6,
    marketCondition: 'Balanced Market',
    redfinMedianPrice: 1300000,
    redfinDataSource: 'Redfin city-level — Southlake, TX. Date: 03/2026',
  },
  school: {
    teaRating: 'A',
    primaryISD: 'Carroll ISD',
  },
  description: 'Southlake is the apex of DFW suburban living — Carroll ISD earned a 95/100 A from TEA in 2025 with straight A grades across all 11 campuses, violent crime is well below state and national averages, and Southlake Town Square gives the city a genuine walkable downtown that most Texas suburbs never achieve. The price of admission is real: median $1.3M. But for families where schools and safety are non-negotiable, no city in Texas delivers more consistently.',
  strengths: [
    'Carroll ISD rated A (95/100) — straight A grades across all 11 campuses in 2025',
    'Southlake Town Square — genuine walkable downtown retail and dining district',
    'Violent crime well below state and national averages — residential neighborhoods are exceptionally quiet',
  ],
  weaknesses: [
    'Median $1.3M — most expensive city in the database by a significant margin',
    'Entry level $800K+ — effectively inaccessible without significant equity or high income',
    'Car-dependent outside Town Square corridor — limited transit',
  ],
},
```

---

### 5. KELLER, TX

```typescript
{
  id: 'keller-tx',
  name: 'Keller',
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
    schools: 8,
    safety: 9,
    walkability: 2,
    transit: 1,
    nightlife: 3,
    outdoors: 6,
    familyFriendly: 9,
    remoteWork: 7,
    lowTaxes: 7,
    weather: 5,
    traffic: 7,
  },
  housing: {
    avgRent1BR: 1600,
    avgRent2BR: 1950,
    avgRent3BR: 2450,
    starterHomePrice: 500000,
    medianHomePrice: 799000,
    propertyTaxRate: 0.0185,
    pricePerSqFt: 225,
    monthlyUtilities: 220,
    monthlyGroceries: 435,
    monthlyTransportation: 450,
  },
  market: {
    daysOnMarket: 47,
    saleToListRatio: 97.0,
    priceYOY: 2.0,
    marketCondition: 'Balanced Market',
    redfinMedianPrice: 799000,
    redfinDataSource: 'Movoto city-level — Keller, TX. Date: 04/2026',
  },
  school: {
    teaRating: 'B',
    primaryISD: 'Keller ISD',
  },
  description: 'Keller sits in the sweet spot between Southlake\'s prestige and Fort Worth\'s affordability — a mature, well-established suburb with strong Keller ISD schools, excellent safety scores, and DFW Airport within 20 minutes. Keller High School earned a TEA A rating in 2025 with a 97.7% graduation rate, and the city\'s location along the SH-170 corridor gives residents efficient access to both the DFW Airport employment zone and Fort Worth\'s growing job base.',
  strengths: [
    'Keller ISD rated B — Keller High School earned an individual A with 97.7% graduation rate',
    'DFW Airport 20 minutes — premier access to the region\'s largest employment corridor',
    'Established community — mature neighborhoods, full retail, and strong community identity',
  ],
  weaknesses: [
    'Premium pricing — median $799K approaches Southlake territory without the Carroll ISD pedigree',
    'Car-dependent — no transit, limited walkability',
    'Distance from Dallas core — best suited for DFW Airport corridor or Fort Worth employment',
  ],
},
```

---

### 6. MANSFIELD, TX

```typescript
{
  id: 'mansfield-tx',
  name: 'Mansfield',
  state: 'TX',
  county: 'Tarrant',
  type: 'city',
  tier: 'tier2',
  parentId: null,
  hasNeighborhoodData: false,
  lastUpdated: '05/2026',
  metroUsed: 'Dallas, TX metro area',
  scores: {
    affordability: 5,
    schools: 8,
    safety: 8,
    walkability: 2,
    transit: 1,
    nightlife: 3,
    outdoors: 6,
    familyFriendly: 8,
    remoteWork: 7,
    lowTaxes: 6,
    weather: 5,
    traffic: 7,
  },
  housing: {
    avgRent1BR: 1400,
    avgRent2BR: 1700,
    avgRent3BR: 2150,
    starterHomePrice: 310000,
    medianHomePrice: 485000,
    propertyTaxRate: 0.0210,
    pricePerSqFt: 186,
    monthlyUtilities: 215,
    monthlyGroceries: 420,
    monthlyTransportation: 440,
  },
  market: {
    daysOnMarket: 90,
    saleToListRatio: 97.5,
    priceYOY: -0.1,
    marketCondition: 'Buyers Market',
    redfinMedianPrice: 485000,
    redfinDataSource: 'Redfin city-level — Mansfield, TX. Date: 02/2026',
  },
  school: {
    teaRating: 'B',
    primaryISD: 'Mansfield ISD',
  },
  description: 'Mansfield is the most underrated family suburb in the DFW Metroplex — Mansfield ISD has earned a B from TEA for two consecutive years, the city sits at the crossroads of I-20 and US-287 giving genuine access to both Fort Worth and Arlington employment, and home prices sit well below the Collin County premium. Families who don\'t need the Frisco or Southlake zip code and want their dollar to go further should put Mansfield on the shortlist.',
  strengths: [
    'Mansfield ISD rated B — two consecutive years of strong TEA performance',
    'I-20/US-287 crossroads — efficient access to Fort Worth, Arlington, and Grand Prairie',
    'Below-average DFW pricing — $186/sqft vs $230+ in Collin County suburbs',
  ],
  weaknesses: [
    'Southeast Tarrant location — longer drive to Dallas employment than Collin County suburbs',
    'Limited nightlife and entertainment — depends on Arlington and Fort Worth',
    'Higher property tax rate — 2.10% vs 1.85–1.90% in northern suburbs',
  ],
},
```

---

### 7. ROCKWALL, TX

```typescript
{
  id: 'rockwall-tx',
  name: 'Rockwall',
  state: 'TX',
  county: 'Rockwall',
  type: 'city',
  tier: 'tier2',
  parentId: null,
  hasNeighborhoodData: false,
  lastUpdated: '05/2026',
  metroUsed: 'Dallas, TX metro area',
  scores: {
    affordability: 5,
    schools: 8,
    safety: 8,
    walkability: 3,
    transit: 1,
    nightlife: 4,
    outdoors: 8,
    familyFriendly: 8,
    remoteWork: 7,
    lowTaxes: 8,
    weather: 5,
    traffic: 7,
  },
  housing: {
    avgRent1BR: 1350,
    avgRent2BR: 1650,
    avgRent3BR: 2100,
    starterHomePrice: 295000,
    medianHomePrice: 425000,
    propertyTaxRate: 0.0155,
    pricePerSqFt: 195,
    monthlyUtilities: 210,
    monthlyGroceries: 415,
    monthlyTransportation: 435,
  },
  market: {
    daysOnMarket: 105,
    saleToListRatio: 97.0,
    priceYOY: 6.2,
    marketCondition: 'Buyers Market',
    redfinMedianPrice: 425000,
    redfinDataSource: 'Redfin county-level — Rockwall County, TX. Date: 01/2026',
  },
  school: {
    teaRating: 'B',
    primaryISD: 'Rockwall ISD',
  },
  description: 'Rockwall has a geographic advantage no other Dallas suburb can claim — it sits on the western shore of Lake Ray Hubbard, the largest inland lake in Texas, giving residents genuine lake access from a standard suburban neighborhood. The smallest county seat in Texas has quietly built a strong identity around its historic downtown, waterfront dining, and a cost of living that undercuts the Collin County suburbs by a meaningful margin.',
  strengths: [
    'Lake Ray Hubbard — only Dallas suburb with direct access to a major recreational lake',
    'Rockwall ISD rated B — consistent performance in the smallest county in Texas',
    'Lowest property tax rate among DFW suburbs in the database — 1.55%',
  ],
  weaknesses: [
    'I-30 corridor traffic — peak hour commute to Dallas can be significant',
    'Limited urban amenities — depends on Mesquite and Dallas for major retail and entertainment',
    'East of Dallas positioning — further from DFW Airport and Fort Worth employment',
  ],
},
```

---

## Implementation Checklist for Claude Code

- [ ] Append all 7 city objects to `texasCities` array in `data/cities.ts`
- [ ] Insert after the existing Corpus Christi entry, before the closing `]`
- [ ] Do not modify any existing city entries
- [ ] Run `tsc --noEmit` to verify no TypeScript errors
- [ ] Commit with descriptive message noting all 7 cities added
- [ ] Push to main

---

## Claude Code Prompt

See bottom of document.

---

## Notes

- Southlake affordability score of 1/10 is intentional — median $1.3M is the most expensive city in the database
- Prosper affordability score of 2/10 is intentional — median $850K, entry level $550K
- Keller and Flower Mound are scored 3/10 on affordability — $620K–$799K medians
- Rockwall and Mansfield are scored 5/10 — more accessible at $425K–$485K medians
- All TEA ratings sourced from August 2025 official release (txschools.gov)
- Rockwall market data is county-level (city-level not available on Redfin) — noted in redfinDataSource

---

*Brief prepared by Claude — HavenQuest COO/Chief Editor. May 28, 2026. Data sourced from Redfin, Zillow, Orchard, Movoto, TEA (Aug 2025), NeighborhoodScout, and local market reports.*
