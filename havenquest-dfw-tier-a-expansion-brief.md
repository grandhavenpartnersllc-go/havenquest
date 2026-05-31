# HavenQuest — DFW Tier A Expansion Brief: 14 New Cities
**Prepared by:** Claude (COO/Chief Editor)  
**Date:** May 29, 2026  
**Status:** Ready for Claude Code implementation  
**Priority:** P1 — Database expansion

---

## Summary

Adds 14 new DFW cities to `data/cities.ts`. All entries are complete and ready to insert. Data sourced from Redfin city-level (Mar 2026), Zillow ZHVI, Orchard, Movoto, and TEA August 2025 ratings.

Cities added:
1. Arlington (Tarrant County — tier2)
2. Irving (Dallas County — tier2)
3. Richardson (Dallas/Collin County — tier2)
4. Denton (Denton County — tier2)
5. Lewisville (Denton County — tier2)
6. Carrollton (Dallas/Denton County — tier2)
7. Celina (Collin County — tier2)
8. Little Elm (Denton County — tier2)
9. Midlothian (Ellis County — tier2)
10. Forney (Kaufman County — tier2)
11. Colleyville (Tarrant County — tier2)
12. Trophy Club (Denton/Tarrant County — tier2)
13. Heath (Rockwall County — tier2)
14. Waxahachie (Ellis County — tier2)

---

## Implementation Instructions for Claude Code

Append all 14 city objects to the `texasCities` array in `data/cities.ts`, after the existing Wylie entry (last city from Wave 2). Do not modify any existing entries. Run `tsc --noEmit` after insertion. Commit and push.

---

## City Data — Complete Entries

### 1. ARLINGTON, TX

```typescript
{
  id: 'arlington-tx',
  name: 'Arlington',
  state: 'TX',
  county: 'Tarrant',
  type: 'city',
  tier: 'tier2',
  parentId: null,
  hasNeighborhoodData: false,
  lastUpdated: '05/2026',
  scores: {
    affordability: 7,
    schools: 4,
    safety: 5,
    walkability: 3,
    transit: 2,
    nightlife: 7,
    outdoors: 6,
    familyFriendly: 6,
    remoteWork: 7,
    lowTaxes: 7,
    weather: 5,
    traffic: 6,
  },
  housing: {
    avgRent1BR: 1200,
    avgRent2BR: 1450,
    avgRent3BR: 1850,
    starterHomePrice: 230000,
    medianHomePrice: 320000,
    propertyTaxRate: 0.0210,
    pricePerSqFt: 175,
    monthlyUtilities: 215,
    monthlyGroceries: 415,
    monthlyTransportation: 440,
  },
  market: {
    daysOnMarket: 62,
    saleToListRatio: 97.1,
    priceYOY: -3.1,
    marketCondition: 'Buyers Market',
    redfinMedianPrice: 320000,
    redfinDataSource: 'Redfin city-level — Arlington, TX. Date: 02/2026',
  },
  school: {
    teaRating: 'C',
    primaryISD: 'Arlington ISD',
  },
  description: 'Arlington punches above its weight as a relocation destination — the entertainment capital of DFW, home to AT&T Stadium, Globe Life Field, and Six Flags Over Texas, sitting perfectly between Dallas and Fort Worth with some of the most affordable housing in the metro. The city is genuinely diverse and culturally rich, and its location on I-20/SH-360 gives residents access to the entire metroplex without the Collin County price tag.',
  strengths: [
    'Most affordable mid-size city in DFW — median $320K with strong housing inventory',
    'Entertainment hub — AT&T Stadium, Globe Life Field, Six Flags, and Texas Live district',
    'Central DFW location — equidistant between Dallas and Fort Worth employment centers',
  ],
  weaknesses: [
    'Arlington ISD rated C by TEA — improving but below DFW suburban average',
    'Car-dependent — no meaningful public transit despite city size',
    'Higher crime rate than suburban DFW peers — select neighborhoods vary significantly',
  ],
},
```

---

### 2. IRVING, TX

```typescript
{
  id: 'irving-tx',
  name: 'Irving',
  state: 'TX',
  county: 'Dallas',
  type: 'city',
  tier: 'tier2',
  parentId: null,
  hasNeighborhoodData: false,
  lastUpdated: '05/2026',
  scores: {
    affordability: 6,
    schools: 4,
    safety: 5,
    walkability: 4,
    transit: 4,
    nightlife: 6,
    outdoors: 5,
    familyFriendly: 5,
    remoteWork: 9,
    lowTaxes: 7,
    weather: 5,
    traffic: 6,
  },
  housing: {
    avgRent1BR: 1350,
    avgRent2BR: 1650,
    avgRent3BR: 2100,
    starterHomePrice: 260000,
    medianHomePrice: 355000,
    propertyTaxRate: 0.0195,
    pricePerSqFt: 213,
    monthlyUtilities: 215,
    monthlyGroceries: 420,
    monthlyTransportation: 440,
  },
  market: {
    daysOnMarket: 63,
    saleToListRatio: 97.0,
    priceYOY: -12.3,
    marketCondition: 'Buyers Market',
    redfinMedianPrice: 355000,
    redfinDataSource: 'Redfin city-level — Irving, TX. Date: 03/2026',
  },
  school: {
    teaRating: 'C',
    primaryISD: 'Irving ISD',
  },
  description: 'Irving is the corporate capital of DFW — Las Colinas is home to five Fortune 500 headquarters, the Toyota Music Factory entertainment district, and the iconic Mandalay Canal waterfront. For remote workers and corporate relocators, no city in the metro offers a better combination of job access, DFW Airport proximity (literally 10 minutes), and mid-range pricing. The tradeoff is school quality — Irving ISD rates C — making it better suited for professionals without school-age children.',
  strengths: [
    'Las Colinas Fortune 500 corridor — McKesson, Celanese, and three others headquartered here',
    'DFW Airport 10 minutes — best airport access in the entire metro',
    'Toyota Music Factory and Mandalay Canal — genuine urban entertainment district',
  ],
  weaknesses: [
    'Irving ISD rated C by TEA — not competitive with suburban DFW districts',
    'Significant price correction — median down 12.3% YOY, raises resale questions',
    'Diverse housing stock quality — older neighborhoods vary significantly from Las Colinas',
  ],
},
```

---

### 3. RICHARDSON, TX

```typescript
{
  id: 'richardson-tx',
  name: 'Richardson',
  state: 'TX',
  county: 'Dallas',
  type: 'city',
  tier: 'tier2',
  parentId: null,
  hasNeighborhoodData: false,
  lastUpdated: '05/2026',
  scores: {
    affordability: 4,
    schools: 5,
    safety: 7,
    walkability: 4,
    transit: 3,
    nightlife: 5,
    outdoors: 5,
    familyFriendly: 6,
    remoteWork: 9,
    lowTaxes: 7,
    weather: 5,
    traffic: 6,
  },
  housing: {
    avgRent1BR: 1400,
    avgRent2BR: 1750,
    avgRent3BR: 2200,
    starterHomePrice: 330000,
    medianHomePrice: 455000,
    propertyTaxRate: 0.0190,
    pricePerSqFt: 226,
    monthlyUtilities: 215,
    monthlyGroceries: 425,
    monthlyTransportation: 440,
  },
  market: {
    daysOnMarket: 65,
    saleToListRatio: 97.0,
    priceYOY: -0.7,
    marketCondition: 'Buyers Market',
    redfinMedianPrice: 455000,
    redfinDataSource: 'Redfin city-level — Richardson, TX. Date: 01/2026',
  },
  school: {
    teaRating: 'C',
    primaryISD: 'Richardson ISD',
  },
  description: 'Richardson is the intellectual capital of DFW — home to the University of Texas at Dallas and the Telecom Corridor, one of the densest concentrations of tech and telecom companies in the country. It is one of the most educated cities in Texas, with a diverse and sophisticated community feel that is genuinely different from surrounding suburbs. For tech workers and academics, Richardson offers walkable neighborhoods, strong employer access, and a cosmopolitan character that is rare in North Texas.',
  strengths: [
    'Telecom Corridor — one of the highest concentrations of tech employers in Texas',
    'University of Texas at Dallas — research institution driving talent and innovation',
    'Most diverse and internationally educated community in North Texas suburbs',
  ],
  weaknesses: [
    'Richardson ISD rated C by TEA — below expectations for the community\'s demographic profile',
    'Premium pricing without A-rated school district — value proposition weaker than Plano or Allen',
    'Older housing stock in some neighborhoods — requires renovation budget',
  ],
},
```

---

### 4. DENTON, TX

```typescript
{
  id: 'denton-tx',
  name: 'Denton',
  state: 'TX',
  county: 'Denton',
  type: 'city',
  tier: 'tier2',
  parentId: null,
  hasNeighborhoodData: false,
  lastUpdated: '05/2026',
  scores: {
    affordability: 7,
    schools: 5,
    safety: 6,
    walkability: 5,
    transit: 3,
    nightlife: 7,
    outdoors: 7,
    familyFriendly: 6,
    remoteWork: 7,
    lowTaxes: 8,
    weather: 5,
    traffic: 7,
  },
  housing: {
    avgRent1BR: 1200,
    avgRent2BR: 1450,
    avgRent3BR: 1850,
    starterHomePrice: 265000,
    medianHomePrice: 390000,
    propertyTaxRate: 0.0185,
    pricePerSqFt: 185,
    monthlyUtilities: 210,
    monthlyGroceries: 410,
    monthlyTransportation: 430,
  },
  market: {
    daysOnMarket: 65,
    saleToListRatio: 97.0,
    priceYOY: 0.7,
    marketCondition: 'Balanced Market',
    redfinMedianPrice: 390000,
    redfinDataSource: 'Redfin city-level — Denton, TX. Date: 03/2026',
  },
  school: {
    teaRating: 'B',
    primaryISD: 'Denton ISD',
  },
  description: 'Denton is the most underrated city in the DFW Metroplex — a genuine college town with two major universities (UNT and TWU), a thriving live music scene, an authentic historic square, and housing prices well below the Dallas and Fort Worth core. The "Mini-Austin" label gets thrown around, but it\'s earned: Denton has a creative, independent spirit rare in North Texas, and its location on I-35 gives residents access to both Dallas and Fort Worth without suburban sameness.',
  strengths: [
    'Two major universities — UNT (47,000 students) and TWU create genuine college town culture',
    'Denton Square — authentic historic downtown with independent restaurants, music venues, and shops',
    'Most affordable city on the I-35 corridor — meaningful savings vs. Lewisville and Carrollton',
  ],
  weaknesses: [
    'Denton ISD rated B — solid but not competitive with Collin County A-rated districts',
    'Growing pains — I-35E and I-35W construction and population growth creating infrastructure strain',
    'Distance from Dallas core — 35-45 minute commute to North Dallas employment centers',
  ],
},
```

---

### 5. LEWISVILLE, TX

```typescript
{
  id: 'lewisville-tx',
  name: 'Lewisville',
  state: 'TX',
  county: 'Denton',
  type: 'city',
  tier: 'tier2',
  parentId: null,
  hasNeighborhoodData: false,
  lastUpdated: '05/2026',
  scores: {
    affordability: 6,
    schools: 5,
    safety: 6,
    walkability: 3,
    transit: 2,
    nightlife: 4,
    outdoors: 7,
    familyFriendly: 7,
    remoteWork: 7,
    lowTaxes: 7,
    weather: 5,
    traffic: 6,
  },
  housing: {
    avgRent1BR: 1300,
    avgRent2BR: 1600,
    avgRent3BR: 2000,
    starterHomePrice: 280000,
    medianHomePrice: 387000,
    propertyTaxRate: 0.0185,
    pricePerSqFt: 202,
    monthlyUtilities: 210,
    monthlyGroceries: 415,
    monthlyTransportation: 435,
  },
  market: {
    daysOnMarket: 58,
    saleToListRatio: 97.0,
    priceYOY: -11.0,
    marketCondition: 'Buyers Market',
    redfinMedianPrice: 387000,
    redfinDataSource: 'Redfin city-level — Lewisville, TX. Date: 11/2025',
  },
  school: {
    teaRating: 'B',
    primaryISD: 'Lewisville ISD',
  },
  description: 'Lewisville sits at the convergence of Lake Lewisville, DFW Airport access, and I-35E — giving residents recreational access that most DFW suburbs can\'t match, strong Lewisville ISD schools, and a genuine value proposition relative to neighboring Flower Mound and Coppell. The -11% YOY price correction has created meaningful buying opportunities in a city that was previously priced out of reach for many families.',
  strengths: [
    'Lake Lewisville — 29,000 acres, 233 miles of shoreline, and Lewisville Lake Park minutes from neighborhoods',
    'Lewisville ISD rated B — solid performer serving a diverse, growing community',
    'Significant price correction — -11% YOY creates buyer opportunity in a well-located market',
  ],
  weaknesses: [
    'Significant price correction — -11% YOY raises questions about near-term appreciation',
    'Car-dependent — limited walkability and no meaningful transit',
    'Lacks distinct identity — often overlooked in favor of neighboring Flower Mound and Coppell',
  ],
},
```

---

### 6. CARROLLTON, TX

```typescript
{
  id: 'carrollton-tx',
  name: 'Carrollton',
  state: 'TX',
  county: 'Dallas',
  type: 'city',
  tier: 'tier2',
  parentId: null,
  hasNeighborhoodData: false,
  lastUpdated: '05/2026',
  scores: {
    affordability: 5,
    schools: 5,
    safety: 6,
    walkability: 3,
    transit: 3,
    nightlife: 4,
    outdoors: 5,
    familyFriendly: 7,
    remoteWork: 8,
    lowTaxes: 7,
    weather: 5,
    traffic: 6,
  },
  housing: {
    avgRent1BR: 1350,
    avgRent2BR: 1650,
    avgRent3BR: 2100,
    starterHomePrice: 300000,
    medianHomePrice: 412000,
    propertyTaxRate: 0.0195,
    pricePerSqFt: 212,
    monthlyUtilities: 215,
    monthlyGroceries: 420,
    monthlyTransportation: 440,
  },
  market: {
    daysOnMarket: 35,
    saleToListRatio: 97.0,
    priceYOY: -4.1,
    marketCondition: 'Balanced Market',
    redfinMedianPrice: 412000,
    redfinDataSource: 'Redfin city-level — Carrollton, TX. Date: 03/2026',
  },
  school: {
    teaRating: 'B',
    primaryISD: 'Carrollton-Farmers Branch ISD',
  },
  description: 'Carrollton is one of the most strategically located cities in DFW — positioned at the intersection of I-35E and the George Bush Turnpike, it gives residents access to Las Colinas, North Dallas, Plano, and DFW Airport within 25 minutes. It is one of the most diverse cities in North Texas, with a particularly strong Korean and Vietnamese community that has built a genuine cultural dining scene. Castle Hills is one of the metro\'s finest master-planned communities.',
  strengths: [
    'Castle Hills master-planned community — resort amenities, golf, and community programming',
    'Most diverse dining scene in suburban DFW — Korean, Vietnamese, and international cuisine',
    'George Bush Turnpike access — Las Colinas, North Dallas, and Plano all within 25 minutes',
  ],
  weaknesses: [
    'Carrollton-Farmers Branch ISD rated B — adequate but not a destination district',
    'No distinct downtown or community identity — functions more as a location than a community',
    'Older housing stock in original neighborhoods — varying quality requires due diligence',
  ],
},
```

---

### 7. CELINA, TX

```typescript
{
  id: 'celina-tx',
  name: 'Celina',
  state: 'TX',
  county: 'Collin',
  type: 'city',
  tier: 'tier2',
  parentId: null,
  hasNeighborhoodData: false,
  lastUpdated: '05/2026',
  scores: {
    affordability: 3,
    schools: 8,
    safety: 9,
    walkability: 1,
    transit: 1,
    nightlife: 2,
    outdoors: 5,
    familyFriendly: 9,
    remoteWork: 7,
    lowTaxes: 6,
    weather: 5,
    traffic: 5,
  },
  housing: {
    avgRent1BR: 1600,
    avgRent2BR: 2000,
    avgRent3BR: 2550,
    starterHomePrice: 380000,
    medianHomePrice: 519000,
    propertyTaxRate: 0.0215,
    pricePerSqFt: 186,
    monthlyUtilities: 225,
    monthlyGroceries: 435,
    monthlyTransportation: 455,
  },
  market: {
    daysOnMarket: 150,
    saleToListRatio: 88.8,
    priceYOY: -8.4,
    marketCondition: 'Buyers Market',
    redfinMedianPrice: 519000,
    redfinDataSource: 'Redfin city-level — Celina, TX. Date: 03/2026',
  },
  school: {
    teaRating: 'B',
    primaryISD: 'Celina ISD',
  },
  description: 'Celina is the northern frontier of DFW\'s master-planned community boom — 150 days on market and a sale-to-list ratio of 88.8% tell you everything: this is one of the best buyer\'s markets in North Texas right now. Celina ISD is rated B by TEA with a 100% graduation rate, the community is brand new, and for families willing to live 30+ minutes from Dallas employment, the combination of space, newness, and negotiating leverage is compelling.',
  strengths: [
    'Celina ISD rated B with 100% graduation rate — strong academic performance',
    'Brand new community infrastructure — roads, parks, schools, and retail all newly built',
    'Best buyer negotiating leverage in Collin County — 88.8% sale-to-list ratio',
  ],
  weaknesses: [
    'Median $519K with 150 days on market — overbuilt relative to current demand',
    'MUD/PID tax districts — additional $3,000-$6,000/year in effective tax burden for many properties',
    'Limited local amenities — dining, retail, and entertainment require 20-30 min drive',
  ],
},
```

---

### 8. LITTLE ELM, TX

```typescript
{
  id: 'little-elm-tx',
  name: 'Little Elm',
  state: 'TX',
  county: 'Denton',
  type: 'city',
  tier: 'tier2',
  parentId: null,
  hasNeighborhoodData: false,
  lastUpdated: '05/2026',
  scores: {
    affordability: 4,
    schools: 6,
    safety: 7,
    walkability: 2,
    transit: 1,
    nightlife: 3,
    outdoors: 8,
    familyFriendly: 8,
    remoteWork: 7,
    lowTaxes: 6,
    weather: 5,
    traffic: 6,
  },
  housing: {
    avgRent1BR: 1450,
    avgRent2BR: 1800,
    avgRent3BR: 2250,
    starterHomePrice: 310000,
    medianHomePrice: 432000,
    propertyTaxRate: 0.0205,
    pricePerSqFt: 167,
    monthlyUtilities: 215,
    monthlyGroceries: 420,
    monthlyTransportation: 440,
  },
  market: {
    daysOnMarket: 153,
    saleToListRatio: 96.5,
    priceYOY: -6.4,
    marketCondition: 'Buyers Market',
    redfinMedianPrice: 432000,
    redfinDataSource: 'Redfin city-level — Little Elm, TX. Date: 02/2026',
  },
  school: {
    teaRating: 'B',
    primaryISD: 'Little Elm ISD',
  },
  description: 'Little Elm is where DFW families go for lake life — Lewisville Lake forms the city\'s eastern border, giving residents beach access, boat launches, and waterfront parks that are genuinely rare in a suburban setting. The master-planned community of Paloma Creek is one of the largest in Texas. Like Celina, the 153 days on market signals a buyer\'s market where negotiation is genuinely possible on new construction.',
  strengths: [
    'Lewisville Lake frontage — beach access, boat launches, and waterfront parks within the city',
    'Paloma Creek — one of the largest master-planned communities in Texas',
    'Little Elm ISD rated B — improving district with strong family community programming',
  ],
  weaknesses: [
    '153 days on market — slowest-moving market in this brief, buyer opportunity but resale risk',
    'Car-dependent — no transit, all amenities require driving',
    'Long commute to Dallas employment — 40-50 minutes to North Dallas during peak hours',
  ],
},
```

---

### 9. MIDLOTHIAN, TX

```typescript
{
  id: 'midlothian-tx',
  name: 'Midlothian',
  state: 'TX',
  county: 'Ellis',
  type: 'city',
  tier: 'tier2',
  parentId: null,
  hasNeighborhoodData: false,
  lastUpdated: '05/2026',
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
    lowTaxes: 6,
    weather: 5,
    traffic: 7,
  },
  housing: {
    avgRent1BR: 1350,
    avgRent2BR: 1650,
    avgRent3BR: 2100,
    starterHomePrice: 320000,
    medianHomePrice: 460000,
    propertyTaxRate: 0.0210,
    pricePerSqFt: 188,
    monthlyUtilities: 215,
    monthlyGroceries: 415,
    monthlyTransportation: 440,
  },
  market: {
    daysOnMarket: 99,
    saleToListRatio: 97.0,
    priceYOY: -11.1,
    marketCondition: 'Buyers Market',
    redfinMedianPrice: 460000,
    redfinDataSource: 'Redfin city-level — Midlothian, TX. Date: 08/2025',
  },
  school: {
    teaRating: 'B',
    primaryISD: 'Midlothian ISD',
  },
  description: 'Midlothian is the fastest-growing city in Ellis County and one of the most overlooked family destinations in DFW — Midlothian ISD earned a B from TEA with strong athletic and academic programming, crime rates well below the Texas average, and new master-planned communities offering larger lots than anything available at comparable prices in Tarrant or Collin counties. The trade is a 30-minute commute on US-287.',
  strengths: [
    'Midlothian ISD rated B — strong academic and extracurricular programming',
    'Largest lots per dollar in south DFW — acreage communities available at suburban prices',
    'Safety — crime rate well below Texas average for a growing city',
  ],
  weaknesses: [
    '-11.1% YOY price decline — significant correction raises near-term appreciation uncertainty',
    '30+ minute commute — US-287 to Fort Worth or I-35E to Dallas both require time',
    'Limited local amenities — Ellis County retail and dining infrastructure still developing',
  ],
},
```

---

### 10. FORNEY, TX

```typescript
{
  id: 'forney-tx',
  name: 'Forney',
  state: 'TX',
  county: 'Kaufman',
  type: 'city',
  tier: 'tier2',
  parentId: null,
  hasNeighborhoodData: false,
  lastUpdated: '05/2026',
  scores: {
    affordability: 7,
    schools: 6,
    safety: 7,
    walkability: 2,
    transit: 1,
    nightlife: 2,
    outdoors: 5,
    familyFriendly: 7,
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
    medianHomePrice: 335000,
    propertyTaxRate: 0.0190,
    pricePerSqFt: 146,
    monthlyUtilities: 210,
    monthlyGroceries: 410,
    monthlyTransportation: 430,
  },
  market: {
    daysOnMarket: 75,
    saleToListRatio: 97.0,
    priceYOY: -1.5,
    marketCondition: 'Buyers Market',
    redfinMedianPrice: 335000,
    redfinDataSource: 'Orchard city-level — Forney, TX. Date: 05/2026',
  },
  school: {
    teaRating: 'B',
    primaryISD: 'Forney ISD',
  },
  description: 'Forney is the easternmost affordable family suburb with genuine DFW access — $146/sqft makes it the best price-per-square-foot value in this brief, Forney ISD earned a B from TEA, and the US-80 corridor to Dallas is genuinely manageable at 25 minutes off-peak. For families prioritizing space and new construction affordability over school district prestige or suburban amenities, Forney delivers.',
  strengths: [
    'Best price per square foot in DFW Tier A — $146/sqft, well below metro average',
    'Forney ISD rated B — strong performance for a fast-growing district',
    'New construction dominates — most homes are 2015 or newer with modern floor plans',
  ],
  weaknesses: [
    'East of Dallas positioning — I-30/US-80 commute adds time vs. northern suburbs',
    'Limited local amenities — Forney is primarily residential with limited retail depth',
    'Fastest-growing market in Kaufman County — infrastructure sometimes lags population growth',
  ],
},
```

---

### 11. COLLEYVILLE, TX

```typescript
{
  id: 'colleyville-tx',
  name: 'Colleyville',
  state: 'TX',
  county: 'Tarrant',
  type: 'city',
  tier: 'tier2',
  parentId: null,
  hasNeighborhoodData: false,
  lastUpdated: '05/2026',
  scores: {
    affordability: 1,
    schools: 9,
    safety: 10,
    walkability: 3,
    transit: 1,
    nightlife: 4,
    outdoors: 6,
    familyFriendly: 10,
    remoteWork: 8,
    lowTaxes: 7,
    weather: 5,
    traffic: 7,
  },
  housing: {
    avgRent1BR: 2000,
    avgRent2BR: 2500,
    avgRent3BR: 3200,
    starterHomePrice: 700000,
    medianHomePrice: 955000,
    propertyTaxRate: 0.0185,
    pricePerSqFt: 281,
    monthlyUtilities: 235,
    monthlyGroceries: 450,
    monthlyTransportation: 460,
  },
  market: {
    daysOnMarket: 58,
    saleToListRatio: 97.0,
    priceYOY: 7.9,
    marketCondition: 'Balanced Market',
    redfinMedianPrice: 955000,
    redfinDataSource: 'Redfin city-level — Colleyville, TX. Date: 10/2025',
  },
  school: {
    teaRating: 'B',
    primaryISD: 'Grapevine-Colleyville ISD',
  },
  description: 'Colleyville is Southlake\'s quieter, more established neighbor — same affluence, same DFW Airport proximity, same family-centered culture, but without the notoriety or the price premium. Grapevine-Colleyville ISD earns a B from TEA, violent crime is among the lowest in the state, and the city\'s tree-lined residential streets and equestrian properties give it a character that most DFW suburbs have sacrificed for density.',
  strengths: [
    'Among the safest cities in Texas — violent crime consistently in bottom 5% statewide',
    'Grapevine-Colleyville ISD rated B — strong performance, high graduation rates',
    'Equestrian properties and large lots available — rare character in DFW suburbs',
  ],
  weaknesses: [
    'Median $955K — second most expensive city in this brief behind Heath',
    'Grapevine-Colleyville ISD rated B — below Carroll ISD next door in Southlake',
    'Car-dependent — no transit, all errands require driving',
  ],
},
```

---

### 12. TROPHY CLUB, TX

```typescript
{
  id: 'trophy-club-tx',
  name: 'Trophy Club',
  state: 'TX',
  county: 'Denton',
  type: 'city',
  tier: 'tier2',
  parentId: null,
  hasNeighborhoodData: false,
  lastUpdated: '05/2026',
  scores: {
    affordability: 2,
    schools: 9,
    safety: 10,
    walkability: 2,
    transit: 1,
    nightlife: 3,
    outdoors: 7,
    familyFriendly: 10,
    remoteWork: 7,
    lowTaxes: 7,
    weather: 5,
    traffic: 7,
  },
  housing: {
    avgRent1BR: 1900,
    avgRent2BR: 2350,
    avgRent3BR: 3000,
    starterHomePrice: 600000,
    medianHomePrice: 800000,
    propertyTaxRate: 0.0185,
    pricePerSqFt: 240,
    monthlyUtilities: 230,
    monthlyGroceries: 445,
    monthlyTransportation: 455,
  },
  market: {
    daysOnMarket: 29,
    saleToListRatio: 97.0,
    priceYOY: 2.9,
    marketCondition: 'Balanced Market',
    redfinMedianPrice: 800000,
    redfinDataSource: 'Redfin city-level — Trophy Club, TX. Date: 03/2026',
  },
  school: {
    teaRating: 'A',
    primaryISD: 'Northwest ISD',
  },
  description: 'Trophy Club is one of the best-kept secrets in DFW luxury living — a small, exceptionally planned community of 12,000 residents served by Northwest ISD (TEA A-rated), with Lake Grapevine access, PGA Tour-level golf courses, and violent crime so low it barely registers. At $800K median it is dramatically more affordable than Southlake or Colleyville while offering comparable quality of life. Twenty-nine days on market tells you demand here is real.',
  strengths: [
    'Northwest ISD rated A by TEA — top-performing district in Tarrant/Denton county border area',
    'Lake Grapevine access and championship golf — exceptional outdoor amenity package',
    'Violent crime essentially zero — one of the safest small cities in Texas',
  ],
  weaknesses: [
    'Median $800K — premium pricing limits buyer pool significantly',
    'Very small city — limited local retail and dining, depends on Southlake and Grapevine',
    'Limited new construction — mostly established homes, fewer options for custom builds',
  ],
},
```

---

### 13. HEATH, TX

```typescript
{
  id: 'heath-tx',
  name: 'Heath',
  state: 'TX',
  county: 'Rockwall',
  type: 'city',
  tier: 'tier2',
  parentId: null,
  hasNeighborhoodData: false,
  lastUpdated: '05/2026',
  scores: {
    affordability: 1,
    schools: 8,
    safety: 10,
    walkability: 2,
    transit: 1,
    nightlife: 2,
    outdoors: 9,
    familyFriendly: 9,
    remoteWork: 7,
    lowTaxes: 8,
    weather: 5,
    traffic: 6,
  },
  housing: {
    avgRent1BR: 2000,
    avgRent2BR: 2500,
    avgRent3BR: 3200,
    starterHomePrice: 650000,
    medianHomePrice: 875000,
    propertyTaxRate: 0.0155,
    pricePerSqFt: 243,
    monthlyUtilities: 230,
    monthlyGroceries: 445,
    monthlyTransportation: 455,
  },
  market: {
    daysOnMarket: 72,
    saleToListRatio: 97.0,
    priceYOY: -18.6,
    marketCondition: 'Buyers Market',
    redfinMedianPrice: 875000,
    redfinDataSource: 'Redfin city-level — Heath, TX. Date: 09/2025',
  },
  school: {
    teaRating: 'B',
    primaryISD: 'Rockwall ISD',
  },
  description: 'Heath sits on the western shore of Lake Ray Hubbard and offers something genuinely rare in DFW — luxury lake-adjacent living at the lowest property tax rate in the database (1.55%). The -18.6% YOY price decline has created a meaningful buyer opportunity in one of the metro\'s most distinctive communities, and Rockwall ISD\'s B rating serves the area\'s affluent families adequately. This is the choice for buyers who want water access without driving to the Hill Country.',
  strengths: [
    'Lake Ray Hubbard frontage — direct access to the largest inland lake in Texas',
    'Lowest property tax rate in the database at 1.55% — meaningful annual savings at this price point',
    'Exceptional safety — Rockwall County has one of the lowest crime rates in Texas',
  ],
  weaknesses: [
    '-18.6% YOY price decline — significant correction, highest in this brief',
    'Median $875K — limited buyer pool, liquidity risk in a correction',
    'I-30 commute — peak hour traffic to Dallas can be significant',
  ],
},
```

---

### 14. WAXAHACHIE, TX

```typescript
{
  id: 'waxahachie-tx',
  name: 'Waxahachie',
  state: 'TX',
  county: 'Ellis',
  type: 'city',
  tier: 'tier2',
  parentId: null,
  hasNeighborhoodData: false,
  lastUpdated: '05/2026',
  scores: {
    affordability: 7,
    schools: 6,
    safety: 7,
    walkability: 4,
    transit: 1,
    nightlife: 4,
    outdoors: 6,
    familyFriendly: 7,
    remoteWork: 6,
    lowTaxes: 7,
    weather: 5,
    traffic: 7,
  },
  housing: {
    avgRent1BR: 1200,
    avgRent2BR: 1500,
    avgRent3BR: 1900,
    starterHomePrice: 230000,
    medianHomePrice: 327000,
    propertyTaxRate: 0.0190,
    pricePerSqFt: 179,
    monthlyUtilities: 210,
    monthlyGroceries: 410,
    monthlyTransportation: 430,
  },
  market: {
    daysOnMarket: 74,
    saleToListRatio: 96.5,
    priceYOY: -16.7,
    marketCondition: 'Buyers Market',
    redfinMedianPrice: 327000,
    redfinDataSource: 'Redfin city-level — Waxahachie, TX. Date: 02/2026',
  },
  school: {
    teaRating: 'B',
    primaryISD: 'Waxahachie ISD',
  },
  description: 'Waxahachie is the most historically significant city in Ellis County and one of the most charming small cities in Texas — the Ellis County Courthouse is one of the most photographed buildings in the state, the historic downtown square has genuine independent character, and housing prices are among the lowest in the DFW database. For families who want Texas character, affordable homeownership, and reasonable I-35E access to Dallas and Fort Worth, Waxahachie is worth a serious look.',
  strengths: [
    'Historic downtown square — authentic Texas character with independent shops, restaurants, and events',
    'Most affordable DFW suburb in the database at median $327K with large lot sizes',
    'Ellis County Courthouse — one of the most architecturally significant buildings in Texas',
  ],
  weaknesses: [
    '-16.7% YOY price decline — significant correction requiring careful timing',
    '30+ minute I-35E commute to Dallas or Fort Worth employment centers',
    'Waxahachie ISD rated B — improving but not competitive with suburban DFW districts',
  ],
},
```

---

## Implementation Checklist for Claude Code

- [ ] Append all 14 city objects to `texasCities` array in `data/cities.ts`
- [ ] Insert after the Wylie entry (last city from Wave 2)
- [ ] Do not modify any existing city entries
- [ ] Run `tsc --noEmit` to verify no TypeScript errors
- [ ] Commit with message noting all 14 cities added
- [ ] Push to main

---

## Score Notes

**Affordability scores:**
- Colleyville 1/10, Heath 1/10 — both at or above $875K median
- Trophy Club 2/10 — $800K median
- Irving 6/10, Denton 7/10, Arlington 7/10, Forney 7/10, Waxahachie 7/10 — genuinely affordable

**School scores:**
- Trophy Club 9/10 — Northwest ISD TEA A
- Colleyville 9/10 — Grapevine-Colleyville ISD TEA B, very high performance
- Arlington 4/10, Irving 4/10, Richardson 5/10 — C-rated ISDs, significant drag

**The -18.6% YOY for Heath and -16.7% for Waxahachie** are accurate Redfin figures and should be displayed honestly — they represent buyer opportunity but also near-term uncertainty.

---

*Brief prepared by Claude — HavenQuest COO/Chief Editor. May 29, 2026. Data sourced from Redfin city-level, Zillow ZHVI, Orchard, Movoto, and TEA August 2025 ratings.*
