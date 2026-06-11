# Build Brief — MM1 Welcome Copy & Navigator Journey Descriptions
**Project:** HavenQuest
**Date:** June 2, 2026
**Status:** PENDING — Ready for Claude Code
**Priority:** High — brand voice and personalization
**Prepared by:** Claude (COO)
**Approved by:** Craig Asbach

---

## Brand Voice Standard

All copy in this brief follows the HavenQuest brand voice:
- Warm, personal, welcoming
- Confident and excited
- Anticipatory — the best part is ahead
- Fun and engaging — "we're in this together"
- Sounds like a trusted friend, not a website

**The test:** Does this sound like a trusted friend who knows everything about Texas real estate? If it sounds like a website — it's wrong.

---

## Overview

Two changes in one file:

1. **MM1Explore.tsx** — Replace welcome headline and paragraph with personalized template copy
2. **MM1Explore.tsx** — Replace all 10 Navigator Journey step descriptions with new brand voice copy

---

## Change 1 — MM1 Welcome Headline & Paragraph

### Location
In `components/portal/milemarkers/MM1Explore.tsx` — the Section 1 welcome block.

### Current headline:
```tsx
<h2 className="text-[22px] font-bold tracking-tight mb-3" style={{ color: WARM_DARK }}>
  {session.firstName}, here's what we found for you.
</h2>
```

### New headline:
```tsx
<h2 className="text-[22px] font-bold tracking-tight mb-3" style={{ color: WARM_DARK }}>
  {session.firstName}, your Texas story starts right here.
</h2>
```

---

### Current paragraph:
```tsx
<p className="text-sm leading-relaxed w-full text-justify" style={{ color: '#6B7280' }}>
  Based on your income, household, financial picture, and lifestyle priorities,
  HavenQuest has matched you to the Texas communities where your life fits best.
  Below is your personalized summary. When you're ready to go deeper,
  your full reports are waiting in Discover.
</p>
```

### New paragraph — personalized template:

Replace with a dynamically built string using profile and matches data:

```tsx
{/* Build personalized welcome paragraph */}
{(() => {
  const topCity = matches[0]?.location.name ?? 'your top match'
  const income = profile.annualIncome
    ? `$${profile.annualIncome.toLocaleString()}`
    : null
  const mustHaveLabels = profile.mustHaves
    .slice(0, 2)
    .map(k => LIFESTYLE_CATEGORIES.find(c => c.key === k)?.label ?? k)
  const householdMap: Record<string, string> = {
    '1': 'just you',
    'just-me': 'just you',
    'couple': 'the two of you',
    'small-family': 'your family',
    'growing-family': 'your growing family',
    'multigenerational': 'your household',
    '2': 'the two of you',
    '3-4': 'your family',
    '5+': 'your household',
  }
  const household = householdMap[profile.householdSize] ?? 'your household'
  const priorityText = mustHaveLabels.length > 0
    ? ` Your Must Haves — ${mustHaveLabels.join(' and ')} — guided everything.`
    : ''

  const parts = [
    `We've been busy.`,
    income
      ? `Based on what you told us about ${household}, a ${income} income, and what matters most to you,`
      : `Based on everything you told us about ${household} and what matters most to you,`,
    `we matched you to the Texas communities where your life fits best.${priorityText}`,
    `Your top match is ${topCity} — and honestly? We're pretty excited about it.`,
    `Below is your personalized summary. When you're ready to go even deeper, your full reports, real numbers, and matched Select Agents are all waiting in Discover.`,
    `Let's go find your home.`,
  ]

  return (
    <p className="text-sm leading-relaxed w-full" style={{ color: '#6B7280' }}>
      {parts.join(' ')}
    </p>
  )
})()}
```

**Note:** Remove `text-justify` from this paragraph — the personalized dynamic text reads better left-aligned. Justified text with variable-length dynamic content can produce awkward spacing.

**Required import check:** Confirm `LIFESTYLE_CATEGORIES` is already imported in MM1Explore.tsx. If not, add:
```tsx
import { LIFESTYLE_CATEGORIES } from '../../../utils/constants'
```

---

## Change 2 — Navigator Journey Step Descriptions

### Location
In `components/portal/milemarkers/MM1Explore.tsx` — the `NAVIGATOR_STEPS` constant at the top of the file.

### Current NAVIGATOR_STEPS:
```typescript
const NAVIGATOR_STEPS = [
  { number: 1, name: 'Welcome', description: 'Review your personalized city matches and understand your Navigator journey.' },
  { number: 2, name: 'Discover', description: 'Dive into full city reports, affordability breakdowns, school data, and matched realtors.' },
  { number: 3, name: 'Decide', description: 'Fine-tune your priorities in the sandbox and commit your direction when ready.' },
  { number: 4, name: 'Connect', description: 'Your personal Ambassador is assigned and reaches out within 24 hours.' },
  { number: 5, name: 'Plan', description: 'Strategy session with your Ambassador — city, zone, timeline, and direction confirmed.' },
  { number: 6, name: 'Prepare', description: 'Get pre-approval, insurance, and logistics in place before your realtor introduction.' },
  { number: 7, name: 'Match', description: 'Your Ambassador hand-selects three vetted realtors for your zone. You choose.' },
  { number: 8, name: 'Engage', description: 'Warm personal introduction to your chosen realtor. They already know your story.' },
  { number: 9, name: 'Contract', description: 'Under contract — the finish line is in sight. Your team is with you.' },
  { number: 10, name: 'Home', description: 'Closed. You\'re home. Your Journey Recap is waiting.' },
]
```

### New NAVIGATOR_STEPS:
```typescript
const NAVIGATOR_STEPS = [
  { number: 1, name: 'Welcome', description: 'This is where it all began. You told us what matters. We got to work.' },
  { number: 2, name: 'Discover', description: 'Your full reports are waiting. Real numbers, real schools, real market data — and the Select Agents who know your zone best. This is where you go from curious to confident.' },
  { number: 3, name: 'Decide', description: 'Time to get behind the wheel. Jump into the sandbox, dial in your direction, and when it feels right — let\'s roll. Your Market Director is ready to ride shotgun.' },
  { number: 4, name: 'Connect', description: 'Your personal Market Director is about to step in — and they\'ve already read everything. No "tell me about yourself." Just real guidance from someone genuinely in your corner.' },
  { number: 5, name: 'Plan', description: 'This is where the map gets drawn. You and your Market Director talk it through — city, zone, timeline, budget. You\'ll hang up with a clear direction and someone who knows exactly how to get you there.' },
  { number: 6, name: 'Prepare', description: 'Before you meet your Select Agent, let\'s make sure everything\'s in place. Financing locked. Insurance sorted. Timeline confirmed. You\'ll walk into that introduction ready — and it\'ll show.' },
  { number: 7, name: 'Match', description: 'Your Market Director hand-picks three exceptional Select Agents for your zone. Not a list. Not an algorithm. Three real professionals chosen specifically for you. You pick who feels right.' },
  { number: 8, name: 'Engage', description: 'The introduction you\'ve been building toward. Your Market Director makes it personal — and your Select Agent already knows your story before you ever speak. This is a different kind of real estate experience.' },
  { number: 9, name: 'Contract', description: 'You found it. The right home, in the right place. Going under contract is one of the best feelings in the world — and your whole team is right there celebrating with you.' },
  { number: 10, name: 'Home', description: 'You\'re home. Everything you hoped for when this journey started — it happened. HavenQuest celebrates with you. And when you\'re ready, your Journey Recap is waiting to tell the whole story.' },
]
```

---

## Acceptance Criteria

- [ ] Welcome headline updated to "{firstName}, your Texas story starts right here."
- [ ] Welcome paragraph replaced with personalized dynamic template
- [ ] Personalized paragraph pulls: household description, income, top 2 Must Have labels, top city name
- [ ] Falls back gracefully if any data field is missing — no broken rendering
- [ ] `text-justify` removed from welcome paragraph
- [ ] All 10 NAVIGATOR_STEPS descriptions replaced with new copy
- [ ] No "Ambassador" in descriptions — uses "Market Director" throughout
- [ ] No "realtor" in descriptions — uses "Select Agent" throughout
- [ ] tsc --noEmit passes clean
- [ ] No any types introduced
- [ ] Only MM1Explore.tsx changed — no other files

---

## What Is NOT Changing

- Section labels ("WELCOME TO YOUR NAVIGATOR")
- City story cards
- Navigator Journey section header
- Acknowledgment checkbox
- MM2 through MM10 — untouched
- Any logic, data, or service files

---

*Brief prepared by Claude (COO) — June 2, 2026. Approved by Craig Asbach.*
