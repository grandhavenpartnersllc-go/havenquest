# HavenQuest Platform Audit — Codebase Summary Request

## Purpose
Provide Claude (chat) with a comprehensive snapshot of the current codebase state so it can give Craig an accurate platform status report. This is a read-only audit — no changes, no fixes.

## Instructions
Work through each section below. Read the relevant files. Report back in structured form exactly matching the output format at the bottom of this brief.

---

## Section 1 — Project Structure
Run the following and report the output:
```
Get-ChildItem -Path . -Recurse -Depth 3 -Name | Where-Object { $_ -notmatch "node_modules|\.next|\\.git" }
```
Summarize the top-level directory structure and note any unusual or unexpected files.

---

## Section 2 — Navigator Activation Fee ($1,799 → $2,499)
Search the entire codebase for every instance of `1799`, `1,799`, `$1,799`, and `1799.00`.
Report: every file path and line number where these strings appear.

Also search for `2499`, `2,499`, `$2,499` to confirm whether the new price is already in place anywhere.

---

## Section 3 — Calendly Integration
Search for `calendly`, `Calendly`, `microsoft bookings`, `microsoftbookings`, `bookings.ms`, `outlook.office`.
Report: every file and line where any of these strings appear. Note whether Calendly is currently wired in or if Bookings references still exist.

---

## Section 4 — MM4 Form
Read the following files completely and report:
- `src/app/portal/components/MM4Intake.tsx` (or equivalent path — find it if path differs)
- Any MM4-related API routes under `src/app/api/`

Report:
- How many form sections exist (count the section definitions)
- What the current Calendly/Bookings URL is set to (exact string)
- What fee amount is displayed on the confirmation screen (exact string)
- What the confirmation email template says about the fee (exact string from the email template)

---

## Section 5 — Portal Architecture
Read and summarize:
- `src/app/portal/page.tsx` or equivalent entry point
- `src/app/md/` directory structure (list all files)
- `src/middleware.ts` (auth/routing logic)

Report:
- How portal auth is gated (Supabase session check? cookie? redirect logic?)
- What the /md/login redirect loop issue is — trace the auth flow and identify where the loop occurs
- Whether the three-portal architecture (/portal, /md, /admin) is reflected in the file structure

---

## Section 6 — Dead Code
Check whether these files exist:
- `src/app/portal/components/StarterPortal.tsx`
- `src/app/portal/components/MM3Decide.tsx`
- `src/app/portal/components/MM4to10.tsx`

Report: which ones exist and their approximate line counts.

---

## Section 7 — Environment Variables
Read `.env.local` if accessible. If not, read `vercel.json` or any config that references env var names.
Report: list of env var keys in use (values masked — do not print actual secrets). Flag any that appear to be missing or placeholder values.

---

## Section 8 — Recent Git History
Run:
```
git log --oneline -20
```
Report the last 20 commits with hash and message.

---

## Section 9 — Package Dependencies
Read `package.json`. Report:
- Next.js version
- Supabase client version
- Framer Motion version
- Any dependency that looks outdated, unusual, or potentially conflicting

---

## Section 10 — Open Issues Scan
Search for `TODO`, `FIXME`, `HACK`, `temp`, `hardcoded` (case insensitive) across all `.tsx` and `.ts` files excluding node_modules.
Report: every hit with file path and line.

---

## Output Format
Return your findings to Craig in Claude chat using this exact structure:

```
PLATFORM AUDIT REPORT — [date]

1. PROJECT STRUCTURE
[summary]

2. FEE REFERENCES ($1,799 / $2,499)
[every file:line found]

3. CALENDLY STATUS
[current state — Calendly wired / Bookings still present / mixed]

4. MM4 FORM
- Section count: [N]
- Calendly/Bookings URL in code: [exact string]
- Fee on confirmation screen: [exact string]
- Fee in email template: [exact string]

5. PORTAL ARCHITECTURE
- Auth gating method: [description]
- /md/login redirect loop: [root cause if identifiable]
- Three-portal structure in place: [yes/no/partial]

6. DEAD CODE
[which files exist, line counts]

7. ENV VARS
[key names only, flag any issues]

8. RECENT COMMITS
[last 20]

9. DEPENDENCIES
[versions + any flags]

10. TODO/FIXME/HACK SCAN
[every hit]
```

After completing all sections, paste the full report back into Claude chat.
