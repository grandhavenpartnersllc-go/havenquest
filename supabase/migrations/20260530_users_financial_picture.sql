ALTER TABLE public.users
ADD COLUMN IF NOT EXISTS financial_picture JSONB;

NOTIFY pgrst, 'reload schema';
