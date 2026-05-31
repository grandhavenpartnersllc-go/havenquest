# HavenQuest — San Antonio Expansion Brief: 10 New Cities
**Prepared by:** Claude (COO/Chief Editor)  
**Date:** May 29, 2026  
**Status:** Ready for Claude Code implementation  
**Priority:** P1 — San Antonio metro coverage

---

## Summary

Adds 10 San Antonio metro cities. San Antonio currently has only 2 cities in the database (San Antonio + New Braunfels). This brief takes SA coverage to 12 cities — comparable to Austin's 16.

Cities added:
1. Boerne (Kendall County — tier2)
2. Schertz (Guadalupe/Bexar County — tier2)
3. Cibolo (Guadalupe County — tier2)
4. Helotes (Bexar County — tier2)
5. Converse (Bexar County — tier2)
6. Universal City (Bexar County — tier2)
7. Alamo Heights (Bexar County — tier2)
8. Seguin (Guadalupe County — tier2)
9. Fair Oaks Ranch (Bexar/Kendall County — tier2)
10. Leon Valley (Bexar County — tier2)

---

## Implementation Instructions for Claude Code

Append all 10 city objects to the `texasCities` array in `data/cities.ts`, after the Manvel entry (last Houston city). Do not modify any existing entries. Run `tsc --noEmit` after insertion. Commit and push.

---

## City Data — Complete Entries

### 1. BOERNE, TX

```typescript
{
  id: 'boerne-tx',
  name: 'Boerne',
  state: 'TX',
  county: 'Kendall',
  type: 'city',
  tier: 'tier2',
  parentId: null,
  hasNeighborhoodData: false,
  lastUpdated: '05/2026',
  metroUsed: 'San Antonio, TX metro area',
  scores: {
    affordability: 3,
    schools: 9,
    safety: 9,
    walkability: 4,
    transit: 1,
    nightlife: 4,
    outdoors: 9,
    familyFriendly: 9,
    remoteWork: 7,
    lowTaxes: 7,
    weather: 5,
    traffic: 7,
  },
  housing: {
    avgRent1BR: 1500,
    avgRent2BR: 1850,
    avgRent3BR: 2400,
    starterHomePrice: 420000,
    medianHomePrice: 630000,
    propertyTaxRate: 0.0185,
    pricePerSqFt: 209,
    monthlyUtilities: 210,
    monthlyGroceries: 420,
    monthlyTransportation: 440,
  },
  market: {
    daysOnMarket: 100,
    saleToListRatio: 96.5,
    priceYOY: 15.5,
    marketCondition: 'Balanced Market',
    redfinMedianPrice: 630000,
    redfinDataSource: 'Redfin/local MLS — Boerne, TX. Date: 11/2025',
  },
  school: {
    teaRating: 'A',
    primaryISD: 'Boerne ISD',
  },
  description: 'Boerne is the gem of the San Antonio metro — a genuine Hill Country town with a walkable historic district, Cibolo Nature Center, exceptional Boerne ISD (A, 92/100, 98.3% graduation rate), and geographical constraints that protect property values from the overdevelopment plaguing other Texas suburbs. The Hill Country Mile is one of the best small-town main streets in Texas, and San Antonio is only 30 minutes on I-10. For families who want school excellence, Hill Country character, and SA access, Boerne is in a category of its own in the metro.',
  strengths: [
    'Boerne ISD rated A (92/100) — 98.3% graduation rate, top-performing district in the San Antonio metro',
    'Hill Country Mile — authentic walkable main street with boutiques, restaurants, and genuine town character',
    'Geographic supply constraint — hills and protected land limit development, protecting property values',
  ],
  weaknesses: [
    'Premium pricing — median $630K with restricted inventory due to geographic constraints',
    'I-10 commute — 30-40 minutes to San Antonio employment centers during peak hours',
    'Limited housing supply — geographic constraints mean fewer options and faster-moving listings',
  ],
},
```

---

### 2. SCHERTZ, TX

```typescript
{
  id: 'schertz-tx',
  name: 'Schertz',
  state: 'TX',
  county: 'Guadalupe',
  type: 'city',
  tier: 'tier2',
  parentId: null,
  hasNeighborhoodData: false,
  lastUpdated: '05/2026',
  metroUsed: 'San Antonio, TX metro area',
  scores: {
    affordability: 5,
    schools: 7,
    safety: 8,
    walkability: 3,
    transit: 1,
    nightlife: 3,
    outdoors: 6,
    familyFriendly: 8,
    remoteWork: 7,
    lowTaxes: 7,
    weather: 5,
    traffic: 7,
  },
  housing: {
    avgRent1BR: 1300,
    avgRent2BR: 1600,
    avgRent3BR: 2050,
    starterHomePrice: 290000,
    medianHomePrice: 392000,
    propertyTaxRate: 0.0195,
    pricePerSqFt: 163,
    monthlyUtilities: 205,
    monthlyGroceries: 415,
    monthlyTransportation: 435,
  },
  market: {
    daysOnMarket: 72,
    saleToListRatio: 96.0,
    priceYOY: 15.8,
    marketCondition: 'Balanced Market',
    redfinMedianPrice: 392000,
    redfinDataSource: 'Orchard city-level — Schertz, TX. Date: 05/2026',
  },
  school: {
    teaRating: 'B',
    primaryISD: 'Schertz-Cibolo-Universal City ISD',
  },
  description: 'Schertz is the northeast San Antonio corridor\'s most established family suburb — positioned between Randolph Air Force Base and downtown San Antonio on I-35, served by SCUC ISD (B, 81/100), and home to master-planned communities with solid infrastructure. The +15.8% YOY appreciation signals genuine demand from military families, San Antonio workers, and buyers priced out of Boerne who want northeast SA access with reasonable pricing.',
  strengths: [
    'Randolph AFB proximity — ideal for military families, VA loan buyers, and defense contractors',
    'SCUC ISD rated B (81/100) — strong and improving district serving the northeast corridor',
    'Established suburban infrastructure — full retail, dining, and community amenities',
  ],
  weaknesses: [
    'I-35 traffic — peak hour commutes to downtown San Antonio or Austin can be challenging',
    'Limited distinct identity — Schertz functions more as a military and suburban corridor than a destination',
    'Heat and humidity — south Texas summer climate is genuinely intense May through September',
  ],
},
```

---

### 3. CIBOLO, TX

```typescript
{
  id: 'cibolo-tx',
  name: 'Cibolo',
  state: 'TX',
  county: 'Guadalupe',
  type: 'city',
  tier: 'tier2',
  parentId: null,
  hasNeighborhoodData: false,
  lastUpdated: '05/2026',
  metroUsed: 'San Antonio, TX metro area',
  scores: {
    affordability: 5,
    schools: 7,
    safety: 8,
    walkability: 2,
    transit: 1,
    nightlife: 2,
    outdoors: 6,
    familyFriendly: 8,
    remoteWork: 6,
    lowTaxes: 7,
    weather: 5,
    traffic: 7,
  },
  housing: {
    avgRent1BR: 1300,
    avgRent2BR: 1600,
    avgRent3BR: 2050,
    starterHomePrice: 280000,
    medianHomePrice: 375000,
    propertyTaxRate: 0.0195,
    pricePerSqFt: 157,
    monthlyUtilities: 205,
    monthlyGroceries: 410,
    monthlyTransportation: 430,
  },
  market: {
    daysOnMarket: 64,
    saleToListRatio: 97.0,
    priceYOY: 16.0,
    marketCondition: 'Balanced Market',
    redfinMedianPrice: 375000,
    redfinDataSource: 'Redfin city-level — Cibolo, TX. Date: 05/2025',
  },
  school: {
    teaRating: 'B',
    primaryISD: 'Schertz-Cibolo-Universal City ISD',
  },
  description: 'Cibolo is Guadalupe County\'s fastest-growing city — doubling in population since 2010 — and one of the most affordable entry points in the northeast San Antonio corridor. Served by SCUC ISD (B, 81/100) alongside Schertz, Cibolo offers newer construction, larger lots, and slightly lower pricing than its neighbor with the same school district access. The Cibolo Creek greenway gives the community genuine outdoor amenity in a rapidly developing suburban setting.',
  strengths: [
    'Fastest-growing city in Guadalupe County — new construction, new infrastructure, new amenities',
    'SCUC ISD rated B — same strong district as Schertz at slightly lower price points',
    'Cibolo Creek greenway — trail system and natural corridor through master-planned communities',
  ],
  weaknesses: [
    'Limited local amenities — retail and dining infrastructure still developing alongside rapid growth',
    'Car-dependent — no transit, all daily needs require driving',
    'Growing pains — infrastructure sometimes lags the population growth curve',
  ],
},
```

---

### 4. HELOTES, TX

```typescript
{
  id: 'helotes-tx',
  name: 'Helotes',
  state: 'TX',
  county: 'Bexar',
  type: 'city',
  tier: 'tier2',
  parentId: null,
  hasNeighborhoodData: false,
  lastUpdated: '05/2026',
  metroUsed: 'San Antonio, TX metro area',
  scores: {
    affordability: 4,
    schools: 6,
    safety: 8,
    walkability: 3,
    transit: 1,
    nightlife: 3,
    outdoors: 8,
    familyFriendly: 8,
    remoteWork: 7,
    lowTaxes: 7,
    weather: 5,
    traffic: 6,
  },
  housing: {
    avgRent1BR: 1400,
    avgRent2BR: 1750,
    avgRent3BR: 2250,
    starterHomePrice: 360000,
    medianHomePrice: 514000,
    propertyTaxRate: 0.0190,
    pricePerSqFt: 190,
    monthlyUtilities: 210,
    monthlyGroceries: 415,
    monthlyTransportation: 440,
  },
  market: {
    daysOnMarket: 73,
    saleToListRatio: 96.5,
    priceYOY: -2.0,
    marketCondition: 'Buyers Market',
    redfinMedianPrice: 514000,
    redfinDataSource: 'Movoto city-level — Helotes, TX. Date: 04/2026',
  },
  school: {
    teaRating: 'C',
    primaryISD: 'Northside ISD',
  },
  description: 'Helotes is San Antonio\'s northwest Hill Country gateway — a small city of 8,000 where development is constrained by the natural terrain, giving communities like Sonoma Ranch and Stone Oak adjacency a genuine Hill Country feel within 20 minutes of Loop 1604. The Alamo Ranch corridor has brought major retail and dining to the area. Northside ISD serves the community with a C rating — adequate but not the draw that Boerne ISD provides, making Helotes a value play for buyers who want Hill Country character without Boerne\'s price premium.',
  strengths: [
    'Hill Country character within 20 minutes of San Antonio — terrain limits development and preserves feel',
    'Alamo Ranch corridor — major retail destination anchored by Target, Costco, and restaurant clusters',
    'Lackland AFB proximity — 25 minutes to one of San Antonio\'s largest military employers',
  ],
  weaknesses: [
    'Northside ISD rated C by TEA — limiting factor for school-focused families vs. Boerne',
    'Median $514K — premium pricing without A-rated school district to justify it',
    'Loop 1604 and I-10 traffic — northwest SA commute patterns can be challenging',
  ],
},
```

---

### 5. CONVERSE, TX

```typescript
{
  id: 'converse-tx',
  name: 'Converse',
  state: 'TX',
  county: 'Bexar',
  type: 'city',
  tier: 'tier2',
  parentId: null,
  hasNeighborhoodData: false,
  lastUpdated: '05/2026',
  metroUsed: 'San Antonio, TX metro area',
  scores: {
    affordability: 8,
    schools: 3,
    safety: 6,
    walkability: 3,
    transit: 2,
    nightlife: 3,
    outdoors: 5,
    familyFriendly: 6,
    remoteWork: 6,
    lowTaxes: 8,
    weather: 5,
    traffic: 7,
  },
  housing: {
    avgRent1BR: 1100,
    avgRent2BR: 1350,
    avgRent3BR: 1750,
    starterHomePrice: 185000,
    medianHomePrice: 250000,
    propertyTaxRate: 0.0185,
    pricePerSqFt: 140,
    monthlyUtilities: 200,
    monthlyGroceries: 400,
    monthlyTransportation: 425,
  },
  market: {
    daysOnMarket: 62,
    saleToListRatio: 97.0,
    priceYOY: -15.2,
    marketCondition: 'Buyers Market',
    redfinMedianPrice: 250000,
    redfinDataSource: 'Orchard city-level — Converse, TX. Date: 05/2026',
  },
  school: {
    teaRating: 'D',
    primaryISD: 'Judson ISD',
  },
  description: 'Converse is the most affordable city in the San Antonio metro for buyers prioritizing military access and housing value — Randolph Air Force Base is 10 minutes away, median pricing is well below $300K, and the -15.2% YOY correction has created genuine buyer negotiating power. Judson ISD rates D from TEA, making it best suited for military families using DoD schools, buyers committed to private schooling, or investors targeting the rental market serving Randolph AFB personnel.',
  strengths: [
    'Most affordable Bexar County suburb — median $250K with Randolph AFB 10 minutes away',
    'Military access — ideal location for active-duty, veterans, and defense contractors',
    'Significant buyer leverage — -15.2% YOY correction with motivated sellers',
  ],
  weaknesses: [
    'Judson ISD rated D by TEA — significant concern for families relying on public schools',
    'Limited community amenities — depends on Schertz and Universal City for retail and dining',
    '-15.2% YOY price decline — significant correction raises near-term appreciation uncertainty',
  ],
},
```

---

### 6. UNIVERSAL CITY, TX

```typescript
{
  id: 'universal-city-tx',
  name: 'Universal City',
  state: 'TX',
  county: 'Bexar',
  type: 'city',
  tier: 'tier2',
  parentId: null,
  hasNeighborhoodData: false,
  lastUpdated: '05/2026',
  metroUsed: 'San Antonio, TX metro area',
  scores: {
    affordability: 7,
    schools: 7,
    safety: 7,
    walkability: 3,
    transit: 2,
    nightlife: 3,
    outdoors: 5,
    familyFriendly: 7,
    remoteWork: 6,
    lowTaxes: 8,
    weather: 5,
    traffic: 7,
  },
  housing: {
    avgRent1BR: 1200,
    avgRent2BR: 1450,
    avgRent3BR: 1850,
    starterHomePrice: 220000,
    medianHomePrice: 299000,
    propertyTaxRate: 0.0185,
    pricePerSqFt: 155,
    monthlyUtilities: 200,
    monthlyGroceries: 405,
    monthlyTransportation: 428,
  },
  market: {
    daysOnMarket: 65,
    saleToListRatio: 97.0,
    priceYOY: -2.0,
    marketCondition: 'Buyers Market',
    redfinMedianPrice: 299000,
    redfinDataSource: 'Redfin/local data — Universal City, TX. Date: 05/2026',
  },
  school: {
    teaRating: 'B',
    primaryISD: 'Schertz-Cibolo-Universal City ISD',
  },
  description: 'Universal City is the sweet spot for military families in the northeast San Antonio corridor — directly adjacent to Randolph Air Force Base, served by SCUC ISD (B, 81/100), priced well below the metro median, and with solid suburban infrastructure from decades of military-adjacent development. For active-duty families who need Randolph AFB access and a B-rated school district without Schertz pricing, Universal City is a logical first stop.',
  strengths: [
    'Randolph AFB adjacent — literally borders one of the largest Air Force bases in Texas',
    'SCUC ISD rated B — strong school district access at below-metro pricing',
    'Established military community — decades of infrastructure built to serve Randolph families',
  ],
  weaknesses: [
    'Limited growth potential — geographically constrained by Randolph AFB and surrounding development',
    'Older housing stock — Universal City has less new construction than Schertz or Cibolo',
    'Distance from downtown SA entertainment — 25-30 minutes to the Riverwalk and cultural core',
  ],
},
```

---

### 7. ALAMO HEIGHTS, TX

```typescript
{
  id: 'alamo-heights-tx',
  name: 'Alamo Heights',
  state: 'TX',
  county: 'Bexar',
  type: 'city',
  tier: 'tier2',
  parentId: null,
  hasNeighborhoodData: false,
  lastUpdated: '05/2026',
  metroUsed: 'San Antonio, TX metro area',
  scores: {
    affordability: 2,
    schools: 9,
    safety: 9,
    walkability: 6,
    transit: 3,
    nightlife: 7,
    outdoors: 6,
    familyFriendly: 9,
    remoteWork: 8,
    lowTaxes: 6,
    weather: 5,
    traffic: 6,
  },
  housing: {
    avgRent1BR: 1800,
    avgRent2BR: 2300,
    avgRent3BR: 3000,
    starterHomePrice: 600000,
    medianHomePrice: 950000,
    propertyTaxRate: 0.0210,
    pricePerSqFt: 310,
    monthlyUtilities: 215,
    monthlyGroceries: 430,
    monthlyTransportation: 450,
  },
  market: {
    daysOnMarket: 60,
    saleToListRatio: 97.0,
    priceYOY: -1.5,
    marketCondition: 'Balanced Market',
    redfinMedianPrice: 950000,
    redfinDataSource: 'Local MLS — Alamo Heights, TX. Date: 05/2026',
  },
  school: {
    teaRating: 'B',
    primaryISD: 'Alamo Heights ISD',
  },
  description: 'Alamo Heights is San Antonio\'s most prestigious inner suburb — a small, affluent enclave of 8,000 residents entirely surrounded by the city of San Antonio, with Alamo Heights ISD earning a B (87/100) from TEA, walkable proximity to the Pearl Brewery district and the San Antonio Museum of Art, and a neighborhood character that is genuinely distinct from the suburban sprawl of the north and west sides. It is the closest thing San Antonio has to an Alamo Heights equivalent of Dallas\'s Highland Park.',
  strengths: [
    'Alamo Heights ISD rated B (87/100) — most prestigious school district within San Antonio proper',
    'Pearl Brewery and Museum District walkability — culture, dining, and arts within walking distance',
    'Distinct neighborhood identity — historic homes, canopy streets, and genuine urban character',
  ],
  weaknesses: [
    'Median $950K — most expensive city in the San Antonio database',
    'Higher property tax rate — 2.10% above the Bexar County average',
    'Very small city — extremely limited housing supply creates competitive, fast-moving market',
  ],
},
```

---

### 8. SEGUIN, TX

```typescript
{
  id: 'seguin-tx',
  name: 'Seguin',
  state: 'TX',
  county: 'Guadalupe',
  type: 'city',
  tier: 'tier2',
  parentId: null,
  hasNeighborhoodData: false,
  lastUpdated: '05/2026',
  metroUsed: 'San Antonio, TX metro area',
  scores: {
    affordability: 8,
    schools: 5,
    safety: 6,
    walkability: 4,
    transit: 1,
    nightlife: 4,
    outdoors: 7,
    familyFriendly: 6,
    remoteWork: 6,
    lowTaxes: 8,
    weather: 5,
    traffic: 8,
  },
  housing: {
    avgRent1BR: 1100,
    avgRent2BR: 1350,
    avgRent3BR: 1750,
    starterHomePrice: 195000,
    medianHomePrice: 270000,
    propertyTaxRate: 0.0180,
    pricePerSqFt: 148,
    monthlyUtilities: 200,
    monthlyGroceries: 400,
    monthlyTransportation: 425,
  },
  market: {
    daysOnMarket: 75,
    saleToListRatio: 96.5,
    priceYOY: -3.0,
    marketCondition: 'Buyers Market',
    redfinMedianPrice: 270000,
    redfinDataSource: 'Zillow ZHVI city-level — Seguin, TX. Date: 05/2026',
  },
  school: {
    teaRating: 'C',
    primaryISD: 'Seguin ISD',
  },
  description: 'Seguin is the Guadalupe County seat and the most historically significant small city between San Antonio and Austin — home to Texas Lutheran University, Guadalupe River recreation, Lake Seguin, and a historic courthouse square that has seen genuine revitalization with new retail and dining. At $270K median with one of the lowest property tax rates in the SA database, Seguin is the best value play for buyers who want Texas character, river access, and reasonable I-10 commute options to both SA and Austin.',
  strengths: [
    'Guadalupe River access — tubing, kayaking, and swimming at Lake Seguin and Starcke Park',
    'Historic courthouse square revitalization — new dining, retail, and community events',
    'Most affordable Guadalupe County city — median $270K with lowest tax rate in SA database',
  ],
  weaknesses: [
    'Seguin ISD rated C by TEA — below average, concern for school-focused families',
    'I-10 commute to San Antonio — 35-40 minutes, longer to the northern employment corridors',
    'Limited high-end retail and dining — depends on New Braunfels and San Antonio for major amenities',
  ],
},
```

---

### 9. FAIR OAKS RANCH, TX

```typescript
{
  id: 'fair-oaks-ranch-tx',
  name: 'Fair Oaks Ranch',
  state: 'TX',
  county: 'Bexar',
  type: 'city',
  tier: 'tier2',
  parentId: null,
  hasNeighborhoodData: false,
  lastUpdated: '05/2026',
  metroUsed: 'San Antonio, TX metro area',
  scores: {
    affordability: 2,
    schools: 9,
    safety: 10,
    walkability: 2,
    transit: 1,
    nightlife: 2,
    outdoors: 9,
    familyFriendly: 9,
    remoteWork: 7,
    lowTaxes: 7,
    weather: 5,
    traffic: 7,
  },
  housing: {
    avgRent1BR: 1800,
    avgRent2BR: 2300,
    avgRent3BR: 3000,
    starterHomePrice: 600000,
    medianHomePrice: 900000,
    propertyTaxRate: 0.0185,
    pricePerSqFt: 260,
    monthlyUtilities: 215,
    monthlyGroceries: 430,
    monthlyTransportation: 450,
  },
  market: {
    daysOnMarket: 90,
    saleToListRatio: 96.5,
    priceYOY: -2.0,
    marketCondition: 'Buyers Market',
    redfinMedianPrice: 900000,
    redfinDataSource: 'Local MLS estimate — Fair Oaks Ranch, TX. Date: 05/2026',
  },
  school: {
    teaRating: 'A',
    primaryISD: 'Boerne ISD',
  },
  description: 'Fair Oaks Ranch is San Antonio\'s most exclusive Hill Country community — a small city of 12,000 served by Boerne ISD (A, 92/100), with acreage properties, equestrian lots, Hill Country topography, and a level of privacy and quiet that no other SA suburb can match. Violent crime is essentially nonexistent. For families who want Boerne ISD schools, significant land, and genuine Hill Country living — but are comfortable with a longer commute and minimal local amenities — Fair Oaks Ranch is the pinnacle of the San Antonio suburban market.',
  strengths: [
    'Boerne ISD rated A (92/100) — same top-tier school district as Boerne at slightly different price points',
    'Acreage and equestrian properties available — genuine Hill Country land in a suburban SA context',
    'Essentially zero violent crime — one of the safest small cities in Texas',
  ],
  weaknesses: [
    'Median $900K — second most expensive city in the SA database behind Alamo Heights',
    'No local amenities — entirely residential, all errands require driving to Boerne or SA',
    '35-40 minute commute to San Antonio employment centers on SH-151 and I-10',
  ],
},
```

---

### 10. LEON VALLEY, TX

```typescript
{
  id: 'leon-valley-tx',
  name: 'Leon Valley',
  state: 'TX',
  county: 'Bexar',
  type: 'city',
  tier: 'tier2',
  parentId: null,
  hasNeighborhoodData: false,
  lastUpdated: '05/2026',
  metroUsed: 'San Antonio, TX metro area',
  scores: {
    affordability: 8,
    schools: 5,
    safety: 6,
    walkability: 4,
    transit: 3,
    nightlife: 4,
    outdoors: 5,
    familyFriendly: 6,
    remoteWork: 7,
    lowTaxes: 7,
    weather: 5,
    traffic: 6,
  },
  housing: {
    avgRent1BR: 1150,
    avgRent2BR: 1400,
    avgRent3BR: 1800,
    starterHomePrice: 195000,
    medianHomePrice: 255000,
    propertyTaxRate: 0.0190,
    pricePerSqFt: 152,
    monthlyUtilities: 205,
    monthlyGroceries: 405,
    monthlyTransportation: 430,
  },
  market: {
    daysOnMarket: 65,
    saleToListRatio: 97.0,
    priceYOY: -2.5,
    marketCondition: 'Buyers Market',
    redfinMedianPrice: 255000,
    redfinDataSource: 'Zillow ZHVI estimate — Leon Valley, TX. Date: 05/2026',
  },
  school: {
    teaRating: 'C',
    primaryISD: 'Northside ISD',
  },
  description: 'Leon Valley is the most affordable incorporated city within Loop 1604 — completely surrounded by San Antonio, served by a VIA Metropolitan Transit bus route (rare for a SA suburb), and priced $40K below the metro median. The city\'s central position on Bandera Road gives direct access to Lackland AFB, the South Texas Medical Center, and downtown SA without the I-10 or I-35 commute penalties. For buyers who want urban proximity, transit access, and true affordability in Bexar County, Leon Valley punches above its size.',
  strengths: [
    'Most affordable city inside Loop 1604 — median $255K with genuine urban SA proximity',
    'VIA bus access — rare transit option in the SA suburban landscape',
    'Central Bexar County location — Lackland, Medical Center, and downtown all within 15-20 minutes',
  ],
  weaknesses: [
    'Northside ISD rated C by TEA — below average, concern for school-focused families',
    'Older housing stock — Leon Valley has limited new construction within its constrained boundaries',
    'Urban challenges — surrounded by SA, the city inherits some of the metro\'s density and crime patterns',
  ],
},
```

---

## Implementation Checklist for Claude Code

- [ ] Append all 10 city objects to `texasCities` array in `data/cities.ts`
- [ ] Insert after the Manvel entry (last Houston city)
- [ ] Do not modify any existing city entries
- [ ] Run `tsc --noEmit` to verify no TypeScript errors
- [ ] Commit with message noting all 10 cities added
- [ ] Push to main

---

## Score Notes

**Schools:**
- Boerne 9/10, Fair Oaks Ranch 9/10 — Boerne ISD A (92/100)
- Alamo Heights 9/10 — Alamo Heights ISD B (87/100), most prestigious inner-city district
- Schertz 7/10, Cibolo 7/10, Universal City 7/10 — SCUC ISD B (81/100)
- Helotes 6/10 — Northside ISD C (75/100)
- Seguin 5/10, Leon Valley 5/10 — C-rated ISDs
- Converse 3/10 — Judson ISD D (69/100)

**Affordability:**
- Alamo Heights 2/10, Fair Oaks Ranch 2/10 — $900K-$950K, most expensive in SA database
- Boerne 3/10 — $630K, geographically constrained premium market
- Helotes 4/10 — $514K, premium without A-rated ISD
- Converse 8/10, Seguin 8/10, Leon Valley 8/10 — genuinely affordable

**Note on Converse and Leon Valley D/C ISD ratings** — both serve legitimate buyer segments (military families, affordability-first buyers, investors) and are included with honest disclosure.

---

*Brief prepared by Claude — HavenQuest COO/Chief Editor. May 29, 2026. Data sourced from Redfin, Zillow ZHVI, Orchard, Movoto, local MLS reports, and TEA August 2025 ratings.*
