# ⚠ THESE MIGRATIONS WERE NEVER APPLIED — DO NOT RUN THEM

The 29 `.sql` files in this directory have **never been applied by any tool.**

On **31 July 2026** the tracking table `supabase_migrations.schema_migrations` was queried on the
live database as the `postgres` role. It returned error **42P01 — relation does not exist.** That
table is created automatically the first time any migration tool applies a migration. Its absence
means no tool has ever run against this database.

Two further facts confirm it from inside the repo:

- **There has never been a tool here that could apply them.** No Supabase CLI in `package.json` or
  `package-lock.json`, none in `node_modules`, none on `PATH`, and no npm script that invokes one.
  No Prisma, Drizzle, Knex, or node-pg-migrate. The `supabase/` directory has no `config.toml` —
  `supabase init` was never run.
- **The file set cannot run against an empty database.** The earliest file (`20260523`) is an
  `ALTER TABLE realtor_applications` against a table no migration in this directory creates. Seven
  of the twelve live tables have no `CREATE TABLE` migration at all, including `users` — 29 of its
  57 live columns were created by no migration here.

**The database was built by hand in the Supabase SQL editor.** These files were written alongside as
a record of intent. They are a changelog, not a build script.

## Do not run them

Running these files against the live database would cause real damage.

**Three are not re-runnable** and would error immediately, because each creates something that
already exists live:

| File | Why it errors |
|---|---|
| `20260530_quiz_sessions.sql` | Bare `CREATE TABLE public.quiz_sessions` — the table exists live with 35 columns. Also 3 bare `CREATE POLICY`. |
| `20260605_users_rls_update_policy.sql` | Bare `CREATE POLICY "Users can update own record"` — already exists. |
| `20260614_mm4_profiles_email_unique.sql` | Bare `ADD CONSTRAINT mm4_profiles_email_key` — already exists. |

This is not hypothetical. `20260605_users_rls_update_policy_fix.sql` exists *because* the unguarded
policy in the file above it failed in production once already; its own header comment records the
incident.

A migration that errors part-way leaves the schema **partially advanced with no record of how far it
got** — the worst state to be in, and worse than the drift being fixed.

**The other 26 are idempotent** (`IF NOT EXISTS` / `DROP … IF EXISTS` / `ON CONFLICT DO NOTHING`)
and would mostly no-op. But they would also create the `admin_audit_log` table and **13 columns that
are currently absent from the live database** — an unreviewed schema change arriving as a side
effect of a tooling step, not as a decision anyone made.

> **A note on that number.** There are **18** columns absent from the live database in total: 13
> that code actively references (`EXPECTED-BUT-ABSENT`) and 5 more that only a migration claims
> (`MIGRATED-BUT-ABSENT`). Of those 18, **13 are claimed by a migration in this directory** and
> would be created by a run. The remaining 5 — `realtor_applications.first_name`, `.last_name`,
> `.metro`, `users.auth_id`, and `users.md_email` — are claimed by **no migration at all** and would
> not be created. Running everything here would not fix the live defects; it would half-fix them
> while introducing an unreviewed change.

## Why the drift went unnoticed for so long

Every one of the absent columns was added with `ADD COLUMN IF NOT EXISTS`. That guard means a
migration which never applied still *reports success and leaves no trace.* A plain `ADD COLUMN`
would have errored loudly the same day and been fixed on the spot.

The guard that was meant to make these files safe to re-run is what made their never having run
invisible.

## What is authoritative instead

**`docs/schema/live-schema-2026-07-31.csv`** — an `information_schema` export of the live `public`
schema. See `docs/schema/README.md` for what it is and how to regenerate it.

> **The live database is the authority. Migration history and code reconcile to it — never the
> reverse.**
>
> Reasoning of the form *"the migration says X, so X is probably true"* is precisely what produced
> this situation. **A migration file is evidence of intent, never evidence of state.**

`docs/SCHEMA-REFERENCE.md` is the full column-by-column analysis built on that export.

## Current practice

Schema changes are made **in the Supabase SQL editor.** Then:

1. Re-export the schema (query in `docs/schema/README.md`).
2. Commit the new CSV.
3. `scripts/check-schema-drift.mjs` — which runs before every build — enforces the code side, failing
   the build if code references a column the snapshot does not have.

Adopting the Supabase CLI properly (baselining the live schema, then routing every future change
through it) remains a defensible alternative and is deferred, not rejected.

**If that is ever taken up, do not simply run `supabase db push`.** With `schema_migrations` absent,
the CLI would treat every file it recognises as unapplied. Baseline first — either
`supabase migration repair --status applied` for all 29 versions, or move these files out of the
CLI's scan path entirely and baseline from a fresh `db dump`. Rehearse against a branch or shadow
database before production, either way.

Note also that these filenames use an 8-digit `YYYYMMDD_` prefix, not the 14-digit
`YYYYMMDDHHMMSS_` the Supabase CLI expects, so they would need renaming before the CLI would
recognise them at all.

## These files are retained as history

They are the only written record of what each schema change was *meant* to do, and several are cited
by `docs/SCHEMA-REFERENCE.md` as the origin of a column. That makes them worth keeping.

**Do not delete them. Do not run them. Do not treat them as a description of the database.**
