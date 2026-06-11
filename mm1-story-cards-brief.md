# Build Brief — MM1 Story Cards with City Narratives & Image Placeholders
**Project:** HavenQuest
**Date:** June 1, 2026
**Status:** PENDING — Ready for Claude Code
**Priority:** High — MM1 visual and narrative experience
**Prepared by:** Claude (COO)
**Approved by:** Craig Asbach

---

## Overview

Replace the current horizontal city cards in MM1 — Welcome with full-width story cards. Each card is magazine-style — image left, narrative story right. No data, no scores, no View Full Report button. This is introduction, not analysis. MM2 — Discover handles the data.

Three changes:
1. Add city narratives to city data
2. Add image field to city data (Texas flag placeholder for all cities now)
3. Redesign MM1 city cards as story cards

---

## Change 1 — Add to types/index.ts

Add two optional fields to the Location interface:

```typescript
export interface Location {
  // ... all existing fields ...
  cityNarrative?: string        // 2-3 sentence story about the city
  cityImageUrl?: string         // URL to city image — defaults to Texas flag
}
```

---

## Change 2 — Add narratives and image placeholder to data/cities.ts

Add `cityNarrative` and `cityImageUrl` to the following 20 cities. All other cities get no narrative (undefined) and no image (undefined — fallback handled in component).

**Texas flag placeholder URL for all cities:**
```
/images/texas-flag.jpg
```

This file does not exist yet — Claude Code should create it by downloading a public domain Texas flag image OR create a simple SVG Texas flag at `/public/images/texas-flag.svg`.

**Add to each of the 20 cities — cityImageUrl: '/images/texas-flag.svg' and cityNarrative as follows:**

### Austin
```
cityNarrative: "Austin is where ambition meets authenticity. As the live music capital of the world and home to the University of Texas, it draws creative professionals, tech workers, and entrepreneurs from across the country. The city's energy is unmistakable — from the buzzing South Congress corridor to the trail-lined shores of Lady Bird Lake.",
cityImageUrl: '/images/texas-flag.svg',
```

### Dallas
```
cityNarrative: "Dallas is a city that means business — and does it with style. Home to more Fortune 500 headquarters than almost any other American city, it offers world-class career opportunities alongside a cultural scene that surprises first-time visitors. The arts district rivals any in the country, the restaurant scene is exceptional, and the neighborhoods range from historic and walkable to sprawling and suburban.",
cityImageUrl: '/images/texas-flag.svg',
```

### Houston
```
cityNarrative: "Houston is the most diverse city in America, and it wears that distinction proudly. From the Texas Medical Center — the largest in the world — to the NASA Johnson Space Center, to a culinary scene that reflects over 145 languages spoken by its residents, Houston offers depth that most cities simply can't match. It's a city that doesn't just accept people from everywhere — it's built by them.",
cityImageUrl: '/images/texas-flag.svg',
```

### San Antonio
```
cityNarrative: "San Antonio is Texas with its roots showing. A thriving military community, a booming medical sector, and a cost of living that makes homeownership genuinely achievable combine to make it one of the most livable large cities in the state. The River Walk at sunset is reason enough to visit. The affordability is reason enough to stay.",
cityImageUrl: '/images/texas-flag.svg',
```

### The Woodlands
```
cityNarrative: "The Woodlands didn't become one of the most consistently ranked master-planned communities in America by accident. Built around 28,000 acres of forest preserve, it offers the rare combination of top-tier schools, corporate headquarters, walkable town center living, and access to nature — all within 30 miles of downtown Houston. Families who move here tend to stay.",
cityImageUrl: '/images/texas-flag.svg',
```

### Plano
```
cityNarrative: "Plano is quietly one of the best-run cities in Texas. With a AAA bond rating, low crime, exceptional schools, and a corporate corridor that includes Toyota, JPMorgan Chase, and Liberty Mutual, it attracts professionals who want stability and opportunity in the same zip code. The dining scene has exploded in recent years, and Legacy West has become one of the premier mixed-use destinations in North Texas.",
cityImageUrl: '/images/texas-flag.svg',
```

### Frisco
```
cityNarrative: "Frisco has grown faster than almost any city in America over the past two decades — and the infrastructure has kept pace. Ranked among the safest large cities in Texas, home to the Dallas Cowboys world headquarters, and served by a Frisco ISD that consistently earns state recognition, it's become the aspirational address for families relocating to the DFW metroplex.",
cityImageUrl: '/images/texas-flag.svg',
```

### Round Rock
```
cityNarrative: "Round Rock sits at the sweet spot between Austin's energy and suburban calm. Home to Dell's global headquarters and a thriving tech corridor, it offers genuine career opportunity without Austin's price tag. The school district is strong, the neighborhoods are well-maintained, and the Old Settlers Park system gives families room to breathe. It's the kind of city where people plan to stay two years and end up raising their children.",
cityImageUrl: '/images/texas-flag.svg',
```

### Cedar Park
```
cityNarrative: "Cedar Park has become one of the most sought-after addresses in the Austin metro — and for good reason. Leander ISD serves the community with consistently high ratings, the area is safe, and the proximity to the 183A toll road makes commuting to Austin genuinely manageable. New development has brought restaurants, retail, and entertainment that make Cedar Park feel complete rather than just convenient.",
cityImageUrl: '/images/texas-flag.svg',
```

### Georgetown
```
cityNarrative: "Georgetown is one of the fastest-growing cities in America, and its appeal is immediately obvious. The historic downtown square is among the most charming in Texas, and the Williamson County school system and affordability relative to closer-in Austin suburbs make it increasingly compelling for families seeking space without sacrificing quality.",
cityImageUrl: '/images/texas-flag.svg',
```

### McKinney
```
cityNarrative: "McKinney has been named the best place to live in America — and it shows. The historic downtown is walkable, locally owned, and genuinely charming in a way that planned communities rarely achieve. The school district is strong, the streets are clean, and the growth has been managed carefully enough that the character hasn't been sacrificed.",
cityImageUrl: '/images/texas-flag.svg',
```

### Sugar Land
```
cityNarrative: "Sugar Land is Fort Bend County's crown jewel — a master-planned community that has matured into a fully self-sufficient city. The diversity is exceptional, the schools are consistently high-performing, and the Imperial District has brought a walkable, upscale town center to what was once purely suburban. For families relocating from coastal cities, Sugar Land often feels the most familiar — and the most welcoming.",
cityImageUrl: '/images/texas-flag.svg',
```

### Kyle
```
cityNarrative: "Kyle is where the Austin metro's affordability story actually holds up. Situated along I-35 between Austin and San Antonio, it offers genuinely attainable homeownership for families who want proximity to Austin's job market without Austin's prices. Getting in now means getting in before prices follow the demand.",
cityImageUrl: '/images/texas-flag.svg',
```

### New Braunfels
```
cityNarrative: "New Braunfels sits perfectly between Austin and San Antonio — and it has quietly become one of the most desirable small cities in Texas. The Comal River and Guadalupe River draw visitors from across the state, but it's the Comal ISD, the German heritage downtown, and the extraordinary growth in quality housing that draw families to stay.",
cityImageUrl: '/images/texas-flag.svg',
```

### Leander
```
cityNarrative: "Leander is one of the Austin metro's most exciting growth stories. The arrival of the MetroRail line connecting it directly to downtown Austin transformed it from a distant suburb into a genuine commuter community. Land is still available, prices are still reasonable relative to closer-in Austin, and the trajectory is clearly upward.",
cityImageUrl: '/images/texas-flag.svg',
```

### Pflugerville
```
cityNarrative: "Pflugerville offers Austin metro access at a price point that still makes financial sense for young families. The Lake Pflugerville park system anchors a growing outdoor recreation culture, the schools are solid, and the proximity to major employers along the 130 toll road makes the commute legitimate. It's a community in transition — still affordable, but gaining the amenities that follow population growth.",
cityImageUrl: '/images/texas-flag.svg',
```

### Fort Worth
```
cityNarrative: "Fort Worth is the surprise of the Texas metroplex — a city with genuine cowboy heritage, a world-class cultural district, and a cost of living that makes Dallas look expensive. The Bass Performance Hall, the Kimbell Art Museum, and the Stockyards National Historic District coexist in a city that also has one of the most ambitious urban park systems in the state.",
cityImageUrl: '/images/texas-flag.svg',
```

### Waco
```
cityNarrative: "Waco has had a remarkable decade. The Magnolia brand has brought national attention, but the city's transformation goes deeper. Baylor University anchors a growing innovation economy, downtown has seen genuine reinvestment, and the cost of living remains among the most affordable of any mid-sized Texas city. For remote workers and lifestyle-first buyers, Waco offers something rare — a city on the rise with prices that haven't caught up yet.",
cityImageUrl: '/images/texas-flag.svg',
```

### Corpus Christi
```
cityNarrative: "Corpus Christi is Texas's coastal city — and it makes the most of it. The Gulf of Mexico is a daily presence, from the morning pelicans to the evening sunsets over the bay. For buyers seeking waterfront lifestyle at a fraction of what coastal living costs in other states, Corpus Christi is worth serious consideration.",
cityImageUrl: '/images/texas-flag.svg',
```

### San Marcos
```
cityNarrative: "San Marcos is where the San Marcos River runs crystal clear through the center of town — and that river defines the city's character. Home to Texas State University, it has a youthful energy and a progressive outdoor culture. The affordability is real, the location between Austin and San Antonio is genuinely strategic, and the quality of life for outdoor enthusiasts is exceptional.",
cityImageUrl: '/images/texas-flag.svg',
```

**Generic fallback narrative (for cities with no cityNarrative):**
```typescript
const FALLBACK_NARRATIVE = "This community matched your priorities and financial profile. Your full report in Discover includes detailed lifestyle scores, school data, affordability breakdown, and matched realtors to help you evaluate this city in depth."
```

---

## Change 3 — Redesign MM1 City Cards as Story Cards

Replace the current `HorizontalCityCard` component inside `MM1Explore.tsx` with a new `StoryCityCard` component.

### Layout

**Desktop:** Full-width card, horizontal — image left (40% width), story right (60% width)
**Mobile:** Stacked — image on top (full width, fixed height), story below

```tsx
<div className="space-y-4 mb-8">
  {matches.map((match, i) => (
    <StoryCityCard
      key={match.location.id}
      match={match}
      rank={i}
    />
  ))}
</div>
```

### StoryCityCard component

```tsx
function StoryCityCard({ match, rank }: { match: CityMatch; rank: number }) {
  const RANK_LABELS = ['Top Pick', 'Runner-Up', 'Strong Alt']
  const imageUrl = match.location.cityImageUrl ?? '/images/texas-flag.svg'
  const narrative = match.location.cityNarrative ?? FALLBACK_NARRATIVE

  return (
    <div
      className="rounded-2xl overflow-hidden flex flex-col sm:flex-row"
      style={{ backgroundColor: CARD_BG, boxShadow: CARD_SHADOW }}
    >
      {/* Image — left on desktop, top on mobile */}
      <div
        className="sm:w-2/5 h-48 sm:h-auto relative shrink-0"
        style={{ minHeight: '200px' }}
      >
        <img
          src={imageUrl}
          alt={match.location.name}
          className="w-full h-full object-cover"
        />
        {/* Rank badge over image */}
        <div
          className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase"
          style={{
            backgroundColor: rank === 0 ? GOLD : 'rgba(0,0,0,0.55)',
            color: rank === 0 ? '#16120D' : '#FFFFFF',
            letterSpacing: '0.12em',
            backdropFilter: 'blur(4px)',
          }}
        >
          {RANK_LABELS[rank]}
        </div>
        {/* Match score badge */}
        <div
          className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-[10px] font-bold"
          style={{
            backgroundColor: 'rgba(0,0,0,0.55)',
            color: '#FFFFFF',
            backdropFilter: 'blur(4px)',
          }}
        >
          {match.matchScore}% match
        </div>
      </div>

      {/* Story content — right on desktop, bottom on mobile */}
      <div className="flex-1 p-6 flex flex-col justify-between">
        <div>
          {/* City header */}
          <h3
            className="text-[20px] font-bold tracking-tight mb-0.5"
            style={{ color: WARM_DARK }}
          >
            {match.location.name}
          </h3>
          <p className="text-xs font-medium mb-4" style={{ color: '#1A5FA8' }}>
            {match.location.metroUsed} · {match.location.county} County, TX
          </p>

          {/* Narrative */}
          <p
            className="text-sm leading-relaxed"
            style={{ color: '#4B5563' }}
          >
            {narrative}
          </p>
        </div>

        {/* Footer — est. cost only, no button */}
        <div className="mt-4 pt-4" style={{ borderTop: '1px solid #F0EDE6' }}>
          <p className="text-xs" style={{ color: '#9A8E82' }}>
            Est. {formatCurrency(match.estimatedMonthlyTotal)}/mo all-in ·{' '}
            <span style={{ color: '#9A8E82' }}>
              Full reports available in Discover
            </span>
          </p>
        </div>
      </div>
    </div>
  )
}
```

### Texas flag SVG

Create `/public/images/texas-flag.svg` — a simple clean Texas flag SVG. Use this:

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 200">
  <!-- Blue vertical stripe -->
  <rect width="100" height="200" fill="#002868"/>
  <!-- Red top stripe -->
  <rect x="100" y="0" width="200" height="100" fill="#BF0A30"/>
  <!-- White bottom stripe -->
  <rect x="100" y="100" width="200" height="100" fill="#FFFFFF"/>
  <!-- White star -->
  <polygon points="50,30 61,65 95,65 68,85 79,120 50,100 21,120 32,85 5,65 39,65"
           fill="#FFFFFF"/>
</svg>
```

---

## Files to Modify

| File | Change |
|---|---|
| `types/index.ts` | Add `cityNarrative?: string` and `cityImageUrl?: string` to Location |
| `data/cities.ts` | Add narratives and image URLs to 20 cities |
| `components/portal/milemarkers/MM1Explore.tsx` | Replace HorizontalCityCard with StoryCityCard |
| `public/images/texas-flag.svg` | CREATE — Texas flag SVG |

---

## Acceptance Criteria

- [ ] `cityNarrative` and `cityImageUrl` added to Location interface as optional fields
- [ ] All 20 cities have narrative text in data/cities.ts
- [ ] All 20 cities have `cityImageUrl: '/images/texas-flag.svg'`
- [ ] `/public/images/texas-flag.svg` exists and renders correctly
- [ ] MM1 city cards are full-width story cards — no data scores, no bars
- [ ] Each card shows image left (desktop) / image top (mobile)
- [ ] Rank badge overlays image top-left
- [ ] Match score badge overlays image top-right
- [ ] City name, metro, county render in story section
- [ ] Narrative text renders — city-specific for top 20, fallback for others
- [ ] Footer shows estimated monthly cost and "Full reports available in Discover"
- [ ] NO "View Full Reports" button on story cards
- [ ] NO score bars or lifestyle category data on story cards
- [ ] MM2 — Discover completely unchanged
- [ ] tsc --noEmit passes clean
- [ ] No any types

---

## Phase 2 Note (do not build now)

When dynamic narrative generation is added:
- Check if `location.cityNarrative` exists
- If yes → use it
- If no → call Anthropic API with city data + user profile → generate narrative → save to Supabase city record → return narrative
- Every subsequent user gets the cached Supabase version

Add a `// TODO: Phase 2 — dynamic narrative generation via Anthropic API` comment in the component where the fallback is used.

---

*Brief prepared by Claude (COO) — June 1, 2026. Approved by Craig Asbach.*
