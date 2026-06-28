ALTER TABLE public.mm4_profiles
ADD COLUMN IF NOT EXISTS quiz_session_id text;

NOTIFY pgrst, 'reload schema';
