# Build Brief — Locked Tab Text Width Fix & Preview Copy Rewrite
**Project:** HavenQuest
**Date:** June 2, 2026
**Status:** PENDING — Ready for Claude Code
**Priority:** High — portal UX and copy
**Prepared by:** Claude (COO)
**Approved by:** Craig Asbach

---

## Overview

Two changes:
1. Remove max-width constraints from paragraph text in MM1, MM3, and all locked tab previews so text fills the full card width
2. Rewrite all 7 locked tab preview paragraphs with warmer, more engaging, anticipation-building copy

---

## Fix 1 — Text Width

### Files to change:

**components/portal/milemarkers/MM1Explore.tsx**

Find:
```
<p className="text-sm leading-relaxed max-w-2xl text-justify" style={{ color: '#6B7280' }}>
```
Change to:
```
<p className="text-sm leading-relaxed w-full text-justify" style={{ color: '#6B7280' }}>
```

Find:
```
<p className="text-sm leading-relaxed text-justify" style={{ color: '#4B5563' }}>
```
This one has no max-width — verify it is filling full width. If not, add `w-full`.

**components/portal/milemarkers/MM3Decide.tsx**

Find:
```
<p className="text-sm leading-relaxed max-w-xl text-justify" style={{ color: '#6B6259' }}>
```
Change to:
```
<p className="text-sm leading-relaxed w-full text-justify" style={{ color: '#6B6259' }}>
```

**components/portal/milemarkers/MM4to10.tsx**

Find any paragraph with `max-w-` class on the preview description text.
Remove the `max-w-*` constraint and replace with `w-full` on all preview paragraphs.
This applies to ALL locked MileMarker previews (MM4 through MM10) so they are consistent.

---

## Fix 2 — Locked Tab Preview Copy Rewrite

### File: components/portal/milemarkers/MM4to10.tsx

Find the copy map keyed by MileMarker number. Replace the preview text for each MileMarker as follows:

---

**MM3 — Decide** (in MM3Decide.tsx):
```
"This is where you get behind the wheel and begin the journey with your destination in mind. Jump into our live sandbox — adjust your priorities, run the numbers, watch your city matches respond in real time. When something clicks and the direction feels right, you hit one button. Your plan becomes your foundation — not a contract, not a cage. Because the moment you're ready to move forward, your Market Director jumps in as your copilot and navigator. They ride shotgun with you through everything that comes next — and as you talk, new roads may open up that you hadn't even considered. The wheel stays in your hands. We just help you find the best route. Every great move starts somewhere. This is yours. And one day, it'll be the first chapter of your Journey Recap."
```

---

**MM4 — Connect:**
```
"You've done the hard work. Now someone who knows your market, has read your full report, and genuinely wants to help you get home is stepping into the picture. Your HavenQuest Market Director will reach out within 24 hours — and unlike most first conversations in real estate, this one won't start with 'so tell me about yourself.' They already know. This is where the journey gets personal."
```

---

**MM5 — Plan:**
```
"Your Market Director sits down with you — really sits down — and maps out your path forward. Timeline, financing, target city, target zone, must-haves in a home. By the end of this conversation you'll have a clear direction, a realistic plan, and someone who knows exactly what it's going to take to get you there. This is where scattered ideas become a real strategy."
```

---

**MM6 — Prepare:**
```
"This is where your move starts becoming real. Before you meet your Select Agent, your Market Director walks you through everything that needs to be in place — financing confirmed, insurance sorted, timeline locked. It sounds like a checklist. It feels like momentum. By the time you're introduced to your agent, you'll walk in knowing exactly what you can spend, when you want to close, and what your dream home actually looks like. No surprises. Just confidence."
```

---

**MM7 — Match:**
```
"Based on everything your Market Director now knows about you — your market, your budget, your non-negotiables — they hand-select three of the best agents in your target area. Not a directory. Not an algorithm. Three real professionals, chosen specifically for you, presented equally. You read the profiles. You choose who you want. Simple as that."
```

---

**MM8 — Engage:**
```
"This is the introduction you've been building toward. Your Market Director makes a warm, personal handoff to your chosen Select Agent — someone who already knows your story, your budget, and exactly what you're looking for before you ever speak. No re-explaining. No starting from scratch. Just a knowledgeable professional ready to find your home from day one."
```

---

**MM9 — Contract:**
```
"You found it. The right home, in the right place, at the right price. Going under contract is one of the most exciting — and yes, occasionally nerve-wracking — moments in the entire journey. Your Select Agent handles the strategy and negotiation. Your Market Director is still right there if you need them. The finish line is in sight and your whole team is with you."
```

---

**MM10 — Home:**
```
"This is what all of it was for. The quiz, the sandbox, the strategy session, the showings, the offer, the counter, the inspection, the appraisal — all of it led here. You're home. HavenQuest celebrates with you, and when you're ready, your personal Journey Recap will be waiting — the full story of how you got here, from your very first click to the keys in your hand."
```

---

## Acceptance Criteria

- [ ] MM1 welcome paragraph fills full card width — no max-width truncation
- [ ] MM1 narrative paragraph fills full card width
- [ ] MM3 locked preview paragraph fills full card width
- [ ] MM4–MM10 all locked preview paragraphs fill full card width
- [ ] All 8 preview copy blocks updated with new text (MM3 through MM10)
- [ ] No max-w- constraints remaining on any preview paragraph text
- [ ] tsc --noEmit passes clean
- [ ] No other files changed

---

## What Is NOT Changing

- Card layouts, padding, or background colors
- Tab navigation logic
- Any MM1 or MM2 content other than paragraph width
- Any logic or data files

---

*Brief prepared by Claude (COO) — June 2, 2026. Approved by Craig Asbach.*
