# Build Brief — Unified Score Label System
**Project:** HavenQuest
**Date:** June 2, 2026
**Status:** PENDING — Ready for Claude Code
**Priority:** High — consistency and honesty
**Prepared by:** Claude (COO)
**Approved by:** Craig Asbach

---

## Overview

Replace all score label systems across the platform with one unified 5-tier standard. Currently CityMatchCard, CompareModal, and FullReport each use different label systems — causing contradictions like "Fair" vs "Good Match" for the same score on the same city.

One standard. Every component. Identical thresholds and labels.

---

## Approved Score Label Thresholds (LOCKED)

```typescript
function getScoreLabel(score: number): { label: string; color: string; bg: string } {
  if (score >= 88) return { label: 'Exceptional Match', color: '#2D7D4E', bg: '#E8F5EE' }
  if (score >= 78) return { label: 'Excellent Match',  color: '#1A6B3C', bg: '#F0FAF4' }
  if (score >= 67) return { label: 'Strong Match',     color: '#B8912A', bg: 'rgba(184,145,42,0.12)' }
  if (score >= 55) return { label: 'Good Match',       color: '#7A6420', bg: 'rgba(184,145,42,0.08)' }
  return               { label: 'Potential Match',  color: '#6B7280', bg: '#F3F4F6' }
}
```

These thresholds are final. Do not adjust them. Apply identically in every file below.

---

## Files to Change

### File 1 — components/results/CityMatchCard.tsx

Find the score-to-label helper around line 22. It currently has a label system ending with `label: 'Fair'` as the lowest tier.

Replace the entire helper function with `getScoreLabel` above using the locked thresholds.

---

### File 2 — components/results/CompareModal.tsx

Find the score-to-label helper around line 56. It currently has a label system ending with `label: 'Fair'` as the lowest tier.

Replace the entire helper function with `getScoreLabel` above using the locked thresholds.

---

### File 3 — components/results/FullReport.tsx

Find the inline score label logic rendered below the ScoreGauge component. Currently renders the qualitative label with inline ternary logic.

Replace the inline ternary with a call to `getScoreLabel(matchScore)` using the locked thresholds. Apply the returned label, color, and bg values to the label span.

---

### File 4 — components/shared/ScoreGauge.tsx

Check if ScoreGauge has any label logic of its own. If it does, replace with the same locked thresholds. If it does not generate labels independently, leave it unchanged.

---

## Acceptance Criteria

- [ ] CityMatchCard score label uses locked 5-tier system — no "Fair" label anywhere
- [ ] CompareModal score label uses locked 5-tier system — no "Fair" label anywhere
- [ ] FullReport score label uses locked 5-tier system
- [ ] ScoreGauge checked — updated if needed
- [ ] A score of 57 shows "Good Match" in every component
- [ ] A score of 88+ shows "Exceptional Match" in every component
- [ ] Colors and backgrounds match exactly across all components
- [ ] tsc --noEmit passes clean
- [ ] No any types introduced
- [ ] No logic or layout changes — label system only

---

## What Is NOT Changing

- The score number itself — never changes
- The scoring algorithm — never changes
- Any layout, card structure, or visual design
- Any copy outside of the score label text

---

*Brief prepared by Claude (COO) — June 2, 2026. Approved by Craig Asbach. Thresholds are locked — do not adjust.*
