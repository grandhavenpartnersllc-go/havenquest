# HavenQuest — Live Schema Reference

**Source of truth:** `live-schema-2026-07-31.csv` — an `information_schema` export taken from the
Supabase SQL editor on **31 July 2026**, covering every column in the `public` schema.
Parsed and verified: **12 tables, 231 columns**, each table's parsed column count matching its
declared `column_count`.

## The rule that governs this document

> **The live database is the authority.**
>
> Migration history and code reconcile to it — never the reverse. Where this document reports a
> disagreement, **the live database is what is true and the other two are what is wrong.** The only
> exception is an intentional schema change, which is applied to the database first and verified
> before code assumes it.

Reasoning of the form "the migration says X, so X is probably true" is what produced the drift this
document exists to record. A migration file is evidence of intent, never evidence of state.

## ⚠ This is a snapshot

This document describes the database **as of 31 July 2026 only.** It does not update itself and
nothing enforces it. Any DDL — a migration, a hand-edit in the SQL editor, a Supabase dashboard
change — invalidates it silently. **Regenerate it from a fresh `information_schema` export after
any schema change**, and treat an undated or stale copy as unreliable.

## Classifications

| Class | Meaning |
|---|---|
| **LIVE-AND-USED** | Exists live; code reads or writes it. |
| **LIVE-AND-ORPHANED** | Exists live; no *named* code reference. See the method caveats — `select('*')` and spread payloads hide real usage. |
| **EXPECTED-BUT-ABSENT** | Code reads or writes it; **does not exist live.** The dangerous class — these are live defects. |
| **MIGRATED-BUT-ABSENT** | A migration claims to create it; **does not exist live.** The class that proves the drift. |

Where a column is *both* expected-by-code and claimed-by-a-migration, it is classified
**EXPECTED-BUT-ABSENT** (the more actionable class) and cross-listed in the migration table below.

---

# Tables

## `admin_audit_log`

> **⚠ THIS TABLE DOES NOT EXIST IN THE LIVE DATABASE.** A `CREATE TABLE` migration claims it
> (`supabase/migrations/20260614_admin_audit_log.sql`), and code writes to it. Every write fails.

| Column | Type | Nullable | Live? | Created by migration? | Read by code? | Written by code? | Classification |
|---|---|---|---|---|---|---|---|
| `action` | — | — | **NO** | `20260614_admin_audit_log.sql` *(IF NOT EXISTS)* | No | `app/api/admin/assign-client/route.ts:45`<br>`app/api/admin/delete-staff/route.ts:41`<br>`app/api/admin/provision-staff/route.ts:137`<br>`app/api/admin/update-staff/route.ts:80` | **EXPECTED-BUT-ABSENT** |
| `admin_email` | — | — | **NO** | `20260614_admin_audit_log.sql` *(IF NOT EXISTS)* | No | `app/api/admin/assign-client/route.ts:45`<br>`app/api/admin/delete-staff/route.ts:41`<br>`app/api/admin/provision-staff/route.ts:137`<br>`app/api/admin/update-staff/route.ts:80` | **EXPECTED-BUT-ABSENT** |
| `created_at` | — | — | **NO** | `20260614_admin_audit_log.sql` *(IF NOT EXISTS)* | No | No | **MIGRATED-BUT-ABSENT** |
| `details` | — | — | **NO** | `20260614_admin_audit_log.sql` *(IF NOT EXISTS)* | No | `app/api/admin/assign-client/route.ts:45`<br>`app/api/admin/delete-staff/route.ts:41`<br>`app/api/admin/provision-staff/route.ts:137`<br>`app/api/admin/update-staff/route.ts:80` | **EXPECTED-BUT-ABSENT** |
| `id` | — | — | **NO** | `20260614_admin_audit_log.sql` *(IF NOT EXISTS)* | No | No | **MIGRATED-BUT-ABSENT** |
| `target_email` | — | — | **NO** | `20260614_admin_audit_log.sql` *(IF NOT EXISTS)* | No | `app/api/admin/assign-client/route.ts:45`<br>`app/api/admin/delete-staff/route.ts:41`<br>`app/api/admin/provision-staff/route.ts:137`<br>`app/api/admin/update-staff/route.ts:80` | **EXPECTED-BUT-ABSENT** |

Counts: LIVE-AND-USED 0 · LIVE-AND-ORPHANED 0 · EXPECTED-BUT-ABSENT 4 · MIGRATED-BUT-ABSENT 2

## `beta_testers`

Live columns: **5**. CREATE TABLE migration: **NO — table predates migration history**.

| Column | Type | Nullable | Live? | Created by migration? | Read by code? | Written by code? | Classification |
|---|---|---|---|---|---|---|---|
| `agreed_at` | timestamp with time zone | YES | Yes | No | No | No | LIVE-AND-ORPHANED |
| `email` | text | YES | Yes | No | No | Yes (1) | LIVE-AND-USED |
| `first_name` | text | YES | Yes | No | No | Yes (1) | LIVE-AND-USED |
| `id` | uuid | NO | Yes | No | No | No | LIVE-AND-ORPHANED |
| `ip_address` | text | YES | Yes | No | No | Yes (1) | LIVE-AND-USED |

Counts: LIVE-AND-USED 3 · LIVE-AND-ORPHANED 2 · EXPECTED-BUT-ABSENT 0 · MIGRATED-BUT-ABSENT 0

## `investor_interest`

Live columns: **10**. CREATE TABLE migration: **NO — table predates migration history**.

| Column | Type | Nullable | Live? | Created by migration? | Read by code? | Written by code? | Classification |
|---|---|---|---|---|---|---|---|
| `created_at` | timestamp with time zone | NO | Yes | No | No | No | LIVE-AND-ORPHANED |
| `email` | text | NO | Yes | No | No | Yes (1) | LIVE-AND-USED |
| `email_opt_in` | boolean | NO | Yes | No | No | Yes (1) | LIVE-AND-USED |
| `first_visited_at` | timestamp with time zone | YES | Yes | No | Yes (1) | Yes (1) | LIVE-AND-USED |
| `id` | uuid | NO | Yes | No | Yes (2) | No | LIVE-AND-USED |
| `last_visited_at` | timestamp with time zone | YES | Yes | No | No | Yes (1) | LIVE-AND-USED |
| `name` | text | NO | Yes | No | No | No | LIVE-AND-ORPHANED |
| `phone` | text | YES | Yes | No | No | Yes (1) | LIVE-AND-USED |
| `token` | text | NO | Yes | No | No | No | LIVE-AND-ORPHANED |
| `visit_count` | integer | NO | Yes | No | Yes (1) | Yes (1) | LIVE-AND-USED |

Counts: LIVE-AND-USED 7 · LIVE-AND-ORPHANED 3 · EXPECTED-BUT-ABSENT 0 · MIGRATED-BUT-ABSENT 0

## `leads`

Live columns: **7**. CREATE TABLE migration: **NO — table predates migration history**.

| Column | Type | Nullable | Live? | Created by migration? | Read by code? | Written by code? | Classification |
|---|---|---|---|---|---|---|---|
| `city` | text | NO | Yes | No | No | No | LIVE-AND-ORPHANED |
| `created_at` | timestamp with time zone | YES | Yes | No | No | No | LIVE-AND-ORPHANED |
| `event_type` | text | YES | Yes | No | No | Yes (1) | LIVE-AND-USED |
| `id` | uuid | NO | Yes | No | No | No | LIVE-AND-ORPHANED |
| `realtor_id` | text | YES | Yes | No | No | Yes (1) | LIVE-AND-USED |
| `status` | text | YES | Yes | No | No | Yes (1) | LIVE-AND-USED |
| `user_id` | uuid | YES | Yes | No | No | Yes (1) | LIVE-AND-USED |

Counts: LIVE-AND-USED 4 · LIVE-AND-ORPHANED 3 · EXPECTED-BUT-ABSENT 0 · MIGRATED-BUT-ABSENT 0

## `md_clients`

Live columns: **8**. CREATE TABLE migration: **yes**.

`select('*')` sites (read every column without naming any): `app/compass/meridian/(portal)/clients/page.tsx:23`, `app/compass/meridian/(portal)/clients/[email]/page.tsx:30`.

| Column | Type | Nullable | Live? | Created by migration? | Read by code? | Written by code? | Classification |
|---|---|---|---|---|---|---|---|
| `assigned_at` | timestamp with time zone | YES | Yes | `20260612_md_clients_table.sql` *(IF NOT EXISTS)* | No | No | LIVE-AND-ORPHANED |
| `client_email` | text | NO | Yes | `20260612_md_clients_table.sql` *(IF NOT EXISTS)* | Yes (1) | Yes (1) | LIVE-AND-USED |
| `id` | uuid | NO | Yes | `20260612_md_clients_table.sql` *(IF NOT EXISTS)* | No | No | LIVE-AND-ORPHANED |
| `internal_notes` | text | YES | Yes | `20260612_md_clients_table.sql` *(IF NOT EXISTS)* | No | Yes (1) | LIVE-AND-USED |
| `journey_health` | character varying | YES | Yes | `20260612_md_clients_table.sql` *(IF NOT EXISTS)* | No | Yes (3) | LIVE-AND-USED |
| `md_email` | text | NO | Yes | `20260612_md_clients_table.sql` *(IF NOT EXISTS)* | Yes (1) | Yes (1) | LIVE-AND-USED |
| `shared_notes` | text | YES | Yes | `20260612_md_clients_table.sql` *(IF NOT EXISTS)* | No | Yes (1) | LIVE-AND-USED |
| `status` | character varying | YES | Yes | `20260612_md_clients_table.sql` *(IF NOT EXISTS)* | No | Yes (2) | LIVE-AND-USED |

Counts: LIVE-AND-USED 6 · LIVE-AND-ORPHANED 2 · EXPECTED-BUT-ABSENT 0 · MIGRATED-BUT-ABSENT 0

## `messages`

Live columns: **10**. CREATE TABLE migration: **yes**.

`select('*')` sites (read every column without naming any): `app/compass/meridian/(portal)/clients/[email]/page.tsx:51`.

| Column | Type | Nullable | Live? | Created by migration? | Read by code? | Written by code? | Classification |
|---|---|---|---|---|---|---|---|
| `body` | text | NO | Yes | `20260612_messages_table.sql` *(IF NOT EXISTS)* | No | Yes (3) | LIVE-AND-USED |
| `client_email` | text | NO | Yes | `20260612_messages_table.sql` *(IF NOT EXISTS)* | No | Yes (3) | LIVE-AND-USED |
| `created_at` | timestamp with time zone | YES | Yes | `20260612_messages_table.sql` *(IF NOT EXISTS)* | No | No | LIVE-AND-ORPHANED |
| `id` | uuid | NO | Yes | `20260612_messages_table.sql` *(IF NOT EXISTS)* | Yes (4) | No | LIVE-AND-USED |
| `md_email` | text | NO | Yes | `20260612_messages_table.sql` *(IF NOT EXISTS)* | No | Yes (3) | LIVE-AND-USED |
| `notification_sent` | boolean | YES | Yes | `20260612_messages_table.sql` *(IF NOT EXISTS)* | No | Yes (4) | LIVE-AND-USED |
| `read` | boolean | YES | Yes | `20260612_messages_table.sql` *(IF NOT EXISTS)* | No | Yes (4) | LIVE-AND-USED |
| `sender_role` | character varying | NO | Yes | `20260612_messages_table.sql` *(IF NOT EXISTS)* | No | Yes (3) | LIVE-AND-USED |
| `subject` | text | YES | Yes | `20260612_messages_table.sql` *(IF NOT EXISTS)* | No | Yes (3) | LIVE-AND-USED |
| `updated_at` | timestamp with time zone | YES | Yes | `20260612_messages_table.sql` *(IF NOT EXISTS)* | No | No | LIVE-AND-ORPHANED |

Counts: LIVE-AND-USED 8 · LIVE-AND-ORPHANED 2 · EXPECTED-BUT-ABSENT 0 · MIGRATED-BUT-ABSENT 0

## `mm3_activity_events`

Live columns: **5**. CREATE TABLE migration: **yes**.

| Column | Type | Nullable | Live? | Created by migration? | Read by code? | Written by code? | Classification |
|---|---|---|---|---|---|---|---|
| `created_at` | timestamp with time zone | NO | Yes | `20260710_mm3_activity_events.sql` *(IF NOT EXISTS)* | No | No | LIVE-AND-ORPHANED |
| `event_type` | text | NO | Yes | `20260710_mm3_activity_events.sql` *(IF NOT EXISTS)* | No | Yes (1) | LIVE-AND-USED |
| `id` | uuid | NO | Yes | `20260710_mm3_activity_events.sql` *(IF NOT EXISTS)* | No | No | LIVE-AND-ORPHANED |
| `payload` | jsonb | NO | Yes | `20260710_mm3_activity_events.sql` *(IF NOT EXISTS)* | No | No | LIVE-AND-ORPHANED |
| `user_email` | text | NO | Yes | `20260710_mm3_activity_events.sql` *(IF NOT EXISTS)* | No | Yes (1) | LIVE-AND-USED |

Counts: LIVE-AND-USED 2 · LIVE-AND-ORPHANED 3 · EXPECTED-BUT-ABSENT 0 · MIGRATED-BUT-ABSENT 0

## `mm4_profiles`

Live columns: **50**. CREATE TABLE migration: **NO — table predates migration history**.

`select('*')` sites (read every column without naming any): `app/compass/meridian/(portal)/clients/page.tsx:39`, `app/compass/meridian/(portal)/clients/[email]/page.tsx:45`, `app/portal/mm4/components/MM4IntakeForm.tsx:118`.

Write payloads this audit cannot enumerate: app/portal/mm4/components/MM4IntakeForm.tsx:238 (`...formData` spread); app/portal/mm4/components/MM4IntakeForm.tsx:300 (`submitData` variable).

| Column | Type | Nullable | Live? | Created by migration? | Read by code? | Written by code? | Classification |
|---|---|---|---|---|---|---|---|
| `additional_must_haves` | text | YES | Yes | No | No | No | LIVE-AND-ORPHANED |
| `approximate_equity` | text | YES | Yes | No | No | No | LIVE-AND-ORPHANED |
| `areas_researched` | text | YES | Yes | No | No | No | LIVE-AND-ORPHANED |
| `best_time_to_reach` | text | YES | Yes | No | No | No | LIVE-AND-ORPHANED |
| `children_ages` | text | YES | Yes | No | No | No | LIVE-AND-ORPHANED |
| `city1_reasoning` | text | YES | Yes | No | No | No | LIVE-AND-ORPHANED |
| `city2_reasoning` | text | YES | Yes | No | No | No | LIVE-AND-ORPHANED |
| `city3_reasoning` | text | YES | Yes | No | No | No | LIVE-AND-ORPHANED |
| `confirmed_target_city` | text | YES | Yes | No | No | No | LIVE-AND-ORPHANED |
| `created_at` | timestamp with time zone | YES | Yes | No | No | No | LIVE-AND-ORPHANED |
| `current_address` | text | YES | Yes | No | No | No | LIVE-AND-ORPHANED |
| `current_city` | text | YES | Yes | No | Yes (1) | No | LIVE-AND-USED |
| `current_state` | text | YES | Yes | No | Yes (1) | No | LIVE-AND-USED |
| `current_zip` | text | YES | Yes | No | No | No | LIVE-AND-ORPHANED |
| `deal_breakers` | text | YES | Yes | No | No | No | LIVE-AND-ORPHANED |
| `email` | text | NO | Yes | No | Yes (1) | Yes (1) | LIVE-AND-USED |
| `employment_status` | text | YES | Yes | No | No | No | LIVE-AND-ORPHANED |
| `first_call_priority` | text | YES | Yes | `20260620_mm4_direction_fields.sql` *(IF NOT EXISTS)* | No | No | LIVE-AND-ORPHANED |
| `has_pets` | boolean | YES | Yes | No | No | No | LIVE-AND-ORPHANED |
| `home_listed` | boolean | YES | Yes | No | No | No | LIVE-AND-ORPHANED |
| `household_alignment` | text | YES | Yes | `20260620_mm4_direction_fields.sql` *(IF NOT EXISTS)* | No | No | LIVE-AND-ORPHANED |
| `household_members` | jsonb | YES | Yes | No | No | No | LIVE-AND-ORPHANED |
| `id` | uuid | NO | Yes | No | No | No | LIVE-AND-ORPHANED |
| `income_range_confirmed` | text | YES | Yes | No | No | No | LIVE-AND-ORPHANED |
| `last_completed_section` | integer | YES | Yes | No | No | Yes (1) | LIVE-AND-USED |
| `num_adults` | integer | YES | Yes | No | No | No | LIVE-AND-ORPHANED |
| `num_children` | integer | YES | Yes | No | No | No | LIVE-AND-ORPHANED |
| `origin_situation` | text | YES | Yes | No | No | No | LIVE-AND-ORPHANED |
| `partner_first_name` | text | YES | Yes | No | Yes (1) | No | LIVE-AND-USED |
| `partner_last_name` | text | YES | Yes | No | Yes (1) | No | LIVE-AND-USED |
| `pet_details` | text | YES | Yes | No | No | No | LIVE-AND-ORPHANED |
| `phone` | text | YES | Yes | No | Yes (1) | No | LIVE-AND-USED |
| `preferred_contact` | text | YES | Yes | No | No | No | LIVE-AND-ORPHANED |
| `primary_first_name` | text | YES | Yes | No | Yes (2) | No | LIVE-AND-USED |
| `primary_last_name` | text | YES | Yes | No | Yes (1) | No | LIVE-AND-USED |
| `purchase_contingent` | text | YES | Yes | No | No | No | LIVE-AND-ORPHANED |
| `quiz_session_id` | text | YES | Yes | `20260627_mm4_quiz_session_id.sql` *(IF NOT EXISTS)* | No | No | LIVE-AND-ORPHANED |
| `relocation_package` | boolean | YES | Yes | No | No | No | LIVE-AND-ORPHANED |
| `ruled_out_cities` | text | YES | Yes | No | No | No | LIVE-AND-ORPHANED |
| `special_notes` | text | YES | Yes | No | No | No | LIVE-AND-ORPHANED |
| `submitted` | boolean | YES | Yes | No | Yes (1) | No | LIVE-AND-USED |
| `submitted_at` | timestamp with time zone | YES | Yes | No | No | No | LIVE-AND-ORPHANED |
| `target_confidence` | text | YES | Yes | `20260620_mm4_direction_fields.sql` *(IF NOT EXISTS)* | No | No | LIVE-AND-ORPHANED |
| `target_move_date` | text | YES | Yes | No | No | No | LIVE-AND-ORPHANED |
| `timeline_flexibility` | text | YES | Yes | No | No | No | LIVE-AND-ORPHANED |
| `updated_at` | timestamp with time zone | YES | Yes | No | No | No | LIVE-AND-ORPHANED |
| `user_id` | uuid | YES | Yes | No | No | Yes (1) | LIVE-AND-USED |
| `why_now` | text | YES | Yes | No | No | No | LIVE-AND-ORPHANED |
| `why_texas` | text | YES | Yes | No | No | No | LIVE-AND-ORPHANED |
| `work_arrangement` | text | YES | Yes | No | No | No | LIVE-AND-ORPHANED |

Counts: LIVE-AND-USED 11 · LIVE-AND-ORPHANED 39 · EXPECTED-BUT-ABSENT 0 · MIGRATED-BUT-ABSENT 0

## `quiz_sessions`

Live columns: **35**. CREATE TABLE migration: **yes**.

| Column | Type | Nullable | Live? | Created by migration? | Read by code? | Written by code? | Classification |
|---|---|---|---|---|---|---|---|
| `annual_income` | numeric | YES | Yes | `20260530_quiz_sessions.sql` *(plain)* | No | Yes (1) | LIVE-AND-USED |
| `archetype` | text | YES | Yes | `20260618_quiz_v2_gateway.sql` *(IF NOT EXISTS)* | No | Yes (1) | LIVE-AND-USED |
| `buyer_profile` | jsonb | YES | Yes | `20260530_quiz_sessions.sql` *(plain)* | No | Yes (1) | LIVE-AND-USED |
| `cards_answered` | integer | YES | Yes | `20260618_quiz_v2_gateway.sql` *(IF NOT EXISTS)* | No | Yes (1) | LIVE-AND-USED |
| `community_feel` | text | YES | Yes | `20260618_quiz_v2_gateway.sql` *(IF NOT EXISTS)* | No | Yes (1) | LIVE-AND-USED |
| `completed` | boolean | YES | Yes | `20260530_quiz_sessions.sql` *(plain)* | No | Yes (1) | LIVE-AND-USED |
| `completion_percentage` | integer | YES | Yes | `20260618_quiz_v2_gateway.sql` *(IF NOT EXISTS)* | No | Yes (1) | LIVE-AND-USED |
| `created_at` | timestamp with time zone | YES | Yes | `20260530_quiz_sessions.sql` *(plain)* | No | No | LIVE-AND-ORPHANED |
| `culture` | — | — | **NO** | `20260619_personality_dimensions_complete.sql` *(IF NOT EXISTS)* | No | `services/quizSessionService.ts:47 (cond)` | **EXPECTED-BUT-ABSENT** |
| `current_step` | integer | NO | Yes | `20260530_quiz_sessions.sql` *(plain)* | No | Yes (2) | LIVE-AND-USED |
| `email` | text | YES | Yes | `20260530_quiz_sessions.sql` *(plain)* | No | Yes (1) | LIVE-AND-USED |
| `entry_path` | text | YES | Yes | `20260618_quiz_v2_gateway.sql` *(IF NOT EXISTS)* | No | Yes (1) | LIVE-AND-USED |
| `environment` | — | — | **NO** | `20260619_personality_dimensions_complete.sql` *(IF NOT EXISTS)* | No | `services/quizSessionService.ts:47 (cond)` | **EXPECTED-BUT-ABSENT** |
| `financial_data` | jsonb | YES | Yes | `20260618_quiz_v2_gateway.sql` *(IF NOT EXISTS)* | No | Yes (1) | LIVE-AND-USED |
| `first_name` | text | YES | Yes | `20260618_quiz_v2_gateway.sql` *(IF NOT EXISTS)* | No | Yes (1) | LIVE-AND-USED |
| `growth_profile` | integer | YES | Yes | `20260618_quiz_v2_gateway.sql` *(IF NOT EXISTS)* | No | Yes (1) | LIVE-AND-USED |
| `home_status` | text | YES | Yes | `20260618_quiz_v2_gateway.sql` *(IF NOT EXISTS)* | No | Yes (1) | LIVE-AND-USED |
| `household_size` | integer | YES | Yes | `20260530_quiz_sessions.sql` *(plain)* | No | Yes (1) | LIVE-AND-USED |
| `housing_preference` | text | YES | Yes | `20260530_quiz_sessions.sql` *(plain)* | No | No | LIVE-AND-ORPHANED |
| `id` | uuid | NO | Yes | `20260530_quiz_sessions.sql` *(plain)* | No | No | LIVE-AND-ORPHANED |
| `last_step` | integer | YES | Yes | `20260618_quiz_v2_gateway.sql` *(IF NOT EXISTS)* | No | No | LIVE-AND-ORPHANED |
| `lifestyle_orientation` | integer | YES | Yes | `20260618_quiz_v2_gateway.sql` *(IF NOT EXISTS)* | No | Yes (1) | LIVE-AND-USED |
| `metro_preference` | jsonb | YES | Yes | `20260618_quiz_v2_gateway.sql` *(IF NOT EXISTS)* | No | Yes (1) | LIVE-AND-USED |
| `move_timeline` | text | YES | Yes | `20260618_quiz_v2_gateway.sql` *(IF NOT EXISTS)* | No | Yes (1) | LIVE-AND-USED |
| `moving_timeline` | text | YES | Yes | `20260530_quiz_sessions.sql` *(plain)* | No | Yes (1) | LIVE-AND-USED |
| `must_haves` | jsonb | YES | Yes | `20260530_quiz_sessions.sql` *(plain)* | No | Yes (1) | LIVE-AND-USED |
| `nice_to_haves` | jsonb | YES | Yes | `20260530_quiz_sessions.sql` *(plain)* | No | Yes (1) | LIVE-AND-USED |
| `not_priorities` | jsonb | YES | Yes | `20260530_quiz_sessions.sql` *(plain)* | No | Yes (1) | LIVE-AND-USED |
| `origin_zip` | text | YES | Yes | `20260618_quiz_v2_gateway.sql` *(IF NOT EXISTS)* | No | Yes (1) | LIVE-AND-USED |
| `pace` | — | — | **NO** | `20260619_personality_dimensions_complete.sql` *(IF NOT EXISTS)* | No | `services/quizSessionService.ts:47 (cond)` | **EXPECTED-BUT-ABSENT** |
| `priorities` | jsonb | YES | Yes | `20260618_quiz_v2_gateway.sql` *(IF NOT EXISTS)* | No | Yes (1) | LIVE-AND-USED |
| `quiz_version` | text | YES | Yes | `20260618_quiz_v2_gateway.sql` *(IF NOT EXISTS)* | No | Yes (1) | LIVE-AND-USED |
| `session_id` | uuid | NO | Yes | `20260530_quiz_sessions.sql` *(plain)* | No | Yes (2) | LIVE-AND-USED |
| `started_at` | timestamp with time zone | YES | Yes | `20260618_quiz_v2_gateway.sql` *(IF NOT EXISTS)* | No | No | LIVE-AND-ORPHANED |
| `target_metro` | text | YES | Yes | `20260618_quiz_v2_gateway.sql` *(IF NOT EXISTS)* | No | Yes (1) | LIVE-AND-USED |
| `unassigned_priorities` | jsonb | YES | Yes | `20260705_users_quiz_sessions_unassigned_priorities.sql` *(IF NOT EXISTS)* | No | Yes (1) | LIVE-AND-USED |
| `updated_at` | timestamp with time zone | YES | Yes | `20260530_quiz_sessions.sql` *(plain)* | No | Yes (3) | LIVE-AND-USED |
| `work_situation` | text | YES | Yes | `20260618_quiz_v2_gateway.sql` *(IF NOT EXISTS)* | No | Yes (1) | LIVE-AND-USED |

Counts: LIVE-AND-USED 30 · LIVE-AND-ORPHANED 5 · EXPECTED-BUT-ABSENT 3 · MIGRATED-BUT-ABSENT 0

## `realtor_applications`

Live columns: **23**. CREATE TABLE migration: **NO — table predates migration history**.

`select('*')` sites (read every column without naming any): `app/compass/admin/(admin)/page.tsx:20`.

| Column | Type | Nullable | Live? | Created by migration? | Read by code? | Written by code? | Classification |
|---|---|---|---|---|---|---|---|
| `brokerage` | text | YES | Yes | No | No | Yes (1) | LIVE-AND-USED |
| `buyer_transaction_count` | integer | YES | Yes | No | No | Yes (1) | LIVE-AND-USED |
| `buyer_transaction_volume` | numeric | YES | Yes | No | No | Yes (1) | LIVE-AND-USED |
| `created_at` | timestamp with time zone | YES | Yes | No | Yes (1) | No | LIVE-AND-USED |
| `email` | text | NO | Yes | No | Yes (1) | Yes (1) | LIVE-AND-USED |
| `first_name` | — | — | **NO** | No | `app/compass/admin/(admin)/agents/page.tsx:22` | No | **EXPECTED-BUT-ABSENT** |
| `har_profile_url` | text | YES | Yes | `20260530_realtor_applications_new_fields.sql` *(IF NOT EXISTS)* | No | No | LIVE-AND-ORPHANED |
| `id` | uuid | NO | Yes | No | Yes (1) | No | LIVE-AND-USED |
| `interest_token` | text | YES | Yes | No | No | Yes (1) | LIVE-AND-USED |
| `last_name` | — | — | **NO** | No | `app/compass/admin/(admin)/agents/page.tsx:22` | No | **EXPECTED-BUT-ABSENT** |
| `license_type` | text | YES | Yes | `20260523_realtor_applications_trec_fields.sql` *(IF NOT EXISTS)* | No | Yes (1) | LIVE-AND-USED |
| `market_segments` | ARRAY | YES | Yes | `20260530_realtor_applications_new_fields.sql` *(IF NOT EXISTS)* | No | Yes (1) | LIVE-AND-USED |
| `market_specialty` | text | YES | Yes | No | No | Yes (1) | LIVE-AND-USED |
| `metro` | — | — | **NO** | No | `app/compass/admin/(admin)/agents/page.tsx:22` | No | **EXPECTED-BUT-ABSENT** |
| `name` | text | NO | Yes | No | No | Yes (1) | LIVE-AND-USED |
| `phone` | text | YES | Yes | No | No | Yes (1) | LIVE-AND-USED |
| `preferred_tier` | text | YES | Yes | `20260523_realtor_applications_trec_fields.sql` *(IF NOT EXISTS)* | No | No | LIVE-AND-ORPHANED |
| `profile_url` | text | YES | Yes | No | No | Yes (1) | LIVE-AND-USED |
| `seller_transaction_count` | integer | YES | Yes | No | No | Yes (1) | LIVE-AND-USED |
| `seller_transaction_volume` | numeric | YES | Yes | No | No | Yes (1) | LIVE-AND-USED |
| `standards_acknowledged` | boolean | YES | Yes | No | No | Yes (1) | LIVE-AND-USED |
| `status` | text | YES | Yes | No | Yes (1) | Yes (3) | LIVE-AND-USED |
| `transactions` | jsonb | YES | Yes | `20260530_realtor_applications_new_fields.sql` *(IF NOT EXISTS)* | No | No | LIVE-AND-ORPHANED |
| `trec_license_number` | text | YES | Yes | `20260523_realtor_applications_trec_fields.sql` *(IF NOT EXISTS)* | No | Yes (1) | LIVE-AND-USED |
| `why_join` | text | YES | Yes | `20260523_realtor_applications_trec_fields.sql` *(IF NOT EXISTS)* | No | Yes (1) | LIVE-AND-USED |
| `years_experience` | integer | YES | Yes | No | No | Yes (1) | LIVE-AND-USED |

Counts: LIVE-AND-USED 20 · LIVE-AND-ORPHANED 3 · EXPECTED-BUT-ABSENT 3 · MIGRATED-BUT-ABSENT 0

## `realtor_interest`

Live columns: **10**. CREATE TABLE migration: **NO — table predates migration history**.

| Column | Type | Nullable | Live? | Created by migration? | Read by code? | Written by code? | Classification |
|---|---|---|---|---|---|---|---|
| `created_at` | timestamp with time zone | YES | Yes | No | No | No | LIVE-AND-ORPHANED |
| `email` | text | NO | Yes | No | Yes (1) | Yes (1) | LIVE-AND-USED |
| `first_name` | text | NO | Yes | No | Yes (1) | Yes (1) | LIVE-AND-USED |
| `id` | uuid | NO | Yes | No | Yes (1) | No | LIVE-AND-USED |
| `last_name` | text | NO | Yes | No | Yes (1) | Yes (1) | LIVE-AND-USED |
| `market_specialty` | text | YES | Yes | No | Yes (1) | Yes (1) | LIVE-AND-USED |
| `phone` | text | YES | Yes | No | Yes (1) | Yes (1) | LIVE-AND-USED |
| `referral_source` | text | YES | Yes | No | No | Yes (1) | LIVE-AND-USED |
| `token` | text | NO | Yes | No | No | No | LIVE-AND-ORPHANED |
| `token_used` | boolean | YES | Yes | No | No | Yes (1) | LIVE-AND-USED |

Counts: LIVE-AND-USED 8 · LIVE-AND-ORPHANED 2 · EXPECTED-BUT-ABSENT 0 · MIGRATED-BUT-ABSENT 0

## `staff_accounts`

Live columns: **11**. CREATE TABLE migration: **yes**.

`select('*')` sites (read every column without naming any): `app/api/admin/update-staff/route.ts:31`, `app/compass/admin/(admin)/page.tsx:19`.

| Column | Type | Nullable | Live? | Created by migration? | Read by code? | Written by code? | Classification |
|---|---|---|---|---|---|---|---|
| `calendly_url` | text | YES | Yes | `20260614_staff_accounts.sql` *(IF NOT EXISTS)* | No | No | LIVE-AND-ORPHANED |
| `compass_walkthrough_complete` | boolean | YES | Yes | `20260614_staff_accounts.sql` *(IF NOT EXISTS)* | No | No | LIVE-AND-ORPHANED |
| `created_at` | timestamp with time zone | YES | Yes | `20260614_staff_accounts.sql` *(IF NOT EXISTS)* | No | No | LIVE-AND-ORPHANED |
| `email` | text | NO | Yes | `20260614_staff_accounts.sql` *(IF NOT EXISTS)* | Yes (1) | Yes (1) | LIVE-AND-USED |
| `full_name` | text | NO | Yes | `20260614_staff_accounts.sql` *(IF NOT EXISTS)* | Yes (2) | No | LIVE-AND-USED |
| `id` | uuid | NO | Yes | `20260614_staff_accounts.sql` *(IF NOT EXISTS)* | No | No | LIVE-AND-ORPHANED |
| `metro` | character varying | YES | Yes | `20260614_staff_accounts.sql` *(IF NOT EXISTS)* | No | No | LIVE-AND-ORPHANED |
| `microsoft_365_provisioned` | boolean | YES | Yes | `20260614_staff_accounts.sql` *(IF NOT EXISTS)* | No | No | LIVE-AND-ORPHANED |
| `role` | character varying | NO | Yes | `20260614_staff_accounts.sql` *(IF NOT EXISTS)* | No | Yes (1) | LIVE-AND-USED |
| `status` | character varying | YES | Yes | `20260614_staff_accounts.sql` *(IF NOT EXISTS)* | No | Yes (1) | LIVE-AND-USED |
| `updated_at` | timestamp with time zone | YES | Yes | `20260614_staff_accounts.sql` *(IF NOT EXISTS)* | No | No | LIVE-AND-ORPHANED |

Counts: LIVE-AND-USED 4 · LIVE-AND-ORPHANED 7 · EXPECTED-BUT-ABSENT 0 · MIGRATED-BUT-ABSENT 0

## `users`

Live columns: **57**. CREATE TABLE migration: **NO — table predates migration history**.

`select('*')` sites (read every column without naming any): `app/compass/admin/(admin)/page.tsx:18`, `app/compass/admin/(admin)/page.tsx:21`.

| Column | Type | Nullable | Live? | Created by migration? | Read by code? | Written by code? | Classification |
|---|---|---|---|---|---|---|---|
| `annual_income` | integer | YES | Yes | No | Yes (6) | Yes (3) | LIVE-AND-USED |
| `annual_income_override` | integer | YES | Yes | `20260627_users_income_override.sql` *(IF NOT EXISTS)* | Yes (4) | Yes (1) | LIVE-AND-USED |
| `archetype` | text | YES | Yes | `20260618_quiz_v2_gateway.sql` *(IF NOT EXISTS)* | Yes (3) | Yes (2) | LIVE-AND-USED |
| `auth_id` | — | — | **NO** | No | No | `app/api/users/route.ts:187 (cond)` | **EXPECTED-BUT-ABSENT** |
| `available_funds` | integer | YES | Yes | No | Yes (1) | Yes (1) | LIVE-AND-USED |
| `buyer_profile` | jsonb | YES | Yes | `20260528_users_buyer_profile.sql` *(IF NOT EXISTS)* | No | Yes (2) | LIVE-AND-USED |
| `chosen_communities` | ARRAY | YES | Yes | `20260604_users_chosen_communities.sql` *(IF NOT EXISTS)* | Yes (4) | Yes (2) | LIVE-AND-USED |
| `community_feel` | text | YES | Yes | `20260618_quiz_v2_gateway.sql` *(IF NOT EXISTS)* | No | No | LIVE-AND-ORPHANED |
| `created_at` | timestamp with time zone | YES | Yes | No | Yes (3) | No | LIVE-AND-USED |
| `culture` | integer | YES | Yes | `20260619_personality_dimensions_complete.sql` *(IF NOT EXISTS)* | Yes (4) | Yes (3) | LIVE-AND-USED |
| `current_milemarker` | integer | YES | Yes | No | Yes (8) | Yes (8) | LIVE-AND-USED |
| `dna_weighting_profile` | jsonb | YES | Yes | `20260620_weighting_profile.sql` *(IF NOT EXISTS)* | No | Yes (3) | LIVE-AND-USED |
| `email` | text | NO | Yes | No | Yes (13) | Yes (4) | LIVE-AND-USED |
| `engagement_paid` | boolean | YES | Yes | `20260628_users_welcome_engagement.sql` *(IF NOT EXISTS)* | Yes (1) | No | LIVE-AND-USED |
| `entry_path` | text | YES | Yes | `20260618_quiz_v2_gateway.sql` *(IF NOT EXISTS)* | No | No | LIVE-AND-ORPHANED |
| `environment` | integer | YES | Yes | `20260619_personality_dimensions_complete.sql` *(IF NOT EXISTS)* | Yes (4) | Yes (4) | LIVE-AND-USED |
| `exact_down_payment` | — | — | **NO** | `20260604_users_exact_financials.sql` *(IF NOT EXISTS)* | No | No | **MIGRATED-BUT-ABSENT** |
| `exact_home_proceeds` | integer | YES | Yes | `20260604_users_exact_financials.sql` *(IF NOT EXISTS)* | Yes (1) | Yes (1) | LIVE-AND-USED |
| `family_profile` | jsonb | YES | Yes | No | Yes (1) | Yes (1) | LIVE-AND-USED |
| `financial_picture` | jsonb | YES | Yes | `20260530_users_financial_picture.sql` *(IF NOT EXISTS)* | Yes (3) | Yes (2) | LIVE-AND-USED |
| `first_name` | text | NO | Yes | No | Yes (12) | Yes (4) | LIVE-AND-USED |
| `growth_profile` | integer | YES | Yes | `20260618_quiz_v2_gateway.sql` *(IF NOT EXISTS)* | Yes (4) | Yes (4) | LIVE-AND-USED |
| `home_status` | text | YES | Yes | `20260618_quiz_v2_gateway.sql` *(IF NOT EXISTS)* | Yes (2) | No | LIVE-AND-USED |
| `household_size` | text | YES | Yes | No | Yes (5) | Yes (3) | LIVE-AND-USED |
| `housing_preference` | text | YES | Yes | No | Yes (2) | Yes (2) | LIVE-AND-USED |
| `id` | uuid | NO | Yes | No | Yes (3) | Yes (1) | LIVE-AND-USED |
| `journey_intent_confirmed` | — | — | **NO** | `20260607_add_journey_intent_columns.sql` *(IF NOT EXISTS)* | No | No | **MIGRATED-BUT-ABSENT** |
| `journey_intent_confirmed_at` | — | — | **NO** | `20260607_add_journey_intent_columns.sql` *(IF NOT EXISTS)* | No | No | **MIGRATED-BUT-ABSENT** |
| `last_name` | — | — | **NO** | `20260614_users_profile_columns.sql` *(IF NOT EXISTS)* | `app/compass/admin/(admin)/clients/page.tsx:23`<br>`app/compass/meridian/(portal)/clients/page.tsx:33`<br>`app/compass/meridian/(portal)/clients/[email]/page.tsx:39`<br>`app/portal/profile/page.tsx:135` | `app/api/portal/update-profile/route.ts:64 (via updateFields)` | **EXPECTED-BUT-ABSENT** |
| `lender_name` | character varying | YES | Yes | No | Yes (2) | No | LIVE-AND-USED |
| `lifestyle_orientation` | integer | YES | Yes | `20260618_quiz_v2_gateway.sql` *(IF NOT EXISTS)* | Yes (4) | Yes (4) | LIVE-AND-USED |
| `loan_term_preference` | integer | YES | Yes | `20260604_users_loan_term.sql` *(IF NOT EXISTS)* | Yes (1) | Yes (1) | LIVE-AND-USED |
| `market_director_name` | character varying | YES | Yes | No | Yes (2) | No | LIVE-AND-USED |
| `md_email` | — | — | **NO** | No | `app/api/portal/update-profile/route.ts:35`<br>`app/portal/profile/page.tsx:135` | No | **EXPECTED-BUT-ABSENT** |
| `mm2_checklist` | jsonb | YES | Yes | No | Yes (1) | No | LIVE-AND-USED |
| `move_timeline` | text | YES | Yes | `20260618_quiz_v2_gateway.sql` *(IF NOT EXISTS)* | No | No | LIVE-AND-ORPHANED |
| `moving_timeline` | text | YES | Yes | No | Yes (4) | Yes (2) | LIVE-AND-USED |
| `must_haves` | ARRAY | YES | Yes | No | Yes (3) | Yes (2) | LIVE-AND-USED |
| `nice_to_haves` | ARRAY | YES | Yes | No | Yes (3) | Yes (2) | LIVE-AND-USED |
| `not_priorities` | ARRAY | YES | Yes | No | Yes (3) | Yes (2) | LIVE-AND-USED |
| `onboarding_acknowledged` | boolean | YES | Yes | No | Yes (1) | Yes (1) | LIVE-AND-USED |
| `origin_city` | text | YES | Yes | `20260614_users_profile_columns.sql` *(IF NOT EXISTS)* | Yes (3) | Yes (3) | LIVE-AND-USED |
| `origin_state` | text | YES | Yes | `20260614_users_profile_columns.sql` *(IF NOT EXISTS)* | Yes (3) | Yes (3) | LIVE-AND-USED |
| `origin_zip` | character varying | YES | Yes | No | Yes (2) | Yes (1) | LIVE-AND-USED |
| `pace` | integer | YES | Yes | `20260619_personality_dimensions_complete.sql` *(IF NOT EXISTS)* | Yes (4) | Yes (4) | LIVE-AND-USED |
| `partner_name` | text | YES | Yes | `20260614_users_profile_columns.sql` *(IF NOT EXISTS)* | Yes (1) | Yes (1) | LIVE-AND-USED |
| `phone` | text | YES | Yes | `20260614_users_profile_columns.sql` *(IF NOT EXISTS)* | Yes (1) | Yes (3) | LIVE-AND-USED |
| `portal_notes` | text | YES | Yes | No | Yes (1) | Yes (1) | LIVE-AND-USED |
| `preferred_city` | text | YES | Yes | No | No | No | LIVE-AND-ORPHANED |
| `profile_photo_url` | text | YES | Yes | `20260614_users_profile_columns.sql` *(IF NOT EXISTS)* | Yes (1) | Yes (2) | LIVE-AND-USED |
| `report_emailed` | boolean | YES | Yes | No | Yes (1) | Yes (1) | LIVE-AND-USED |
| `sandbox_committed` | boolean | YES | Yes | No | Yes (1) | Yes (1) | LIVE-AND-USED |
| `sandbox_committed_at` | timestamp with time zone | YES | Yes | No | Yes (1) | Yes (1) | LIVE-AND-USED |
| `sandbox_profile` | jsonb | YES | Yes | No | Yes (2) | Yes (2) | LIVE-AND-USED |
| `select_agent_name` | character varying | YES | Yes | No | Yes (2) | No | LIVE-AND-USED |
| `target_metro` | text | YES | Yes | `20260618_quiz_v2_gateway.sql` *(IF NOT EXISTS)* | No | No | LIVE-AND-ORPHANED |
| `theme_preference` | character varying | YES | Yes | No | Yes (1) | Yes (1) | LIVE-AND-USED |
| `top_city_matches` | jsonb | YES | Yes | No | Yes (1) | Yes (3) | LIVE-AND-USED |
| `unassigned_priorities` | jsonb | YES | Yes | `20260705_users_quiz_sessions_unassigned_priorities.sql` *(IF NOT EXISTS)* | Yes (3) | Yes (2) | LIVE-AND-USED |
| `updated_at` | timestamp with time zone | YES | Yes | No | No | No | LIVE-AND-ORPHANED |
| `user_role` | character varying | YES | Yes | `20260612_add_user_role.sql` *(IF NOT EXISTS)* | Yes (9) | Yes (2) | LIVE-AND-USED |
| `welcome_seen` | boolean | YES | Yes | `20260628_users_welcome_engagement.sql` *(IF NOT EXISTS)* | Yes (1) | Yes (1) | LIVE-AND-USED |
| `work_situation` | text | YES | Yes | `20260618_quiz_v2_gateway.sql` *(IF NOT EXISTS)* | Yes (1) | No | LIVE-AND-USED |

Counts: LIVE-AND-USED 51 · LIVE-AND-ORPHANED 6 · EXPECTED-BUT-ABSENT 3 · MIGRATED-BUT-ABSENT 3

---

# Summary

## Counts by table

| Table | LIVE-AND-USED | LIVE-AND-ORPHANED | EXPECTED-BUT-ABSENT | MIGRATED-BUT-ABSENT | Total |
|---|---|---|---|---|---|
| `admin_audit_log` | 0 | 0 | 4 | 2 | 6 |
| `beta_testers` | 3 | 2 | 0 | 0 | 5 |
| `investor_interest` | 7 | 3 | 0 | 0 | 10 |
| `leads` | 4 | 3 | 0 | 0 | 7 |
| `md_clients` | 6 | 2 | 0 | 0 | 8 |
| `messages` | 8 | 2 | 0 | 0 | 10 |
| `mm3_activity_events` | 2 | 3 | 0 | 0 | 5 |
| `mm4_profiles` | 11 | 39 | 0 | 0 | 50 |
| `quiz_sessions` | 30 | 5 | 3 | 0 | 38 |
| `realtor_applications` | 20 | 3 | 3 | 0 | 26 |
| `realtor_interest` | 8 | 2 | 0 | 0 | 10 |
| `staff_accounts` | 4 | 7 | 0 | 0 | 11 |
| `users` | 51 | 6 | 3 | 3 | 63 |
| **TOTAL** | **154** | **77** | **13** | **5** | **249** |

The first two columns sum to **231**, reconciling exactly against the CSV's 231 live columns.
The remaining **18** rows are columns that do not exist in the database at all.

## EXPECTED-BUT-ABSENT — code references a column that does not exist

**This is the actionable list.** Postgres/PostgREST reject the *entire* statement when any named
column is unknown, so each of these fails whole queries, not just one field.

| # | Column | Referenced from | Kind |
|---|---|---|---|
| 1 | `admin_audit_log.action` | WRITE `app/api/admin/assign-client/route.ts:45`<br>WRITE `app/api/admin/delete-staff/route.ts:41`<br>WRITE `app/api/admin/provision-staff/route.ts:137`<br>WRITE `app/api/admin/update-staff/route.ts:80` | write |
| 2 | `admin_audit_log.admin_email` | WRITE `app/api/admin/assign-client/route.ts:45`<br>WRITE `app/api/admin/delete-staff/route.ts:41`<br>WRITE `app/api/admin/provision-staff/route.ts:137`<br>WRITE `app/api/admin/update-staff/route.ts:80` | write |
| 3 | `admin_audit_log.details` | WRITE `app/api/admin/assign-client/route.ts:45`<br>WRITE `app/api/admin/delete-staff/route.ts:41`<br>WRITE `app/api/admin/provision-staff/route.ts:137`<br>WRITE `app/api/admin/update-staff/route.ts:80` | write |
| 4 | `admin_audit_log.target_email` | WRITE `app/api/admin/assign-client/route.ts:45`<br>WRITE `app/api/admin/delete-staff/route.ts:41`<br>WRITE `app/api/admin/provision-staff/route.ts:137`<br>WRITE `app/api/admin/update-staff/route.ts:80` | write |
| 5 | `quiz_sessions.culture` | WRITE `services/quizSessionService.ts:47 (cond)` | write |
| 6 | `quiz_sessions.environment` | WRITE `services/quizSessionService.ts:47 (cond)` | write |
| 7 | `quiz_sessions.pace` | WRITE `services/quizSessionService.ts:47 (cond)` | write |
| 8 | `realtor_applications.first_name` | READ `app/compass/admin/(admin)/agents/page.tsx:22` | read |
| 9 | `realtor_applications.last_name` | READ `app/compass/admin/(admin)/agents/page.tsx:22` | read |
| 10 | `realtor_applications.metro` | READ `app/compass/admin/(admin)/agents/page.tsx:22` | read |
| 11 | `users.auth_id` | WRITE `app/api/users/route.ts:187 (cond)` | write |
| 12 | `users.last_name` | READ `app/compass/admin/(admin)/clients/page.tsx:23`<br>READ `app/compass/meridian/(portal)/clients/page.tsx:33`<br>READ `app/compass/meridian/(portal)/clients/[email]/page.tsx:39`<br>READ `app/portal/profile/page.tsx:135`<br>WRITE `app/api/portal/update-profile/route.ts:64 (via updateFields)` | read + write |
| 13 | `users.md_email` | READ `app/api/portal/update-profile/route.ts:35`<br>READ `app/portal/profile/page.tsx:135` | read |

## MIGRATED-BUT-ABSENT — a migration claims a column that does not exist

| Column | Claimed by | Guard |
|---|---|---|
| `admin_audit_log.created_at` | `20260614_admin_audit_log.sql` | `IF NOT EXISTS` |
| `admin_audit_log.id` | `20260614_admin_audit_log.sql` | `IF NOT EXISTS` |
| `users.exact_down_payment` | `20260604_users_exact_financials.sql` | `IF NOT EXISTS` |
| `users.journey_intent_confirmed` | `20260607_add_journey_intent_columns.sql` | `IF NOT EXISTS` |
| `users.journey_intent_confirmed_at` | `20260607_add_journey_intent_columns.sql` | `IF NOT EXISTS` |

Cross-listed — also claimed by a migration, but classified EXPECTED-BUT-ABSENT above because code uses them:

| Column | Claimed by | Guard |
|---|---|---|
| `admin_audit_log.action` | `20260614_admin_audit_log.sql` | `IF NOT EXISTS` |
| `admin_audit_log.admin_email` | `20260614_admin_audit_log.sql` | `IF NOT EXISTS` |
| `admin_audit_log.details` | `20260614_admin_audit_log.sql` | `IF NOT EXISTS` |
| `admin_audit_log.target_email` | `20260614_admin_audit_log.sql` | `IF NOT EXISTS` |
| `quiz_sessions.culture` | `20260619_personality_dimensions_complete.sql` | `IF NOT EXISTS` |
| `quiz_sessions.environment` | `20260619_personality_dimensions_complete.sql` | `IF NOT EXISTS` |
| `quiz_sessions.pace` | `20260619_personality_dimensions_complete.sql` | `IF NOT EXISTS` |
| `users.last_name` | `20260614_users_profile_columns.sql` | `IF NOT EXISTS` |

Every one of these used `IF NOT EXISTS`. That guard is why the drift went unnoticed: an
`ADD COLUMN IF NOT EXISTS` that fails to apply reports success and leaves no trace. A plain
`ADD COLUMN` would have errored loudly and been fixed the same day.

## Tables with no `CREATE TABLE` migration

| Table | Migrations touching it | Status |
|---|---|---|
| `beta_testers` | **none at all** | live, base shape unrecorded |
| `investor_interest` | **none at all** | live, base shape unrecorded |
| `leads` | **none at all** | live, base shape unrecorded |
| `mm4_profiles` | 4 `ADD COLUMN` | live, base shape unrecorded |
| `realtor_applications` | 7 `ADD COLUMN` | live, base shape unrecorded |
| `realtor_interest` | **none at all** | live, base shape unrecorded |
| `users` | 32 `ADD COLUMN` | live, base shape unrecorded |

**7 of 12 live tables have no `CREATE TABLE` migration.** Their base column sets exist only in the
live database and in this document. `public.users` is the most consequential: 29 of its 57 live
columns are created by no migration in the repo.

## `select('*')` sites

These read every column without naming any, so they **cannot fail on an unknown column name** and
are invisible to a name-based drift check. They also silently pick up new columns.

| Site | Table |
|---|---|
| `app/compass/meridian/(portal)/clients/page.tsx:23` | `md_clients` |
| `app/compass/meridian/(portal)/clients/[email]/page.tsx:30` | `md_clients` |
| `app/compass/meridian/(portal)/clients/[email]/page.tsx:51` | `messages` |
| `app/compass/meridian/(portal)/clients/page.tsx:39` | `mm4_profiles` |
| `app/compass/meridian/(portal)/clients/[email]/page.tsx:45` | `mm4_profiles` |
| `app/portal/mm4/components/MM4IntakeForm.tsx:118` | `mm4_profiles` |
| `app/compass/admin/(admin)/page.tsx:20` | `realtor_applications` |
| `app/api/admin/update-staff/route.ts:31` | `staff_accounts` |
| `app/compass/admin/(admin)/page.tsx:19` | `staff_accounts` |
| `app/compass/admin/(admin)/page.tsx:18` | `users` |
| `app/compass/admin/(admin)/page.tsx:21` | `users` |

---

# Method and its limits

**Live** — parsed directly from the CSV. No inference.

**Created by migration** — every `CREATE TABLE` and `ADD COLUMN` in `supabase/migrations/`, with
line comments stripped so commented-out DDL never counts. All 66 `ADD COLUMN` occurrences in the
directory were captured and reconciled against a raw count.

**Read / written by code** — every `.select()` string and every `.insert()`/`.update()`/`.upsert()`
object-literal payload across `app`, `components`, `services`, `utils`, `lib` (`.ts`/`.tsx`), each
attributed to its **nearest preceding `.from('table')`**.

**Known blind spots — these make LIVE-AND-ORPHANED a weaker claim than the other three classes:**

1. `select('*')` sites name no columns. A column read only through one of them looks orphaned.
   This is why `mm4_profiles` shows 39 orphans: `MM4IntakeForm.tsx:118` selects `*`.
2. Write payloads built from a variable or a bare spread cannot be enumerated —
   `MM4IntakeForm.tsx:238` (`...formData`) and `:300` (`submitData`). `mm4_profiles` orphan counts
   are therefore **not** evidence those columns are unused.
3. `update-profile/route.ts:64` spreads `updateFields`; its nine keys were read from the source and
   added by hand.
4. Columns referenced only in raw SQL, RLS policies, database functions, triggers, or by an
   external client are not visible to this scan.

EXPECTED-BUT-ABSENT and MIGRATED-BUT-ABSENT are unaffected by blind spots 1 and 2 — those are
positive findings, derived from names the code states explicitly.

**Not verified:** whether any absent column exists under a different name; whether RLS policies
reference absent columns; and the live state of anything outside the `public` schema.
