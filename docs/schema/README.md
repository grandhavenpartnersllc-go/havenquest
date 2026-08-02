# Schema snapshot

This directory holds the **authoritative record of the live HavenQuest database schema**.

| File | What it is |
|---|---|
| `live-schema-2026-07-31.csv` | An `information_schema` export of the `public` schema, taken from the Supabase SQL editor on **31 July 2026**. |

`docs/SCHEMA-REFERENCE.md` is the human-readable analysis built on top of this CSV. This CSV is the
evidence; that document is the reading of it.

## Why this file is authoritative

> **The live database is the authority. Migration history and code reconcile to it — never the reverse.**

The 29 `.sql` files in `supabase/migrations/` were **never applied by any tool** — see
`supabase/migrations/README.md`. They record intent, not state. The database was built by hand in the
Supabase SQL editor, and this CSV is the only machine-readable record of what it actually contains.

## What enforces it

`scripts/check-schema-drift.mjs` runs automatically before every build (via the `prebuild` npm
script). It extracts every column name the code references and fails the build if the code asks for
a column this CSV does not contain.

The check **compares code against this snapshot**. It cannot tell whether the snapshot still matches
the database — only a fresh export does that. That is why the step below is not optional.

## After ANY schema change — required

Schema changes are made **in the Supabase SQL editor**, not by migration files. Immediately after
making one:

1. Run the regeneration query below in the Supabase SQL editor.
2. Export the result as CSV.
3. Save it here as `live-schema-YYYY-MM-DD.csv` using the date of the export.
4. Delete the previous snapshot — **there is exactly one snapshot at a time.**
5. Update the filename references in `scripts/check-schema-drift.mjs` and in this README.
6. Commit the new CSV in the same commit as the code that depends on the change.

Skipping this does not break loudly. It makes the drift check validate against a database that no
longer exists, which is worse. The check prints a staleness warning once the snapshot passes 45 days
old, but a snapshot can be wrong the moment after it is taken.

## Regeneration query

> **⚠ RECONSTRUCTED — not the verified original.**
>
> The SQL that produced `live-schema-2026-07-31.csv` was never recorded. This query was derived by
> working backwards from the CSV's output format and reproduces that format exactly:
> `table_name,column_count,columns`, with `columns` pipe-delimited as `name type null|notnull`,
> alphabetically ordered by table and by column, `public` schema only, base tables only.
>
> It has **not** been run against the database (this repo carries no database credentials).
> Before trusting a regenerated snapshot, diff its output against the existing CSV — the 12 table
> rows and 231 columns should reconcile except where the schema genuinely changed.

```sql
select
  c.table_name,
  count(*) as column_count,
  string_agg(
    c.column_name || ' ' || c.data_type || ' ' ||
      case when c.is_nullable = 'YES' then 'null' else 'notnull' end,
    ' | ' order by c.column_name
  ) as columns
from information_schema.columns c
join information_schema.tables t
  on  t.table_schema = c.table_schema
  and t.table_name   = c.table_name
where c.table_schema = 'public'
  and t.table_type   = 'BASE TABLE'
group by c.table_name
order by c.table_name;
```

Notes on the format, so a future export is recognisably the same shape:

- `data_type` is used verbatim — so array columns read `ARRAY` (not `text[]`), and
  `character varying` carries no length.
- Nullability is flattened to the literal strings `null` / `notnull`.
- Views and foreign tables are excluded by `table_type = 'BASE TABLE'`.

## Snapshot contents as of 2026-07-31

12 tables, 231 columns.

| Table | Columns |
|---|---|
| `beta_testers` | 5 |
| `investor_interest` | 10 |
| `leads` | 7 |
| `md_clients` | 8 |
| `messages` | 10 |
| `mm3_activity_events` | 5 |
| `mm4_profiles` | 50 |
| `quiz_sessions` | 35 |
| `realtor_applications` | 23 |
| `realtor_interest` | 10 |
| `staff_accounts` | 11 |
| `users` | 57 |
| **Total** | **231** |
