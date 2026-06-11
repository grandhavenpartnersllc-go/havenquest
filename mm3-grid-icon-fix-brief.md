# Build Brief — MM3 Priority Grid: Icon Fix & Circle Visibility
**Project:** HavenQuest
**Date:** June 2, 2026
**Status:** PENDING — Ready for Claude Code
**Priority:** High — MM3 UX is broken without this
**Prepared by:** Claude (COO)
**Approved by:** Craig Asbach

---

## Overview

Three fixes in MM3Discover.tsx only:

1. Replace emoji icons with Lucide icons from CATEGORY_ICONS — matching the rest of the build
2. Make empty column circles clearly visible — currently invisible against the cream background
3. Add instruction copy so users know the circles are clickable

---

## File to Change

`components/portal/milemarkers/MM3Discover.tsx` only.

---

## Change 1 — Import CATEGORY_ICONS

Add to the existing imports at the top of the file:

```typescript
import { CATEGORY_ICONS } from '../../../utils/categoryIcons'
```

---

## Change 2 — Replace Emoji Icons with Lucide Icons

In the priority grid rows, find the category label section:

```tsx
<span className="text-sm">{cat.icon}</span>
<span className="text-xs font-semibold" style={{ color: WARM_DARK }}>
  {cat.label}
</span>
```

Replace with:

```tsx
{(() => {
  const Icon = CATEGORY_ICONS[cat.key]
  return <Icon size={16} strokeWidth={1.5} style={{ color: WARM_DARK }} />
})()}
<span className="text-xs font-semibold" style={{ color: WARM_DARK }}>
  {cat.label}
</span>
```

Also replace the icon inside the active circle. Find:

```tsx
{isActive ? cat.icon : ''}
```

Replace with:

```tsx
{(() => {
  const Icon = CATEGORY_ICONS[cat.key]
  return isActive
    ? <Icon size={14} strokeWidth={2} style={{ color: '#FFFFFF' }} />
    : <span style={{ fontSize: '12px', color: '#C5BFB8', opacity: 0.6 }}>+</span>
})()}
```

---

## Change 3 — Make Empty Circles Visible

Find the empty circle button style. The current border line reads:

```
border: isActive ? 'none' : `1.5px dashed ${isFull ? '#FCA5A5' : '#E5E7EB'}`,
```

Replace with:

```
border: isActive ? 'none' : `2px dashed ${isFull ? '#FCA5A5' : '#C5BFB8'}`,
backgroundColor: isActive
  ? BUCKET_COLORS[bucket]
  : isFull
  ? 'transparent'
  : 'rgba(197,191,184,0.15)',
```

This gives empty circles a visible dashed border and a very light fill — clearly a click target without being distracting.

---

## Change 4 — Add Instruction Copy

Find the instruction paragraph below "Adjust Your Priorities". It currently reads something like:

```tsx
<p className="text-xs mb-5" style={{ color: '#9A8E82' }}>
  Slide each category to assign its importance. Rankings update instantly.
  Move right to increase priority — move left to decrease.
</p>
```

Replace with:

```tsx
<p className="text-xs mb-5" style={{ color: '#9A8E82' }}>
  Click any circle to move a category into that bucket. Rankings update instantly.
  Gold = Must Have · Green = Important · Gray = Nice to Have
</p>
```

---

## Acceptance Criteria

- [ ] All 13 category rows show Lucide icons — no emoji
- [ ] Active circle shows Lucide icon in white on colored background
- [ ] Empty circles are clearly visible — dashed border + light fill
- [ ] "+" placeholder visible in empty circles
- [ ] Instruction copy updated — says "Click any circle"
- [ ] tsc --noEmit passes clean
- [ ] No any types
- [ ] No other files changed

---

*Brief prepared by Claude (COO) — June 2, 2026. Approved by Craig Asbach.*
