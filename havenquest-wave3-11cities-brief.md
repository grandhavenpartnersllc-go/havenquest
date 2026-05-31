# HavenQuest — Wave 3 Expansion Brief: 11 New Cities
**Prepared by:** Claude (COO/Chief Editor)  
**Date:** May 29, 2026  
**Status:** Ready for Claude Code implementation  
**Priority:** P1 — Database expansion across all 4 metros

---

## Summary

Adds 11 cities across DFW (4), Houston (3), Austin (2), and San Antonio (2).

Cities added:
1. Garland (Dallas County — tier2) — DFW
2. Grand Prairie (Dallas/Tarrant County — tier2) — DFW
3. Burleson (Johnson County — tier2) — DFW
4. Mesquite (Dallas County — tier2) — DFW
5. Deer Park (Harris County — tier2) — Houston
6. Texas City (Galveston County — tier2) — Houston
7. Alvin (Brazoria County — tier2) — Houston
8. Bastrop (Bastrop County — tier2) — Austin
9. Wimberley (Hays County — tier2) — Austin
10. Kerrville (Kerr County — tier2) — San Antonio
11. Canyon Lake (Comal County — tier2) — San Antonio

**TEA ratings confirmed 2025:**
- Garland ISD: B (84/100 — on track to become A-rated, leads Dallas County in gains)
- Grand Prairie ISD: C
- Burleson ISD: B
- Mesquite ISD: B (improved from C in 2024)
- Deer Park ISD: B (91.8% graduation rate)
- Texas City ISD: C (73/100)
- Alvin ISD: B (84/100)
- Bastrop ISD: C
- Wimberley ISD: B
- Kerrville ISD: C
- Comal ISD (Canyon Lake): B (serves Canyon Lake area)

---

## Implementation Instructions for Claude Code

Append all 11 city objects to the `texasCities` array in `data/cities.ts`, after the Leon Valley entry (last San Antonio city). Do not modify any existing entries. Run `tsc --noEmit` after insertion. Commit and push.

---

## City Data — Complete Entries

### 1. GARLAND, TX (DFW)

```typescript
{
  id: 'garland-tx',
  name: 'Garland',
  state: 'TX',
  county: 'Dallas',
  type: 'city',
  tier: 'tier2',
  parentId: null,
  hasNeighborhoodData: false,
  lastUpdated: '05/2026',
  metroUsed: 'Dallas, TX metro area',
  scores: {
    affordability: 8,
    schools: 6,
    safety: 5,
    walkability: 4,
    transit: 5,
    nightlife: 5,
    outdoors: 6,
    familyFriendly: 6,
    remoteWork: 7,
    lowTaxes: 8,
    weather: 5,
    traffic: 6,
  },
  housing: {
    avgRent1BR: 1150,
    avgRent2BR: 1400,
    avgRent3BR: 1800,
    starterHomePrice: 200000,
    medianHomePrice: 287000,
    propertyTaxRate: 0.0195,
    pricePerSqFt: 167,
    monthlyUtilities: 210,
    monthlyGroceries: 410,
    monthlyTransportation: 435,
  },
  market: {
    daysOnMarket: 70,
    saleToListRatio: 95.4,
    priceYOY: -4.3,
    marketCondition: 'Buyers Market',
    redfinMedianPrice: 287000,
    redfinDataSource: 'Redfin city-level — Garland, TX. Date: 01/2026',
  },
  school: {
    teaRating: 'B',
    primaryISD: 'Garland ISD',
  },
  description: 'Garland is the most underrated affordable suburb in Dallas County — the third largest city in the county with 246,000 residents, DART Blue Line rail access into downtown Dallas, Lake Ray Hubbard on its eastern border, and Garland ISD now rated B (84/100) by TEA with the district explicitly on track to become A-rated after leading Dallas County in accountability gains in 2025. At $287K median Garland offers the lowest price point of any city with direct Dallas rail access in the entire DFW database.',
  strengths: [
    'DART Blue Line access — two stations connecting directly to downtown Dallas without driving',
    'Garland ISD rated B (84/100) — leading Dallas County in TEA gains, on track for A rating',
    'Lake Ray Hubbard eastern border — boating, fishing, and waterfront parks within city limits',
  ],
  weaknesses: [
    'Higher crime rate than suburban DFW peers — neighborhood-level research essential',
    '-4.3% YOY price decline — correction continues in an affordable market',
    'Older housing stock — Garland is established rather than new, requiring renovation due diligence',
  ],
},
```

---

### 2. GRAND PRAIRIE, TX (DFW)

```typescript
{
  id: 'grand-prairie-tx',
  name: 'Grand Prairie',
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
    transit: 3,
    nightlife: 5,
    outdoors: 7,
    familyFriendly: 6,
    remoteWork: 7,
    lowTaxes: 8,
    weather: 5,
    traffic: 6,
  },
  housing: {
    avgRent1BR: 1200,
    avgRent2BR: 1450,
    avgRent3BR: 1850,
    starterHomePrice: 225000,
    medianHomePrice: 350000,
    propertyTaxRate: 0.0200,
    pricePerSqFt: 173,
    monthlyUtilities: 210,
    monthlyGroceries: 410,
    monthlyTransportation: 435,
  },
  market: {
    daysOnMarket: 42,
    saleToListRatio: 95.0,
    priceYOY: -2.4,
    marketCondition: 'Balanced Market',
    redfinMedianPrice: 350000,
    redfinDataSource: 'Redfin city-level — Grand Prairie, TX. Date: 03/2026',
  },
  school: {
    teaRating: 'C',
    primaryISD: 'Grand Prairie ISD',
  },
  description: 'Grand Prairie is the geographic center of DFW — literally positioned between Dallas and Fort Worth on I-30, giving residents access to both employment centers, DFW Airport (15 minutes), AT&T Stadium (10 minutes), and Joe Pool Lake (within city limits). At $350K median it sits in the sweet spot for buyers who want central DFW positioning without Frisco or Plano pricing. Grand Prairie ISD rates C from TEA, making it best suited for families using private schools or buyers without school-age children.',
  strengths: [
    'Geographic center of DFW — equidistant between Dallas and Fort Worth employment centers on I-30',
    'Joe Pool Lake — 7,500-acre reservoir with beaches, marinas, and camping within city limits',
    'Epic Waters Indoor Waterpark and Lone Star Park — regional entertainment anchors',
  ],
  weaknesses: [
    'Grand Prairie ISD rated C by TEA — limiting factor for school-focused families',
    'Limited distinct suburban identity — often overlooked in favor of neighboring Arlington and Irving',
    'Crime rate above DFW suburban average — neighborhood research required',
  ],
},
```

---

### 3. BURLESON, TX (DFW)

```typescript
{
  id: 'burleson-tx',
  name: 'Burleson',
  state: 'TX',
  county: 'Johnson',
  type: 'city',
  tier: 'tier2',
  parentId: null,
  hasNeighborhoodData: false,
  lastUpdated: '05/2026',
  metroUsed: 'Dallas, TX metro area',
  scores: {
    affordability: 7,
    schools: 7,
    safety: 7,
    walkability: 2,
    transit: 1,
    nightlife: 3,
    outdoors: 6,
    familyFriendly: 8,
    remoteWork: 6,
    lowTaxes: 7,
    weather: 5,
    traffic: 7,
  },
  housing: {
    avgRent1BR: 1250,
    avgRent2BR: 1550,
    avgRent3BR: 1950,
    starterHomePrice: 240000,
    medianHomePrice: 333000,
    propertyTaxRate: 0.0200,
    pricePerSqFt: 181,
    monthlyUtilities: 210,
    monthlyGroceries: 410,
    monthlyTransportation: 430,
  },
  market: {
    daysOnMarket: 73,
    saleToListRatio: 96.5,
    priceYOY: -2.7,
    marketCondition: 'Buyers Market',
    redfinMedianPrice: 305000,
    redfinDataSource: 'Zillow ZHVI city-level — Burleson, TX. Date: 05/2026',
  },
  school: {
    teaRating: 'B',
    primaryISD: 'Burleson ISD',
  },
  description: 'Burleson is Fort Worth\'s most underappreciated family suburb — Johnson County\'s largest city with Burleson ISD earning a B (94.3% graduation rate) from TEA, a genuine revitalized downtown with Chisholm Trail Parkway access to Fort Worth, and housing prices well below the DFW metro median. For families priced out of Mansfield or Keller who still need south Fort Worth access, Burleson offers the same community character at a meaningful discount.',
  strengths: [
    'Burleson ISD rated B — 94.3% graduation rate, strong academic performance for Johnson County',
    'Chisholm Trail Parkway — direct access to downtown Fort Worth without I-35W congestion',
    'Revitalized downtown Burleson — Dobson Street corridor with restaurants, shops, and community events',
  ],
  weaknesses: [
    '-2.7% YOY price decline — correction in a Johnson County market with higher inventory',
    'Car-dependent — no transit, all errands require driving',
    'Limited employment base in Johnson County — most residents commute to Fort Worth or Dallas',
  ],
},
```

---

### 4. MESQUITE, TX (DFW)

```typescript
{
  id: 'mesquite-tx',
  name: 'Mesquite',
  state: 'TX',
  county: 'Dallas',
  type: 'city',
  tier: 'tier2',
  parentId: null,
  hasNeighborhoodData: false,
  lastUpdated: '05/2026',
  metroUsed: 'Dallas, TX metro area',
  scores: {
    affordability: 8,
    schools: 6,
    safety: 5,
    walkability: 3,
    transit: 3,
    nightlife: 4,
    outdoors: 5,
    familyFriendly: 6,
    remoteWork: 7,
    lowTaxes: 8,
    weather: 5,
    traffic: 6,
  },
  housing: {
    avgRent1BR: 1150,
    avgRent2BR: 1400,
    avgRent3BR: 1800,
    starterHomePrice: 195000,
    medianHomePrice: 300000,
    propertyTaxRate: 0.0200,
    pricePerSqFt: 163,
    monthlyUtilities: 210,
    monthlyGroceries: 410,
    monthlyTransportation: 430,
  },
  market: {
    daysOnMarket: 85,
    saleToListRatio: 97.6,
    priceYOY: 3.6,
    marketCondition: 'Buyers Market',
    redfinMedianPrice: 300000,
    redfinDataSource: 'Redfin city-level — Mesquite, TX. Date: 03/2026',
  },
  school: {
    teaRating: 'B',
    primaryISD: 'Mesquite ISD',
  },
  description: 'Mesquite is one of the most improved school districts in DFW — Mesquite ISD jumped from C to B in the 2025 TEA ratings with 40% of its 50 eligible campuses improving by at least one letter grade. At $300K median on the east side of Dallas with I-30 and I-635 access, Mesquite is the most affordable city in the database with a B-rated school district. The +3.6% YOY price appreciation signals a market that is stabilizing rather than correcting.',
  strengths: [
    'Mesquite ISD upgraded to B — most improved major district in DFW, 40% of campuses improved in 2025',
    'Most affordable B-rated ISD city in the DFW database — median $300K',
    'I-30 and I-635 access — East Dallas employment corridor and downtown within 20 minutes',
  ],
  weaknesses: [
    '85 days on market — slower moving inventory vs. western DFW suburbs',
    'Crime rate above suburban DFW average — east Dallas corridor requires neighborhood research',
    'Older housing stock — Mesquite is established suburban DFW with limited new construction',
  ],
},
```

---

### 5. DEER PARK, TX (Houston)

```typescript
{
  id: 'deer-park-tx',
  name: 'Deer Park',
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
    schools: 7,
    safety: 7,
    walkability: 3,
    transit: 1,
    nightlife: 3,
    outdoors: 6,
    familyFriendly: 7,
    remoteWork: 6,
    lowTaxes: 8,
    weather: 4,
    traffic: 7,
  },
  housing: {
    avgRent1BR: 1200,
    avgRent2BR: 1500,
    avgRent3BR: 1900,
    starterHomePrice: 210000,
    medianHomePrice: 298000,
    propertyTaxRate: 0.0190,
    pricePerSqFt: 151,
    monthlyUtilities: 210,
    monthlyGroceries: 410,
    monthlyTransportation: 430,
  },
  market: {
    daysOnMarket: 43,
    saleToListRatio: 97.0,
    priceYOY: -0.3,
    marketCondition: 'Balanced Market',
    redfinMedianPrice: 285000,
    redfinDataSource: 'Redfin/HAR city-level — Deer Park, TX. Date: 06/2025',
  },
  school: {
    teaRating: 'B',
    primaryISD: 'Deer Park ISD',
  },
  description: 'Deer Park is one of Houston\'s most stable and underrated east side suburbs — a tight-knit community of 35,000 where Deer Park ISD earns a B from TEA with a 91.8% graduation rate, the median home price is well below $300K, and the city\'s position near the Houston Ship Channel brings the economic stability of energy sector employment. HAR data shows a seller\'s market with only 2.9 months of inventory — unusual in a Houston market where most cities have excess supply.',
  strengths: [
    'Deer Park ISD rated B — 91.8% graduation rate, strong community school district',
    'Seller\'s market conditions — 2.9 months inventory with 43 days on market, stable demand',
    'Energy sector employment proximity — Ship Channel and refinery corridor within 15 minutes',
  ],
  weaknesses: [
    'Industrial adjacency — Ship Channel proximity means industrial character and air quality considerations',
    'Flooding risk — Harris County east side experienced significant Harvey flooding',
    'Limited retail and entertainment — Deer Park is primarily residential, depends on Pasadena and Webster',
  ],
},
```

---

### 6. TEXAS CITY, TX (Houston)

```typescript
{
  id: 'texas-city-tx',
  name: 'Texas City',
  state: 'TX',
  county: 'Galveston',
  type: 'city',
  tier: 'tier2',
  parentId: null,
  hasNeighborhoodData: false,
  lastUpdated: '05/2026',
  metroUsed: 'Houston, TX metro area',
  scores: {
    affordability: 9,
    schools: 4,
    safety: 5,
    walkability: 3,
    transit: 1,
    nightlife: 3,
    outdoors: 7,
    familyFriendly: 5,
    remoteWork: 5,
    lowTaxes: 8,
    weather: 3,
    traffic: 7,
  },
  housing: {
    avgRent1BR: 1100,
    avgRent2BR: 1350,
    avgRent3BR: 1700,
    starterHomePrice: 170000,
    medianHomePrice: 300000,
    propertyTaxRate: 0.0185,
    pricePerSqFt: 142,
    monthlyUtilities: 210,
    monthlyGroceries: 405,
    monthlyTransportation: 430,
  },
  market: {
    daysOnMarket: 123,
    saleToListRatio: 96.5,
    priceYOY: 2.4,
    marketCondition: 'Buyers Market',
    redfinMedianPrice: 300000,
    redfinDataSource: 'Redfin city-level — Texas City, TX. Date: 03/2026',
  },
  school: {
    teaRating: 'C',
    primaryISD: 'Texas City ISD',
  },
  description: 'Texas City is Galveston County\'s industrial port city — home to a major Valero refinery and the Texas City Dike, one of the longest fishing piers in the Gulf Coast at 5.25 miles, with Galveston Bay waterfront access and some of the lowest home prices in the Houston metro. At $300K median with $142/sqft and direct I-45 access to both Galveston and Houston, Texas City is a genuine value play for buyers who want coastal access and energy sector proximity at an affordable price point.',
  strengths: [
    'Texas City Dike — 5.25-mile fishing pier, one of the longest on the Gulf Coast, within city limits',
    'Galveston Bay waterfront access — boating, fishing, and coastal recreation without Galveston island pricing',
    'Most affordable Galveston County city — median $300K at $142/sqft with low tax rate',
  ],
  weaknesses: [
    'Texas City ISD rated C (73/100) — below area average, concern for school-focused families',
    'Hurricane and storm surge risk — coastal Galveston County location with significant weather exposure',
    '123 days on market — slow-moving inventory signals buyer leverage but resale risk',
  ],
},
```

---

### 7. ALVIN, TX (Houston)

```typescript
{
  id: 'alvin-tx',
  name: 'Alvin',
  state: 'TX',
  county: 'Brazoria',
  type: 'city',
  tier: 'tier2',
  parentId: null,
  hasNeighborhoodData: false,
  lastUpdated: '05/2026',
  metroUsed: 'Houston, TX metro area',
  scores: {
    affordability: 8,
    schools: 7,
    safety: 6,
    walkability: 3,
    transit: 1,
    nightlife: 3,
    outdoors: 6,
    familyFriendly: 7,
    remoteWork: 6,
    lowTaxes: 8,
    weather: 4,
    traffic: 7,
  },
  housing: {
    avgRent1BR: 1150,
    avgRent2BR: 1400,
    avgRent3BR: 1800,
    starterHomePrice: 210000,
    medianHomePrice: 310000,
    propertyTaxRate: 0.0185,
    pricePerSqFt: 159,
    monthlyUtilities: 210,
    monthlyGroceries: 405,
    monthlyTransportation: 430,
  },
  market: {
    daysOnMarket: 75,
    saleToListRatio: 97.0,
    priceYOY: -1.3,
    marketCondition: 'Buyers Market',
    redfinMedianPrice: 310000,
    redfinDataSource: 'Redfin city-level — Alvin, TX. Date: 01/2026',
  },
  school: {
    teaRating: 'B',
    primaryISD: 'Alvin ISD',
  },
  description: 'Alvin is the birthplace of Nolan Ryan and the most affordable Brazoria County city with a B-rated school district — Alvin ISD earned a B (84/100) from TEA tied with Pasadena ISD, with the Texas Medical Center accessible via SH-288 in 35 minutes. For buyers who want Brazoria County\'s lower cost structure, B-rated schools, and direct Medical Center access without Pearland pricing, Alvin is the most logical alternative.',
  strengths: [
    'Alvin ISD rated B (84/100) — tied with Pasadena ISD, strong performance for Brazoria County',
    'Brazoria County cost advantage — lower pricing than Harris County with access to same employment centers',
    'SH-288 corridor — direct route to Texas Medical Center and Pearland without backtracking',
  ],
  weaknesses: [
    'Limited local amenities — Alvin is primarily residential, depends on Pearland for retail and dining',
    '35-40 minute Medical Center commute — SH-288 traffic can be challenging during peak hours',
    'Hurricane risk — Brazoria County coastal proximity creates weather exposure',
  ],
},
```

---

### 8. BASTROP, TX (Austin)

```typescript
{
  id: 'bastrop-tx',
  name: 'Bastrop',
  state: 'TX',
  county: 'Bastrop',
  type: 'city',
  tier: 'tier2',
  parentId: null,
  hasNeighborhoodData: false,
  lastUpdated: '05/2026',
  metroUsed: 'Austin, TX metro area',
  scores: {
    affordability: 7,
    schools: 4,
    safety: 6,
    walkability: 4,
    transit: 1,
    nightlife: 4,
    outdoors: 9,
    familyFriendly: 6,
    remoteWork: 6,
    lowTaxes: 7,
    weather: 5,
    traffic: 8,
  },
  housing: {
    avgRent1BR: 1200,
    avgRent2BR: 1500,
    avgRent3BR: 1900,
    starterHomePrice: 240000,
    medianHomePrice: 386000,
    propertyTaxRate: 0.0195,
    pricePerSqFt: 160,
    monthlyUtilities: 205,
    monthlyGroceries: 395,
    monthlyTransportation: 425,
  },
  market: {
    daysOnMarket: 80,
    saleToListRatio: 92.6,
    priceYOY: 7.3,
    marketCondition: 'Balanced Market',
    redfinMedianPrice: 386000,
    redfinDataSource: 'Neuhaus/MLS city-level — Bastrop, TX. Date: 04/2026',
  },
  school: {
    teaRating: 'C',
    primaryISD: 'Bastrop ISD',
  },
  description: 'Bastrop is Austin metro\'s eastern wild card — home to Bastrop State Park and the Lost Pines forest (a geological anomaly that places loblolly pines 100 miles west of their natural range), Colorado River recreation, and a genuine historic downtown that has resisted the chain-restaurant homogenization affecting other Austin suburbs. SpaceX\'s Starbase facility is 30 miles south and Samsung\'s Taylor campus is 30 miles north, anchoring Bastrop as a logistics midpoint for the emerging east Austin tech corridor. Bastrop ISD rates C, making it best suited for nature-focused buyers without school-age children.',
  strengths: [
    'Bastrop State Park and Lost Pines — one of the most ecologically unique outdoor destinations in Texas',
    'Colorado River recreation — kayaking, fishing, and swimming minutes from downtown Bastrop',
    'SpaceX/Samsung corridor positioning — east Austin tech employment axis within 30 minutes',
  ],
  weaknesses: [
    'Bastrop ISD rated C by TEA — concern for families relying on public schools',
    'Wildfire risk — 2011 Bastrop County Complex Fire destroyed 1,600+ homes; risk remains real',
    'US-71 commute to Austin — 35-45 minutes to east Austin, longer to north and west employment',
  ],
},
```

---

### 9. WIMBERLEY, TX (Austin)

```typescript
{
  id: 'wimberley-tx',
  name: 'Wimberley',
  state: 'TX',
  county: 'Hays',
  type: 'city',
  tier: 'tier2',
  parentId: null,
  hasNeighborhoodData: false,
  lastUpdated: '05/2026',
  metroUsed: 'Austin, TX metro area',
  scores: {
    affordability: 2,
    schools: 7,
    safety: 9,
    walkability: 3,
    transit: 1,
    nightlife: 4,
    outdoors: 10,
    familyFriendly: 7,
    remoteWork: 8,
    lowTaxes: 7,
    weather: 5,
    traffic: 7,
  },
  housing: {
    avgRent1BR: 1600,
    avgRent2BR: 2000,
    avgRent3BR: 2600,
    starterHomePrice: 380000,
    medianHomePrice: 560000,
    propertyTaxRate: 0.0195,
    pricePerSqFt: 260,
    monthlyUtilities: 210,
    monthlyGroceries: 415,
    monthlyTransportation: 435,
  },
  market: {
    daysOnMarket: 120,
    saleToListRatio: 91.5,
    priceYOY: -11.1,
    marketCondition: 'Buyers Market',
    redfinMedianPrice: 498000,
    redfinDataSource: 'Neuhaus/MLS city-level — Wimberley, TX. Date: 04/2026',
  },
  school: {
    teaRating: 'B',
    primaryISD: 'Wimberley ISD',
  },
  description: 'Wimberley is the crown jewel of the Texas Hill Country lifestyle — Jacob\'s Well Natural Area, the Blanco River, Blue Hole Regional Park, and a thriving arts and market scene in a community that has maintained its character despite massive growth pressure from the Austin metro. Wimberley ISD earns a B from TEA. The 91.5% sale-to-list ratio means buyers are currently closing at 8.5% below asking on average — meaningful negotiating power in a community where the lifestyle premium has historically kept prices firm.',
  strengths: [
    'Jacob\'s Well and Blue Hole — among the most iconic natural swimming destinations in Texas',
    'Wimberley ISD rated B — strong small-district academic performance with tight community culture',
    'Best buyer negotiating leverage in Hill Country — 91.5% sale-to-list ratio, 8.5% average below ask',
  ],
  weaknesses: [
    'Median $560K with -11.1% YOY — significant correction in a small-volume luxury market',
    'Remote location — 45 minutes to Austin, no meaningful commuter route for daily office workers',
    'Flash flood risk — Blanco River corridor has experienced multiple serious flood events',
  ],
},
```

---

### 10. KERRVILLE, TX (San Antonio)

```typescript
{
  id: 'kerrville-tx',
  name: 'Kerrville',
  state: 'TX',
  county: 'Kerr',
  type: 'city',
  tier: 'tier2',
  parentId: null,
  hasNeighborhoodData: false,
  lastUpdated: '05/2026',
  metroUsed: 'San Antonio, TX metro area',
  scores: {
    affordability: 6,
    schools: 4,
    safety: 7,
    walkability: 4,
    transit: 1,
    nightlife: 4,
    outdoors: 9,
    familyFriendly: 6,
    remoteWork: 7,
    lowTaxes: 8,
    weather: 6,
    traffic: 8,
  },
  housing: {
    avgRent1BR: 1150,
    avgRent2BR: 1400,
    avgRent3BR: 1800,
    starterHomePrice: 230000,
    medianHomePrice: 356000,
    propertyTaxRate: 0.0178,
    pricePerSqFt: 175,
    monthlyUtilities: 200,
    monthlyGroceries: 400,
    monthlyTransportation: 425,
  },
  market: {
    daysOnMarket: 131,
    saleToListRatio: 97.3,
    priceYOY: 6.5,
    marketCondition: 'Buyers Market',
    redfinMedianPrice: 329000,
    redfinDataSource: 'Redfin/Orchard county-level — Kerr County, TX. Date: 02/2026',
  },
  school: {
    teaRating: 'C',
    primaryISD: 'Kerrville ISD',
  },
  description: 'Kerrville is the Hill Country capital — the largest city in the Texas Hill Country proper, seat of Kerr County, home to Guadalupe River frontage, Kerrville-Schreiner Park, the Texas State Arts and Crafts Fair, and a genuine arts community built around the Kerrville Folk Festival. For remote workers and retirees seeking authentic Hill Country living with real city infrastructure — hospital, airport, retail — without San Antonio prices or Austin congestion, Kerrville is the best option in the database. Kerrville ISD rates C, but private schooling options are strong in the area.',
  strengths: [
    'Guadalupe River frontage and Kerrville-Schreiner Park — premier Hill Country outdoor recreation',
    'Lowest traffic stress in the SA database — minimal congestion, genuine small-city pace',
    'Established arts community — Kerrville Folk Festival, Texas State Arts and Crafts Fair, gallery district',
  ],
  weaknesses: [
    'Kerrville ISD rated C — below average, concern for school-focused families',
    '65-mile drive to San Antonio — I-10 commute is real and limits daily employment options',
    '131 days on market — slow-moving inventory, buyer opportunity but thin liquidity',
  ],
},
```

---

### 11. CANYON LAKE, TX (San Antonio)

```typescript
{
  id: 'canyon-lake-tx',
  name: 'Canyon Lake',
  state: 'TX',
  county: 'Comal',
  type: 'city',
  tier: 'tier2',
  parentId: null,
  hasNeighborhoodData: false,
  lastUpdated: '05/2026',
  metroUsed: 'San Antonio, TX metro area',
  scores: {
    affordability: 4,
    schools: 7,
    safety: 8,
    walkability: 1,
    transit: 1,
    nightlife: 3,
    outdoors: 10,
    familyFriendly: 7,
    remoteWork: 7,
    lowTaxes: 8,
    weather: 6,
    traffic: 8,
  },
  housing: {
    avgRent1BR: 1400,
    avgRent2BR: 1750,
    avgRent3BR: 2250,
    starterHomePrice: 300000,
    medianHomePrice: 424000,
    propertyTaxRate: 0.0175,
    pricePerSqFt: 236,
    monthlyUtilities: 205,
    monthlyGroceries: 405,
    monthlyTransportation: 430,
  },
  market: {
    daysOnMarket: 161,
    saleToListRatio: 96.5,
    priceYOY: -6.9,
    marketCondition: 'Buyers Market',
    redfinMedianPrice: 424000,
    redfinDataSource: 'Redfin city-level — Canyon Lake, TX. Date: 11/2025',
  },
  school: {
    teaRating: 'B',
    primaryISD: 'Comal ISD',
  },
  description: 'Canyon Lake is the best lake lifestyle in the San Antonio metro — a Comal County reservoir community with 80 miles of shoreline, marinas, scuba diving in crystal-clear water (visibility up to 30 feet), and Comal ISD earning a B from TEA serving the area. The -6.9% YOY price decline has created meaningful buyer leverage in a community that traditionally holds its value due to supply constraints and persistent lifestyle demand. At one of the lowest property tax rates in the SA database, the annual ownership cost advantage compounds over time.',
  strengths: [
    'Canyon Lake — 80 miles of shoreline, marinas, and unique freshwater scuba diving in Texas Hill Country',
    'Comal ISD rated B — same district as New Braunfels, strong academic programming',
    'Lowest property tax rate in the SA database at 1.75% — significant annual savings vs. Bexar County',
  ],
  weaknesses: [
    '161 days on market — slowest-moving market in the SA database, thin liquidity',
    '-6.9% YOY price decline — correction in a lifestyle market with limited buyer pool',
    'No walkability, no transit, no local commercial center — entirely car-dependent lifestyle community',
  ],
},
```

---

## Implementation Checklist for Claude Code

- [ ] Append all 11 city objects to `texasCities` array in `data/cities.ts`
- [ ] Insert after the Leon Valley entry (last San Antonio city)
- [ ] Do not modify any existing city entries
- [ ] Run `tsc --noEmit` to verify no TypeScript errors
- [ ] Commit with message noting all 11 cities and metros
- [ ] Push to main

---

## Score Notes

**Schools:**
- Garland 6/10 — B-rated but improving, on track for A
- Mesquite 6/10 — B-rated after significant improvement from C
- Burleson 7/10, Deer Park 7/10, Alvin 7/10, Wimberley 7/10, Canyon Lake 7/10 — solid B-rated districts
- Grand Prairie 4/10, Texas City 4/10, Kerrville 4/10 — C-rated, disclosed honestly
- Bastrop 4/10 — C-rated, disclosed honestly

**Affordability:**
- Garland 8/10, Mesquite 8/10, Alvin 8/10, Deer Park 8/10, Texas City 9/10 — genuinely affordable
- Wimberley 2/10 — $560K median in a small-volume buyer's market
- Canyon Lake 4/10 — $424K with thin liquidity

**Wildfire risk noted** for Bastrop — 2011 fire destroyed 1,600+ homes. Non-negotiable disclosure.
**Flash flood risk noted** for Wimberley — Blanco River has flooded seriously multiple times.
**Hurricane risk noted** for Texas City — coastal Galveston County.

---

*Brief prepared by Claude — HavenQuest COO/Chief Editor. May 29, 2026. Data sourced from Redfin city-level, Zillow ZHVI, Orchard, HAR, Neuhaus/MLS, and TEA August 2025 ratings.*
