# Build Brief — Dead Code Cleanup

## Objective
Delete three confirmed orphaned component files from the pre-portal-rebuild era. These files are not imported anywhere in the current codebase.

---

## Step 1 — Confirm Zero Imports
Before deleting, search the entire codebase to confirm none of these files are imported anywhere:

```
grep -r "StarterPortal" . --include="*.ts" --include="*.tsx" -l
grep -r "MM3Decide" . --include="*.ts" --include="*.tsx" -l
grep -r "MM4to10" . --include="*.ts" --include="*.tsx" -l
```

If any imports are found, report them and do NOT delete that file. Only delete files confirmed to have zero imports.

---

## Step 2 — Delete Confirmed Dead Files
Delete the following files if confirmed unused:
- `components/portal/StarterPortal.tsx` (342 lines)
- `components/portal/milemarkers/MM3Decide.tsx` (38 lines)
- `components/portal/milemarkers/MM4to10.tsx` (52 lines)

---

## Step 3 — Clean Up Stale .md Brief Files from Project Root
List all .md files in the project root that match these patterns:
- `havenquest-*.md`
- `mm3-*.md`
- `mm4-*.md`
- `*-fix.md`
- `*-brief.md`
- `*-audit*.md`

Delete all of them. These are Claude Code build artifacts and should not be in the repository.

---

## Step 4 — Verify Build
Run a TypeScript check to confirm nothing broke:
```
npx tsc --noEmit
```

Report any errors found.

---

## Step 5 — Commit and Deploy
```
git add -A
git commit -m "chore: delete dead code (StarterPortal, MM3Decide, MM4to10) and clean up stale .md build artifacts from root"
git push origin main
```

Confirm Vercel deployment triggered. Report commit hash.

---

## Report Back
- Which files were deleted
- Which .md files were removed from root
- TypeScript check result
- Git commit hash
