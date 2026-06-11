# Claude Code Instructions — Stage 1 Realtor Email Copy Update

## What You're Doing

One file only — `services/emailService.ts`. Update the `buildStage1RealtorEmailHtml` function with approved copy. No other files touched.

---

## Before You Start

Read `services/emailService.ts` in full before making any changes. Confirm back the exact location of `buildStage1RealtorEmailHtml` before editing.

---

## The Change

### Subject line
Find the `resend.emails.send` call in `app/api/realtor-interest/route.ts` that uses `buildStage1RealtorEmailHtml`.

Change the subject from:
```
'Your invitation to apply — HavenQuest Partner Network'
```
To:
```
"You're one step closer — HavenQuest Partner Network"
```

### Email body
In `services/emailService.ts`, update `buildStage1RealtorEmailHtml`.

Keep the existing HavenQuest header (dark background, logo) and footer styling exactly as is. Replace only the body content between header and footer with the following approved copy:

---

Hi {firstName},

Something new is happening in Texas real estate, and I think you're exactly the kind of agent who will get it immediately.

HavenQuest is a relocation intelligence platform built for people moving to Texas. Not tourists. Not tire-kickers. People who have made a serious decision, matched themselves to a specific Texas city based on their income, lifestyle, and priorities — and are now ready to find a home.

By the time they reach you, they already know which city they want. They already understand the market. They've already run their numbers. All they need is the right agent to take them across the finish line.

We curate a small shortlist of three partners per market segment per zone. Buyers read your profile and choose who they want to work with. When they choose you, that introduction is warm, informed, and intentional — not a cold lead dropped in your lap.

This is not a lead service. This is a partnership.

You've taken the first step by expressing interest. The next step is your application. The link below is private and was created specifically for you — it takes about 10 minutes to complete.

[Complete My Application →] — styled gold CTA button, links to the token URL (same as current implementation)

I want to be straightforward with you — we don't accept everyone. Every application is reviewed personally, and we limit the number of partners in each market by design. But if you're the right fit, this is an opportunity worth your attention.

You'll hear from me within 5 business days.

**Craig Asbach**
Founder, HavenQuest
craig.asbach@havenquest.co

---

## Files to Modify

| File | Change |
|---|---|
| `services/emailService.ts` | Update `buildStage1RealtorEmailHtml` body copy |
| `app/api/realtor-interest/route.ts` | Update subject line |

---

## When Done

1. `tsc --noEmit` passes clean
2. Commit and push
3. Report commit hash

---

*Instructions prepared by Claude (COO) — May 30, 2026. Copy approved by Craig Asbach.*
