CREATE TABLE IF NOT EXISTS public.md_clients (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  md_email text NOT NULL,
  client_email text NOT NULL,
  assigned_at timestamptz DEFAULT now(),
  status varchar(20) DEFAULT 'active',
  journey_health varchar(20) DEFAULT 'on_track',
  internal_notes text,
  shared_notes text,
  UNIQUE(md_email, client_email)
);

ALTER TABLE public.md_clients ENABLE ROW LEVEL SECURITY;

CREATE POLICY "MD can read own client assignments"
  ON public.md_clients FOR SELECT
  USING (md_email = (SELECT email FROM public.users WHERE id = auth.uid()));

CREATE POLICY "MD can update own client records"
  ON public.md_clients FOR UPDATE
  USING (md_email = (SELECT email FROM public.users WHERE id = auth.uid()));

CREATE POLICY "MD can insert client assignments"
  ON public.md_clients FOR INSERT
  WITH CHECK (md_email = (SELECT email FROM public.users WHERE id = auth.uid()));

CREATE POLICY "Clients can read own shared notes"
  ON public.md_clients FOR SELECT
  USING (client_email = (SELECT email FROM public.users WHERE id = auth.uid()));
