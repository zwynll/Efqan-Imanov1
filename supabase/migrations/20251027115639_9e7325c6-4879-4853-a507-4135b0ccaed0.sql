-- Create users with auth.users (using extensions schema)
-- User 1: I kurs admin
INSERT INTO auth.users (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_token, email_change, email_change_token_new, recovery_token)
VALUES 
  ('00000000-0000-0000-0000-000000000000', gen_random_uuid(), 'authenticated', 'authenticated', 'rehimcabbarov@gmail.com', crypt('19.01', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{}', now(), now(), '', '', '', ''),
  ('00000000-0000-0000-0000-000000000000', gen_random_uuid(), 'authenticated', 'authenticated', 'turalceferov@gmail.com', crypt('19.02', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{}', now(), now(), '', '', '', ''),
  ('00000000-0000-0000-0000-000000000000', gen_random_uuid(), 'authenticated', 'authenticated', 'orxanmirzeyev@gmail.com', crypt('19.03', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{}', now(), now(), '', '', '', ''),
  ('00000000-0000-0000-0000-000000000000', gen_random_uuid(), 'authenticated', 'authenticated', 'farizyusifov@gmail.com', crypt('19.04', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{}', now(), now(), '', '', '', ''),
  ('00000000-0000-0000-0000-000000000000', gen_random_uuid(), 'authenticated', 'authenticated', 'efganimaov@gmail.com', crypt('0021', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{}', now(), now(), '', '', '', ''),
  ('00000000-0000-0000-0000-000000000000', gen_random_uuid(), 'authenticated', 'authenticated', 'aliramazan@gmail.com', crypt('199313', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{}', now(), now(), '', '', '', '');

-- Create profiles for users
INSERT INTO public.profiles (user_id, full_name)
SELECT id, 
  CASE email
    WHEN 'rehimcabbarov@gmail.com' THEN 'Rəhim Cabbarov'
    WHEN 'turalceferov@gmail.com' THEN 'Tural Cəfərov'
    WHEN 'orxanmirzeyev@gmail.com' THEN 'Orxan Mirzəyev'
    WHEN 'farizyusifov@gmail.com' THEN 'Fariz Yusifov'
    WHEN 'efganimaov@gmail.com' THEN 'Əfqan İmaov'
    WHEN 'aliramazan@gmail.com' THEN 'Əli Ramazan'
  END
FROM auth.users 
WHERE email IN ('rehimcabbarov@gmail.com', 'turalceferov@gmail.com', 'orxanmirzeyev@gmail.com', 'farizyusifov@gmail.com', 'efganimaov@gmail.com', 'aliramazan@gmail.com');

-- Assign roles to users
INSERT INTO public.user_roles (user_id, role, course_id)
SELECT 
  u.id,
  CASE u.email
    WHEN 'rehimcabbarov@gmail.com' THEN 'COURSE_1_ADMIN'::app_role
    WHEN 'turalceferov@gmail.com' THEN 'COURSE_2_ADMIN'::app_role
    WHEN 'orxanmirzeyev@gmail.com' THEN 'COURSE_3_ADMIN'::app_role
    WHEN 'farizyusifov@gmail.com' THEN 'COURSE_4_ADMIN'::app_role
    WHEN 'efganimaov@gmail.com' THEN 'MAIN_ADMIN_READ'::app_role
    WHEN 'aliramazan@gmail.com' THEN 'MAIN_ADMIN_FULL'::app_role
  END,
  CASE u.email
    WHEN 'rehimcabbarov@gmail.com' THEN 1
    WHEN 'turalceferov@gmail.com' THEN 2
    WHEN 'orxanmirzeyev@gmail.com' THEN 3
    WHEN 'farizyusifov@gmail.com' THEN 4
    ELSE NULL
  END
FROM auth.users u
WHERE u.email IN ('rehimcabbarov@gmail.com', 'turalceferov@gmail.com', 'orxanmirzeyev@gmail.com', 'farizyusifov@gmail.com', 'efganimaov@gmail.com', 'aliramazan@gmail.com');