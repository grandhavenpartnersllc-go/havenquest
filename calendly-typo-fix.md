# Fix Brief — Calendly URL Typo

## Problem
The Calendly booking URL contains a typo: `havenquest-consulation` (missing the second 't').
Correct URL: `https://calendly.com/craig-asbach-havenquest/havenquest-consultation`

## Step 1 — Find All Instances
Search the entire codebase for the misspelled string:
```
grep -r "consulation" . --include="*.ts" --include="*.tsx" --include="*.js" --include="*.jsx" --include="*.env*" --include="*.json" -l
```
List every file found.

## Step 2 — Fix Each Instance
In every file identified in Step 1, replace:
```
havenquest-consulation
```
with:
```
havenquest-consultation
```
Use str_replace for each file. Do not change anything else in these files.

## Step 3 — Verify
After all replacements, run the search again to confirm zero instances of `consulation` remain in the codebase.

## Step 4 — Commit and Deploy
```
git add -A
git commit -m "fix: correct Calendly URL typo consulation -> consultation"
git push origin main
```
Confirm push succeeded and Vercel deployment triggered.

## Step 5 — Report Back
Paste into Claude chat:
- Every file that was changed
- Confirmation that zero instances of the typo remain
- Git commit hash
