# HavenQuest — Texas Insider: Rename & Copy Update Brief
**Date:** June 6, 2026  
**Prepared by:** Claude (COO)  
**Executed by:** Claude Code  
**Branch:** main  

---

## Overview

Four changes to the Texas market profiles section. No design changes — copy, navigation, URL, and metadata only.

---

## Change 1 — Rename URL route

Rename the directory:
```
app/texas/market-profiles/
```
To:
```
app/texas/texas-insider/
```

This changes the live URLs:
```
/texas/market-profiles        → /texas/texas-insider
/texas/market-profiles/austin → /texas/texas-insider/austin
/texas/market-profiles/dfw    → /texas/texas-insider/dfw
/texas/market-profiles/houston → /texas/texas-insider/houston
/texas/market-profiles/san-antonio → /texas/texas-insider/san-antonio
/texas/market-profiles/state  → /texas/texas-insider/state
```

Add redirects in `next.config.js` for all old URLs pointing to the new ones so any existing links don't break:
```js
{
  source: '/texas/market-profiles',
  destination: '/texas/texas-insider',
  permanent: true,
},
{
  source: '/texas/market-profiles/:path*',
  destination: '/texas/texas-insider/:path*',
  permanent: true,
},
```

---

## Change 2 — Update navigation link

Find the public site navigation component (used on homepage, /about, /begin, and the Texas pages).

Change the nav link label:
- **From:** "Texas Intel"
- **To:** "Texas Insider"

Link target remains: `/texas/texas-insider`

---

## Change 3 — Update hub page headline and subhead

File: `app/texas/texas-insider/page.tsx` (after rename)

**Eyebrow label** — change from:
```
TEXAS MARKET INTELLIGENCE
```
To:
```
TEXAS INSIDER
```

**H1 headline** — change from:
```
Everything you need to know about Texas — before you move here.
```
To:
```
Your inside look at Texas — the markets, the communities, and the Lone Star lifestyle.
```

**Subhead paragraph** — change from:
```
Real data. Honest assessments. Everything you need to understand the state, the markets, and what homeownership actually looks like — before you commit to anything.
```
To:
```
Real data. Honest assessments. The intelligence you need to understand Texas markets, communities, and what life here actually looks like — before you commit to anything.
```

---

## Change 4 — Move data disclosure line to bottom of page

The current meta line sits directly below the subhead in the hero section:
```
Updated quarterly · Q2 2026 · Sources: TRERC · Redfin · Zillow · Dallas Fed · U.S. Census
```

**Remove it from the hero section entirely.**

**Add it to the bottom of the page** in a footer strip above the existing footer, styled as small muted text:
```
Data updated quarterly · Q2 2026 · Sources: TRERC, Redfin, Zillow, Dallas Fed, U.S. Census Bureau
```

Same styling as the existing footer strip at the bottom of the page.

---

## Update SEO Metadata

Update the metadata for the hub page:
```typescript
export const metadata = {
  title: 'Texas Insider | HavenQuest',
  description: 'Your inside look at Texas — the markets, the communities, and the Lone Star lifestyle. Real data and honest assessments on Texas real estate, homeowner laws, and what life here actually looks like.',
}
```

---

## Final Step — Commit and Deploy

After all changes are complete, tsc clean, and next build passes:

```
git add -A
git commit -m "feat: rename Texas Intel to Texas Insider — new URL, nav label, headline, subhead, data disclosure moved to footer"
git push origin main
```

Confirm push succeeded and Vercel deployment triggered. Report back to Claude chat when complete.
