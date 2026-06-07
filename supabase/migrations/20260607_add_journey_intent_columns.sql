-- Add journey intent tracking to users table
ALTER TABLE public.users
ADD COLUMN IF NOT EXISTS journey_intent_confirmed boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS journey_intent_confirmed_at timestamptz;
