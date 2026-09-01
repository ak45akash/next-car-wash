-- Diamond Car Wash - Supabase Fresh Project Setup (Idempotent)
-- This script creates core tables, functions, triggers, RLS policies,
-- inserts initial data, and configures Storage. Safe to run multiple times.

-- =============================
-- 1) Core Tables
-- =============================

-- Profiles: stores user metadata linked to auth.users
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Services offered by the business
CREATE TABLE IF NOT EXISTS public.services (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  duration INTEGER NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  category TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'Active',
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Customer bookings
CREATE TABLE IF NOT EXISTS public.bookings (
  id SERIAL PRIMARY KEY,
  customer_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  car_model TEXT NOT NULL,
  service_id TEXT NOT NULL,
  service_name TEXT NOT NULL,
  service_price DECIMAL(10,2) NOT NULL,
  date DATE NOT NULL,
  time_slot TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'Upcoming',
  payment_method TEXT NOT NULL,
  payment_status TEXT NOT NULL DEFAULT 'Pending',
  upi_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Key/value app settings (e.g., booking closure)
CREATE TABLE IF NOT EXISTS public.settings (
  id SERIAL PRIMARY KEY,
  key TEXT NOT NULL UNIQUE,
  value TEXT NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Customers directory
CREATE TABLE IF NOT EXISTS public.customers (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  phone TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- =============================
-- 2) Enable RLS
-- =============================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;

-- =============================
-- 3) Helper Functions and Triggers
-- =============================

-- Update updated_at column on row changes
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Create profile for new auth user
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, role)
  VALUES (NEW.id, NEW.email, 'user')
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

-- Get user role bypassing RLS safely
CREATE OR REPLACE FUNCTION public.get_user_role(user_id UUID)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  user_role TEXT;
BEGIN
  SET LOCAL row_security = off;
  SELECT role INTO user_role FROM public.profiles WHERE id = user_id;
  RESET row_security;
  RETURN COALESCE(user_role, 'user');
EXCEPTION
  WHEN OTHERS THEN
    RESET row_security;
    RETURN 'user';
END;
$$;

-- Check if current user is admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN (SELECT public.get_user_role(auth.uid()) = 'admin');
EXCEPTION
  WHEN OTHERS THEN
    RETURN FALSE;
END;
$$;

-- Triggers
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'update_profiles_updated_at'
  ) THEN
    CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'on_auth_user_created'
  ) THEN
    CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
  END IF;
END $$;

-- =============================
-- 4) RLS Policies
-- =============================

-- Clean up possible prior policies (safe on fresh DB)
DO $$
BEGIN
  EXECUTE 'DROP POLICY IF EXISTS view_own_profile ON public.profiles';
  EXECUTE 'DROP POLICY IF EXISTS update_own_profile ON public.profiles';
  EXECUTE 'DROP POLICY IF EXISTS admin_view_all_profiles ON public.profiles';
  EXECUTE 'DROP POLICY IF EXISTS admin_update_any_profile ON public.profiles';
  EXECUTE 'DROP POLICY IF EXISTS service_read_public ON public.services';
  EXECUTE 'DROP POLICY IF EXISTS admin_manage_services ON public.services';
  EXECUTE 'DROP POLICY IF EXISTS allow_public_create_bookings ON public.bookings';
  EXECUTE 'DROP POLICY IF EXISTS settings_public_read ON public.settings';
  EXECUTE 'DROP POLICY IF EXISTS customers_auth_read ON public.customers';
END $$;

-- Profiles
CREATE POLICY view_own_profile ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY update_own_profile ON public.profiles
  FOR UPDATE USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

CREATE POLICY admin_view_all_profiles ON public.profiles
  FOR SELECT USING (public.is_admin());

CREATE POLICY admin_update_any_profile ON public.profiles
  FOR UPDATE USING (public.is_admin());

-- Services
CREATE POLICY service_read_public ON public.services
  FOR SELECT USING (true);

CREATE POLICY admin_manage_services ON public.services
  FOR ALL USING (public.is_admin());

-- Bookings
-- Allow public to create bookings (for public booking form)
CREATE POLICY allow_public_create_bookings ON public.bookings
  FOR INSERT WITH CHECK (true);

-- Optionally allow authenticated users to read bookings (dashboard)
CREATE POLICY bookings_auth_read ON public.bookings
  FOR SELECT USING (auth.role() = 'authenticated');

-- Settings
CREATE POLICY settings_public_read ON public.settings
  FOR SELECT USING (true);

-- Customers
CREATE POLICY customers_auth_read ON public.customers
  FOR SELECT USING (auth.role() = 'authenticated');

-- =============================
-- 5) Seed Data
-- =============================
INSERT INTO public.services (name, description, duration, price, category)
VALUES 
  ('Basic Wash', 'Exterior wash with hand dry', 30, 499, 'Wash'),
  ('Premium Wash', 'Exterior wash, hand dry, and interior vacuum', 45, 799, 'Wash'),
  ('Steam Wash', 'Deep cleaning with steam technology', 60, 999, 'Wash'),
  ('Interior Detailing', 'Complete interior cleaning and conditioning', 120, 1499, 'Detailing'),
  ('Exterior Detailing', 'Clay bar treatment, polishing, and waxing', 180, 1999, 'Detailing'),
  ('Full Detailing', 'Complete interior and exterior detailing package', 300, 2999, 'Detailing'),
  ('Paint Protection Film', 'Premium PPF installation', 480, 15999, 'Protection')
ON CONFLICT DO NOTHING;

INSERT INTO public.settings (key, value)
VALUES ('booking_closure', '{"isClosed": false, "endTime": null}')
ON CONFLICT (key) DO NOTHING;

-- =============================
-- 6) Storage: Bucket and Policies (service-images)
-- =============================

-- IMPORTANT: Supabase-managed storage tables are owned by internal roles.
-- Do NOT ALTER storage.buckets/objects here. Create the bucket via Dashboard:
--   Storage → Create bucket → id/name: service-images → Public: ON
-- Then run the following block to create storage policies. It will skip
-- automatically if your SQL role lacks privileges (no-op on error).

DO $$
BEGIN
  BEGIN
    EXECUTE 'DROP POLICY IF EXISTS "Public Read Access for Service Images" ON storage.objects';
    EXECUTE 'DROP POLICY IF EXISTS "Authenticated Upload for Service Images" ON storage.objects';
    EXECUTE 'DROP POLICY IF EXISTS "Authenticated Update for Service Images" ON storage.objects';
    EXECUTE 'DROP POLICY IF EXISTS "Authenticated Delete for Service Images" ON storage.objects';
  EXCEPTION WHEN insufficient_privilege THEN
    NULL; -- skip drops if not owner
  END;

  BEGIN
    EXECUTE 'CREATE POLICY "Public Read Access for Service Images" '
            'ON storage.objects FOR SELECT '
            'USING (bucket_id = ''service-images'')';
  EXCEPTION WHEN insufficient_privilege THEN NULL; END;

  BEGIN
    EXECUTE 'CREATE POLICY "Authenticated Upload for Service Images" '
            'ON storage.objects FOR INSERT '
            'WITH CHECK ( '
            '  bucket_id = ''service-images'' AND '
            '  auth.role() = ''authenticated'' AND '
            '  (storage.extension(name) IN (''jpg'', ''jpeg'', ''png'', ''gif'', ''webp'')) '
            ')';
  EXCEPTION WHEN insufficient_privilege THEN NULL; END;

  BEGIN
    EXECUTE 'CREATE POLICY "Authenticated Update for Service Images" '
            'ON storage.objects FOR UPDATE '
            'USING ( '
            '  bucket_id = ''service-images'' AND '
            '  auth.role() = ''authenticated'' '
            ')';
  EXCEPTION WHEN insufficient_privilege THEN NULL; END;

  BEGIN
    EXECUTE 'CREATE POLICY "Authenticated Delete for Service Images" '
            'ON storage.objects FOR DELETE '
            'USING ( '
            '  bucket_id = ''service-images'' AND '
            '  auth.role() = ''authenticated'' '
            ')';
  EXCEPTION WHEN insufficient_privilege THEN NULL; END;
END $$;

-- =============================
-- 7) Optional: Promote an admin by email (run after user exists in auth.users)
-- UPDATE public.profiles SET role = 'admin' WHERE email = 'admin@diamondsteamcarwash.com';

-- End of setup


