CREATE TABLE IF NOT EXISTS public.messages (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  client_email text NOT NULL,
  md_email text NOT NULL,
  sender_role varchar(20) NOT NULL,
  subject text,
  body text NOT NULL,
  read boolean DEFAULT false,
  notification_sent boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "MD can read messages"
  ON public.messages FOR SELECT
  USING (
    md_email = (SELECT email FROM public.users WHERE id = auth.uid())
    OR
    client_email = (SELECT email FROM public.users WHERE id = auth.uid())
  );

CREATE POLICY "MD can insert messages"
  ON public.messages FOR INSERT
  WITH CHECK (
    md_email = (SELECT email FROM public.users WHERE id = auth.uid())
    OR
    client_email = (SELECT email FROM public.users WHERE id = auth.uid())
  );

CREATE POLICY "Users can update own messages read status"
  ON public.messages FOR UPDATE
  USING (
    client_email = (SELECT email FROM public.users WHERE id = auth.uid())
    OR
    md_email = (SELECT email FROM public.users WHERE id = auth.uid())
  );
