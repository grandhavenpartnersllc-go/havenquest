CREATE TABLE public.quiz_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL UNIQUE,
  current_step INTEGER NOT NULL DEFAULT 1,
  annual_income NUMERIC,
  household_size INTEGER,
  housing_preference TEXT,
  moving_timeline TEXT,
  must_haves JSONB,
  nice_to_haves JSONB,
  not_priorities JSONB,
  buyer_profile JSONB,
  email TEXT,
  completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.quiz_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow anonymous insert" ON public.quiz_sessions
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow anonymous update by session_id" ON public.quiz_sessions
  FOR UPDATE USING (true);

CREATE POLICY "Allow anonymous select by session_id" ON public.quiz_sessions
  FOR SELECT USING (true);

NOTIFY pgrst, 'reload schema';
