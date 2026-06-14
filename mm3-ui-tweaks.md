# MM3 — UI Tweaks Brief

**Date:** June 12, 2026
**File:** components/portal/milemarkers/MM3Discover.tsx
**Stack:** Next.js 14, TypeScript strict, TailwindCSS, CSS variables
**Deploy:** Vercel via GitHub origin/main — commit and push after completion

---

## Overview

Four visual refinements to the MM3 Discover workspace. No logic changes. Visual and layout only — except where the city lock button is being relocated (Tweak 3).

---

## Phase 0 — Audit

Read MM3Discover.tsx before touching anything. Identify:
1. The exact current layout of the Down Payment and Home Sale Proceeds fields
2. How the left financial panel and right city rankings panel are currently sized/structured
3. Where the city lock button currently renders
4. The max-width constraint on the Relocation Plan description paragraph

Report findings before proceeding.

---

## Tweak 1 — Down Payment and Home Sale Proceeds Side by Side

**Current:** Down Payment (label + range dropdown + exact amount field) stacks vertically, then Home Sale Proceeds (label + range dropdown + exact amount field) stacks below it. Both are full width.

**Change:** Place Down Payment and Home Sale Proceeds in a two-column grid on the same row.

Layout:
```
[ Down Payment          ] [ Home Sale Proceeds    ]
[ Range dropdown        ] [ Range dropdown        ]
[ Exact amount (opt.)   ] [ Exact amount (opt.)   ]
```

Each column takes 50% width with a gap between. Labels, dropdowns, and exact amount fields are all contained within their column. No other financial fields are affected.

---

## Tweak 2 — Fixed Height Alignment Between Panels

**Current:** The Financial Picture panel (left) and Live City Rankings panel (right) are variable height based on content. Their bottom edges don't align, making the layout feel uneven.

**Change:** Set a matching `minHeight` on both panels so their bottom edges always align. Use the taller panel's natural height as the reference — do not truncate content. Both panels should bottom-align cleanly so the commitment panel below them sits flush and consistent.

Implementation: Add `minHeight` or use flexbox `align-items: stretch` on the parent container that holds both panels side by side. Test with both a short and long city list to confirm alignment holds.

---

## Tweak 3 — City Lock Button Moved Into Rankings Panel

**Current:** The "Lock my city choices" button renders somewhere outside or below the Live City Rankings panel.

**Change:** Move the city lock button to the bottom of the Live City Rankings panel — same position and visual treatment as the "Lock my financials" button at the bottom of the Financial Picture panel.

The two lock buttons should be visually symmetric and parallel:
- Financial Picture panel bottom: "Lock my financials" button
- Live City Rankings panel bottom: "Lock my city choices" button

Both buttons sit at the bottom of their respective panels, same styling, same position. When locked, both show the green lock indicator in the same position.

Do not change any lock logic — only move the button's render location.

---

## Tweak 4 — Relocation Plan Description Full Width

**Current:** The descriptive paragraph under "YOUR RELOCATION PLAN" has a `maxWidth` constraint (approximately 680px) that limits it to roughly half the panel width.

**Change:** Remove the maxWidth constraint. The description paragraph should span the full width of the commitment panel. It reads better at full width and uses the available horizontal space properly.

The paragraph copy stays exactly the same. Only the width constraint changes.

---

## Phase 1 — Make All Four Changes

Apply all four tweaks in sequence. After each one verify it looks correct before moving to the next.

---

## Phase 2 — TypeScript Check, Commit, Deploy

```
npx tsc --noEmit && git add -A && git commit -m "fix: MM3 UI tweaks — financial fields side by side, panel height alignment, city lock button position, description full width" && git push origin main
```

Confirm Vercel deployment triggered. Report back when complete.

---

## Summary

| Tweak | Change |
|---|---|
| 1 | Down Payment + Home Sale Proceeds in two-column grid |
| 2 | Fixed minHeight on both panels so bottom edges align |
| 3 | City lock button moved to bottom of Rankings panel |
| 4 | Relocation Plan description paragraph — remove maxWidth, go full width |

**Report back to Claude chat after Phase 0 before making any changes.**
