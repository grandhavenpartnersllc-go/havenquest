# How Priority Tiers Change a City's Match Score

This explains, with real numbers, exactly how a client's Must Have / Important to Me / Would Be Nice / Unassigned selections change which cities rank higher or lower — and lays out the three options for how "Unassigned" (categories a client never touched) should be treated, ahead of that decision.

No code was changed to produce this document — it's a plain-language trace of what the code in `services/archetypeService.ts` and `services/matchingService.ts` actually does today.

---

## 1. The baseline weights — where they actually came from

The 7 category weights live in `services/archetypeService.ts`:

| Category | Baseline weight |
|---|---|
| School Quality | 22% |
| Family Lifestyle | 16% |
| Career Access | 16% |
| Outdoor Lifestyle | 13% |
| Growth Potential | 13% |
| Dining & Entertainment | 11% |
| Luxury Lifestyle | 9% |

**These are not arbitrary.** They trace back to a real source: the June 15, 2026 "Austin Community DNA™ Prototype Scorecard v0.1," built via Claude + ChatGPT collaboration and reviewed by Craig. That document's original weight table had **8** categories, including a Weather category at 7%: School 20%, Family 15%, Career 15%, Outdoor 12%, Growth 12%, Dining 10%, Luxury 9%, Weather 7%.

The code carries a comment marking the current 7-category set as "**post Weather-removal refinement (locked June 16, 2026)**" — one day after the original scorecard was created, Weather was pulled out of the model entirely, and its 7% was redistributed proportionally across the remaining 7 categories. I verified this redistribution math traces correctly: dividing each original weight by 0.93 (the remaining 93% after removing Weather's 7%) and rounding reproduces the current live numbers almost exactly (e.g. School Quality: 20% ÷ 0.93 = 21.5% → rounds to 22%; Family Lifestyle: 15% ÷ 0.93 = 16.1% → rounds to 16%). So the current 7-number set is a **deliberate, traceable recalculation**, not a fresh guess.

One honest caveat worth flagging: the *original* 8 numbers in that source document are explicitly labeled by the document itself as "**Expert-Calibrated Estimates — Not derived from the HavenQuest Community Intelligence Data Warehouse**" — i.e., Craig and Claude's best editorial judgment as a starting point, not something empirically measured. So: yes, deliberate and documented at the redistribution-math level; the root numbers themselves are an acknowledged starting-point judgment call, not a discovered truth. I also noticed the separate Notion "Weather Climate Scores" document (also dated June 15) still describes Weather as "**Active — Ready for integration**" into the scoring engine, unrevised since before the June 16 removal — a minor documentation lag, not a code bug, but worth someone updating that page to reflect that Weather was in fact excluded.

---

## 2. Exactly how a tier changes the baseline — the literal math

Each category, based on which tier a client puts it in, gets a **percentage-point shift** before anything is renormalized:

| Tier | Shift |
|---|---|
| Must Have | **+10** percentage points |
| Important to Me | **+5** percentage points |
| Would Be Nice | **+0** (no shift) |
| Unassigned (today) | **−5** percentage points |

So if a client marks **Outdoor Lifestyle** (13% baseline) as a **Must Have**: `0.13 + (10/100) = 0.23` → it becomes **23%** before renormalization. Marked **Important**: `0.13 + 0.05 = 0.18` → **18%**. Marked **Would Be Nice**: stays at **13%** (no shift). Left **Unassigned** (today's behavior): `0.13 − 0.05 = 0.08` → **8%**.

These shifted numbers don't sum to 100% anymore (shifting some up and some down changes the total pot) — so the code always does one more step: **add up all 7 shifted numbers, then divide each one by that total.** This final division is what guarantees every scenario always lands back at exactly 100%, no matter what combination of shifts happened. This step matters a lot for the Unassigned question in Section 4.

---

## 3. One full worked example

**A realistic client:** marks **School Quality** and **Outdoor Lifestyle** as Must Have, **Family Lifestyle** and **Career Access** as Important, **Dining & Entertainment** as Would Be Nice, and never touches **Growth Potential** or **Luxury Lifestyle**. (This is a representative example built to walk through the math clearly — not a reconstruction of any specific real client's actual quiz answers.)

**Step 1 — starting baseline, then the shift applied:**

| Category | Baseline | Tier | Shift | After shift |
|---|---|---|---|---|
| School Quality | 22% | Must Have | +10pp | 32% |
| Outdoor Lifestyle | 13% | Must Have | +10pp | 23% |
| Family Lifestyle | 16% | Important | +5pp | 21% |
| Career Access | 16% | Important | +5pp | 21% |
| Dining & Entertainment | 11% | Would Be Nice | +0pp | 11% |
| Growth Potential | 13% | Unassigned (today) | −5pp | 8% |
| Luxury Lifestyle | 9% | Unassigned (today) | −5pp | 4% |

**Step 2 — total pot after shifts:** 32+23+21+21+11+8+4 = **120%** (not 100% — this is expected and normal; it gets fixed in the next step).

**Step 3 — renormalize (divide each by 1.20):**

| Category | Final weight |
|---|---|
| School Quality | 32/120 = **26.7%** |
| Outdoor Lifestyle | 23/120 = **19.2%** |
| Family Lifestyle | 21/120 = **17.5%** |
| Career Access | 21/120 = **17.5%** |
| Dining & Entertainment | 11/120 = **9.2%** |
| Growth Potential | 8/120 = **6.7%** |
| Luxury Lifestyle | 4/120 = **3.3%** |

These 7 numbers sum to 100%, confirmed.

**Step 4 — combine with a real city's DNA scores.** Using Austin's actual live DNA scores (School 6, Family 5, Career 10, Outdoor 7, Growth 8, Dining 10, Luxury 8), the functional-fit calculation multiplies each category's final weight by the city's score in that category and adds them up:

`(0.267×6) + (0.175×5) + (0.175×10) + (0.192×7) + (0.067×8) + (0.092×10) + (0.033×8)`
`= 1.60 + 0.88 + 1.75 + 1.34 + 0.53 + 0.92 + 0.27 = 7.28`

That **7.3** (rounded) is Austin's "functional fit score" (0–10 scale) for this client. It then combines with a separate "emotional fit" score (from the personality sliders) and a financial-affordability multiplier to produce the final 0–100 match percentage shown to the client — but the priority-tier math above is entirely what determines the DNA-category half of that final number.

---

## 4. The "Unassigned" question — three options, real numbers

Using the same 2 untouched categories from the example above (Growth Potential 13% baseline, Luxury Lifestyle 9% baseline):

### Option A — `'hard'` (zero out)

The 2 untouched categories are set to **0%** before renormalization — not shifted down, fully removed from the pot.

| Category | After shift | 
|---|---|
| School Quality | 32% (unchanged) |
| Outdoor Lifestyle | 23% (unchanged) |
| Family Lifestyle | 21% (unchanged) |
| Career Access | 21% (unchanged) |
| Dining & Entertainment | 11% (unchanged) |
| Growth Potential | **0%** |
| Luxury Lifestyle | **0%** |

New total: 32+23+21+21+11+0+0 = **108%**. Renormalize (÷1.08):

| Category | Final weight | vs. soft mode |
|---|---|---|
| School Quality | **29.6%** | was 26.7% |
| Outdoor Lifestyle | **21.3%** | was 19.2% |
| Family Lifestyle | **19.4%** | was 17.5% |
| Career Access | **19.4%** | was 17.5% |
| Dining & Entertainment | **10.2%** | was 9.2% |
| Growth Potential | **0%** | was 6.7% |
| Luxury Lifestyle | **0%** | was 3.3% |

**The important part:** the other 5 categories absorb *all* of the removed 22 percentage points, boosting each of them noticeably above even their "soft mode" numbers. A city that happens to be strong specifically in Growth Potential or Luxury gets zero credit for that at all — its score is now driven entirely by the 5 remaining categories, amplified.

### Option B — `'soft'` (−5 percentage points, today's default everywhere after the recent fix)

Already shown in full in Section 3: Growth Potential lands at **6.7%**, Luxury Lifestyle at **3.3%** — both roughly half their original baseline, not zero. The other 5 categories are boosted, but more mildly than in hard mode (total pot is 120% instead of 108%, so less gets redistributed).

### Option C — "True neutral" (not yet built): untouched categories keep their exact original baseline weight, no shift at all

| Category | After shift |
|---|---|
| School Quality | 32% |
| Outdoor Lifestyle | 23% |
| Family Lifestyle | 21% |
| Career Access | 21% |
| Dining & Entertainment | 11% |
| Growth Potential | **13%** (untouched) |
| Luxury Lifestyle | **9%** (untouched) |

New total: 32+23+21+21+11+13+9 = **130%**. Renormalize (÷1.30):

| Category | Final weight |
|---|---|
| School Quality | **24.6%** |
| Outdoor Lifestyle | **17.7%** |
| Family Lifestyle | **16.2%** |
| Career Access | **16.2%** |
| Dining & Entertainment | **8.5%** |
| Growth Potential | **10.0%** |
| Luxury Lifestyle | **6.9%** |

**Direct answer to the precision question asked:** this is **not** mathematically broken and does **not** create a normalization problem. The renormalization step (divide-by-total) is completely generic — it works correctly no matter what the pre-renormalization total happens to be, whether that's 108%, 120%, or 130%. The code doesn't need any special-case handling to support this option; it already does the right thing automatically.

**But here's the non-obvious part, worth sitting with:** even under "true neutral," Growth Potential still ends up at 10.0% — *lower* than its original 13% baseline — and Luxury Lifestyle ends up at 6.9%, also lower than its 9% baseline. This isn't a bug or a hidden penalty being applied to them specifically — it's a pure side effect of the other 5 categories being boosted. When the total pot grows to 130% because 5 categories got positive shifts, dividing *everything* (including the two untouched categories) by that larger number necessarily shrinks everyone's relative share, even the ones that didn't change. **So "true neutral" doesn't actually mean "no effect" — it means "the mildest possible effect," not "zero effect."** There is no version of this system where an untouched category's *relative influence* stays perfectly flat while other categories get boosted — that's a mathematical impossibility once you require everything to sum to 100%, not a limitation of this particular code.

### Side-by-side summary for Growth Potential (13% baseline)

| Option | Final weight | Change from baseline |
|---|---|---|
| Hard (zero out) | 0% | −13pp (all of it) |
| Soft (−5pp) | 6.7% | −6.3pp (about half) |
| True neutral | 10.0% | −3pp (about a quarter) |

---

## 5. Plain-language summary

- **Hard mode:** if you don't pick it, it counts for *nothing*. Your results are driven entirely by whatever you did actively choose — genuinely powerful for showing "what if this category didn't matter to you at all," but it can swing rankings hard, especially for a city that happens to be unusually strong in exactly the category that got zeroed out.
- **Soft mode (current default):** not picking something quietly costs it a little credit — roughly half its normal influence, redistributed to your other picks. Feels like "I didn't say I cared about this, so it matters somewhat less" — a mild thumb on the scale, not a veto.
- **True neutral (not yet built):** not picking something still costs it *some* credit — just less than soft mode, and purely as an unavoidable side effect of your other choices getting a boost, not as an intentional penalty. Feels the closest to "I have no opinion on this" while still being mathematically honest that *something* has to give when other categories get boosted.

None of the three options can make an untouched category's influence stay perfectly unchanged relative to categories you did pick — that would require the total to exceed 100%, which the system (correctly) never allows.
