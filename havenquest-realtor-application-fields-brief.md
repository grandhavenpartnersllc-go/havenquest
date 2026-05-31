# HavenQuest — Realtor Application Form Enhancement Brief
**Prepared by:** Claude (COO/Chief Editor)  
**Date:** May 29, 2026  
**Status:** Ready for Claude Code implementation  
**Priority:** P1 — Required before realtor outreach begins

---

## Overview

Adds three new fields to the realtor application form in `components/for-realtors/ForRealtorsClient.tsx`. Insert all three between the Market Specialty dropdown and the Tell us about your approach textarea. Do not change any existing fields.

---

## Field 1 — Market Segment Specialty

**Position:** Full-width (sm:col-span-2), immediately after Market Specialty dropdown  
**Label:** Market Segment Specialty  
**Helper text:** Select up to 2 segments that best represent your primary market within your selected zone. Adjacent segments only (e.g. Starter + Mid-Market, or High + Luxury).  
**Input type:** Checkboxes — one per segment  
**Field name:** market_segments (array of strings)  
**Validation:** Minimum 1 required, maximum 2 selections  

**Options:**
- Starter — Under $325K
- Mid-Market — $325K to $650K
- High — $650K to $1.3M
- Luxury — $1.3M to $2M
- Estate — $2M+

---

## Field 2 — Recent Transaction History

**Position:** Full-width (sm:col-span-2), after Market Segment Specialty  
**Label:** Recent Transaction History  
**Helper text:** List at least 5 of your closed transactions from the past 24 months. This is used to verify your zone and segment expertise. You may add up to 10.  
**Input type:** Repeating row set — 5 rows shown by default, Add Transaction button adds rows up to 10 total  
**Field name:** transactions (array of objects)  
**Validation:** Minimum 5 complete rows required — all 3 fields in each row must be filled  

**Each row contains 3 fields side by side:**
- City — text input, placeholder "e.g. Frisco"
- Sale Price — text input, placeholder "e.g. $485,000"
- Close Date — text input, placeholder "MM/YYYY"

**Row labels:** Transaction 1, Transaction 2, etc.

---

## Field 3 — HAR Profile URL

**Position:** Single column, after Transaction History  
**Label:** HAR Profile URL  
**Helper text:** Required for Houston metro applicants. Recommended for all others — HAR.com is the most comprehensive agent profile source in Texas.  
**Input type:** Text input  
**Placeholder:** https://www.har.com/your-profile  
**Field name:** har_profile_url  
**Validation:** Required if any Houston metro zone is selected in Market Specialty dropdown. Optional for all other zones.  

**Houston zones that trigger required validation:**
- Inner Loop / Urban Core Houston
- The Heights / Inner Northwest
- West University / Bellaire / Memorial
- The Woodlands / North Houston
- Spring / Klein / Champions Corridor
- Katy / Fulshear / West Houston Energy Corridor
- Sugar Land / Fort Bend County
- Pearland / South Houston
- Clear Lake / NASA / Southeast Houston
- Cypress / Northwest Houston
- Kingwood / Lake Houston Corridor
- Baytown / East Houston Industrial Corridor
- Richmond / Rosenberg / Southwest Growth Corridor
- Conroe / Montgomery County North Growth Belt
- Galveston Island / Gulf Coast
- Brazosport / Gulf Coast South

---

## Supabase Migration

Run the following SQL in the Supabase SQL Editor for project gsxiqberewwzoohhuphn:

```sql
ALTER TABLE public.realtor_applications
  ADD COLUMN IF NOT EXISTS market_segments text[],
  ADD COLUMN IF NOT EXISTS transactions jsonb,
  ADD COLUMN IF NOT EXISTS har_profile_url text;

NOTIFY pgrst, 'reload schema';
```

---

## Implementation Checklist

- [ ] Add Field 1 — Market Segment Specialty checkboxes
- [ ] Add Field 2 — Transaction History repeating rows (5 default, up to 10)
- [ ] Add Field 3 — HAR Profile URL with conditional required validation
- [ ] Run Supabase migration
- [ ] Run tsc --noEmit — must be clean
- [ ] Commit with message: "feat: add market segment, transaction history, and HAR profile fields to realtor application"
- [ ] Push to main

---

*Brief prepared by Claude — HavenQuest COO/Chief Editor. May 29, 2026.*
