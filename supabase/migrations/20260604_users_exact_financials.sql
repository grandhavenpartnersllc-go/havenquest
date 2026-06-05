ALTER TABLE public.users
ADD COLUMN IF NOT EXISTS exact_down_payment numeric,
ADD COLUMN IF NOT EXISTS exact_home_proceeds numeric;

NOTIFY pgrst, 'reload schema';
