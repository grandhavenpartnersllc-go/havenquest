CREATE TABLE IF NOT EXISTS public.staff_accounts (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  email text UNIQUE NOT NULL,
  full_name text NOT NULL,
  role varchar(20) NOT NULL CHECK (role IN ('market_director', 'state_director', 'admin')),
  metro varchar(20) CHECK (metro IN ('austin', 'dfw', 'houston', 'san_antonio', 'all')),
  status varchar(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')),
  calendly_url text,
  microsoft_365_provisioned boolean DEFAULT false,
  compass_walkthrough_complete boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE public.staff_accounts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admin only" ON public.staff_accounts
  USING (auth.jwt()->>'user_role' = 'admin');
