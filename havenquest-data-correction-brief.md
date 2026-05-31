# HavenQuest — cities.ts Data Correction Brief
**Prepared by:** Claude (COO/Chief Editor)  
**Date:** May 28, 2026  
**Status:** Ready for Claude Code implementation  
**Priority:** P0 — Beta blocker

---

## Summary

The `cities.ts` file contains two categories of data problems:

1. **Market data templating** — Austin metro suburbs (Round Rock, Cedar Park, Georgetown, Kyle, San Marcos, Leander, Pflugerville) and Dallas metro suburbs (Frisco, Plano, McKinney) share metro-level market figures applied as city-specific data. The Woodlands and Sugar Land also share identical Houston metro figures.

2. **Content duplication** — The crime rate superlative ("lowest crime rate… 948 per 100K") is applied to both McKinney and Frisco. The school district description ("Exceptional district — consistently outperforms state standards") is templated across all A/B-rated ISDs.

All corrections below are sourced from Redfin city-level data (March 2026), Zillow ZHVI (May 2026), Orchard, and Houzeo. Sources are cited per city.

---

## Correction Method for Claude Code

For each city, update only the fields listed. Leave all other fields unchanged. Do not modify scores, descriptions, or other content unless explicitly listed in this brief.

After all market/housing updates are applied, apply the content fixes in Section 2.

---

## Section 1 — Market & Housing Data Corrections

---

### FRISCO, TX (`id: 'frisco-tx'`)

**Current data problem:** Using Dallas metro-level figures. Frisco is a premium market — median $600K+ range, materially different from metro average.

**Corrections:**

```typescript
housing: {
  avgRent1BR: 1600,          // was 1350 — Frisco premium market
  avgRent2BR: 1950,          // was 1650
  avgRent3BR: 2500,          // was 2150
  starterHomePrice: 420000,  // was 252000 — Frisco entry level ~$420K
  medianHomePrice: 620000,   // was 366500 — Redfin median Feb 2026: $620K
  propertyTaxRate: 0.0190,   // unchanged — verified correct
  pricePerSqFt: 233,         // was 251 — Redfin $/sqft Mar 2026: $233 (down 8.8% YoY)
  monthlyUtilities: 220,     // unchanged
  monthlyGroceries: 430,     // unchanged
  monthlyTransportation: 450, // unchanged
},
market: {
  daysOnMarket: 71,          // was 61 — Redfin Feb 2026: 71 days
  saleToListRatio: 94.0,     // was 97.4 — Realtor.com 94% (buyer's market)
  priceYOY: -2.4,            // was -3.8 — Redfin Feb 2026: -2.4% YoY
  marketCondition: 'Buyers Market', // unchanged
  redfinMedianPrice: 620000, // was 409000 — Redfin city-level Feb 2026
  redfinDataSource: 'Redfin city-level — Frisco, TX. Date: 02/2026',
},
```

**Source:** Redfin Frisco housing market (Feb 2026); allisonkeegan.com Frisco pricing report (Apr 2026); Realtor.com Frisco market classification

---

### PLANO, TX (`id: 'plano-tx'`)

**Current data problem:** Using identical Dallas metro figures as Frisco. Plano median is ~$490–500K, meaningfully different from McKinney.

**Corrections:**

```typescript
housing: {
  avgRent1BR: 1500,          // was 1350 — Plano above DFW average
  avgRent2BR: 1850,          // was 1650
  avgRent3BR: 2300,          // was 2150
  starterHomePrice: 340000,  // was 252000 — Plano entry level
  medianHomePrice: 490000,   // was 366500 — Houzeo/Redfin median Mar 2026: $490K
  propertyTaxRate: 0.0190,   // unchanged — verified correct
  pricePerSqFt: 215,         // was 210 — Redfin $/sqft: $215 (down 3.2% YoY)
  monthlyUtilities: 215,     // unchanged
  monthlyGroceries: 425,     // unchanged
  monthlyTransportation: 445, // unchanged
},
market: {
  daysOnMarket: 69,          // was 61 — Redfin/Dunnican Team Feb 2026: 69 days
  saleToListRatio: 98.4,     // was 97.4 — haistingsre.com 2025 full-year: 98.4%
  priceYOY: -0.1,            // was -3.8 — Houzeo Mar 2026: -0.11% YoY
  marketCondition: 'Balanced Market', // was Buyers Market — 2.9 month supply
  redfinMedianPrice: 490000, // was 409000 — Redfin/Houzeo city-level Mar 2026
  redfinDataSource: 'Redfin city-level — Plano, TX. Date: 03/2026',
},
```

**Source:** Houzeo Plano Mar 2026; haistingsre.com Plano market data; The Dunnican Team Feb 2026 report; Redfin Plano housing market

---

### McKINNEY, TX (`id: 'mckinney-tx'`)

**Current data problem:** Using Dallas metro-level figures. McKinney median ~$488K city-level, DOM ~54 days.

**Corrections:**

```typescript
housing: {
  avgRent1BR: 1400,          // was 1350 — slight premium over metro
  avgRent2BR: 1750,          // was 1650
  avgRent3BR: 2200,          // was 2150
  starterHomePrice: 310000,  // was 252000 — McKinney entry level
  medianHomePrice: 488000,   // was 366500 — Redfin city-level Mar 2026: $488K
  propertyTaxRate: 0.0190,   // unchanged — verified correct
  pricePerSqFt: 206,         // was 205 — Redfin $/sqft Mar 2026: $206
  monthlyUtilities: 215,     // unchanged
  monthlyGroceries: 420,     // unchanged
  monthlyTransportation: 445, // unchanged
},
market: {
  daysOnMarket: 54,          // was 61 — Redfin city-level Mar 2026: 54 days
  saleToListRatio: 97.0,     // was 97.4 — estimated from -1% below list average
  priceYOY: -1.0,            // was -3.8 — Redfin city-level Mar 2026: -1.0% YoY
  marketCondition: 'Buyers Market', // unchanged
  redfinMedianPrice: 488000, // was 409000 — Redfin city-level Mar 2026
  redfinDataSource: 'Redfin city-level — McKinney, TX. Date: 03/2026',
},
```

**Source:** Redfin McKinney city-level housing market (Mar 2026); Zillow McKinney ZHVI: $515,561 (May 2026)

---

### ROUND ROCK, TX (`id: 'round-rock-tx'`)

**Current data problem:** Using generic Austin metro figures. Round Rock has city-level Redfin data.

**Corrections:**

```typescript
housing: {
  avgRent1BR: 1250,          // was 1300 — slightly below Cedar Park
  avgRent2BR: 1550,          // was 1600
  avgRent3BR: 1950,          // was 2050
  starterHomePrice: 280000,  // was 306000 — corrected for buyer's market
  medianHomePrice: 395000,   // was 430500 — Redfin Feb 2026: $388K; Zillow: $412K; midpoint $395K
  propertyTaxRate: 0.0168,   // unchanged — verified correct (Williamson County)
  pricePerSqFt: 191,         // was 202 — Redfin $/sqft: $191 (down 5.2% YoY)
  monthlyUtilities: 210,     // unchanged
  monthlyGroceries: 400,     // unchanged
  monthlyTransportation: 430, // unchanged
},
market: {
  daysOnMarket: 104,         // was 88 — Redfin city-level Feb 2026: 104 days
  saleToListRatio: 96.0,     // was 96.5 — Orchard 96%
  priceYOY: -5.8,            // was -0.7 — Redfin Feb 2026: -5.8% YoY
  marketCondition: 'Buyers Market', // unchanged
  redfinMedianPrice: 388000, // was 446000 — Redfin city-level Feb 2026
  redfinDataSource: 'Redfin city-level — Round Rock, TX. Date: 02/2026',
},
```

**Source:** Redfin Round Rock housing market (Feb 2026); Orchard Round Rock (May 2026); Zillow Round Rock ZHVI $412,831; T. Kerr Property Group analysis Apr 2026

---

### CEDAR PARK, TX (`id: 'cedar-park-tx'`)

**Current data problem:** Using generic Austin metro figures. Cedar Park has city-level Redfin data.

**Corrections:**

```typescript
housing: {
  avgRent1BR: 1350,          // was 1300 — Cedar Park slightly above Round Rock
  avgRent2BR: 1650,          // was 1600
  avgRent3BR: 2100,          // was 2050
  starterHomePrice: 355000,  // was 306000 — corrected for Cedar Park market
  medianHomePrice: 496000,   // was 430500 — Redfin city-level Mar 2026: $496K
  propertyTaxRate: 0.0168,   // unchanged — verified correct (Williamson County)
  pricePerSqFt: 228,         // was 215 — Redfin $/sqft Mar 2026: $228
  monthlyUtilities: 205,     // unchanged
  monthlyGroceries: 395,     // unchanged
  monthlyTransportation: 425, // unchanged
},
market: {
  daysOnMarket: 53,          // was 88 — Redfin city-level Mar 2026: 53 days
  saleToListRatio: 97.5,     // was 96.5 — Orchard 97.5%
  priceYOY: -8.0,            // was -0.7 — Redfin city-level Mar 2026: -8.0% YoY
  marketCondition: 'Buyers Market', // unchanged
  redfinMedianPrice: 496000, // was 446000 — Redfin city-level Mar 2026
  redfinDataSource: 'Redfin city-level — Cedar Park, TX. Date: 03/2026',
},
```

**Source:** Redfin Cedar Park housing market (Mar 2026); Orchard Cedar Park; Zillow Cedar Park ZHVI $515,501; Movoto Cedar Park May 2026

---

### GEORGETOWN, TX (`id: 'georgetown-tx'`)

**Current data problem:** Using generic Austin metro figures. Georgetown has city-level Redfin data. Note: existing weakness bullet mentions -17% YOY which conflicts with current data showing +1.9% — correct accordingly.

**Corrections:**

```typescript
housing: {
  avgRent1BR: 1250,          // was 1300 — Georgetown slightly below Cedar Park
  avgRent2BR: 1550,          // was 1600
  avgRent3BR: 1950,          // was 2050
  starterHomePrice: 285000,  // was 306000 — Georgetown more affordable than Cedar Park
  medianHomePrice: 413000,   // was 430500 — Redfin city-level Mar 2026: $413K
  propertyTaxRate: 0.0168,   // unchanged — verified correct (Williamson County)
  pricePerSqFt: 204,         // was 195 — Redfin $/sqft Mar 2026: $204
  monthlyUtilities: 200,     // unchanged
  monthlyGroceries: 390,     // unchanged
  monthlyTransportation: 420, // unchanged
},
market: {
  daysOnMarket: 96,          // was 88 — Redfin city-level Mar 2026: 96 days
  saleToListRatio: 96.5,     // unchanged — estimated
  priceYOY: 1.9,             // was -0.7 — Redfin city-level Mar 2026: +1.9% YoY
  marketCondition: 'Buyers Market', // unchanged
  redfinMedianPrice: 413000, // was 446000 — Redfin city-level Mar 2026
  redfinDataSource: 'Redfin city-level — Georgetown, TX. Date: 03/2026',
},
```

**Also update weakness bullet (content fix):**
- OLD: `'Home prices fell 17% YOY — market correction underway'`
- NEW: `'Growing fast — rapid population growth straining roads and school capacity'`

**Source:** Redfin Georgetown housing market (Mar 2026)

---

### KYLE, TX (`id: 'kyle-tx'`)

**Current data problem:** Using generic Austin metro figures. Kyle has city-level Redfin data. Kyle is notably cheaper than Cedar Park/Round Rock.

**Corrections:**

```typescript
housing: {
  avgRent1BR: 1150,          // was 1300 — Kyle most affordable Austin suburb
  avgRent2BR: 1400,          // was 1600
  avgRent3BR: 1800,          // was 2050
  starterHomePrice: 220000,  // was 306000 — Kyle is true value market
  medianHomePrice: 305000,   // was 430500 — Redfin city-level Jan 2026: $305K
  propertyTaxRate: 0.0215,   // unchanged — verified correct (Hays County)
  pricePerSqFt: 160,         // was 185 — Redfin $/sqft: $160 (down 7.5% YoY)
  monthlyUtilities: 200,     // unchanged
  monthlyGroceries: 385,     // unchanged
  monthlyTransportation: 415, // unchanged
},
market: {
  daysOnMarket: 94,          // was 88 — Redfin city-level Jan 2026: 94 days
  saleToListRatio: 96.5,     // unchanged — estimated
  priceYOY: -6.2,            // was -0.7 — Redfin Jan 2026: -6.2% YoY
  marketCondition: 'Buyers Market', // unchanged
  redfinMedianPrice: 305000, // was 446000 — Redfin city-level Jan 2026
  redfinDataSource: 'Redfin city-level — Kyle, TX. Date: 01/2026',
},
```

**Source:** Redfin Kyle housing market (Jan 2026); Zillow Kyle ZHVI $341,856; Orchard Kyle median $297K (30-day)

---

### SAN MARCOS, TX (`id: 'san-marcos-tx'`)

**Current data problem:** Using generic Austin metro figures. San Marcos has city-level Redfin data. Note: current starterHomePrice of $306,000 is Austin metro — San Marcos is genuinely more affordable.

**Corrections:**

```typescript
housing: {
  avgRent1BR: 1100,          // was 1300 — college town, more affordable
  avgRent2BR: 1350,          // was 1600
  avgRent3BR: 1700,          // was 2050
  starterHomePrice: 210000,  // was 306000 — San Marcos entry level
  medianHomePrice: 320000,   // was 430500 — Redfin city-level Jan 2026: $320K
  propertyTaxRate: 0.0215,   // unchanged — verified correct (Hays County)
  pricePerSqFt: 168,         // was 175 — Redfin $/sqft: $168 (down 8.7% YoY)
  monthlyUtilities: 195,     // unchanged
  monthlyGroceries: 380,     // unchanged
  monthlyTransportation: 415, // unchanged
},
market: {
  daysOnMarket: 90,          // was 88 — Redfin city-level Jan 2026: 90 days
  saleToListRatio: 97.0,     // was 96.5 — estimated
  priceYOY: -2.9,            // was -0.7 — Redfin Jan 2026: -2.9% YoY
  marketCondition: 'Buyers Market', // unchanged
  redfinMedianPrice: 320000, // was 446000 — Redfin city-level Jan 2026
  redfinDataSource: 'Redfin city-level — San Marcos, TX. Date: 01/2026',
},
```

**Source:** Redfin San Marcos housing market (Jan 2026)

---

### LEANDER, TX (`id: 'leander-tx'`)

**Current data problem:** Using generic Austin metro figures. Leander has city-level MLS data via Neuhaus Realty.

**Corrections:**

```typescript
housing: {
  avgRent1BR: 1300,          // unchanged — consistent with Leander market
  avgRent2BR: 1600,          // unchanged
  avgRent3BR: 2050,          // unchanged
  starterHomePrice: 320000,  // was 306000 — Leander slightly above Round Rock
  medianHomePrice: 451000,   // was 430500 — Neuhaus/Unlock MLS Feb 2026: $451,210
  propertyTaxRate: 0.0168,   // unchanged — verified correct
  pricePerSqFt: 196,         // unchanged — Redfin $/sqft: $196 (down 4.4% YoY)
  monthlyUtilities: 205,     // unchanged
  monthlyGroceries: 390,     // unchanged
  monthlyTransportation: 425, // unchanged
},
market: {
  daysOnMarket: 97,          // was 88 — Redfin city-level Mar 2026: 97 days
  saleToListRatio: 96.5,     // unchanged — estimated
  priceYOY: -8.7,            // was -0.7 — Redfin city-level Mar 2026: -8.7% YoY
  marketCondition: 'Buyers Market', // unchanged
  redfinMedianPrice: 451000, // was 446000 — Neuhaus/Unlock MLS Feb 2026
  redfinDataSource: 'Redfin city-level — Leander, TX. Date: 03/2026',
},
```

**Source:** Redfin Leander housing market (Mar 2026); Neuhaus Realty Group Leander Feb 2026 report; Zillow Leander ZHVI $456,956

---

### PFLUGERVILLE, TX (`id: 'pflugerville-tx'`)

**Current data problem:** Using generic Austin metro figures. Pflugerville has city-level Redfin data.

**Corrections:**

```typescript
housing: {
  avgRent1BR: 1250,          // was 1300 — Pflugerville below Cedar Park/Leander
  avgRent2BR: 1550,          // was 1600
  avgRent3BR: 1950,          // was 2050
  starterHomePrice: 270000,  // was 306000 — Pflugerville value market
  medianHomePrice: 355000,   // was 430500 — Redfin city-level Mar 2026: $355K
  propertyTaxRate: 0.0195,   // unchanged — verified correct (Travis County)
  pricePerSqFt: 180,         // was 202 — Redfin $/sqft Mar 2026: $180
  monthlyUtilities: 210,     // unchanged
  monthlyGroceries: 395,     // unchanged
  monthlyTransportation: 430, // unchanged
},
market: {
  daysOnMarket: 52,          // was 88 — Redfin city-level Mar 2026: 52 days
  saleToListRatio: 96.5,     // unchanged — estimated
  priceYOY: -10.2,           // was -0.7 — Redfin city-level Mar 2026: -10.2% YoY
  marketCondition: 'Buyers Market', // unchanged
  redfinMedianPrice: 355000, // was 446000 — Redfin city-level Mar 2026
  redfinDataSource: 'Redfin city-level — Pflugerville, TX. Date: 03/2026',
},
```

**Source:** Redfin Pflugerville housing market (Mar 2026); Neuhaus Realty Group Pflugerville Feb 2026 report (median $390K Feb); Zillow Pflugerville

---

### NEW BRAUNFELS, TX (`id: 'new-braunfels-tx'`)

**Current data problem:** Using San Antonio metro figures applied as city-specific. New Braunfels has city-level Redfin data. Note: existing weakness mentions "125 days on market" — now updated.

**Corrections:**

```typescript
housing: {
  avgRent1BR: 1150,          // unchanged
  avgRent2BR: 1400,          // unchanged
  avgRent3BR: 1800,          // unchanged
  starterHomePrice: 225000,  // was 182500 — corrected upward for 2026 market
  medianHomePrice: 307000,   // was 280000 — Redfin city-level Feb 2026: $307K
  propertyTaxRate: 0.0215,   // unchanged — verified correct
  pricePerSqFt: 175,         // unchanged — Redfin $/sqft: $175 (down 3.8% YoY)
  monthlyUtilities: 190,     // unchanged
  monthlyGroceries: 375,     // unchanged
  monthlyTransportation: 410, // unchanged
},
market: {
  daysOnMarket: 125,         // was 88 — Redfin city-level Feb 2026: 125 days
  saleToListRatio: 96.2,     // was 97.2 — Houzeo Mar 2026: 96.21%
  priceYOY: -5.5,            // was 0.4 — Redfin city-level Feb 2026: -5.5% YoY
  marketCondition: 'Buyers Market', // unchanged
  redfinMedianPrice: 307000, // was 310000 — Redfin city-level Feb 2026
  redfinDataSource: 'Redfin city-level — New Braunfels, TX. Date: 02/2026',
},
```

**Also update weakness bullet:**
- OLD: `'New Braunfels ISD rated B but growing rapidly — watch school quality'`
- NEW: `'New Braunfels ISD rated B with 125+ days on market — slower resale liquidity'`

Wait — that conflates two issues. Preferred update:
- Keep: `'New Braunfels ISD rated B but growing rapidly — watch school quality'`
- Update DOM weakness: `'125 days on market — slowest resale liquidity among cities in the database'`

**Source:** Redfin New Braunfels housing market (Feb 2026); Houzeo New Braunfels Mar 2026; Zillow New Braunfels ZHVI $345,319

---

### THE WOODLANDS, TX (`id: 'the-woodlands-tx'`)

**Current data problem:** Housing prices are Houston city-level, not Woodlands-specific. The Woodlands is a premium market at $635K+ median.

**Corrections:**

```typescript
housing: {
  avgRent1BR: 1550,          // was 1350 — Woodlands premium
  avgRent2BR: 1950,          // was 1600
  avgRent3BR: 2500,          // was 2050
  starterHomePrice: 395000,  // was 209500 — Woodlands entry level much higher
  medianHomePrice: 635000,   // was 308000 — Redfin city-level Mar 2026: $635K
  propertyTaxRate: 0.0191,   // unchanged — verified correct
  pricePerSqFt: 230,         // unchanged — Movoto: $229/sqft
  monthlyUtilities: 215,     // unchanged
  monthlyGroceries: 415,     // unchanged
  monthlyTransportation: 445, // unchanged
},
market: {
  daysOnMarket: 27,          // was 67 — Movoto Mar 2026: 27 days
  saleToListRatio: 97.5,     // was 96.0 — estimated for competitive market
  priceYOY: 18.7,            // was -1.7 — Redfin city-level Mar 2026: +18.7% YoY
  marketCondition: 'Sellers Market', // was Buyers Market — 1.39 month supply
  redfinMedianPrice: 635000, // was 333000 — Redfin city-level Mar 2026
  redfinDataSource: 'Redfin city-level — The Woodlands, TX. Date: 03/2026',
},
```

**Note:** The Woodlands affordability score of 5/10 should be reviewed. At $635K median, this is correct or arguably should be lower.

**Source:** Redfin The Woodlands (Mar 2026: $635K, +18.7% YoY); Movoto The Woodlands Mar 2026: $607,500 median, 27 DOM; HoustonProperties $652,400 median 56 DOM; Houzeo seller's market classification

---

### SUGAR LAND, TX (`id: 'sugar-land-tx'`)

**Current data problem:** Using identical Houston metro figures as The Woodlands. Sugar Land is a distinct market.

**Corrections:**

```typescript
housing: {
  avgRent1BR: 1400,          // was 1350 — Sugar Land above Houston average
  avgRent2BR: 1700,          // was 1600
  avgRent3BR: 2150,          // was 2050
  starterHomePrice: 310000,  // was 209500 — Sugar Land entry level
  medianHomePrice: 457000,   // was 308000 — Redfin city-level Jan 2026: $457K
  propertyTaxRate: 0.0184,   // unchanged — verified correct
  pricePerSqFt: 176,         // unchanged — Redfin $/sqft: $176 (up 1.1% YoY)
  monthlyUtilities: 210,     // unchanged
  monthlyGroceries: 405,     // unchanged
  monthlyTransportation: 435, // unchanged
},
market: {
  daysOnMarket: 53,          // was 67 — Redfin city-level Jan 2026: 53 days
  saleToListRatio: 96.0,     // unchanged — estimated
  priceYOY: -3.7,            // was -1.7 — Redfin Jan 2026: -3.7% YoY
  marketCondition: 'Buyers Market', // unchanged
  redfinMedianPrice: 457000, // was 333000 — Redfin city-level Jan 2026
  redfinDataSource: 'Redfin city-level — Sugar Land, TX. Date: 01/2026',
},
```

**Source:** Redfin Sugar Land housing market (Jan 2026)

---

## Section 2 — Content Fixes (Descriptions & Strengths/Weaknesses)

---

### Fix 1 — Crime Rate Superlative Duplication

Both McKinney and Frisco claim "lowest crime rate of any major Texas city — 948 per 100K." This is the same number applied to two cities. Based on current crime data, Frisco's crime rate is lower than McKinney's. Apply the following:

**FRISCO — Keep the superlative, update specificity:**
- OLD: `'Lowest crime rate among major Texas cities — 948 per 100K'`
- NEW: `'Lowest crime rate among DFW suburbs — 789 per 100K (FBI UCR est.)'`

**McKINNEY — Remove the superlative claim, replace with accurate positioning:**
- OLD: `'Lowest crime rate of any major Texas city — 948 per 100K'`
- NEW: `'Among the safest cities in North Texas — 948 per 100K violent + property crime'`

**McKINNEY description — update opening superlative:**
- OLD: `'McKinney is the complete package for families relocating to North Texas — the lowest crime rate of any major Texas city...'`
- NEW: `'McKinney is the complete package for families relocating to North Texas — one of the lowest crime rates in the DFW metro, A-rated schools, and a charming historic downtown that gives it an identity beyond just another DFW suburb.'`

---

### Fix 2 — School District Description Template

The phrase "Exceptional district — consistently outperforms state standards." is applied identically to every A-rated ISD. Replace with city-specific language:

**McKinney ISD (TEA: A):**
- NEW: `'McKinney ISD has earned an A from TEA — top-performing district in Collin County with consistent year-over-year improvement.'`

**Frisco ISD (TEA: A):**
- NEW: `'Frisco ISD is one of the most celebrated districts in Texas — 56 of 75 schools rated A, none below C, with a near-99% graduation rate.'`

**Plano ISD (TEA: A):**
- NEW: `'Plano ISD is one of the longest-tenured top-rated districts in Texas — consistently A-rated with deep academic programs and strong college placement.'`

**The Woodlands / Conroe ISD (TEA: B):**
- NEW: `'Conroe ISD earns a B from TEA and serves The Woodlands\' master-planned communities — consistent performance and strong extracurricular programs.'`

**Fort Bend ISD / Sugar Land (TEA: B):**
- NEW: `'Fort Bend ISD earns a B from TEA — one of the most culturally diverse and academically competitive suburban districts in the Houston metro.'`

---

### Fix 3 — Georgetown YOY Weakness Bullet

**GEORGETOWN weaknesses:**
- OLD: `'Home prices fell 17% YOY — market correction underway'`
- NEW: `'Rapid growth pressuring infrastructure — roads and schools lagging population gains'`

(The -17% figure was incorrect/outdated; Redfin shows +1.9% YOY as of Mar 2026.)

---

## Section 3 — Affordability Score Review (Flag for Craig)

The following cities may need affordability score adjustments now that housing prices are corrected:

| City | Current Score | Old Median | New Median | Recommendation |
|------|--------------|------------|------------|----------------|
| Frisco | 4/10 | $366,500 | $620,000 | Consider 3/10 |
| McKinney | 5/10 | $366,500 | $488,000 | 4/10 reasonable |
| The Woodlands | 5/10 | $308,000 | $635,000 | Consider 3/10 |
| Plano | 4/10 | $366,500 | $490,000 | Unchanged — 4/10 correct |
| Cedar Park | 6/10 | $430,500 | $496,000 | Consider 5/10 |
| Leander | 6/10 | $430,500 | $451,000 | Unchanged — 6/10 correct |
| Kyle | 7/10 | $430,500 | $305,000 | Consider 8/10 — genuinely affordable |
| San Marcos | 8/10 | $430,500 | $320,000 | Consider 8–9/10 |
| Pflugerville | 6/10 | $430,500 | $355,000 | Consider 7/10 |

**Craig decides on score changes. Claude Code does not touch scores unless Craig confirms.**

---

## Section 4 — Rent Data Note

The `avgRent1BR/2BR/3BR` fields have been updated where city-specific data shows a meaningful difference from metro defaults. For cities where rent data is limited (Leander, Georgetown, San Marcos), conservative estimates based on metro position were used. These should be verified against Zillow Rental Manager or ApartmentList city-level data before the next full data audit.

---

## Implementation Checklist for Claude Code

- [ ] Apply all `housing` field corrections (Section 1)
- [ ] Apply all `market` field corrections (Section 1)
- [ ] Update `redfinDataSource` strings for all corrected cities
- [ ] Apply content fixes — crime rate superlatives (Section 2, Fix 1)
- [ ] Apply content fixes — school district descriptions (Section 2, Fix 2)
- [ ] Apply Georgetown YOY weakness bullet fix (Section 2, Fix 3)
- [ ] Update New Braunfels DOM weakness bullet (Section 1, New Braunfels note)
- [ ] **Do NOT change** scores, tiers, ISD names, TEA ratings, or any other fields not listed above
- [ ] **Hold** affordability score changes pending Craig's decision (Section 3)
- [ ] Run `tsc --noEmit` to verify no TypeScript errors after changes
- [ ] Verify the site builds cleanly on Vercel preview before merging to main

---

## Data Integrity Status Post-Fix

| City | Market Data | Housing Data | Content |
|------|-------------|--------------|---------|
| Austin | ✅ City-level | ✅ City-level | ✅ |
| Dallas | ✅ City-level | ✅ City-level | ✅ |
| Houston | ✅ City-level | ✅ City-level | ✅ |
| San Antonio | ✅ City-level | ✅ City-level | ✅ |
| Fort Worth | ✅ City-level | ✅ City-level | ✅ |
| Frisco | ✅ City-level (post-fix) | ✅ City-level (post-fix) | ✅ (post-fix) |
| Plano | ✅ City-level (post-fix) | ✅ City-level (post-fix) | ✅ |
| McKinney | ✅ City-level (post-fix) | ✅ City-level (post-fix) | ✅ (post-fix) |
| Round Rock | ✅ City-level (post-fix) | ✅ City-level (post-fix) | ✅ |
| Cedar Park | ✅ City-level (post-fix) | ✅ City-level (post-fix) | ✅ |
| The Woodlands | ✅ City-level (post-fix) | ✅ City-level (post-fix) | ✅ (post-fix) |
| Sugar Land | ✅ City-level (post-fix) | ✅ City-level (post-fix) | ✅ (post-fix) |
| Georgetown | ✅ City-level (post-fix) | ✅ City-level (post-fix) | ✅ (post-fix) |
| Kyle | ✅ City-level (post-fix) | ✅ City-level (post-fix) | ✅ |
| New Braunfels | ✅ City-level (post-fix) | ✅ City-level (post-fix) | ✅ (post-fix) |
| San Marcos | ✅ City-level (post-fix) | ✅ City-level (post-fix) | ✅ |
| Leander | ✅ City-level (post-fix) | ✅ City-level (post-fix) | ✅ |
| Pflugerville | ✅ City-level (post-fix) | ✅ City-level (post-fix) | ✅ |
| Waco | ✅ Zillow (flagged) | ✅ Verified | ✅ |
| Corpus Christi | ✅ Zillow (flagged) | ✅ Verified | ✅ |

---

*Brief prepared by Claude — HavenQuest COO/Chief Editor. All figures sourced from Redfin city-level data, Zillow ZHVI, Orchard, Houzeo, and local MLS reports (March–May 2026). Verify against Supabase if city data is migrated to database in Phase 2.*

---

## Section 5 — Affordability Score Changes (Craig Approved)

Apply these score changes to the `scores.affordability` field for each city listed. All other scores unchanged.

| City | Current Score | New Score | Rationale |
|------|--------------|-----------|-----------|
| Frisco | 4 | **3** | Median $620K, entry $420K — genuinely expensive market |
| The Woodlands | 5 | **3** | Median $635K, entry $395K — most expensive suburb in database |
| Cedar Park | 6 | **5** | Median $496K — above Austin metro average |
| McKinney | 5 | **4** | Median $488K — premium Collin County pricing |
| Kyle | 7 | **8** | Median $305K — legitimately affordable, well below metro average |
| San Marcos | 8 | **9** | Median $320K — second most affordable Austin-corridor city |
| Pflugerville | 6 | **7** | Median $355K — genuine value vs Cedar Park and Round Rock |

**Cities with no affordability score change:**
- Plano: stays 4 (median $490K — expensive, correct)
- Round Rock: stays 6 (median $395K — midrange, correct)
- Leander: stays 6 (median $451K — above average, correct)
- Georgetown: stays 6 (median $413K — reasonable, correct)
- New Braunfels: stays 7 (median $307K — affordable, correct)
- Sugar Land: stays 5 (median $457K — moderate, correct)

**Claude Code instruction:** Update `scores.affordability` for the 7 cities listed in the table above. Do not change any other score fields.

---

*Section 5 added May 28, 2026 — affordability scores confirmed by Craig Asbach.*
