ALTER TABLE public.opportunities
  ADD COLUMN IF NOT EXISTS location text NOT NULL DEFAULT 'Global',
  ADD COLUMN IF NOT EXISTS is_remote boolean NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS difficulty text NOT NULL DEFAULT 'Beginner',
  ADD COLUMN IF NOT EXISTS required_skills text[] NOT NULL DEFAULT '{}'::text[],
  ADD COLUMN IF NOT EXISTS compensation text,
  ADD COLUMN IF NOT EXISTS career_id uuid REFERENCES public.careers(id) ON DELETE SET NULL;

CREATE TABLE IF NOT EXISTS public.saved_opportunities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  opportunity_id uuid NOT NULL REFERENCES public.opportunities(id) ON DELETE CASCADE,
  note text,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, opportunity_id)
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.saved_opportunities TO authenticated;
GRANT ALL ON public.saved_opportunities TO service_role;

ALTER TABLE public.saved_opportunities ENABLE ROW LEVEL SECURITY;

CREATE POLICY "own saved opportunities" ON public.saved_opportunities
  FOR ALL TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);