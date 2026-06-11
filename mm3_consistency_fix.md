# Fix Brief — MM2 / MM3 City Match Inconsistency
**Date:** June 3, 2026
**For:** Claude Code
**Type:** Execute — make all changes described below
**Priority:** P1 — creates user-facing data contradiction
**Report back:** Confirm each fix complete, describe what changed

---

## Root Cause Summary

MM2 and MM3 use completely different data sources, city pools, and result limits:

- MM2 scores against all 101 Texas cities, returns top 3, uses a frozen sessionStorage snapshot
- MM3 scores against one metro only (e.g. Austin ~15 cities), returns top 5, re-runs live on every render

Result: Bee Cave ranks outside the global top 3 but becomes #1 when the pool narrows to Austin metro only. The user sees different top picks in MM2 and MM3 with no explanation — this breaks trust in the algorithm.

---

## The Fix — Two Changes

### Fix 1 — MM3Discover.tsx — Anchor the ranked list to the user's matched metro, not an arbitrary default

**Current behavior:**
MM3 defaults to showing all cities in whichever metro the user selects via tab. The starting metro tab is not determined by the user's actual top match — it may default to Austin regardless of where the user's MM2 results actually pointed.

**Fix:**
On initial load of MM3, set `selectedMetro` to the metro of the user's #1 MM2 match (the Top Pick city). This ensures MM3 opens showing the metro that matters most to this specific user, not a generic default.

To do this:
- Pass the `matches` prop into MM3Discover (it may already be available via StarterPortal → MileMarkerContent)
- On mount, read `matches[0].location.metroUsed` (or equivalent field) to determine the top match metro
- Set `selectedMetro` to that metro on initial render

This doesn't change the scoring — it just ensures MM3 opens in the right context for this user.

---

### Fix 2 — MM3Discover.tsx — Add a "Your Global Top Matches" anchor panel above the metro explorer

**The core problem:** MM3 re-runs the algorithm against a metro-scoped pool, which produces different results than the global ranking. There is no way to make these agree without fundamentally changing what MM3 does (which is intentional — it's a sandbox explorer).

**The right fix is not to suppress MM3's behavior — it's to anchor the user to their saved global results so the metro explorer is clearly additive context, not a contradiction.**

Add a read-only panel at the top of MM3 that displays the user's saved top 3 matches from MM2 (the `matches` prop from StarterPortal). Label it clearly so the user understands what they're looking at.

**Panel content:**
```
YOUR TOP MATCHES — from your full Texas assessment

#1  Round Rock      66%  Austin, TX metro area
#2  San Marcos      66%  Austin, TX metro area  
#3  Cedar Park      65%  Austin, TX metro area

These are your top matches across all 101 Texas communities.
Use the explorer below to dig deeper into any metro.
```

Style this panel consistently with the existing MM3 UI — use the same card/surface styling, same font weights, same gold accent color. Keep it compact — this is an anchor reference, not a repeat of MM2.

**Implementation:**
- Accept `matches: CityMatch[]` as a prop in MM3Discover (or read from the prop already passed)
- Render the top 3 as a simple ranked list above the metro tab selector
- No interaction needed — read only, no "Choose" buttons, no "Learn more" links
- Add a single line of explanatory copy below the list (see above)

---

## What NOT to Change

- Do not change MM3's live scoring behavior — the metro explorer re-running the algorithm is intentional and useful
- Do not change MM2 or SavedMatches.tsx — those are correct
- Do not change the result limit in either component
- Do not change how top_city_matches is written to Supabase

---

## Acceptance Criteria

- [ ] MM3 opens with the metro tab set to the user's #1 top match metro (not a hardcoded default)
- [ ] MM3 shows a "Your Top Matches" anchor panel above the metro explorer displaying the user's saved MM2 top 3
- [ ] The anchor panel is clearly labeled and includes explanatory copy distinguishing global matches from metro explorer results
- [ ] The metro explorer below continues to function exactly as before — live scoring, sandbox, metro tabs all work
- [ ] No regression on MM2 — SavedMatches still shows the same top 3
- [ ] Tested with Craig's test account — MM3 opens in Austin metro (matches the test user's top match metro), anchor panel shows Round Rock / San Marcos / Cedar Park

---

## Files to Change

- `components/portal/milemarkers/MM3Discover.tsx` — add anchor panel, fix default metro selection
- Any parent component if `matches` prop needs to be threaded through to MM3Discover

Report back: list each file changed, describe exactly what was changed, confirm acceptance criteria tested.
