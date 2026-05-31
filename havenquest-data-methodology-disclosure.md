# HavenQuest — Data Sources, Methodology & Scoring Disclosure
**Version:** 1.0  
**Prepared by:** Claude (COO/Chief Editor)  
**Date:** May 29, 2026  
**Status:** Public-facing disclosure document

---

## Purpose

This document provides full transparency into how HavenQuest collects, scores, and uses data to generate city match results for users. It is intended for users, realtors, investors, and any party who wants to understand how the platform works.

HavenQuest is a relocation intelligence tool. Our goal is to help people find the Texas city that best fits their lifestyle, budget, and priorities. We do not guarantee outcomes. All scores are directional guidance — not financial, legal, or real estate advice.

---

## Section 1 — What Data We Use

HavenQuest uses publicly available data from the following sources. All data is researched and verified at the city level wherever possible. Where city-level data is unavailable, county-level or metro-level data is used and disclosed.

### 1.1 Housing & Market Data

| Data Point | Primary Source | Frequency |
|-----------|---------------|-----------|
| Median home price | Redfin city-level (preferred), Zillow ZHVI, Orchard | Monthly |
| Price per square foot | Redfin city-level | Monthly |
| Days on market | Redfin city-level | Monthly |
| Sale-to-list ratio | Redfin city-level, Orchard | Monthly |
| Price YOY change | Redfin city-level | Monthly |
| Market condition | Derived from DOM and sale-to-list ratio | Monthly |
| Property tax rate | County appraisal district records | Annually (January) |
| Estimated rent (1BR/2BR/3BR) | Zillow Rent Estimates, Apartments.com | Quarterly |

**Market condition definitions:**
- **Seller's Market** — homes selling in under 30 days, sale-to-list above 99%
- **Balanced Market** — 30–60 days on market, sale-to-list 97–99%
- **Buyer's Market** — over 60 days on market, sale-to-list below 97%

### 1.2 School Data

| Data Point | Primary Source | Frequency |
|-----------|---------------|-----------|
| TEA A–F district rating | Texas Education Agency (TEA) | Annually (August) |
| Primary ISD name | TEA district records | Annually |

TEA ratings are assigned A through F based on three domains: Student Achievement, School Progress, and Closing the Gaps. Scores are based primarily on STAAR standardized test performance, graduation rates, and college/career readiness.

**Note:** TEA ratings reflect the 2024-2025 school year, released August 15, 2025. HavenQuest will update all ISD ratings following each annual TEA release.

### 1.3 Safety Data

| Data Point | Primary Source | Frequency |
|-----------|---------------|-----------|
| Crime rate (per 100K residents) | FBI UCR, City-level crime reports, NeighborhoodScout | Annually |
| Crime trend direction | Year-over-year comparison from same sources | Annually |

Safety scores are derived from violent crime rates and property crime rates relative to Texas and national averages. Cities are scored on a 1–10 scale where 10 represents the lowest crime rate relative to peers.

### 1.4 Cost of Living Data

| Data Point | Primary Source | Frequency |
|-----------|---------------|-----------|
| Monthly utilities estimate | EnergyBot, City utility reports | Annually |
| Monthly groceries estimate | Bureau of Labor Statistics CPI regional data | Annually |
| Monthly transportation estimate | AAA, Bureau of Transportation Statistics | Annually |

### 1.5 Lifestyle & Walkability Data

| Data Point | Primary Source | Frequency |
|-----------|---------------|-----------|
| Walkability score | Walk Score city-level | Annually |
| Transit score | Walk Score, city transit authority data | Annually |
| Traffic/commute data | TomTom Traffic Index, Google Maps commute data | Annually |
| Outdoor recreation | AllTrails, Texas Parks and Wildlife, city parks departments | Annually |
| Nightlife/dining density | Yelp business density data, local knowledge | Annually |

### 1.6 Climate Data

| Data Point | Primary Source | Frequency |
|-----------|---------------|-----------|
| Weather score | NOAA climate normals, Texas climatology data | Evergreen |

Weather scores reflect average annual temperature range, humidity, number of extreme heat days, and storm exposure (hurricane, tornado, flooding risk).

---

## Section 2 — How Scores Are Calculated

### 2.1 The 12 Lifestyle Category Scores

Every city in the HavenQuest database is scored on 12 lifestyle categories on a scale of 1 to 10. These scores are editorially assigned by HavenQuest based on the underlying data sources listed in Section 1. They are directional indicators, not precise measurements.

| Category | What It Measures | Data Basis |
|----------|-----------------|-----------|
| **Affordability** | How accessible the housing market is for typical buyers | Median home price relative to Texas average; property tax rate |
| **Schools** | Quality of the primary public school district | TEA A–F rating (A=9-10, B=7-8, C=5-6, D=3-4, F=1-2) |
| **Safety** | Violent and property crime rate relative to Texas average | FBI UCR, city crime reports |
| **Walkability** | Ability to accomplish daily tasks without a car | Walk Score city-level |
| **Transit** | Access to public transportation | Walk Score transit index, city transit routes |
| **Nightlife** | Density and quality of restaurants, bars, and entertainment | Yelp business density, local editorial review |
| **Outdoors** | Access to parks, trails, lakes, and natural recreation | AllTrails, Texas Parks and Wildlife, proximity to state parks |
| **Family Friendly** | Overall suitability for families with children | School quality, safety, parks, community programming |
| **Remote Work** | Infrastructure and environment for remote workers | Internet availability, coworking space access, cost of living |
| **Low Taxes** | Property tax burden relative to Texas average | County appraisal district effective tax rates |
| **Weather** | Climate comfort and storm risk | NOAA climate normals, hurricane/tornado/flood risk |
| **Traffic** | Commute times and congestion | TomTom Traffic Index, peak hour commute estimates |

### 2.2 Score Calibration

Scores are calibrated relative to the full HavenQuest database of 101 Texas cities. A score of 10 represents the best-performing city in the database for that category. A score of 1 represents the lowest-performing city.

Scores are not absolute — they are relative to the Texas cities in our database. A city scoring 8/10 on Safety is very safe compared to other Texas cities. The same city may score differently if compared to a national database.

### 2.3 Affordability Score Logic

The affordability score is calculated based on median home price relative to the Texas average ($341,800 as of March 2026), property tax rate, and estimated monthly ownership cost.

**Affordability flag:** If a user's estimated monthly housing cost (principal, interest, and property tax at 7% down and 30-year fixed) exceeds 40% of their declared monthly gross income, an affordability flag is displayed on that city's result. This flag is a warning, not a disqualification. Users who select "Luxury" as a priority bypass this flag.

---

## Section 3 — The Matching Algorithm

### 3.1 How User Priorities Are Weighted

Users assign each of the 12 lifestyle categories to one of three priority levels:

| Priority Level | Weight | Maximum Assignments |
|---------------|--------|-------------------|
| **Must Have** | 3× | Up to 3 categories |
| **Important to Me** | 2× | Up to 5 categories |
| **Would Be Nice** | 1× | Unlimited |
| **Unassigned** | 0× | Not included in score |

Categories left unassigned receive zero weight and do not influence results. This means a user who does not assign a category is explicitly saying "this does not matter to me" — and the algorithm honors that.

### 3.2 Match Score Calculation

For each city, a weighted match score is calculated as follows:

```
Match Score = Σ (Category Score × Priority Weight)
```

Example: A user assigns Schools as Must Have (3×), Safety as Must Have (3×), Affordability as Important to Me (2×), and Outdoors as Would Be Nice (1×).

For a city scoring: Schools=9, Safety=8, Affordability=7, Outdoors=6:
```
Match Score = (9×3) + (8×3) + (7×2) + (6×1) = 27 + 24 + 14 + 6 = 71
```

Cities are ranked by their match score. The top results are presented to the user as their best matches.

### 3.3 What the Algorithm Does Not Do

- It does not use personal demographic data (race, religion, national origin) in any scoring calculation
- It does not weight results based on price point unless affordability is explicitly assigned as a priority
- It does not favor or suppress any city based on realtor relationships or commercial arrangements
- It does not use machine learning or AI inference — all scores are human-researched and editorially assigned

---

## Section 4 — Data Integrity & Maintenance

### 4.1 Data Freshness

HavenQuest maintains a scheduled data review process:

| Review Type | Frequency | What Is Updated |
|------------|-----------|----------------|
| Market data audit | Monthly (1st of each month) | Median price, DOM, sale-to-list, market condition |
| TEA ratings update | Annually (August) | All 101 ISD ratings |
| Property tax rate review | Annually (January) | All 101 city tax rates |
| Crime data update | Annually | All 101 city safety scores |

Each city entry includes a `lastUpdated` field indicating when that city's data was last verified. Data that has not been verified within 90 days is flagged for review.

### 4.2 Data Sources We Do Not Use

HavenQuest does not use the following as primary data sources:

- **User-generated reviews** (Yelp ratings, Nextdoor posts, Reddit threads) — these are subject to bias and cannot be verified
- **Real estate agent recommendations** — realtors in our network do not influence city scores
- **Advertiser-influenced rankings** — no city pays to appear in results or receive higher scores
- **Automated scraping without verification** — all data points are manually verified against primary sources

### 4.3 Limitations We Disclose

**City-level vs. neighborhood-level data:** HavenQuest scores reflect city-wide averages. Significant variation can exist between neighborhoods within the same city. A city scoring 5/10 on Safety may have neighborhoods that score significantly higher or lower. Users should conduct neighborhood-level research before making any purchasing decision.

**Small market data:** For smaller cities (population under 20,000) and some newer communities, city-level Redfin data may be unavailable. In these cases we use county-level data or local MLS data and disclose the source.

**Score subjectivity:** The 12 lifestyle scores involve editorial judgment in their assignment. Two researchers reviewing the same data may assign slightly different scores. We calibrate scores annually and adjust for material changes.

**Market volatility:** Texas housing market conditions in 2026 are more volatile than historical norms. Price data can change materially within a 30-60 day period. Users should verify current market conditions with a licensed real estate professional before making any purchasing decisions.

---

## Section 5 — What HavenQuest Is Not

HavenQuest is a relocation intelligence and city-matching platform. It is not:

- A licensed real estate brokerage
- A mortgage lender or financial advisor
- A legal advisor
- A school enrollment service
- A guarantee of any housing outcome

All city match results, scores, and descriptions are provided for informational purposes only. HavenQuest does not guarantee the accuracy of any data point and recommends users verify all information independently before making any relocation or purchasing decision.

---

## Section 6 — Realtor Network Disclosure

Realtors featured in HavenQuest's network are vetted against the following published standards:

**Tier 1 — Major Metro Markets (DFW, Houston, Austin, San Antonio):**
- Active TREC license in good standing
- 40+ verified transactions per year
- 4.8+ star rating with 50+ reviews on Google or Zillow
- 15+ years licensed experience
- Credible recognition (team, awards, production ranking)

**Tier 2 — Secondary Markets:**
- Active TREC license in good standing
- 25+ verified transactions per year
- 4.8+ star rating with 30+ reviews
- 10+ years licensed experience

**Tier 3 — Smaller Markets:**
- Active TREC license in good standing
- 20+ verified transactions per year
- 4.7+ star rating with 20+ reviews
- 7+ years licensed experience

**All tiers require:**
- Clean TREC disciplinary record (verified at application)
- 24-hour response commitment to HavenQuest-referred clients
- Paid subscription to the HavenQuest realtor network

**Important disclosure:** Realtors pay a monthly subscription to be listed in the HavenQuest network. Subscription tier (Standard $99, Professional $199, Elite $349/month) affects placement prominence but does not affect city match scores or which users are matched to which cities. No realtor can pay to influence the matching algorithm.

---

## Section 7 — Contact & Corrections

If you believe any data point in the HavenQuest database is inaccurate, outdated, or misleading, please contact us:

**Email:** grandhavenpartners.llc@gmail.com  
**Subject line:** Data Correction Request — [City Name]

We will review all correction requests and update data within 30 days if the correction is substantiated by a verifiable primary source.

---

*HavenQuest is operated by American Victory Alliance, LLC — Austin, TX. All data is provided for informational purposes only and does not constitute financial, legal, or real estate advice. Scores are directional lifestyle guidance. How scores work: havenquest.co/methodology*

*Document version 1.0 — May 29, 2026. Subject to revision as platform data and methodology evolve.*
