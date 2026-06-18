-- Navigator Quiz v2.1 (Brief 1) — Pre-Quiz Gateway + 10 Quiz Cards
-- Adds entry-path-driven gateway fields, per-card answer columns, and
-- analytics/versioning columns to quiz_sessions, plus the matching
-- entry-path columns on users. Also documents first_name/origin_zip/
-- last_step/started_at, which were already live on quiz_sessions but
-- predate this repo's migration history (added by hand in the SQL Editor).

ALTER TABLE public.quiz_sessions
ADD COLUMN IF NOT EXISTS first_name text,
ADD COLUMN IF NOT EXISTS origin_zip text,
ADD COLUMN IF NOT EXISTS last_step integer,
ADD COLUMN IF NOT EXISTS started_at timestamptz,
ADD COLUMN IF NOT EXISTS entry_path text,
ADD COLUMN IF NOT EXISTS archetype text,
ADD COLUMN IF NOT EXISTS priorities jsonb,
ADD COLUMN IF NOT EXISTS community_feel text,
ADD COLUMN IF NOT EXISTS growth_profile integer,
ADD COLUMN IF NOT EXISTS lifestyle_orientation integer,
ADD COLUMN IF NOT EXISTS home_status text,
ADD COLUMN IF NOT EXISTS move_timeline text,
ADD COLUMN IF NOT EXISTS work_situation text,
ADD COLUMN IF NOT EXISTS financial_data jsonb,
ADD COLUMN IF NOT EXISTS metro_preference jsonb,
ADD COLUMN IF NOT EXISTS target_metro text,
ADD COLUMN IF NOT EXISTS quiz_version text DEFAULT '2.1',
ADD COLUMN IF NOT EXISTS completion_percentage integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS cards_answered integer DEFAULT 0;

ALTER TABLE public.users
ADD COLUMN IF NOT EXISTS entry_path text,
ADD COLUMN IF NOT EXISTS archetype text,
ADD COLUMN IF NOT EXISTS growth_profile integer,
ADD COLUMN IF NOT EXISTS lifestyle_orientation integer,
ADD COLUMN IF NOT EXISTS community_feel text,
ADD COLUMN IF NOT EXISTS move_timeline text,
ADD COLUMN IF NOT EXISTS home_status text,
ADD COLUMN IF NOT EXISTS work_situation text,
ADD COLUMN IF NOT EXISTS target_metro text;

NOTIFY pgrst, 'reload schema';
