# HavenQuest — Houston Expansion Wave 2 Brief: 12 New Cities
**Prepared by:** Claude (COO/Chief Editor)  
**Date:** May 29, 2026  
**Status:** Ready for Claude Code implementation  
**Priority:** P1 — Houston metro parity with DFW

---

## Summary

Adds 12 Houston metro cities to bring Houston coverage to parity with DFW. Houston is the second largest metro in Texas and the second largest relocation destination nationally. This brief takes Houston from 8 cities to 20 cities.

Cities added:
1. Cypress (Harris County — tier2)
2. Missouri City (Fort Bend County — tier2)
3. Tomball (Harris County — tier2)
4. Fulshear (Fort Bend County — tier2)
5. Pasadena (Harris County — tier2)
6. Baytown (Harris/Chambers County — tier2)
7. Humble (Harris County — tier2)
8. Spring (Harris County — tier2)
9. Galveston (Galveston County — tier2)
10. Richmond (Fort Bend County — tier2)
11. Rosenberg (Fort Bend County — tier2)
12. Manvel (Brazoria County — tier2)

---

## Implementation Instructions for Claude Code

Append all 12 city objects to the `texasCities` array in `data/cities.ts`, after the Conroe entry (last city from Houston Wave 1 brief). Do not modify any existing entries. Run `tsc --noEmit` after insertion. Commit and push.

---

## City Data — Complete Entries

### 1. CYPRESS, TX

```typescript
{
  id: 'cypress-tx',
  name: 'Cypress',
  state: 'TX',
  county: 'Harris',
  type: 'city',
  tier: 'tier2',
  parentId: null,
  hasNeighborhoodData: false,
  lastUpdated: '05/2026',
  metroUsed: 'Houston, TX metro area',
  scores: {
    affordability: 6,
    schools: 7,
    safety: 7,
    walkability: 2,
    transit: 1,
    nightlife: 3,
    outdoors: 6,
    familyFriendly: 9,
    remoteWork: 7,
    lowTaxes: 7,
    weather: 4,
    traffic: 5,
  },
  housing: {
    avgRent1BR: 1350,
    avgRent2BR: 1650,
    avgRent3BR: 2100,
    starterHomePrice: 270000,
    medianHomePrice: 390000,
    propertyTaxRate: 0.0205,
    pricePerSqFt: 161,
    monthlyUtilities: 215,
    monthlyGroceries: 415,
    monthlyTransportation: 440,
  },
  market: {
    daysOnMarket: 68,
    saleToListRatio: 94.6,
    priceYOY: -6.7,
    marketCondition: 'Buyers Market',
    redfinMedianPrice: 390000,
    redfinDataSource: 'Redfin/Zillow city-level — Cypress, TX. Date: 03/2026',
  },
  school: {
    teaRating: 'B',
    primaryISD: 'Cy-Fair ISD',
  },
  description: 'Cypress was named the nation\'s hottest most moved-to zip code in 2025 — and the data backs it up. Cy-Fair ISD earns a B (85/100) from TEA with 25 A-rated campuses, master-planned communities like Bridgeland and Towne Lake offer resort-quality amenities centered on a 300-acre recreational lake, and US-290 and the Grand Parkway give residents efficient access to the Energy Corridor and downtown Houston. The -6.7% YOY correction has made a hot market meaningfully more accessible.',
  strengths: [
    'Named #1 most moved-to zip code in the US in 2025 — validated relocation destination',
    'Bridgeland and Towne Lake master-planned communities — among the finest in Texas',
    'Cy-Fair ISD rated B (85/100) — 25 A-rated campuses serving one of the largest districts in Texas',
  ],
  weaknesses: [
    'US-290 and Beltway 8 traffic — peak hour commutes into Houston can stretch 45-60 minutes',
    'Hurricane and flooding risk — Harris County location and proximity to Buffalo Bayou tributaries',
    'Car-dependent — no meaningful transit in an unincorporated community of 200,000+',
  ],
},
```

---

### 2. MISSOURI CITY, TX

```typescript
{
  id: 'missouri-city-tx',
  name: 'Missouri City',
  state: 'TX',
  county: 'Fort Bend',
  type: 'city',
  tier: 'tier2',
  parentId: null,
  hasNeighborhoodData: false,
  lastUpdated: '05/2026',
  metroUsed: 'Houston, TX metro area',
  scores: {
    affordability: 6,
    schools: 7,
    safety: 7,
    walkability: 3,
    transit: 2,
    nightlife: 4,
    outdoors: 6,
    familyFriendly: 8,
    remoteWork: 7,
    lowTaxes: 7,
    weather: 4,
    traffic: 6,
  },
  housing: {
    avgRent1BR: 1300,
    avgRent2BR: 1600,
    avgRent3BR: 2050,
    starterHomePrice: 240000,
    medianHomePrice: 347000,
    propertyTaxRate: 0.0200,
    pricePerSqFt: 154,
    monthlyUtilities: 210,
    monthlyGroceries: 415,
    monthlyTransportation: 440,
  },
  market: {
    daysOnMarket: 94,
    saleToListRatio: 96.5,
    priceYOY: -10.9,
    marketCondition: 'Buyers Market',
    redfinMedianPrice: 347000,
    redfinDataSource: 'Redfin city-level — Missouri City, TX. Date: 03/2026',
  },
  school: {
    teaRating: 'B',
    primaryISD: 'Fort Bend ISD',
  },
  description: 'Missouri City is Fort Bend County\'s most diverse and established suburban community — a 75,000-person city that straddles Harris and Fort Bend counties, served by Fort Bend ISD, and home to one of the most culturally diverse populations in the Houston metro. The -10.9% YOY price decline has created significant buyer leverage in a city with genuine suburban infrastructure, Texas Medical Center proximity, and an active community identity.',
  strengths: [
    'Fort Bend ISD rated B — one of the most culturally diverse and academically improving districts in Houston',
    'Most diverse suburban community in Fort Bend County — international restaurants, cultural events, community programming',
    'Texas Medical Center 20 minutes — direct SH-6 access to the world\'s largest medical complex',
  ],
  weaknesses: [
    '-10.9% YOY price decline — significant correction raises near-term appreciation uncertainty',
    '94 days on market — slower-moving inventory in current market conditions',
    'SH-6 and US-90A traffic — peak hour commutes to downtown Houston can be lengthy',
  ],
},
```

---

### 3. TOMBALL, TX

```typescript
{
  id: 'tomball-tx',
  name: 'Tomball',
  state: 'TX',
  county: 'Harris',
  type: 'city',
  tier: 'tier2',
  parentId: null,
  hasNeighborhoodData: false,
  lastUpdated: '05/2026',
  metroUsed: 'Houston, TX metro area',
  scores: {
    affordability: 5,
    schools: 10,
    safety: 9,
    walkability: 3,
    transit: 1,
    nightlife: 4,
    outdoors: 6,
    familyFriendly: 10,
    remoteWork: 7,
    lowTaxes: 7,
    weather: 4,
    traffic: 6,
  },
  housing: {
    avgRent1BR: 1400,
    avgRent2BR: 1700,
    avgRent3BR: 2200,
    starterHomePrice: 310000,
    medianHomePrice: 480000,
    propertyTaxRate: 0.0195,
    pricePerSqFt: 168,
    monthlyUtilities: 215,
    monthlyGroceries: 420,
    monthlyTransportation: 440,
  },
  market: {
    daysOnMarket: 55,
    saleToListRatio: 97.0,
    priceYOY: 8.1,
    marketCondition: 'Balanced Market',
    redfinMedianPrice: 400000,
    redfinDataSource: 'Redfin city-level — Tomball, TX. Date: 06/2025',
  },
  school: {
    teaRating: 'A',
    primaryISD: 'Tomball ISD',
  },
  description: 'Tomball is the highest-rated school district in Harris County — Tomball ISD earned an A (92/100) from TEA for the sixth consecutive year in 2025, making it the highest-scoring large district in all of Texas. The city\'s historic downtown has undergone genuine revitalization with breweries, farm-to-table restaurants, and community events, and the US-249 corridor gives residents solid access to the Energy Corridor. For families where school quality is the primary filter, no Houston suburb delivers a better combination of TEA rating and community character.',
  strengths: [
    'Tomball ISD rated A (92/100) — 6 consecutive A ratings, highest-scoring large district in Texas in 2025',
    'Historic downtown Tomball — revitalized with breweries, restaurants, and authentic small-town character',
    'US-249 corridor — efficient Energy Corridor access without Cypress\'s US-290 congestion',
  ],
  weaknesses: [
    'Premium pricing — median $480K for a city without Sugar Land or Katy brand recognition',
    'Distance from downtown Houston — 35-40 minute commute during peak hours',
    'Car-dependent — no transit, limited walkability outside the historic downtown district',
  ],
},
```

---

### 4. FULSHEAR, TX

```typescript
{
  id: 'fulshear-tx',
  name: 'Fulshear',
  state: 'TX',
  county: 'Fort Bend',
  type: 'city',
  tier: 'tier2',
  parentId: null,
  hasNeighborhoodData: false,
  lastUpdated: '05/2026',
  metroUsed: 'Houston, TX metro area',
  scores: {
    affordability: 3,
    schools: 8,
    safety: 9,
    walkability: 2,
    transit: 1,
    nightlife: 2,
    outdoors: 6,
    familyFriendly: 9,
    remoteWork: 7,
    lowTaxes: 7,
    weather: 4,
    traffic: 6,
  },
  housing: {
    avgRent1BR: 1600,
    avgRent2BR: 2000,
    avgRent3BR: 2600,
    starterHomePrice: 420000,
    medianHomePrice: 558000,
    propertyTaxRate: 0.0200,
    pricePerSqFt: 184,
    monthlyUtilities: 220,
    monthlyGroceries: 425,
    monthlyTransportation: 445,
  },
  market: {
    daysOnMarket: 50,
    saleToListRatio: 96.5,
    priceYOY: 7.3,
    marketCondition: 'Balanced Market',
    redfinMedianPrice: 558000,
    redfinDataSource: 'Redfin city-level — Fulshear, TX. Date: 09/2025',
  },
  school: {
    teaRating: 'B',
    primaryISD: 'Lamar CISD',
  },
  description: 'Fulshear is Fort Bend County\'s fastest-growing city and one of the most in-demand new construction markets in Texas — Lamar CISD earns a B (88/100) from TEA tied with Katy ISD as the sixth highest in the Houston metro, Cross Creek Ranch is one of Texas\'s premier master-planned communities, and the Grand Parkway (SH-99) gives residents efficient access to both Katy and Sugar Land. The +7.3% YOY appreciation signals sustained demand in a still-developing market.',
  strengths: [
    'Lamar CISD rated B (88/100) — tied 6th in Houston metro, strong academic performance',
    'Cross Creek Ranch — award-winning master-planned community with resort amenities and trails',
    'Grand Parkway access — efficient connectivity to Katy, Sugar Land, and the Energy Corridor',
  ],
  weaknesses: [
    'Median $558K — premium pricing in a market still building retail and service infrastructure',
    'Limited local amenities — dining, shopping, and entertainment require driving to Katy or Sugar Land',
    'Flooding risk — Fort Bend County location requires flood zone due diligence before purchasing',
  ],
},
```

---

### 5. PASADENA, TX

```typescript
{
  id: 'pasadena-tx',
  name: 'Pasadena',
  state: 'TX',
  county: 'Harris',
  type: 'city',
  tier: 'tier2',
  parentId: null,
  hasNeighborhoodData: false,
  lastUpdated: '05/2026',
  metroUsed: 'Houston, TX metro area',
  scores: {
    affordability: 9,
    schools: 5,
    safety: 5,
    walkability: 3,
    transit: 2,
    nightlife: 4,
    outdoors: 5,
    familyFriendly: 6,
    remoteWork: 6,
    lowTaxes: 8,
    weather: 4,
    traffic: 6,
  },
  housing: {
    avgRent1BR: 1100,
    avgRent2BR: 1350,
    avgRent3BR: 1750,
    starterHomePrice: 155000,
    medianHomePrice: 218000,
    propertyTaxRate: 0.0195,
    pricePerSqFt: 129,
    monthlyUtilities: 210,
    monthlyGroceries: 405,
    monthlyTransportation: 430,
  },
  market: {
    daysOnMarket: 60,
    saleToListRatio: 97.0,
    priceYOY: 0.2,
    marketCondition: 'Balanced Market',
    redfinMedianPrice: 218000,
    redfinDataSource: 'Zillow ZHVI city-level — Pasadena, TX. Date: 05/2026',
  },
  school: {
    teaRating: 'B',
    primaryISD: 'Pasadena ISD',
  },
  description: 'Pasadena is the most affordable city of meaningful size in the Houston metro — at $218K median and $129/sqft, it offers the lowest entry point in the database for buyers prioritizing proximity to the Houston Ship Channel employment corridor and the Texas Medical Center. Pasadena ISD earns a B (84/100) from TEA. The tradeoff is honest: this is a working-class industrial city with a different character than Sugar Land or Katy, and buyers should approach it knowing that.',
  strengths: [
    'Most affordable Houston suburb in the database — median $218K, $129/sqft',
    'Houston Ship Channel proximity — major industrial and petrochemical employment corridor minutes away',
    'Pasadena ISD rated B (84/100) — strong academic performance for an economically diverse district',
  ],
  weaknesses: [
    'Industrial character — petrochemical plants and Ship Channel proximity affect air quality and aesthetic',
    'Higher crime rate than suburban Houston peers — neighborhood-level due diligence essential',
    'Flooding risk — low-lying Harris County geography creates meaningful exposure',
  ],
},
```

---

### 6. BAYTOWN, TX

```typescript
{
  id: 'baytown-tx',
  name: 'Baytown',
  state: 'TX',
  county: 'Harris',
  type: 'city',
  tier: 'tier2',
  parentId: null,
  hasNeighborhoodData: false,
  lastUpdated: '05/2026',
  metroUsed: 'Houston, TX metro area',
  scores: {
    affordability: 9,
    schools: 5,
    safety: 5,
    walkability: 3,
    transit: 1,
    nightlife: 3,
    outdoors: 6,
    familyFriendly: 6,
    remoteWork: 5,
    lowTaxes: 8,
    weather: 4,
    traffic: 7,
  },
  housing: {
    avgRent1BR: 1050,
    avgRent2BR: 1300,
    avgRent3BR: 1650,
    starterHomePrice: 155000,
    medianHomePrice: 241000,
    propertyTaxRate: 0.0200,
    pricePerSqFt: 137,
    monthlyUtilities: 210,
    monthlyGroceries: 405,
    monthlyTransportation: 430,
  },
  market: {
    daysOnMarket: 74,
    saleToListRatio: 97.0,
    priceYOY: -7.9,
    marketCondition: 'Buyers Market',
    redfinMedianPrice: 241000,
    redfinDataSource: 'Redfin city-level — Baytown, TX. Date: 01/2026',
  },
  school: {
    teaRating: 'B',
    primaryISD: 'Goose Creek CISD',
  },
  description: 'Baytown is Houston\'s east side blue-collar backbone — an 84,000-person city anchored by ExxonMobil\'s massive Baytown Complex (one of the largest refineries in the US), with Galveston Bay access for birding, fishing, and coastal recreation, and housing prices that make every other city in the database look expensive. Goose Creek CISD earns a B from TEA. Best suited for energy sector workers, buyers prioritizing maximum affordability with Houston access, or outdoor enthusiasts drawn to the Galveston Bay ecosystem.',
  strengths: [
    'ExxonMobil Baytown Complex — one of the largest petrochemical employment centers in the US',
    'Galveston Bay access — birding, fishing, and coastal recreation on the doorstep',
    'Second most affordable city in the database — median $241K for an 84,000-person city',
  ],
  weaknesses: [
    'Industrial character — refinery and petrochemical presence defines the city\'s identity and air quality',
    'Higher crime rate than suburban Houston peers — area varies significantly by neighborhood',
    'Hurricane and storm surge risk — coastal location with significant weather exposure',
  ],
},
```

---

### 7. HUMBLE, TX

```typescript
{
  id: 'humble-tx',
  name: 'Humble',
  state: 'TX',
  county: 'Harris',
  type: 'city',
  tier: 'tier2',
  parentId: null,
  hasNeighborhoodData: false,
  lastUpdated: '05/2026',
  metroUsed: 'Houston, TX metro area',
  scores: {
    affordability: 8,
    schools: 4,
    safety: 5,
    walkability: 3,
    transit: 2,
    nightlife: 3,
    outdoors: 5,
    familyFriendly: 6,
    remoteWork: 6,
    lowTaxes: 7,
    weather: 4,
    traffic: 6,
  },
  housing: {
    avgRent1BR: 1150,
    avgRent2BR: 1400,
    avgRent3BR: 1800,
    starterHomePrice: 185000,
    medianHomePrice: 261000,
    propertyTaxRate: 0.0200,
    pricePerSqFt: 145,
    monthlyUtilities: 210,
    monthlyGroceries: 410,
    monthlyTransportation: 430,
  },
  market: {
    daysOnMarket: 77,
    saleToListRatio: 96.5,
    priceYOY: -3.5,
    marketCondition: 'Buyers Market',
    redfinMedianPrice: 261000,
    redfinDataSource: 'Redfin city-level — Humble, TX. Date: 03/2026',
  },
  school: {
    teaRating: 'C',
    primaryISD: 'Humble ISD',
  },
  description: 'Humble sits at the intersection of two major advantages for certain buyers — IAH (George Bush Intercontinental Airport) is 10 minutes away, making it the best option in Houston for frequent international travelers, and housing prices are among the lowest in the north Houston corridor. The city\'s location on US-59 and Beltway 8 gives reasonable access to The Woodlands employment corridor. Best suited for airport workers, airline employees, and buyers where price is the primary constraint.',
  strengths: [
    'IAH Airport 10 minutes — unmatched access to Houston\'s international airport for frequent travelers',
    'Affordable north Houston pricing — median $261K significantly below The Woodlands and Spring',
    'US-59/Beltway 8 access — The Woodlands employment corridor within 20 minutes',
  ],
  weaknesses: [
    'Humble ISD rated C by TEA — below north Houston suburban average',
    'Flooding risk — significant Harvey flooding in 2017; elevation and drainage require investigation',
    'Limited community character — Humble functions primarily as a commercial corridor and residential area',
  ],
},
```

---

### 8. SPRING, TX

```typescript
{
  id: 'spring-tx',
  name: 'Spring',
  state: 'TX',
  county: 'Harris',
  type: 'city',
  tier: 'tier2',
  parentId: null,
  hasNeighborhoodData: false,
  lastUpdated: '05/2026',
  metroUsed: 'Houston, TX metro area',
  scores: {
    affordability: 8,
    schools: 4,
    safety: 5,
    walkability: 2,
    transit: 1,
    nightlife: 3,
    outdoors: 5,
    familyFriendly: 6,
    remoteWork: 6,
    lowTaxes: 7,
    weather: 4,
    traffic: 6,
  },
  housing: {
    avgRent1BR: 1150,
    avgRent2BR: 1400,
    avgRent3BR: 1800,
    starterHomePrice: 175000,
    medianHomePrice: 236000,
    propertyTaxRate: 0.0200,
    pricePerSqFt: 140,
    monthlyUtilities: 210,
    monthlyGroceries: 410,
    monthlyTransportation: 430,
  },
  market: {
    daysOnMarket: 77,
    saleToListRatio: 96.5,
    priceYOY: -5.6,
    marketCondition: 'Buyers Market',
    redfinMedianPrice: 236000,
    redfinDataSource: 'Redfin city-level — Spring, TX. Date: 03/2026',
  },
  school: {
    teaRating: 'D',
    primaryISD: 'Spring ISD',
  },
  description: 'Spring is the largest unincorporated community in Harris County — a sprawling area of 170,000+ residents with no city government, low property taxes, and housing prices that compete with the most affordable markets in the database. The I-45 north corridor gives direct access to The Woodlands employment center, and the Spring area is home to dozens of master-planned communities at prices well below Woodlands pricing. Best suited for buyers prioritizing affordability and access to The Woodlands without the price tag, who are comfortable with private schooling or selecting specific neighborhoods with Klein ISD access.',
  strengths: [
    'Most affordable north Houston corridor option — median $236K with I-45 access to The Woodlands',
    'Large unincorporated community — lower tax burden than incorporated cities in the same area',
    'Diverse housing inventory — everything from starter homes to established executive neighborhoods',
  ],
  weaknesses: [
    'Spring ISD rated D by TEA — significant concern for families relying on public schools',
    'Unincorporated status — no city services; quality of roads, drainage, and services varies by area',
    'Flooding risk — multiple Spring area communities experienced serious Harvey flooding',
  ],
},
```

---

### 9. GALVESTON, TX

```typescript
{
  id: 'galveston-tx',
  name: 'Galveston',
  state: 'TX',
  county: 'Galveston',
  type: 'city',
  tier: 'tier2',
  parentId: null,
  hasNeighborhoodData: false,
  lastUpdated: '05/2026',
  metroUsed: 'Houston, TX metro area',
  scores: {
    affordability: 5,
    schools: 3,
    safety: 5,
    walkability: 6,
    transit: 3,
    nightlife: 7,
    outdoors: 10,
    familyFriendly: 5,
    remoteWork: 6,
    lowTaxes: 7,
    weather: 3,
    traffic: 6,
  },
  housing: {
    avgRent1BR: 1400,
    avgRent2BR: 1750,
    avgRent3BR: 2200,
    starterHomePrice: 250000,
    medianHomePrice: 365000,
    propertyTaxRate: 0.0195,
    pricePerSqFt: 260,
    monthlyUtilities: 220,
    monthlyGroceries: 415,
    monthlyTransportation: 440,
  },
  market: {
    daysOnMarket: 130,
    saleToListRatio: 96.5,
    priceYOY: 1.4,
    marketCondition: 'Buyers Market',
    redfinMedianPrice: 365000,
    redfinDataSource: 'Redfin city-level — Galveston, TX. Date: 03/2026',
  },
  school: {
    teaRating: 'C',
    primaryISD: 'Galveston ISD',
  },
  description: 'Galveston is the most distinctive city in the Houston metro — a barrier island with 32 miles of beaches, a Victorian Historic District listed on the National Register of Historic Places, UTMB (the oldest medical school in Texas), and a Strand district of galleries, restaurants, and live music that feels genuinely unlike anywhere else in Texas. For buyers who want coastal living, beach access, and authentic historic character, and can accept hurricane risk and C-rated schools, Galveston is in a category of its own.',
  strengths: [
    '32 miles of Gulf Coast beaches — the only metro-adjacent beach city in the HavenQuest database',
    'Victorian Historic District — one of the most architecturally significant historic neighborhoods in Texas',
    'UTMB presence — research institution and major employer anchoring the island\'s economy',
  ],
  weaknesses: [
    'Hurricane risk — barrier island location is among the highest hurricane exposure in Texas',
    'Galveston ISD rated C — below average, significant concern for school-focused families',
    '130 days on market — slowest-moving inventory in the Houston database, buyer opportunity but resale risk',
  ],
},
```

---

### 10. RICHMOND, TX

```typescript
{
  id: 'richmond-tx',
  name: 'Richmond',
  state: 'TX',
  county: 'Fort Bend',
  type: 'city',
  tier: 'tier2',
  parentId: null,
  hasNeighborhoodData: false,
  lastUpdated: '05/2026',
  metroUsed: 'Houston, TX metro area',
  scores: {
    affordability: 7,
    schools: 8,
    safety: 7,
    walkability: 3,
    transit: 1,
    nightlife: 3,
    outdoors: 6,
    familyFriendly: 8,
    remoteWork: 6,
    lowTaxes: 7,
    weather: 4,
    traffic: 7,
  },
  housing: {
    avgRent1BR: 1250,
    avgRent2BR: 1550,
    avgRent3BR: 1950,
    starterHomePrice: 235000,
    medianHomePrice: 340000,
    propertyTaxRate: 0.0200,
    pricePerSqFt: 158,
    monthlyUtilities: 210,
    monthlyGroceries: 410,
    monthlyTransportation: 435,
  },
  market: {
    daysOnMarket: 64,
    saleToListRatio: 97.0,
    priceYOY: 3.8,
    marketCondition: 'Balanced Market',
    redfinMedianPrice: 340000,
    redfinDataSource: 'Redfin city-level — Richmond/Rosenberg, TX. Date: 03/2026',
  },
  school: {
    teaRating: 'B',
    primaryISD: 'Lamar CISD',
  },
  description: 'Richmond is Fort Bend County\'s historic county seat — a small city of 12,000 with a genuine historic downtown, served by Lamar CISD (B, 88/100), and surrounded by some of the fastest-growing master-planned communities in the Houston metro. Grand Mission and Aliana bring new infrastructure and amenities to Richmond\'s doorstep while the historic Brazos River corridor and Fort Bend Museum give the city an identity beyond bedroom community.',
  strengths: [
    'Lamar CISD rated B (88/100) — tied 6th in Houston metro, strong and improving',
    'Historic Fort Bend County seat — genuine character with courthouse square and Brazos River access',
    'Grand Mission and Aliana communities — new master-planned development in adjacent areas',
  ],
  weaknesses: [
    'Small city infrastructure — limited local dining, retail, and entertainment options',
    'US-90A commute — 35-40 minutes to downtown Houston or the Medical Center',
    'Flooding risk — Brazos River proximity creates meaningful flood exposure in some areas',
  ],
},
```

---

### 11. ROSENBERG, TX

```typescript
{
  id: 'rosenberg-tx',
  name: 'Rosenberg',
  state: 'TX',
  county: 'Fort Bend',
  type: 'city',
  tier: 'tier2',
  parentId: null,
  hasNeighborhoodData: false,
  lastUpdated: '05/2026',
  metroUsed: 'Houston, TX metro area',
  scores: {
    affordability: 8,
    schools: 8,
    safety: 6,
    walkability: 3,
    transit: 1,
    nightlife: 3,
    outdoors: 5,
    familyFriendly: 7,
    remoteWork: 6,
    lowTaxes: 7,
    weather: 4,
    traffic: 7,
  },
  housing: {
    avgRent1BR: 1200,
    avgRent2BR: 1500,
    avgRent3BR: 1900,
    starterHomePrice: 220000,
    medianHomePrice: 323000,
    propertyTaxRate: 0.0200,
    pricePerSqFt: 148,
    monthlyUtilities: 210,
    monthlyGroceries: 410,
    monthlyTransportation: 435,
  },
  market: {
    daysOnMarket: 64,
    saleToListRatio: 97.0,
    priceYOY: 3.8,
    marketCondition: 'Balanced Market',
    redfinMedianPrice: 323000,
    redfinDataSource: 'Redfin city-level — Rosenberg, TX. Date: 03/2026',
  },
  school: {
    teaRating: 'B',
    primaryISD: 'Lamar CISD',
  },
  description: 'Rosenberg is Fort Bend County\'s most affordable city — adjacent to Richmond, served by the same Lamar CISD (B, 88/100), and offering the best price-per-square-foot value in the Fort Bend corridor at $148/sqft. The US-59 Southwest Freeway gives direct access to Sugar Land and Houston, and Rosenberg\'s location between two of the fastest-growing corridors in Texas (Fort Bend and Brazoria counties) positions it well for long-term appreciation despite near-term market stability.',
  strengths: [
    'Most affordable Fort Bend County city — median $323K with Lamar CISD B-rated schools',
    'Best price per square foot in Fort Bend corridor — $148/sqft vs $184 in Fulshear',
    'US-59 access — direct freeway to Sugar Land, Stafford, and downtown Houston',
  ],
  weaknesses: [
    'Limited urban amenities — depends on Sugar Land and Richmond for retail and dining',
    'Crime rate above Fort Bend county average — neighborhood-level research essential',
    'Flooding risk — Brazos River and low-lying terrain create exposure in some areas',
  ],
},
```

---

### 12. MANVEL, TX

```typescript
{
  id: 'manvel-tx',
  name: 'Manvel',
  state: 'TX',
  county: 'Brazoria',
  type: 'city',
  tier: 'tier2',
  parentId: null,
  hasNeighborhoodData: false,
  lastUpdated: '05/2026',
  metroUsed: 'Houston, TX metro area',
  scores: {
    affordability: 7,
    schools: 7,
    safety: 8,
    walkability: 1,
    transit: 1,
    nightlife: 2,
    outdoors: 5,
    familyFriendly: 8,
    remoteWork: 6,
    lowTaxes: 8,
    weather: 4,
    traffic: 7,
  },
  housing: {
    avgRent1BR: 1250,
    avgRent2BR: 1550,
    avgRent3BR: 2000,
    starterHomePrice: 270000,
    medianHomePrice: 375000,
    propertyTaxRate: 0.0185,
    pricePerSqFt: 157,
    monthlyUtilities: 210,
    monthlyGroceries: 410,
    monthlyTransportation: 435,
  },
  market: {
    daysOnMarket: 55,
    saleToListRatio: 97.0,
    priceYOY: -2.0,
    marketCondition: 'Buyers Market',
    redfinMedianPrice: 375000,
    redfinDataSource: 'Zillow ZHVI city-level — Manvel, TX. Date: 05/2026',
  },
  school: {
    teaRating: 'B',
    primaryISD: 'Alvin ISD',
  },
  description: 'Manvel is Brazoria County\'s fastest-growing family destination — served by Alvin ISD (B, 84/100 from TEA), with one of the lowest property tax rates in the Houston metro at 1.85%, and master-planned communities like Iowa Colony bringing resort amenities to what was recently rural land. The SH-288 corridor gives residents 25-minute access to Pearland and 35-minute access to the Texas Medical Center, and Brazoria County\'s lower cost structure means buyers get more house per dollar than in Harris or Fort Bend.',
  strengths: [
    'Alvin ISD rated B (84/100) — strong and improving district serving a fast-growing Brazoria County community',
    'Lowest property tax rate in the Houston database at 1.85% — meaningful annual savings',
    'Iowa Colony master-planned community — new infrastructure and amenities in a fast-developing corridor',
  ],
  weaknesses: [
    'Limited local amenities — almost entirely residential, all retail and dining require driving to Pearland',
    'Car-dependent — no transit, no walkability, purely suburban',
    'SH-288 commute — 35-40 minutes to Texas Medical Center during peak hours',
  ],
},
```

---

## Implementation Checklist for Claude Code

- [ ] Append all 12 city objects to `texasCities` array in `data/cities.ts`
- [ ] Insert after the Conroe entry (last city from Houston Wave 1 brief)
- [ ] Do not modify any existing city entries
- [ ] Run `tsc --noEmit` to verify no TypeScript errors
- [ ] Commit with message noting all 12 cities added
- [ ] Push to main

---

## Score Notes

**Schools:**
- Tomball 10/10 — A (92/100), highest-scoring large district in Texas, 6 consecutive A ratings
- Fulshear 8/10, Missouri City 7/10, Cypress 7/10, Richmond 8/10, Rosenberg 8/10, Manvel 7/10 — B-rated ISDs
- Humble 4/10, Spring 4/10 — C and D rated ISDs disclosed honestly
- Galveston 3/10, Pasadena 5/10, Baytown 5/10 — lower-performing but serving legitimate buyer segments

**Weather scored 4/10 for all Houston cities** — Houston's heat, humidity, and hurricane risk are significant and must be disclosed honestly to out-of-state buyers.

**Flooding risk disclosed in weaknesses** for Cypress, Pasadena, Baytown, Humble, Spring, Richmond, Rosenberg — all experienced Harvey flooding. This is non-negotiable disclosure for relocating buyers.

**Spring ISD D rating** — disclosed honestly. Spring serves a legitimate buyer segment (affordability-first, private school families, investors). Scoring reflects reality.

---

*Brief prepared by Claude — HavenQuest COO/Chief Editor. May 29, 2026. Data sourced from Redfin city-level, Zillow ZHVI, Orchard, Movoto, and TEA August 2025 ratings.*
