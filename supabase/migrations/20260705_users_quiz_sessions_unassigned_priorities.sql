-- Adds the genuine 4th priorities bucket ("never touched" categories), separate
-- from not_priorities (which now holds only genuine "Would Be Nice" picks).
-- See build_priorities_fourth_bucket.md / fix_priorities_and_interim_weighting.md.
--
-- Applied manually via Supabase dashboard SQL editor (no direct DB connection
-- available in this environment) and verified via information_schema.columns:
-- both users.unassigned_priorities and quiz_sessions.unassigned_priorities
-- confirmed present, type jsonb.

ALTER TABLE users ADD COLUMN IF NOT EXISTS unassigned_priorities JSONB;
ALTER TABLE quiz_sessions ADD COLUMN IF NOT EXISTS unassigned_priorities JSONB;
