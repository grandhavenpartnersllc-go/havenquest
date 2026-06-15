# Build Brief — Remove Dead MM3Decide Import and Delete File

## Objective
Remove the dead import of MM3Decide from MileMarkerContent.tsx and then delete the now-unused MM3Decide.tsx file.

---

## Step 1 — Remove Dead Import
In components/portal/MileMarkerContent.tsx line 4, remove the import line for MM3Decide:
```
import MM3Decide from './milemarkers/MM3Decide'
```
Remove this line entirely. Do not change any other code in the file.

---

## Step 2 — Confirm MM3Decide Is No Longer Referenced
Run:
```
grep -r "MM3Decide" . --include="*.ts" --include="*.tsx" -n
```
Confirm zero results before proceeding.

---

## Step 3 — Delete the File
```
Remove-Item "components\portal\milemarkers\MM3Decide.tsx" -Force
```

---

## Step 4 — TypeScript Check
```
npx tsc --noEmit
```
Report any errors. There should be none.

---

## Step 5 — Commit and Deploy
```
git add -A
git commit -m "chore: remove dead MM3Decide import and delete unused component"
git push origin main
```

Report commit hash.
