ALTER TABLE public.mm4_profiles
ADD COLUMN IF NOT EXISTS target_confidence text,
ADD COLUMN IF NOT EXISTS household_alignment text,
ADD COLUMN IF NOT EXISTS first_call_priority text;

NOTIFY pgrst, 'reload schema';
