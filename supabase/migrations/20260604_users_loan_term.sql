ALTER TABLE public.users
ADD COLUMN IF NOT EXISTS loan_term_preference integer;

NOTIFY pgrst, 'reload schema';
