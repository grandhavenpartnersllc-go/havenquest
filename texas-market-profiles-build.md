# HavenQuest — Texas Market Profiles: Web Pages Build Brief
**Date:** June 6, 2026  
**Prepared by:** Claude (COO)  
**Executed by:** Claude Code  
**Branch:** main  

---

## Overview

Build a public-facing Texas Market Intelligence section on havenquest.co. This is a magazine-style editorial hub with a landing/hub page and six individual profile pages. All pages are public — no authentication required. The design is luxury magazine: white, editorial, refined, data-rich, with lifestyle photography throughout.

This is a franchise prototype. When Florida, Tennessee, and other states are added, they follow the identical URL structure and page template with state-specific content swapped in.

---

## URL Structure

```
/texas/market-profiles                    ← Hub page (all markets)
/texas/market-profiles/state              ← Texas statewide profile
/texas/market-profiles/austin             ← Austin metro profile
/texas/market-profiles/dfw                ← Dallas-Fort Worth metro profile
/texas/market-profiles/houston            ← Houston metro profile
/texas/market-profiles/san-antonio        ← San Antonio metro profile
```

Create these as Next.js App Router pages under:
```
app/texas/market-profiles/page.tsx
app/texas/market-profiles/state/page.tsx
app/texas/market-profiles/austin/page.tsx
app/texas/market-profiles/dfw/page.tsx
app/texas/market-profiles/houston/page.tsx
app/texas/market-profiles/san-antonio/page.tsx
```

All pages are server components with `export const metadata` for SEO. No authentication wrapper. No portal layout — these use the public site layout (same nav/footer as havenquest.co homepage).

---

## Design System

### Brand Colors
```css
--gold: #C9A84C
--gold-light: #FAEEDA
--gold-bg: #FDFAF4
--dark: #1A1A1A
--warm-gray: #6B6560
--border: #D4C5A9
--cream: #FAF8F4
```

### Typography
- Use Google Fonts: **Playfair Display** (serif) for headlines and pull quotes — import via next/font or Google Fonts CDN
- Body text: system sans-serif stack or Tailwind default
- Section eyebrows: 10-11px, letter-spacing: 0.15em, uppercase, gold color
- Headlines: Playfair Display, medium weight, dark color
- Body prose: 14px, line-height 1.85, muted color

### Aesthetic Direction
Luxury editorial magazine — think Architectural Digest meets WSJ Weekend. White backgrounds, generous whitespace, gold accents, serif display type, photography-forward. Data presented in clean bordered cards woven into editorial prose. Not a dashboard, not a brochure — a feature article you'd pay to read.

---

## Page 1 — Hub Page (`/texas/market-profiles`)

### Layout

**Navigation:** Standard havenquest.co public nav. Add "Texas Intel" as a nav link pointing to `/texas/market-profiles`.

**Hero section:**
- Full-width, white background
- Eyebrow: "TEXAS MARKET INTELLIGENCE" (gold, uppercase, small tracking)
- Headline (Playfair Display): "Everything you need to know about Texas — before you move here."
- Subhead: "Real data. Honest assessments. Everything you need to understand the state, the markets, and what homeownership actually looks like — before you commit to anything."
- Meta row: "Updated quarterly · Q2 2026 · Sources: TRERC · Redfin · Zillow · Dallas Fed · U.S. Census"
- Thin gold rule below hero

**Metro card grid:**
- Layout: Featured state card (wider, left) + 2×2 grid of 4 metro cards (right)
- Each card: border-radius 12px, 0.5px border, hover state adds gold border
- State card (featured): gold border always visible, "Start here" badge, taller image area, longer description
- Metro cards: city aerial/cityscape image placeholder (use `/public/images/cities/` where available — austin-tx.jpg, dallas-tx.jpg, houston-tx.jpg, san-antonio-tx.jpg), metro name, one-line character description, median home price
- All cards link to their respective profile pages

**Card content:**

| Card | Image | Title | Description | Price |
|---|---|---|---|---|
| Texas Statewide | Texas map/aerial | Texas statewide | Laws, taxes, homeowner rights, economy, and the full picture on what it means to own a home in Texas | — |
| Austin | austin-tx.jpg | Austin | Tech · Hill Country · The city that reset | $460,000 median |
| Dallas-Fort Worth | dallas-tx.jpg | Dallas-Fort Worth | Corporate · Suburbs · #1 market to watch nationally | $375,000 median |
| Houston | houston-tx.jpg | Houston | Energy · Medical · Most affordable major Texas metro | $270,000 median |
| San Antonio | san-antonio-tx.jpg | San Antonio | Military · Value · Texas's most underrated market | $260,000 median |

**Footer strip:** "Data updated quarterly · Q2 2026 · HavenQuest Texas Market Intelligence"

---

## Page 2 — Individual Profile Pages (all 5 profiles follow this template)

Each profile page has two sections:

### Section A — Snapshot Card (always visible)

**Hero image:**
- Full-width, border-radius 12px, height 240px
- Use existing city image from `/public/images/cities/`
- Dark gradient overlay from bottom
- Overlay text: eyebrow (metro label + Q2 2026), large serif headline (city name), subtitle (tagline)
- Q2 2026 badge top-right

**Lede paragraph:**
- 15px italic serif, line-height 1.75
- 2-3 sentences — the one-line take expanded slightly
- Gold rule below

**6-stat grid (2 rows × 3 columns):**
- Stat cards: light gray background, label (10px muted), value (18px medium), sub-label (10px muted)
- Color coding: up/good = green (#3B6D11), down/caution = amber (#BA7517), neutral = dark

**2-column card row:**
- Left: Economy snapshot (4 key/value rows)
- Right: "Best fit for" — tag pills (gold for primary fits, neutral for secondary)

**Meta:** Sources line, update date

### Section B — Expand Trigger

- Gold-bordered card with gold background tint (#FDFAF4)
- Eyebrow: "FULL PROFILE"
- Title: "The complete [City] story — market analysis, neighborhoods, schools, and what homeownership really costs here"
- Subtitle: one sentence teaser
- Chevron icon right-aligned, rotates 180° when open
- On click: smooth max-height transition reveals full article below
- Implemented in a Client Component (`'use client'`) with useState for open/closed

### Section C — Full Article (hidden by default, expands on click)

The full article is long-form editorial prose with data callouts woven throughout. Structure for every profile:

1. **Opening prose** (2-3 paragraphs) — tells the market story in editorial voice
2. **Pull quote** — gold left border, italic, serif font, HavenQuest attribution
3. **Full market snapshot callout** — gold border card, 6-stat grid
4. **Full-width lifestyle image placeholder** — 160px height, warm gray background, descriptive caption placeholder
5. **Economy section** — prose paragraph + 6-stat callout grid
6. **Image pair** — 2-column lifestyle images with caption
7. **Neighborhood breakdown section** — prose intro + formatted table (Community / Character / Best for / Price tier)
8. **Schools section** — prose intro + ISD table (District / Coverage / Reputation with colored badges)
9. **Full-width lifestyle image** — second break image
10. **True cost of homeownership section** — prose + monthly cost callout (2×2 grid)
11. **Honest assessment** — two-column card: "Strong fit if..." and "May not be the right fit if..." with bullet lists
12. **Collapse button** — "Collapse full profile" with up chevron, scrolls back to trigger on click
13. **Footer strip** — sources, date, "Begin your Texas journey →" link to homepage

---

## Content for Each Profile

### Austin (`/texas/market-profiles/austin`)

**Snapshot:**
- Tagline: "The city that reset — and what that means for you"
- Lede: "Austin is the most corrected major Texas market right now — and for buyers, that's actually good news. Prices are down 16% from their 2022 peak, sellers are negotiating on more than half of all listings, and the city that felt out of reach three years ago has become genuinely accessible again. The long-term fundamentals haven't changed. The price tag finally did."
- Stats: Median $460K / -16.4% from peak / Buyer's market / 76 days on market / No state income tax / $140K homestead exemption
- Economy: Jobs added 28,500 / Median HH income $109,000 / Property tax 1.8-2.2% / To own comfortably $90,000+
- Best fit: Tech workers, Remote workers, School-priority families, Culture seekers, Outdoor lifestyle, Hill Country lovers

**Full article content:** Use the full Austin Metro Profile from Notion (documented in Intelligence & Market Data). Key sections: market correction story, economy & jobs, property tax + homestead exemption explainer, neighborhood breakdown table (Round Rock, Cedar Park, Georgetown, Westlake Hills, Bee Cave/Lakeway, East Austin, Kyle/Buda), ISD table (Eanes, Lake Travis, Leander, Round Rock, Georgetown, Dripping Springs), true cost scenario ($420K, 20% down, 6.75%, 30yr), honest assessment.

**Image:** Use `austin-tx.jpg` for hero. Lifestyle image placeholders: "Austin neighborhood street scene", "Barton Springs or community park", "Texas Hill Country landscape"

---

### Dallas-Fort Worth (`/texas/market-profiles/dfw`)

**Snapshot:**
- Tagline: "#1 real estate market to watch nationally — here's why"
- Lede: "Dallas-Fort Worth is the most resilient major Texas market in 2026 — named the #1 real estate market to watch nationally by PwC and the Urban Land Institute. It's correcting, not collapsing, and the economic diversity that drove a decade of explosive growth is still fully intact. DFW added more net new jobs than any other metro in America this decade. That doesn't happen to a market in trouble."
- Stats: Median $375K / -0.3% to -0.6% YoY / Rebalancing — buyer-favorable / 36 days on market / No state income tax / $140K homestead exemption
- Economy: 450K net new jobs this decade / AT&T $1.35B HQ campus / Google $40B AI investment / Dallas Fed projects 1.9% job growth 2026
- Best fit: Corporate relocators, Suburban families, Finance/tech workers, Frequent travelers, School-priority families

**Full article content:** Use DFW Metro Profile from Notion. Key sections: corporate relocation story, economic diversity (finance/tech/healthcare/logistics/defense), submarket breakdown table (Frisco, Plano, McKinney, Allen, Colleyville, Southlake, Grand Prairie/Arlington, Fort Worth, Celina/Prosper), ISD table (Carroll/Southlake, Frisco, Plano, Allen, McKinney, Lewisville, Keller), weather/tornado note, true cost scenario, honest assessment.

**Image:** Use `dallas-tx.jpg` for hero.

---

### Houston (`/texas/market-profiles/houston`)

**Snapshot:**
- Tagline: "The most accessible entry point into Texas homeownership"
- Lede: "Houston is the most affordable major metro in Texas — and in 2026, that affordability comes with a buyer's market on top of it. The most economically diversified city in the state, anchored by the world's largest medical complex, the #1 U.S. port by foreign tonnage, and a job market that doesn't rise and fall with oil prices the way it once did. For first-time buyers and budget-conscious relocators, no Texas city offers more."
- Stats: Median $270K / -2.8% YoY / Cooling — buyer-favorable / 64 days on market / 7% below national COL avg. / $140K homestead exemption
- Economy: Texas Medical Center (world's largest) / NASA Johnson Space Center / Port of Houston #1 US port / Energy, healthcare, aerospace, logistics
- Best fit: First-time buyers, Energy/healthcare/aerospace workers, Budget-conscious families, Investors, Master-planned community seekers

**Full article content:** Use Houston Metro Profile from Notion. Key sections: affordability story, economic diversification (energy/healthcare/aerospace/logistics/international), submarket breakdown (The Woodlands, Sugar Land, Katy, Cypress, Fulshear, Spring, The Heights, West University, River Oaks, Pearland, League City, Conroe), ISD table (Katy, Fort Bend, Conroe, Clear Creek, Cy-Fair, Houston ISD caveat), flood risk section (critical — FEMA flood maps, flood insurance), insurance cost note, true cost scenario, honest assessment.

**Image:** Use `houston-tx.jpg` for hero.

---

### San Antonio (`/texas/market-profiles/san-antonio`)

**Snapshot:**
- Tagline: "Texas's most underrated relocation destination"
- Lede: "San Antonio is the third-largest city in Texas with the smallest price tag among major metros. The median home runs at roughly half Austin's price. The cost of living sits 9% below the national average. And the city is adding around 30,000 new residents a year — the third-largest numeric gain of any U.S. city — almost entirely from domestic migration. People who move here almost never leave."
- Stats: Median $260K / -3.3% YoY / Buyer's market / 98 days on market / 9% below national COL avg. / $140K homestead exemption
- Economy: JBSA (largest US military installation) / USAA HQ / Valero Energy HQ / H-E-B HQ / Growing cybersecurity sector
- Best fit: Military families, Budget-conscious buyers, Retirees, Hill Country lifestyle seekers, Value relocators from Austin/DFW

**Full article content:** Use San Antonio Metro Profile from Notion. Key sections: affordability story vs. Austin, three growth drivers (population/value relocation/employment diversification), submarket breakdown (Alamo Heights, Olmos Park, Southtown, Stone Oak, Helotes, Alamo Ranch, Boerne, New Braunfels, Schertz/Cibolo, Converse, Fair Oaks Ranch), ISD table (Comal, Boerne, Alamo Heights, North East, Northside, Schertz-Cibolo-UC, SAISD caveat), military/VA loan section, Hill Country access note, true cost scenario, honest assessment.

**Image:** Use `san-antonio-tx.jpg` for hero.

---

### Texas Statewide (`/texas/market-profiles/state`)

**Snapshot:**
- Tagline: "The full picture — before you commit to anything"
- Lede: "Texas added more residents than any other state last year, reaching 31.7 million people. Its economy is the second largest in the country. There is no state income tax. And in 2026, a historic set of legislative changes gave homeowners the strongest protections and tax relief in state history. This is the profile that explains the rules of the game — so you can play it well."
- Stats: Population 31.7M / GDP $2.769T (2nd largest US) / No state income tax / 53 Fortune 500 companies / $140K homestead exemption / 1.2% population growth (2× national)
- Economy: Energy, tech, healthcare, finance, aerospace, manufacturing, government
- Best fit: Anyone relocating to Texas — read this first

**Full article content:** Use Texas Statewide Relocation & Homeownership Profile from Notion. Key sections: why Texas (population/economy/tax), legislative changes (foreign buyer ban, no capital gains tax, property tax relief, insurance reforms, squatter law, HOA crackdown), statewide housing market overview, true cost of homeownership in Texas, metro comparison table (Austin/DFW/Houston/San Antonio side by side), climate by region, infrastructure/ERCOT note, honest assessment.

---

## Navigation Integration

Add "Texas Intel" to the public site navigation (the same nav used on homepage, /about, /begin).

Link: `/texas/market-profiles`

Position: Between existing nav items — after "About" or as a standalone item. Match existing nav styling exactly.

---

## SEO Metadata

For each page, set metadata:

```typescript
// Hub page
export const metadata = {
  title: 'Texas Market Intelligence | HavenQuest',
  description: 'Real data and honest assessments on Texas real estate markets, homeowner laws, property taxes, and what it actually costs to own a home in Texas.',
}

// Austin
export const metadata = {
  title: 'Austin Texas Market Profile 2026 | HavenQuest',
  description: 'The complete Austin relocation guide — market conditions, neighborhoods, school districts, property taxes, and what homeownership really costs in 2026.',
}

// DFW
export const metadata = {
  title: 'Dallas-Fort Worth Market Profile 2026 | HavenQuest',
  description: 'The complete Dallas-Fort Worth relocation guide — market conditions, neighborhoods, school districts, and what homeownership costs in DFW in 2026.',
}

// Houston
export const metadata = {
  title: 'Houston Texas Market Profile 2026 | HavenQuest',
  description: 'The complete Houston relocation guide — market conditions, neighborhoods, flood risk, schools, and what homeownership really costs in Houston in 2026.',
}

// San Antonio
export const metadata = {
  title: 'San Antonio Market Profile 2026 | HavenQuest',
  description: 'The complete San Antonio relocation guide — market conditions, neighborhoods, military resources, Hill Country access, and homeownership costs in 2026.',
}

// State
export const metadata = {
  title: 'Texas Homeowner Guide 2026 | HavenQuest',
  description: 'Everything you need to know about Texas before you move — property taxes, homestead exemptions, new laws, housing market conditions, and the honest truth about living here.',
}
```

---

## Technical Notes

- All profile pages are static — no data fetching, no Supabase queries
- The expand/collapse section requires `'use client'` — create a `ProfileExpander` client component that wraps Section B + C
- Image paths use existing `/public/images/cities/` files where available
- Lifestyle image placeholders: use a styled div with warm gray background (#DDD8CF), centered icon, and descriptive caption text — these will be replaced with real photography
- The Playfair Display font: import via `next/font/google` in a layout file scoped to the `/texas` route, or add to the existing font configuration
- Mobile responsive: single column stack on mobile, two-column grid on desktop for stat grids and card pairs
- Do not use any portal layout components — these are fully public pages

---

## Final Step — Commit and Deploy

After all pages are built, tsc clean, and next build passes:

```
git add -A
git commit -m "feat: Texas Market Intelligence hub and 5 profile pages — public editorial market profiles with expand/collapse full article"
git push origin main
```

Confirm push succeeded and Vercel deployment triggered. Report back to Claude chat with the live URLs when complete.
