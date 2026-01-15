-- Add new fields to students table for comprehensive profile
ALTER TABLE public.students
ADD COLUMN birth_place text,
ADD COLUMN registered_address text,
ADD COLUMN current_address text,
ADD COLUMN work_number text,
ADD COLUMN origin_location text,
ADD COLUMN service_start_year integer,
ADD COLUMN position text,
ADD COLUMN rank text,
ADD COLUMN awards text,
ADD COLUMN foreign_languages text,
ADD COLUMN sports_achievements text,
ADD COLUMN id_card_number text,
ADD COLUMN service_card_number text,
ADD COLUMN phone_home text,
ADD COLUMN military_service boolean DEFAULT false,
ADD COLUMN height numeric(5,2),
ADD COLUMN weight numeric(5,2);

-- Add year field to discipline_records
ALTER TABLE public.discipline_records
ADD COLUMN year integer;

-- Add course management fields
ALTER TABLE public.courses
ADD COLUMN level integer DEFAULT 1 CHECK (level >= 1 AND level <= 4),
ADD COLUMN is_active boolean DEFAULT true,
ADD COLUMN start_year integer,
ADD COLUMN end_year integer,
ADD COLUMN archived boolean DEFAULT false;

-- Create family_members table
CREATE TABLE public.family_members (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id uuid NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  relation text NOT NULL CHECK (relation IN ('Ata', 'Ana', 'Qardaş', 'Bacı', 'Qohum')),
  full_name text NOT NULL,
  birth_date date,
  birth_place text,
  address text,
  job text,
  phone_mobile text,
  phone_home text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Enable RLS on family_members
ALTER TABLE public.family_members ENABLE ROW LEVEL SECURITY;

-- RLS policies for family_members
CREATE POLICY "Everyone can view family members"
ON public.family_members
FOR SELECT
USING (true);

CREATE POLICY "Course admins can manage family members"
ON public.family_members
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.students s
    WHERE s.id = family_members.student_id
    AND (has_role(auth.uid(), 'MAIN_ADMIN_FULL'::app_role) OR is_course_admin_for(auth.uid(), s.course_id))
  )
);

-- Create course_leadership table
CREATE TABLE public.course_leadership (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  course_id integer NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE UNIQUE,
  full_name text NOT NULL,
  rank text,
  position text,
  email text,
  phone text,
  photo_url text,
  bio text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Enable RLS on course_leadership
ALTER TABLE public.course_leadership ENABLE ROW LEVEL SECURITY;

-- RLS policies for course_leadership
CREATE POLICY "Everyone can view course leadership"
ON public.course_leadership
FOR SELECT
USING (true);

CREATE POLICY "Main admin can manage course leadership"
ON public.course_leadership
FOR ALL
USING (has_role(auth.uid(), 'MAIN_ADMIN_FULL'::app_role));

-- Add sub-commander fields to teams
ALTER TABLE public.teams
ADD COLUMN commander_rank text,
ADD COLUMN sub_commander text,
ADD COLUMN sub_commander_rank text,
ADD COLUMN sub_commander_contact text;

-- Create triggers for updated_at
CREATE TRIGGER update_family_members_updated_at
BEFORE UPDATE ON public.family_members
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_course_leadership_updated_at
BEFORE UPDATE ON public.course_leadership
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Update courses with initial data
UPDATE public.courses SET level = id, start_year = 2024 WHERE level IS NULL;