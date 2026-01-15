ALTER TABLE public.teams
  ADD COLUMN IF NOT EXISTS sub_commander_1 text,
  ADD COLUMN IF NOT EXISTS sub_commander_1_rank text,
  ADD COLUMN IF NOT EXISTS sub_commander_1_contact text,
  ADD COLUMN IF NOT EXISTS sub_commander_2 text,
  ADD COLUMN IF NOT EXISTS sub_commander_2_rank text,
  ADD COLUMN IF NOT EXISTS sub_commander_2_contact text,
  ADD COLUMN IF NOT EXISTS sub_commander_3 text,
  ADD COLUMN IF NOT EXISTS sub_commander_3_rank text,
  ADD COLUMN IF NOT EXISTS sub_commander_3_contact text;

UPDATE public.teams
SET
  sub_commander_1 = sub_commander,
  sub_commander_1_rank = sub_commander_rank,
  sub_commander_1_contact = sub_commander_contact
WHERE sub_commander IS NOT NULL
  AND sub_commander_1 IS NULL;

ALTER TABLE public.teams
  DROP COLUMN IF EXISTS sub_commander,
  DROP COLUMN IF EXISTS sub_commander_rank,
  DROP COLUMN IF EXISTS sub_commander_contact;

CREATE TABLE IF NOT EXISTS public.course_leadership_staff (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id integer NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  full_name text NOT NULL,
  rank text,
  position text,
  email text,
  phone text,
  photo_url text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

ALTER TABLE public.course_leadership_staff ENABLE ROW LEVEL SECURITY;

CREATE POLICY IF NOT EXISTS "Everyone can view course leadership staff"
ON public.course_leadership_staff
FOR SELECT
USING (true);

CREATE POLICY IF NOT EXISTS "Main admin can manage course leadership staff"
ON public.course_leadership_staff
FOR ALL
USING (has_role(auth.uid(), 'MAIN_ADMIN_FULL'::app_role));

CREATE TRIGGER IF NOT EXISTS update_course_leadership_staff_updated_at
BEFORE UPDATE ON public.course_leadership_staff
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

