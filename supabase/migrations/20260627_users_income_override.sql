ALTER TABLE public.users
ADD COLUMN IF NOT EXISTS annual_income_override integer;

NOTIFY pgrst, 'reload schema';
