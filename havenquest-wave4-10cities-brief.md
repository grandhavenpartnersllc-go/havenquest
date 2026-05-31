# HavenQuest — Wave 4 Expansion Brief: 10 New Cities (101 Total)
**Prepared by:** Claude (COO/Chief Editor)  
**Date:** May 29, 2026  
**Status:** Ready for Claude Code implementation  
**Priority:** P1 — Reach 101 cities milestone

---

## Summary

Adds 10 cities to reach 101 total. DFW (3), Houston (3), Austin (2), San Antonio (2).

Cities added:
1. Cedar Hill (Dallas County — tier2) — DFW
2. DeSoto (Dallas County — tier2) — DFW
3. Anna (Collin County — tier2) — DFW
4. Dickinson (Galveston County — tier2) — Houston
5. Lake Jackson (Brazoria County — tier2) — Houston
6. Webster (Harris County — tier2) — Houston
7. Lockhart (Caldwell County — tier2) — Austin
8. Marble Falls (Burnet County — tier2) — Austin
9. Fredericksburg (Gillespie County — tier2) — San Antonio
10. Pleasanton (Atascosa County — tier2) — San Antonio

**TEA 2025 ratings confirmed:**
- Cedar Hill ISD: C
- DeSoto ISD: C (improved from D in 2024)
- Anna ISD: B
- Dickinson ISD (Clear Creek ISD): B
- Brazosport ISD (Lake Jackson): B
- Clear Creek ISD (Webster): B
- Lockhart ISD: D (dropped from C in 2025)
- Marble Falls ISD: C
- Fredericksburg ISD: B
- Pleasanton ISD: C

---

## Implementation Instructions for Claude Code

Append all 10 city objects to the `texasCities` array in `data/cities.ts`, after the Canyon Lake entry (last city from Wave 3). Do not modify any existing entries. Run `tsc --noEmit` after insertion. Commit and push.

---

## City Data — Complete Entries

### 1. CEDAR HILL, TX (DFW)

```typescript
{
  id: 'cedar-hill-tx',
  name: 'Cedar Hill',
  state: 'TX',
  county: 'Dallas',
  type: 'city',
  tier: 'tier2',
  parentId: null,
  hasNeighborhoodData: false,
  lastUpdated: '05/2026',
  metroUsed: 'Dallas, TX metro area',
  scores: {
    affordability: 7,
    schools: 4,
    safety: 6,
    walkability: 2,
    transit: 1,
    nightlife: 3,
    outdoors: 8,
    familyFriendly: 7,
    remoteWork: 6,
    lowTaxes: 8,
    weather: 5,
    traffic: 7,
  },
  housing: {
    avgRent1BR: 1200,
    avgRent2BR: 1500,
    avgRent3BR: 1900,
    starterHomePrice: 225000,
    medianHomePrice: 324000,
    propertyTaxRate: 0.0200,
    pricePerSqFt: 165,
    monthlyUtilities: 210,
    monthlyGroceries: 410,
    monthlyTransportation: 430,
  },
  market: {
    daysOnMarket: 68,
    saleToListRatio: 96.5,
    priceYOY: -11.0,
    marketCondition: 'Buyers Market',
    redfinMedianPrice: 324000,
    redfinDataSource: 'Redfin city-level — Cedar Hill, TX. Date: 08/2025',
  },
  school: {
    teaRating: 'C',
    primaryISD: 'Cedar Hill ISD',
  },
  description: 'Cedar Hill is southwest Dallas County\'s outdoor destination suburb — Cedar Hill State Park sits within the city limits with 355 acres on Joe Pool Lake, offering mountain biking trails, camping, swimming, and kayaking that no other DFW suburb can match. The city\'s ridge-top terrain gives many neighborhoods panoramic views of the Dallas skyline 20 miles north. At $324K median with significant buyer leverage, Cedar Hill is a value option for outdoors-focused families who can work with Cedar Hill ISD\'s C rating or use private schools.',
  strengths: [
    'Cedar Hill State Park — 355 acres on Joe Pool Lake with mountain biking, camping, and water access within city limits',
    'Panoramic Dallas skyline views — ridge-top terrain unique in the southwest DFW corridor',
    '-11% YOY correction — meaningful buyer leverage in an established suburb',
  ],
  weaknesses: [
    'Cedar Hill ISD rated C by TEA — limiting factor for school-focused families',
    'Limited employment base locally — most residents commute north to Dallas or Irving',
    'Car-dependent — no transit, older retail infrastructure along US-67',
  ],
},
```

---

### 2. DESOTO, TX (DFW)

```typescript
{
  id: 'desoto-tx',
  name: 'DeSoto',
  state: 'TX',
  county: 'Dallas',
  type: 'city',
  tier: 'tier2',
  parentId: null,
  hasNeighborhoodData: false,
  lastUpdated: '05/2026',
  metroUsed: 'Dallas, TX metro area',
  scores: {
    affordability: 7,
    schools: 4,
    safety: 5,
    walkability: 3,
    transit: 2,
    nightlife: 4,
    outdoors: 5,
    familyFriendly: 6,
    remoteWork: 7,
    lowTaxes: 8,
    weather: 5,
    traffic: 6,
  },
  housing: {
    avgRent1BR: 1200,
    avgRent2BR: 1500,
    avgRent3BR: 1900,
    starterHomePrice: 230000,
    medianHomePrice: 350000,
    propertyTaxRate: 0.0195,
    pricePerSqFt: 154,
    monthlyUtilities: 210,
    monthlyGroceries: 410,
    monthlyTransportation: 430,
  },
  market: {
    daysOnMarket: 65,
    saleToListRatio: 97.2,
    priceYOY: -6.7,
    marketCondition: 'Buyers Market',
    redfinMedianPrice: 350000,
    redfinDataSource: 'Orchard/Redfin city-level — DeSoto, TX. Date: 05/2026',
  },
  school: {
    teaRating: 'C',
    primaryISD: 'DeSoto ISD',
  },
  description: 'DeSoto is a south Dallas County suburban city of 58,000 that improved from a D to C in TEA\'s 2025 ratings — a district explicitly on a trajectory of steady districtwide improvement per its own superintendent. At $350K median with I-35E access to downtown Dallas in 20 minutes and direct DART bus connections, DeSoto punches above its price point for buyers who need south Dallas positioning. The city has a strong Black community identity and cultural heritage that gives it a distinct character.',
  strengths: [
    'DeSoto ISD improved from D to C in 2025 — district superintendent cited steady districtwide improvement',
    'I-35E direct access — 20-minute corridor to downtown Dallas employment',
    'Strong community identity and cultural character — established south Dallas suburb with distinct heritage',
  ],
  weaknesses: [
    'DeSoto ISD rated C — still below DFW suburban average despite recent improvement',
    'Crime rate above suburban DFW average — south Dallas corridor requires neighborhood research',
    '-6.7% YOY price correction — buyer opportunity but market still adjusting',
  ],
},
```

---

### 3. ANNA, TX (DFW)

```typescript
{
  id: 'anna-tx',
  name: 'Anna',
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
    schools: 7,
    safety: 8,
    walkability: 1,
    transit: 1,
    nightlife: 2,
    outdoors: 5,
    familyFriendly: 8,
    remoteWork: 6,
    lowTaxes: 7,
    weather: 5,
    traffic: 6,
  },
  housing: {
    avgRent1BR: 1400,
    avgRent2BR: 1750,
    avgRent3BR: 2200,
    starterHomePrice: 290000,
    medianHomePrice: 360000,
    propertyTaxRate: 0.0164,
    pricePerSqFt: 157,
    monthlyUtilities: 215,
    monthlyGroceries: 415,
    monthlyTransportation: 440,
  },
  market: {
    daysOnMarket: 80,
    saleToListRatio: 97.0,
    priceYOY: -8.7,
    marketCondition: 'Buyers Market',
    redfinMedianPrice: 349000,
    redfinDataSource: 'Redfin/Zillow city-level — Anna, TX. Date: 11/2025',
  },
  school: {
    teaRating: 'B',
    primaryISD: 'Anna ISD',
  },
  description: 'Anna is north Collin County\'s emerging family destination — positioned on US-75 between McKinney and Sherman with Anna ISD earning a B from TEA, one of the lowest effective tax rates in Collin County at 1.64%, and master-planned communities like Sherley Farms (3,000 homes) and Liberty Hills (1,800 homes) breaking ground in 2025. For families priced out of Celina or Prosper who want Collin County schools and new construction at a genuine discount, Anna is the next frontier.',
  strengths: [
    'Anna ISD rated B — strong academic performance for a rapidly growing north Collin County district',
    'Lowest effective property tax rate in Collin County — 1.64% provides meaningful annual savings',
    'Sherley Farms and Liberty Hills — major new master-planned communities breaking ground in 2025',
  ],
  weaknesses: [
    '-8.7% YOY price decline — new construction supply absorption taking time',
    'Limited local amenities — Anna is still primarily residential, McKinney is 20 minutes for retail',
    'Long US-75 commute — 45-55 minutes to Dallas employment centers during peak hours',
  ],
},
```

---

### 4. DICKINSON, TX (Houston)

```typescript
{
  id: 'dickinson-tx',
  name: 'Dickinson',
  state: 'TX',
  county: 'Galveston',
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
    outdoors: 7,
    familyFriendly: 7,
    remoteWork: 6,
    lowTaxes: 8,
    weather: 3,
    traffic: 7,
  },
  housing: {
    avgRent1BR: 1150,
    avgRent2BR: 1400,
    avgRent3BR: 1800,
    starterHomePrice: 200000,
    medianHomePrice: 268000,
    propertyTaxRate: 0.0195,
    pricePerSqFt: 148,
    monthlyUtilities: 210,
    monthlyGroceries: 405,
    monthlyTransportation: 430,
  },
  market: {
    daysOnMarket: 65,
    saleToListRatio: 97.0,
    priceYOY: -2.5,
    marketCondition: 'Buyers Market',
    redfinMedianPrice: 268000,
    redfinDataSource: 'Redfin city-level — Dickinson, TX. Date: 04/2026',
  },
  school: {
    teaRating: 'B',
    primaryISD: 'Dickinson ISD',
  },
  description: 'Dickinson is the most affordable city in the Clear Lake/Galveston Bay corridor — served by Dickinson ISD (rated B by TEA), with Galveston Bay access for fishing and boating, and I-45 giving residents 30-minute access to both Houston and Galveston. At $268K median with $148/sqft, Dickinson offers the best price-per-square-foot value in the Galveston County database while maintaining B-rated schools.',
  strengths: [
    'Dickinson ISD rated B — strong academic performance for a Galveston County community',
    'Most affordable Galveston County city with B-rated schools — median $268K',
    'Galveston Bay access — fishing, boating, and bay recreation minutes from neighborhoods',
  ],
  weaknesses: [
    'Hurricane and flooding risk — Galveston County coastal location with significant storm exposure',
    'Limited local retail and dining — depends on League City and Webster for amenities',
    'I-45 traffic — peak hour commute to Houston can be 45-60 minutes',
  ],
},
```

---

### 5. LAKE JACKSON, TX (Houston)

```typescript
{
  id: 'lake-jackson-tx',
  name: 'Lake Jackson',
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
    safety: 7,
    walkability: 4,
    transit: 1,
    nightlife: 4,
    outdoors: 8,
    familyFriendly: 7,
    remoteWork: 6,
    lowTaxes: 8,
    weather: 3,
    traffic: 8,
  },
  housing: {
    avgRent1BR: 1150,
    avgRent2BR: 1400,
    avgRent3BR: 1800,
    starterHomePrice: 215000,
    medianHomePrice: 323000,
    propertyTaxRate: 0.0185,
    pricePerSqFt: 155,
    monthlyUtilities: 210,
    monthlyGroceries: 405,
    monthlyTransportation: 430,
  },
  market: {
    daysOnMarket: 74,
    saleToListRatio: 97.0,
    priceYOY: 14.2,
    marketCondition: 'Balanced Market',
    redfinMedianPrice: 323000,
    redfinDataSource: 'Orchard city-level — Lake Jackson, TX. Date: 05/2026',
  },
  school: {
    teaRating: 'B',
    primaryISD: 'Brazosport ISD',
  },
  description: 'Lake Jackson is the Brazosport area\'s anchor city — a planned community originally built by Dow Chemical in the 1940s to house its workers, giving it a distinctive layout of curving streets and greenbelts unlike any other Texas suburb. Brazosport ISD earns a B from TEA, the Brazos River and Gulf Coast are within 15 minutes, and +14.2% YOY price appreciation signals that buyers are discovering its distinctive character and relative affordability. The Dow Chemical corridor provides stable petrochemical employment that has anchored the community for 80 years.',
  strengths: [
    'Unique planned community design — curving streets and greenbelts unlike any other Texas suburb',
    'Brazosport ISD rated B — strong academic programming for the Brazosport area community',
    'Dow Chemical corridor — 80 years of stable petrochemical employment anchoring the local economy',
  ],
  weaknesses: [
    'Hurricane exposure — Gulf Coast positioning with significant storm and surge risk',
    '50-mile drive to Houston — not suitable for daily Houston commuters',
    'Limited economic diversification — heavy dependence on Dow and petrochemical sector',
  ],
},
```

---

### 6. WEBSTER, TX (Houston)

```typescript
{
  id: 'webster-tx',
  name: 'Webster',
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
    schools: 8,
    safety: 7,
    walkability: 4,
    transit: 2,
    nightlife: 5,
    outdoors: 6,
    familyFriendly: 7,
    remoteWork: 7,
    lowTaxes: 7,
    weather: 4,
    traffic: 6,
  },
  housing: {
    avgRent1BR: 1300,
    avgRent2BR: 1600,
    avgRent3BR: 2050,
    starterHomePrice: 250000,
    medianHomePrice: 345000,
    propertyTaxRate: 0.0195,
    pricePerSqFt: 163,
    monthlyUtilities: 213,
    monthlyGroceries: 413,
    monthlyTransportation: 438,
  },
  market: {
    daysOnMarket: 55,
    saleToListRatio: 97.0,
    priceYOY: -1.5,
    marketCondition: 'Balanced Market',
    redfinMedianPrice: 345000,
    redfinDataSource: 'Zillow/local MLS — Webster, TX. Date: 05/2026',
  },
  school: {
    teaRating: 'B',
    primaryISD: 'Clear Creek ISD',
  },
  description: 'Webster is the commercial and community hub of the Clear Lake corridor — positioned on I-45 between Houston and Galveston, served by Clear Creek ISD (B, 86/100), and home to a dense retail and dining corridor that serves the NASA/Johnson Space Center community. For buyers who want Clear Creek ISD access without League City pricing, and who need NASA corridor employment access with strong commercial amenities, Webster fills a specific and underserved niche in the Houston database.',
  strengths: [
    'Clear Creek ISD rated B (86/100) — same strong district as League City at lower price point',
    'NASA/Johnson Space Center corridor — 15 minutes to aerospace and tech employment hub',
    'Dense retail and dining on Bay Area Boulevard — one of the best-served commercial corridors in southeast Houston',
  ],
  weaknesses: [
    'Flooding risk — Harris County low-lying terrain with Harvey flood exposure',
    'I-45 traffic — can be significant during peak hours both directions',
    'Limited residential character — Webster is more commercial corridor than residential community',
  ],
},
```

---

### 7. LOCKHART, TX (Austin)

```typescript
{
  id: 'lockhart-tx',
  name: 'Lockhart',
  state: 'TX',
  county: 'Caldwell',
  type: 'city',
  tier: 'tier2',
  parentId: null,
  hasNeighborhoodData: false,
  lastUpdated: '05/2026',
  metroUsed: 'Austin, TX metro area',
  scores: {
    affordability: 8,
    schools: 3,
    safety: 6,
    walkability: 4,
    transit: 1,
    nightlife: 4,
    outdoors: 6,
    familyFriendly: 5,
    remoteWork: 6,
    lowTaxes: 8,
    weather: 5,
    traffic: 8,
  },
  housing: {
    avgRent1BR: 1100,
    avgRent2BR: 1350,
    avgRent3BR: 1750,
    starterHomePrice: 200000,
    medianHomePrice: 330000,
    propertyTaxRate: 0.0185,
    pricePerSqFt: 170,
    monthlyUtilities: 200,
    monthlyGroceries: 390,
    monthlyTransportation: 420,
  },
  market: {
    daysOnMarket: 90,
    saleToListRatio: 96.5,
    priceYOY: -3.0,
    marketCondition: 'Buyers Market',
    redfinMedianPrice: 330000,
    redfinDataSource: 'MLS/local data — Lockhart, TX. Date: 03/2026',
  },
  school: {
    teaRating: 'D',
    primaryISD: 'Lockhart ISD',
  },
  description: 'Lockhart is the self-proclaimed BBQ Capital of Texas — home to Kreuz Market, Smitty\'s, Black\'s, and Chisholm Trail BBQ, four legendary pitmasters in one small city that draws visitors from across the country. The Caldwell County seat has a genuine historic courthouse square, SH-130 access to Austin in 30 minutes without I-35 traffic, and some of the lowest home prices in the Austin metro. Lockhart ISD dropped to D in 2025, making Lockhart best suited for remote workers, retirees, private school families, or buyers who prioritize affordability and Texas character over school ratings.',
  strengths: [
    'BBQ Capital of Texas — Kreuz Market, Smitty\'s, Black\'s, and Chisholm Trail all within city limits',
    'SH-130 access to Austin — 30-minute corridor to east Austin without I-35 congestion',
    'Most affordable Caldwell County city — median $330K with genuine historic small-town character',
  ],
  weaknesses: [
    'Lockhart ISD rated D by TEA — dropped from C in 2025, significant concern for school-focused families',
    'Limited employment base locally — Caldwell County economy requires Austin commuting for most professional roles',
    'Small city infrastructure — limited retail, medical, and entertainment options',
  ],
},
```

---

### 8. MARBLE FALLS, TX (Austin)

```typescript
{
  id: 'marble-falls-tx',
  name: 'Marble Falls',
  state: 'TX',
  county: 'Burnet',
  type: 'city',
  tier: 'tier2',
  parentId: null,
  hasNeighborhoodData: false,
  lastUpdated: '05/2026',
  metroUsed: 'Austin, TX metro area',
  scores: {
    affordability: 5,
    schools: 4,
    safety: 7,
    walkability: 4,
    transit: 1,
    nightlife: 4,
    outdoors: 10,
    familyFriendly: 6,
    remoteWork: 7,
    lowTaxes: 8,
    weather: 6,
    traffic: 8,
  },
  housing: {
    avgRent1BR: 1250,
    avgRent2BR: 1550,
    avgRent3BR: 2000,
    starterHomePrice: 265000,
    medianHomePrice: 452000,
    propertyTaxRate: 0.0185,
    pricePerSqFt: 215,
    monthlyUtilities: 205,
    monthlyGroceries: 400,
    monthlyTransportation: 425,
  },
  market: {
    daysOnMarket: 110,
    saleToListRatio: 96.5,
    priceYOY: -6.0,
    marketCondition: 'Buyers Market',
    redfinMedianPrice: 324000,
    redfinDataSource: 'Redfin/Zillow city-level — Marble Falls, TX. Date: 04/2026',
  },
  school: {
    teaRating: 'C',
    primaryISD: 'Marble Falls ISD',
  },
  description: 'Marble Falls is the Highland Lakes gateway city — sitting on the shores of Lake Marble Falls on the Colorado River, with Lake LBJ, Inks Lake, and Lake Buchanan all within 20 minutes, it offers the most comprehensive lake access of any city in the Austin metro database. The downtown square has genuine Hill Country character with independent restaurants and shops, and US-281 gives reasonable Austin access in 50 minutes. Best suited for remote workers and retirees seeking lake lifestyle with some Austin connectivity.',
  strengths: [
    'Highland Lakes gateway — Lake Marble Falls, Lake LBJ, Inks Lake, and Lake Buchanan all within 20 minutes',
    'Downtown Marble Falls square — genuine Hill Country character with Colorado River waterfront',
    'Remote work and retirement destination — growing community of Austin-connected remote workers',
  ],
  weaknesses: [
    'Marble Falls ISD rated C by TEA — below average, concern for school-focused families',
    'US-281 commute to Austin — 50-60 minutes to Austin employment centers',
    '110 days on market — slower-moving market with buyer leverage but thinner liquidity',
  ],
},
```

---

### 9. FREDERICKSBURG, TX (San Antonio)

```typescript
{
  id: 'fredericksburg-tx',
  name: 'Fredericksburg',
  state: 'TX',
  county: 'Gillespie',
  type: 'city',
  tier: 'tier2',
  parentId: null,
  hasNeighborhoodData: false,
  lastUpdated: '05/2026',
  metroUsed: 'San Antonio, TX metro area',
  scores: {
    affordability: 3,
    schools: 7,
    safety: 8,
    walkability: 6,
    transit: 1,
    nightlife: 6,
    outdoors: 9,
    familyFriendly: 6,
    remoteWork: 7,
    lowTaxes: 8,
    weather: 6,
    traffic: 9,
  },
  housing: {
    avgRent1BR: 1500,
    avgRent2BR: 1900,
    avgRent3BR: 2500,
    starterHomePrice: 380000,
    medianHomePrice: 510000,
    propertyTaxRate: 0.0168,
    pricePerSqFt: 275,
    monthlyUtilities: 205,
    monthlyGroceries: 415,
    monthlyTransportation: 435,
  },
  market: {
    daysOnMarket: 105,
    saleToListRatio: 96.0,
    priceYOY: 13.6,
    marketCondition: 'Buyers Market',
    redfinMedianPrice: 510000,
    redfinDataSource: 'Redfin city-level — Fredericksburg, TX. Date: 11/2025',
  },
  school: {
    teaRating: 'B',
    primaryISD: 'Fredericksburg ISD',
  },
  description: 'Fredericksburg is the cultural capital of the Texas Hill Country — a German heritage town of 12,000 with more than 50 wineries within 10 miles, the National Museum of the Pacific War, Enchanted Rock State Natural Area 18 miles north, and one of the most walkable and authentic Main Streets in Texas. Fredericksburg ISD earns a B from TEA. For remote workers, retirees, and lifestyle buyers who prioritize extraordinary quality of life, Hill Country wine country, and genuine small-city character over commute access, Fredericksburg is the finest destination in the SA metro database.',
  strengths: [
    'Texas wine country capital — 50+ wineries within 10 miles, nationally recognized wine trail',
    'Fredericksburg ISD rated B — strong academic performance for a small Hill Country district',
    'Enchanted Rock and National Museum of the Pacific War — world-class outdoor and cultural attractions',
  ],
  weaknesses: [
    'Median $510K — premium pricing in a small market with thin inventory and slow turnover',
    '80-mile drive to San Antonio — US-290 commute rules out daily employment access',
    'Tourism-driven economy — Main Street congestion on weekends can be significant',
  ],
},
```

---

### 10. PLEASANTON, TX (San Antonio)

```typescript
{
  id: 'pleasanton-tx',
  name: 'Pleasanton',
  state: 'TX',
  county: 'Atascosa',
  type: 'city',
  tier: 'tier2',
  parentId: null,
  hasNeighborhoodData: false,
  lastUpdated: '05/2026',
  metroUsed: 'San Antonio, TX metro area',
  scores: {
    affordability: 9,
    schools: 4,
    safety: 7,
    walkability: 4,
    transit: 1,
    nightlife: 3,
    outdoors: 6,
    familyFriendly: 6,
    remoteWork: 5,
    lowTaxes: 9,
    weather: 5,
    traffic: 9,
  },
  housing: {
    avgRent1BR: 1000,
    avgRent2BR: 1250,
    avgRent3BR: 1600,
    starterHomePrice: 175000,
    medianHomePrice: 245000,
    propertyTaxRate: 0.0175,
    pricePerSqFt: 135,
    monthlyUtilities: 198,
    monthlyGroceries: 395,
    monthlyTransportation: 420,
  },
  market: {
    daysOnMarket: 80,
    saleToListRatio: 97.0,
    priceYOY: -2.0,
    marketCondition: 'Buyers Market',
    redfinMedianPrice: 245000,
    redfinDataSource: 'Zillow/local MLS estimate — Pleasanton, TX. Date: 05/2026',
  },
  school: {
    teaRating: 'C',
    primaryISD: 'Pleasanton ISD',
  },
  description: 'Pleasanton is the Atascosa County seat and the most affordable city in the San Antonio metro database — the self-proclaimed Birthplace of the Cowboy, with a genuine working-Texas agricultural identity, US-281 access to San Antonio in 40 minutes, and one of the lowest property tax rates in the database at 1.75%. At $245K median with minimal traffic and a genuine small-town pace, Pleasanton serves buyers who prioritize maximum affordability, Texas ranch culture, and SA access without SA pricing.',
  strengths: [
    'Most affordable city in the San Antonio metro database — median $245K at $135/sqft',
    'One of the lowest property tax rates in the SA database at 1.75%',
    'Genuine working-Texas identity — Birthplace of the Cowboy, agricultural heritage, ranch community',
  ],
  weaknesses: [
    'Pleasanton ISD rated C by TEA — below average, concern for school-focused families',
    'US-281 commute to San Antonio — 40-50 minutes to north SA employment centers',
    'Very limited local amenities — small-city infrastructure requires SA trips for most retail and services',
  ],
},
```

---

## Implementation Checklist for Claude Code

- [ ] Append all 10 city objects to `texasCities` array in `data/cities.ts`
- [ ] Insert after the Canyon Lake entry (last city from Wave 3 brief)
- [ ] Do not modify any existing city entries
- [ ] Run `tsc --noEmit` to verify no TypeScript errors
- [ ] Update all "91 cities" references to "101 cities" across the codebase
- [ ] Commit and push

---

## Score Notes

**Lockhart ISD D rating** — disclosed honestly. Lockhart serves affordability-first buyers, remote workers, and private school families legitimately.
**Pleasanton schools C** — small district serving a specific buyer type. Disclosed accurately.
**Cedar Hill ISD C, DeSoto ISD C** — both improving, both disclosed honestly.
**Fredericksburg outdoors 9/10** — wine country, Enchanted Rock, and extensive Hill Country access justifies the score.
**Marble Falls outdoors 10/10** — five Highland Lakes within 20 minutes is genuinely exceptional.

---

*Brief prepared by Claude — HavenQuest COO/Chief Editor. May 29, 2026. Data sourced from Redfin, Zillow ZHVI, Orchard, local MLS, and TEA August 2025 ratings.*
