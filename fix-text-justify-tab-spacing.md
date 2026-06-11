# Quick Fix — Text Justification & Navigator Tab Spacing
**Date:** June 2, 2026
**Files:** 3 files, CSS only — no logic changes

---

## Fix 1 — NavigatorTabs.tsx — Tighten tab spacing

Find the desktop tab container:
```
className="flex overflow-x-auto gap-1 pb-3 border-b"
```
Change `gap-1` to `gap-0.5`

Find the tab button:
```
className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all shrink-0"
```
Change `px-3` to `px-2`

---

## Fix 2 — MM1Explore.tsx — Justify narrative text

Find:
```
<p className="text-sm leading-relaxed max-w-2xl" style={{ color: '#6B7280' }}>
```
Change to:
```
<p className="text-sm leading-relaxed max-w-2xl text-justify" style={{ color: '#6B7280' }}>
```

Find:
```
<p className="text-sm leading-relaxed" style={{ color: '#4B5563' }}>
```
Change to:
```
<p className="text-sm leading-relaxed text-justify" style={{ color: '#4B5563' }}>
```

---

## Fix 3 — MM3Decide.tsx — Justify locked preview text

Find:
```
<p className="text-sm leading-relaxed max-w-xl" style={{ color: '#6B6259' }}>
```
Change to:
```
<p className="text-sm leading-relaxed max-w-xl text-justify" style={{ color: '#6B6259' }}>
```

---

## When done

Run tsc --noEmit, commit and push:
```
fix: justify narrative text and tighten Navigator tab spacing
```
