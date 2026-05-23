# HavenQuest — Claude Code Build Brief
## Phase 1 MVP
### Version 1.0 — May 2026

---

## OVERVIEW

Build a premium relocation intelligence platform called **HavenQuest** that helps people find the Texas city or neighborhood where their income, household, and lifestyle priorities actually fit — then connects them with vetted top-tier Texas realtors and provides a starter portal to begin their relocation journey.

This is not a listings site. Not a calculator. A relocation decision platform that answers the question nobody else answers:

> *"Where in Texas can I actually build the life I want on what I make?"*

**Live domain:** havenquest.co

---

## PROJECT CREDENTIALS

```
Domain:     havenquest.co (Namecheap)
GitHub:     github.com/grandhavenpartnersllc-go/havenquest
Hosting:    Vercel — account: grandhavenpartnersllc-go
Database:   Supabase — project: gsxiqberewwzoohhuphn
Email:      Resend
```

---

## TECH STACK

```
Frontend:   Next.js 14 App Router
Language:   TypeScript (strict mode — no any types)
Styling:    TailwindCSS
Animation:  Framer Motion
Icons:      Lucide React
Database:   Supabase (PostgreSQL)
Auth:       Supabase Auth
Email:      Resend
Hosting:    Vercel
```

---

## ENVIRONMENT VARIABLES

Create `/env.local` — leave values blank for owner to populate:

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
RESEND_API_KEY=
NEXT_PUBLIC_SITE_URL=https://havenquest.co
```

---

## DESIGN SYSTEM

### Philosophy
Premium. Warm. Modern. Trustworthy. Think Apple meets a trusted local guide.
Not corporate. Not clinical. Not a government database.
The user should feel like they found something genuinely helpful.

### Color Palette
```css
--color-bg-primary:       #FFFFFF;
--color-bg-secondary:     #F7F6F3;
--color-text-primary:     #1A1A1A;
--color-text-secondary:   #6B7280;
--color-accent:           #1A5FA8;
--color-accent-hover:     #154d8a;
--color-success-bg:       #EAF3DE;
--color-success-text:     #3B6D11;
--color-warning-bg:       #FCEBEB;
--color-warning-text:     #A32D2D;
--color-gold:             #C9A84C;
--color-border:           #E5E7EB;
```

### Typography
- Font: Inter (load via next/font)
- Headings: medium weight (500)
- Body: regular weight (400)
- Numbers: tabular-nums class for consistent alignment

### Component Standards
- Border radius: 12px on cards, 8px on inputs and buttons
- Card shadow: `0 2px 12px rgba(0,0,0,0.08)`
- Hover shadow: `0 4px 20px rgba(0,0,0,0.12)`
- Transitions: 200ms ease on all interactive elements
- Spacing: generous whitespace — never feel cluttered
- **Mobile first** — design for 390px viewport, scale up to desktop

---

## URL STRUCTURE

```
/                               Landing page
/explore                        Exploring Texas flow
/metro                          Metro Mode flow
/results                        Results page
/report/[citySlug]              Full city report
/portal                         Starter portal (session required)
/texas/[city]                   City SEO pages (static generated)
/texas/[city]/[neighborhood]    Neighborhood pages (Phase 2 — architect ready)
/methodology                    How scores are calculated
/for-realtors                   Realtor landing page
```

---

## FILE STRUCTURE

```
/app
  page.tsx
  layout.tsx
  globals.css
  /explore/page.tsx
  /metro/page.tsx
  /results/page.tsx
  /report/[citySlug]/page.tsx
  /portal/page.tsx
  /texas/[city]/page.tsx
  /methodology/page.tsx
  /for-realtors/page.tsx

/components
  /landing
    HeroSection.tsx
    TwoFrontDoors.tsx
    HowItWorks.tsx
    FeaturedCities.tsx
    RealtorCTA.tsx
  /form
    IncomeForm.tsx
    HouseholdForm.tsx
    PrioritySelector.tsx      ← three-bucket drag and drop
    ModeSelector.tsx
    FormProgress.tsx
  /results
    TeaserResults.tsx
    EmailGate.tsx
    CityMatchCard.tsx
    FullReport.tsx
    AffordabilityBreakdown.tsx
    AffordabilityWarning.tsx
    RealtorMatchSection.tsx
    RealtorCard.tsx
    StrengthWeaknessGrid.tsx
    MarketSnapshot.tsx
    SchoolSnapshot.tsx
    ListingsButton.tsx
  /portal
    StarterPortal.tsx
    SavedMatches.tsx
    CityGuide.tsx
    RealtorContacts.tsx
    RelocationChecklist.tsx
    NotesArea.tsx
  /shared
    Header.tsx
    Footer.tsx
    ProgressBar.tsx
    ScoreGauge.tsx
    ScoreBar.tsx
    LifestyleBadge.tsx
    MarketBadge.tsx
    TEARatingBadge.tsx

/data
  cities.ts                     ← PROVIDED — do not modify
  realtors.ts                   ← PROVIDED — do not modify
  index.ts                      ← PROVIDED — do not modify

/services
  locationService.ts            ← ALL data access goes through here
  matchingService.ts
  affordabilityService.ts
  emailService.ts
  listingsService.ts

/types
  index.ts                      ← ALL interfaces defined here

/utils
  formatting.ts
  scoring.ts
  zillowUrl.ts
  constants.ts

/public
  /images
  /icons
```

---

## TYPESCRIPT INTERFACES

Place all interfaces in `/types/index.ts`:

```typescript
export interface LifestyleScores {
  affordability: number
  schools: number
  safety: number
  walkability: number
  transit: number
  nightlife: number
  outdoors: number
  familyFriendly: number
  remoteWork: number
  lowTaxes: number
  weather: number
  traffic: number
}

export interface HousingData {
  avgRent1BR: number
  avgRent2BR: number
  avgRent3BR: number
  starterHomePrice: number
  medianHomePrice: number
  propertyTaxRate: number
  pricePerSqFt: number
  monthlyUtilities: number
  monthlyGroceries: number
  monthlyTransportation: number
}

export interface MarketData {
  daysOnMarket: number
  saleToListRatio: number
  priceYOY: number
  marketCondition: 'Sellers Market' | 'Balanced Market' | 'Buyers Market'
  redfinMedianPrice: number
  redfinDataSource: string
}

export interface SchoolData {
  teaRating: 'A' | 'B' | 'C' | 'D' | 'F'
  primaryISD: string
}

export interface Location {
  id: string
  name: string
  state: string
  county: string
  type: 'city' | 'neighborhood'
  tier: 'tier1' | 'tier2' | 'tier3'
  parentId: string | null
  scores: LifestyleScores
  housing: HousingData
  market: MarketData
  school: SchoolData
  description: string
  strengths: [string, string, string]
  weaknesses: [string, string, string]
  hasNeighborhoodData: boolean
  lastUpdated: string
  metroUsed: string
}

export interface UserProfile {
  annualIncome: number
  householdSize: '1' | '2' | '3-4' | '5+'
  housingPreference: 'rent1br' | 'rent2br' | 'rent3br' | 'buyStarter' | 'buyMedian'
  movingTimeline: '0-3months' | '3-6months' | '6-12months' | 'exploring'
  mustHaves: (keyof LifestyleScores)[]      // max 3
  niceToHaves: (keyof LifestyleScores)[]    // max 5
  notPriorities: (keyof LifestyleScores)[]  // remaining
}

export interface CityMatch {
  location: Location
  matchScore: number
  affordabilityScore: number
  affordabilityFlag: boolean
  estimatedMonthlyHousing: number
  estimatedMonthlyTotal: number
  zillowSearchUrl: string
}

export interface Realtor {
  id: string
  name: string
  brokerage: string
  city: string
  yearsExperience: number
  transactionsLast12mo: number
  rating: number
  reviewCount: number
  designations: string[]
  awards: string
  isRelocationSpecialist: boolean
  phone: string
  website: string
  bio: string
  minPurchasePrice: number
  maxPurchasePrice: number
}
```

---

## DATA ARCHITECTURE — CRITICAL

**The single most important architectural rule:**

All data fetching must go through `/services/locationService.ts`.
No component imports from `/data` directly.
This allows static JSON (Phase 1) to be swapped for Supabase queries (Phase 2) without touching any UI component.

```typescript
// services/locationService.ts — example structure

import { texasCities, texasMetros } from '../data'
import { Location } from '../types'

export function getAllCities(): Location[] {
  return texasCities
}

export function getCityById(id: string): Location | undefined {
  return texasCities.find(city => city.id === id)
}

export function getCityBySlug(slug: string): Location | undefined {
  return texasCities.find(city => city.id === slug)
}

export function getCitiesByMetro(metro: string): Location[] {
  const metroData = texasMetros[metro as keyof typeof texasMetros]
  if (!metroData) return []
  return texasCities.filter(city => metroData.cityIds.includes(city.id))
}

export function getCityChildren(parentId: string): Location[] {
  // Phase 2: returns neighborhood children
  // Phase 1: always returns empty array
  return texasCities.filter(city => city.parentId === parentId)
}
```

**Every component that displays city or neighborhood data must accept a `Location` type.
No component should be city-specific.**

---

## MATCHING ALGORITHM

```typescript
// services/matchingService.ts

import { Location, UserProfile, CityMatch } from '../types'
import { getAllCities } from './locationService'
import { generateZillowUrl } from '../utils/zillowUrl'

export function calculateMatchScore(
  city: Location,
  profile: UserProfile
): number {
  const mustHaveTotal = profile.mustHaves.reduce(
    (sum, key) => sum + city.scores[key] * 3, 0
  )
  const niceToHaveTotal = profile.niceToHaves.reduce(
    (sum, key) => sum + city.scores[key] * 1.5, 0
  )
  const notPriorityTotal = profile.notPriorities.reduce(
    (sum, key) => sum + city.scores[key] * 1, 0
  )

  const rawScore = mustHaveTotal + niceToHaveTotal + notPriorityTotal

  const maxMustHave = profile.mustHaves.length * 10 * 3
  const maxNiceToHave = profile.niceToHaves.length * 10 * 1.5
  const maxNotPriority = profile.notPriorities.length * 10 * 1
  const maxScore = maxMustHave + maxNiceToHave + maxNotPriority

  return Math.round((rawScore / maxScore) * 100)
}

export function getMonthlyHousingCost(
  city: Location,
  preference: UserProfile['housingPreference']
): number {
  const h = city.housing
  switch (preference) {
    case 'rent1br': return h.avgRent1BR
    case 'rent2br': return h.avgRent2BR
    case 'rent3br': return h.avgRent3BR
    case 'buyStarter': return Math.round((h.starterHomePrice * 0.007))
    case 'buyMedian': return Math.round((h.medianHomePrice * 0.007))
    default: return h.avgRent2BR
  }
}

export function checkAffordabilityFlag(
  city: Location,
  profile: UserProfile
): boolean {
  const monthlyIncome = profile.annualIncome / 12
  const monthlyHousing = getMonthlyHousingCost(city, profile.housingPreference)
  return monthlyHousing > monthlyIncome * 0.40
}

export function getTopMatches(
  profile: UserProfile,
  cities: Location[],
  limit = 3
): CityMatch[] {
  return cities
    .map(city => ({
      location: city,
      matchScore: calculateMatchScore(city, profile),
      affordabilityScore: Math.round(city.scores.affordability * 10),
      affordabilityFlag: checkAffordabilityFlag(city, profile),
      estimatedMonthlyHousing: getMonthlyHousingCost(city, profile.housingPreference),
      estimatedMonthlyTotal:
        getMonthlyHousingCost(city, profile.housingPreference) +
        city.housing.monthlyUtilities +
        city.housing.monthlyGroceries +
        city.housing.monthlyTransportation,
      zillowSearchUrl: generateZillowUrl(city, profile),
    }))
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, limit)
}
```

---

## ZILLOW URL GENERATOR

```typescript
// utils/zillowUrl.ts

import { Location, UserProfile } from '../types'

function getBedCount(preference: UserProfile['housingPreference']): string {
  if (preference === 'rent1br') return '1'
  if (preference === 'rent2br') return '2'
  if (preference === 'rent3br') return '3'
  return '3'
}

function getMaxBudget(profile: UserProfile, city: Location): number {
  const monthlyIncome = profile.annualIncome / 12
  const maxMonthlyHousing = Math.round(monthlyIncome * 0.40)

  if (profile.housingPreference.startsWith('rent')) {
    return maxMonthlyHousing
  }

  // Purchase: rough mortgage back-calculation (assumes 20% down, 7% rate, 30yr)
  return Math.round(profile.annualIncome * 4.5)
}

export function generateZillowUrl(
  city: Location,
  profile: UserProfile
): string {
  const citySlug = city.name.replace(/\s+/g, '-')
  const isRenting = profile.housingPreference.startsWith('rent')
  const maxBudget = getMaxBudget(profile, city)

  if (isRenting) {
    const beds = getBedCount(profile.housingPreference)
    return `https://www.zillow.com/homes/for_rent/${citySlug}-TX_rb/?beds=${beds}&price=0-${maxBudget}`
  }

  return `https://www.zillow.com/homes/for_sale/${citySlug}-TX_rb/?price=0-${maxBudget}`
}
```

---

## LANDING PAGE

### Hero Section
```
Headline:     "Find where your life fits in Texas"
Subheadline:  "Match your income and lifestyle to the right Texas city
               or neighborhood — then connect with the best realtors
               in your market."
```

### Two Front Doors — PRIMARY UI ELEMENT
Two large equal cards displayed prominently below the hero:

```
┌─────────────────────────────┐  ┌─────────────────────────────┐
│  🗺  Exploring Texas        │  │  📍  Metro Mode             │
│                             │  │                             │
│  Find the city that fits    │  │  Already know your metro?   │
│  your life and budget       │  │  Find the neighborhood      │
│  across all of Texas        │  │  that fits within it        │
│                             │  │                             │
│  [ Find My City → ]         │  │  [ Explore My Metro → ]     │
└─────────────────────────────┘  └─────────────────────────────┘
```

### How It Works
Three step cards:
1. Enter your profile — income, household, preferences
2. Rank your priorities — drag into Must Have, Nice to Have, or Not a Priority
3. Discover your matches — verified data, honest tradeoffs, matched realtors

### Featured Cities
Show 4 cities as preview cards with a teaser match score

### Realtor CTA
*"Are you a Texas realtor? Join the HavenQuest network."* → /for-realtors

---

## CORE USER FLOW — EXPLORING TEXAS

### Step 1 — Profile Form
Multi-step card with progress indicator. One concept per step.

**Income step:**
- Label: "What is your annual household income?"
- Input: text with $ prefix, comma formatting, numeric only
- Placeholder: "$85,000"

**Household step:**
- Label: "Tell us about your household"
- Select cards (not dropdown): Just me / 2 people / Family of 3–4 / Family of 5+
- Second question: Housing preference
- Select cards: Rent 1BR / Rent 2BR / Rent 3BR / Buy starter home / Buy median home

**Timeline step:**
- Label: "When are you thinking about making a move?"
- Select cards: Within 3 months / 3–6 months / 6–12 months / Just exploring

### Step 2 — Priority Selector (PrioritySelector.tsx)

Three-bucket drag and drop. On mobile: tap to assign.

**Buckets:**
```
┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐
│   MUST HAVE      │  │  NICE TO HAVE    │  │  NOT A PRIORITY  │
│   up to 3        │  │  up to 5         │  │  (rest)          │
│                  │  │                  │  │                  │
│  Drop here       │  │  Drop here       │  │  Drop here       │
└──────────────────┘  └──────────────────┘  └──────────────────┘
```

**12 category cards — start in unassigned pool below buckets:**

| Category | Icon | One-line description |
|---|---|---|
| Affordability | 💰 | Housing costs relative to your income |
| Schools | 🎓 | Public school district quality |
| Safety | 🛡️ | Crime rates and community safety |
| Walkability | 🚶 | Errands and daily life on foot |
| Transit | 🚌 | Bus, rail, and commute options |
| Nightlife | 🎵 | Bars, music, restaurants, entertainment |
| Outdoors | 🏞️ | Parks, trails, nature access |
| Family Friendly | 👨‍👩‍👧 | Overall environment for raising children |
| Remote Work | 💻 | Broadband, tech culture, coworking |
| Low Taxes | 📋 | Property tax rates and tax burden |
| Weather | ☀️ | Climate, sunshine, seasonal comfort |
| Traffic | 🚗 | Commute times and congestion levels |

**Rules — enforce in state logic not just UI:**
- Must Have: hard max 3. Locked state after 3 placed.
- Nice to Have: hard max 5. Locked state after 5 placed.
- Submit disabled until at least 1 Must Have placed.
- Progress indicator: "2 of 3 Must Haves selected"
- Mobile: tap card → modal with three bucket options

### Step 3 — Matching Algorithm
Run `getTopMatches(profile, getAllCities(), 3)` from matchingService.ts

### Step 4 — Teaser Results

Show top 3 matches. Everything below headline stats is blurred with a frosted overlay.

**Each teaser card shows:**
- City name + state
- Match score — large number (e.g. "87") with animated fill bar
- Market condition badge
- One headline strength from strengths[0]
- Affordability warning if flag triggered (yellow banner)

**Below all cards — email gate prompt:**
```
┌────────────────────────────────────────────────────────┐
│  Your full HavenQuest report is ready                  │
│  See complete scores, cost breakdowns, school data,    │
│  and your matched realtors — free                      │
│                                                        │
│            [ Get My Full Report → ]                    │
└────────────────────────────────────────────────────────┘
```

### Step 5 — Email Gate (Modal)

**Fields:**
- First name (required)
- Email address (required)
- Phone number (optional — labeled "Optional — for realtor contact")
- Moving timeline (pre-filled from Step 1, editable)

**On submit logic:**
1. Validate required fields
2. POST to Supabase users table
3. If Supabase write FAILS → show error, do NOT unlock results
4. If Supabase write SUCCEEDS → send welcome email via Resend → unlock results
5. Store user session object in localStorage

### Step 6 — Full Report

For each top 3 city, render a full FullReport component:

**Header:**
- City name, county, state
- Match score with ScoreGauge component
- Tier badge (Major Metro / Growing Suburb / Lifestyle City)
- MarketBadge (Buyer's Market / Balanced / Seller's Market)
- TEARatingBadge (A / B / C / D / F)

**Affordability Breakdown:**
- Monthly housing (rent or estimated mortgage)
- Property tax monthly estimate: `(medianHomePrice * propertyTaxRate) / 12`
- Monthly utilities
- Monthly groceries
- Monthly transportation
- **Total estimated monthly cost** — bold, larger font
- Income remaining: `(annualIncome / 12) - totalMonthly`
- AffordabilityWarning if flag: yellow box
  > "Housing costs in [City] represent [X]% of your monthly income — above the recommended 40% guideline. Consider a different housing preference or explore nearby suburbs."

**Lifestyle Scores:**
All 12 scores as labeled bars. Must Haves highlighted with accent color border.
Show score number (e.g. "8/10") and filled progress bar.

**Market Snapshot:**
- Median sale price (formatted as $XXX,XXX)
- Days on market: "Homes sell in X days on average"
- Sale to list: "Homes sell for X% of asking price"
- YOY: "Prices are up/down X% vs last year" with ↑↓ indicator
- Market context sentence based on marketCondition

**School Snapshot:**
- Primary ISD name
- TEA letter grade badge (color coded: A=green, B=blue, C=yellow, D=orange, F=red)
- Context sentence

**Strengths and Weaknesses:**
- 3 strength cards (green background)
- 3 weakness cards (red background)

**Price Intelligence:**
- Price per sq ft
- Starter home price
- Median home price
- Property tax rate %
- Estimated monthly property tax on median home

**Listings Button (ListingsButton.tsx):**
```
┌────────────────────────────────────────────────────────┐
│  See available homes in [City Name]                    │
│  Filtered to your budget and bedroom preference        │
│                                                        │
│         [ Browse Homes on Zillow → ]                   │
└────────────────────────────────────────────────────────┘
```
- Uses generateZillowUrl(city, profile)
- Opens in new tab: `target="_blank" rel="noopener noreferrer"`
- On click: log click event to Supabase leads table

**Share Button:**
"Share this report" — generates shareable URL with encoded profile

### Step 7 — Realtor Match Section

Visually distinct section below the full report. Clear heading. Visual separator.

```
─────────────────────────────────────────────────────────
Ready to take the next step in [City]?
These are your top matched realtors — verified, top-rated,
and experienced in relocations.
─────────────────────────────────────────────────────────
```

Show top 3 realtors for the matched city using `getTopRealtors(city.name)`.

**Each RealtorCard:**
- Circular avatar with initials (no photo required Phase 1)
- Name (bold)
- Brokerage
- Years experience: "X years experience"
- Transactions: "X transactions in the last 12 months"
- Rating: star display "4.9 ★ (127 reviews)"
- Relocation specialist badge if `isRelocationSpecialist === true`
- Top designation (first item from designations array)
- Bio excerpt (first 120 characters)
- Two CTA buttons: "Call [Name]" (tel: link) and "Visit Website" (external link)

---

## METRO MODE FLOW

Route: `/metro`

Identical to Exploring Texas flow with one addition at the start:

**Metro selector step:**
"Which Texas metro are you moving to?"

Select cards:
- Austin Metro
- Dallas-Fort Worth Metro
- Houston Metro
- San Antonio Metro

After metro selected → same profile form → same priority selector → matching runs against that metro's cities only using `getCitiesByMetro(metro)`.

**Metro city groupings (from data/index.ts):**
- Austin: Austin, Round Rock, Cedar Park, Georgetown, Kyle, San Marcos, Leander, Pflugerville
- Dallas: Dallas, Fort Worth, Frisco, Plano, McKinney
- Houston: Houston, The Woodlands, Sugar Land
- San Antonio: San Antonio, New Braunfels

**Architecture note:**
The Location type includes `parentId: string | null`. This field is reserved for Phase 2 neighborhood children. All city records have `parentId: null`. Do not remove this field — it enables Phase 2 neighborhood data without schema changes.

---

## STARTER PORTAL

Route: `/portal`

Gate: redirect to `/` if no localStorage session.

**Sections:**

**Welcome header:**
"Welcome, [firstName]. Your HavenQuest portal is ready."

**Your top matches:**
Three compact city match cards. Click to expand to full report.

**City guide — top match:**
- City description (full)
- What to know before you move (3 key facts from data)
- Links: city website, school district site

**School district snapshot (show if Schools was in mustHaves):**
- Primary ISD and TEA rating
- Link to TEA school report card: `https://tea.texas.gov`
- Note: "Most Texas districts open enrollment in spring"

**Market intelligence:**
- Market condition badge
- Days on market context sentence
- YOY price trend

**Your matched realtors:**
Compact RealtorCard components for top match city. Direct contact buttons.

**Relocation checklist:**
Checkboxes. State persists in localStorage.
```
□ Research neighborhoods in [City]
□ Connect with your matched realtor
□ Plan a visit to [City]
□ Research school enrollment requirements
□ Compare cost of living to your current city
□ Get mortgage pre-approval
□ Join local Facebook and Reddit communities for [City]
□ Research commute routes from [City] to your employer
```

**Notes:**
Textarea. Saves to localStorage on blur.
Label: "Your relocation notes"

**Browse listings:**
ListingsButton component for top matched city.

---

## METHODOLOGY PAGE

Route: `/methodology`

Headline: *"How HavenQuest scores Texas cities"*

Sections:
1. The 12 lifestyle categories — what each one measures
2. Data sources table — source, URL, last updated, frequency
3. Scoring scale — 1-10 explained with color examples
4. How the matching algorithm works — plain English
5. Affordability calculation — the 40% threshold explained
6. Disclaimer: *"Scores represent directional lifestyle guidance. Not authoritative financial, legal, or real estate advice. Verify all data independently before making relocation decisions. Data last updated 05/2026."*

Footer link: Link to methodology page from every page footer.

---

## REALTOR LANDING PAGE

Route: `/for-realtors`

This is a B2B page. Not the consumer tool.

**Headline:** *"The most qualified relocation leads in Texas"*

**Subheadline:** *"HavenQuest users tell us their income, budget, household size, lifestyle priorities, and timeline before they ever speak to a realtor. That's the lead you receive."*

**Why leads are different:**
- Income and budget verified by user entry
- Lifestyle priorities documented — 12 categories
- Timeline stated — within 3 months to just exploring
- City match confirmed — they chose your market
- Serious intent — completed a multi-step qualification process

**Subscription tiers:**

| | Standard | Professional | Elite |
|---|---|---|---|
| Price | $99/month | $199/month | $349/month |
| Territory | City-level | Zip code level | Exclusive zip (1-2 agents) |
| Placement | Standard | Priority | Featured with photo/bio |
| Dashboard | — | Performance stats | Full analytics |
| Reports | — | — | Monthly co-branded market report |

**Vetting standards section:**
- Top 5% of Texas realtors only
- Verified transaction history
- Active Texas real estate license
- Clean TREC disciplinary record
- 24-hour lead response commitment

**Application form:**
Fields: Name, email, phone, city/markets served, years experience, brokerage, Zillow or Realtor.com profile URL

On submit:
- Save to Supabase `realtor_applications` table
- Send notification email to admin via Resend
- Show confirmation message

---

## EMAIL FLOWS — RESEND

### Email 1 — Welcome / Report Unlock
- **Trigger:** Email gate form submission
- **To:** User email
- **Subject:** `Your HavenQuest report is ready, [firstName]`
- **Content:** Top 3 city names with scores, CTA button to full report, CTA to portal

### Email 2 — Realtor Introduction
- **Trigger:** User clicks "Call" or "Visit Website" on a RealtorCard
- **To:** User email
- **Subject:** `Your matched realtors in [City], [firstName]`
- **Content:** Realtor cards with contact details, tips for first conversation

### Email 3 — New Lead Notification
- **Trigger:** Same event as Email 2
- **To:** Admin notification email (use RESEND_ADMIN_EMAIL env var)
- **Subject:** `New HavenQuest lead — [City] — [timeline]`
- **Content:** User firstName, income range, household, housing preference, timeline, mustHaves, match score for their city

### Email 4 — Realtor Application
- **Trigger:** For-realtors form submission
- **To:** Admin notification email
- **Subject:** `New realtor application — [name] — [markets]`
- **Content:** All form fields

---

## SUPABASE SCHEMA

Run these SQL statements in Supabase SQL Editor:

```sql
-- Users
create table public.users (
  id uuid primary key default gen_random_uuid(),
  first_name text not null,
  email text unique not null,
  phone text,
  annual_income integer,
  household_size text,
  housing_preference text,
  moving_timeline text,
  must_haves text[],
  nice_to_haves text[],
  not_priorities text[],
  top_city_matches jsonb,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Leads (Zillow clicks and realtor contacts)
create table public.leads (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.users(id),
  city text not null,
  realtor_id text,
  event_type text default 'zillow_click',
  status text default 'new',
  created_at timestamp with time zone default now()
);

-- Realtor applications
create table public.realtor_applications (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text,
  markets text,
  years_experience integer,
  brokerage text,
  profile_url text,
  status text default 'pending',
  created_at timestamp with time zone default now()
);

-- Enable Row Level Security
alter table public.users enable row level security;
alter table public.leads enable row level security;
alter table public.realtor_applications enable row level security;

-- Allow inserts from anonymous users (for email gate)
create policy "Allow anonymous insert" on public.users
  for insert with check (true);

create policy "Allow anonymous insert" on public.leads
  for insert with check (true);

create policy "Allow anonymous insert" on public.realtor_applications
  for insert with check (true);
```

---

## SEO REQUIREMENTS

Every page must export metadata:

```typescript
export const metadata: Metadata = {
  title: 'Page Title | HavenQuest',
  description: 'Under 160 characters',
  openGraph: {
    title: 'Page Title',
    description: 'OG description',
    url: 'https://havenquest.co/page',
    siteName: 'HavenQuest',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Page Title',
    description: 'Twitter description',
  }
}
```

City pages: use `generateStaticParams()` to pre-generate at build time.

**Target keywords to include naturally in copy:**
- moving to Texas
- best cities to live in Texas
- Texas relocation guide
- where to live in Texas
- cost of living Texas cities

---

## PERFORMANCE REQUIREMENTS

- Lighthouse score 90+ on mobile
- First contentful paint under 2 seconds
- All images: Next.js `<Image>` component
- City pages: statically generated
- No cumulative layout shift
- Fonts: `next/font/google` for Inter

---

## CRITICAL BUILD RULES

1. **Data abstraction is non-negotiable.** Every data access goes through `/services/locationService.ts`. No component imports from `/data` directly.

2. **Location type is universal.** Every component displaying city data accepts a `Location` type. No component is city-specific. This enables Phase 2 neighborhood data without UI changes.

3. **TypeScript strict mode.** No `any` types. All interfaces in `/types/index.ts`.

4. **Priority selector hard limits.** Must Have max 3. Nice to Have max 5. Enforce in state logic. Not just visual.

5. **Affordability flag at 40%.** Monthly housing > 40% of monthly gross income triggers the warning. Informational tone. Not alarming. Not disqualifying.

6. **Email gate must write to Supabase before unlocking.** If write fails → show error → do not proceed.

7. **Mobile first.** Design for 390px viewport. Scale up. Never the reverse.

8. **Realtors are a separate section.** Visually distinct below the full report. Clear heading and separator. Never inline with match results.

9. **Zillow button on every city card.** Uses `generateZillowUrl()`. Opens new tab. Logs to Supabase leads table on click.

10. **No hardcoded credentials.** All keys in `.env.local` only.

11. **GitHub deployment.** Connect to `github.com/grandhavenpartnersllc-go/havenquest`. Auto-deploy on push to main. Vercel account: `grandhavenpartnersllc-go`.

12. **Methodology page linked in footer.** Transparency is a trust signal. Every page footer links to `/methodology`.

---

## PHASE 1 SCOPE

### Build now:
- Full landing page with two front doors
- Exploring Texas complete flow (Steps 1–7)
- Metro Mode flow (city level)
- Three-bucket priority selector with drag and drop
- Matching algorithm with affordability flag
- Teaser results with blur overlay
- Email gate with Supabase write
- Full city reports for top 3 matches
- Zillow listings deep link on every city report
- Static realtor cards from realtors.ts
- Starter portal with all sections
- Methodology page
- Realtor landing page with application form
- All Resend email flows
- SEO metadata on all pages
- Mobile responsive throughout
- Vercel deployment via GitHub

### Do NOT build (Phase 2+):
- Realtor self-service dashboard
- Stripe subscription payments
- Document center or file uploads
- Active buyer portal
- Automated lead bidding
- IDX native listings
- Neighborhood level data population
- Realtor performance scoring
- Admin dashboard
- Vendor or moving company marketplace
- User authentication beyond email capture + localStorage session

---

## DATA FILES

Three data files are provided. Place them exactly here:

```
/data/cities.ts       ← 20 Texas cities, all data
/data/realtors.ts     ← 9 vetted realtors, helper functions
/data/index.ts        ← barrel exports, metro groupings
```

**Do not modify these files.** Import from them via locationService.ts only.

---

*HavenQuest Build Brief v1.0 — Phase 1 MVP — May 2026*
*All data verified. All sources documented. Build to this standard.*
