-- Step 1: Clean up by dropping any existing policies and tables
DO $$
BEGIN
    -- Drop existing policies safely
    EXECUTE 'DROP POLICY IF EXISTS admin_view_all_profiles ON public.profiles';
    EXECUTE 'DROP POLICY IF EXISTS view_own_profile ON public.profiles';
    EXECUTE 'DROP POLICY IF EXISTS update_own_profile ON public.profiles';
    EXECUTE 'DROP POLICY IF EXISTS admin_update_any_profile ON public.profiles';
    EXECUTE 'DROP POLICY IF EXISTS profiles_self_read ON public.profiles';
    EXECUTE 'DROP POLICY IF EXISTS profiles_self_update ON public.profiles';
    EXECUTE 'DROP POLICY IF EXISTS profiles_admin_read_all ON public.profiles';
    EXECUTE 'DROP POLICY IF EXISTS basic_user_read_own ON public.profiles';
    EXECUTE 'DROP POLICY IF EXISTS basic_user_update_own ON public.profiles';
    EXECUTE 'DROP POLICY IF EXISTS admin_read_all ON public.profiles';
    EXECUTE 'DROP POLICY IF EXISTS admin_update_all ON public.profiles';
    
    -- Drop services policies
    EXECUTE 'DROP POLICY IF EXISTS view_services ON public.services';
    EXECUTE 'DROP POLICY IF EXISTS view_active_services ON public.services';
    EXECUTE 'DROP POLICY IF EXISTS admin_manage_services ON public.services';
    EXECUTE 'DROP POLICY IF EXISTS services_read ON public.services';
    EXECUTE 'DROP POLICY IF EXISTS services_admin_all ON public.services';
    EXECUTE 'DROP POLICY IF EXISTS service_read_public ON public.services';
    EXECUTE 'DROP POLICY IF EXISTS service_admin_all ON public.services';
    
    -- Drop storage policies
    EXECUTE 'DROP POLICY IF EXISTS "Public Read Access for Service Images" ON storage.objects';
    EXECUTE 'DROP POLICY IF EXISTS "Admin Upload for Service Images" ON storage.objects';
    EXECUTE 'DROP POLICY IF EXISTS "Admin Update for Service Images" ON storage.objects';
    EXECUTE 'DROP POLICY IF EXISTS "Admin Delete for Service Images" ON storage.objects';
    EXECUTE 'DROP POLICY IF EXISTS storage_public_read ON storage.objects';
    EXECUTE 'DROP POLICY IF EXISTS storage_admin_insert ON storage.objects';
    EXECUTE 'DROP POLICY IF EXISTS storage_admin_update ON storage.objects';
    EXECUTE 'DROP POLICY IF EXISTS storage_admin_delete ON storage.objects';
    EXECUTE 'DROP POLICY IF EXISTS storage_read_public ON storage.objects';
    EXECUTE 'DROP POLICY IF EXISTS storage_admin_write ON storage.objects';
    EXECUTE 'DROP POLICY IF EXISTS storage_admin_modify ON storage.objects';
    EXECUTE 'DROP POLICY IF EXISTS storage_admin_remove ON storage.objects';
    
    -- Drop functions
    EXECUTE 'DROP FUNCTION IF EXISTS public.is_admin()';
    EXECUTE 'DROP FUNCTION IF EXISTS public.is_admin_basic()';
    EXECUTE 'DROP FUNCTION IF EXISTS public.is_admin_secure()';
    EXECUTE 'DROP FUNCTION IF EXISTS public.get_user_role(UUID)';
    
    -- Drop triggers 
    EXECUTE 'DROP TRIGGER IF EXISTS update_profiles_updated_at ON public.profiles';
    EXECUTE 'DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users';
    
    -- Drop trigger functions
    EXECUTE 'DROP FUNCTION IF EXISTS public.handle_updated_at()';
    EXECUTE 'DROP FUNCTION IF EXISTS public.handle_new_user()';
END
$$;

-- Step 2: Create core tables
-- Create profiles table to store user metadata
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create services table
CREATE TABLE IF NOT EXISTS public.services (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  duration INTEGER NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  category TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'Active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create bookings table
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

-- Create settings table
CREATE TABLE IF NOT EXISTS public.settings (
  id SERIAL PRIMARY KEY,
  key TEXT NOT NULL UNIQUE,
  value TEXT NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create customers table
CREATE TABLE IF NOT EXISTS public.customers (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  phone TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Step 3: Enable Row Level Security on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;

-- Step 4: Create helper functions
-- Function to get user role safely (bypasses RLS)
CREATE OR REPLACE FUNCTION public.get_user_role(user_id UUID)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  user_role TEXT;
BEGIN
  -- Temporarily disable RLS for this query
  SET LOCAL row_security = off;
  
  -- Get the role directly from the profiles table
  SELECT role INTO user_role
  FROM public.profiles
  WHERE id = user_id;
  
  -- Reset row security
  RESET row_security;
  
  RETURN user_role;
EXCEPTION
  WHEN OTHERS THEN
    RESET row_security;
    RETURN 'user'; -- Default to user role
END;
$$;

-- Function to check if current user is admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN (SELECT get_user_role(auth.uid()) = 'admin');
EXCEPTION
  WHEN OTHERS THEN
    RETURN FALSE;
END;
$$;

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Function to create profile for new users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, role)
  VALUES (NEW.id, NEW.email, 'user');
  RETURN NEW;
END;
$$;

-- Step 5: Create triggers
-- Trigger to update updated_at column
CREATE TRIGGER update_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();

-- Trigger to create profile for new users
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Step 6: Create RLS policies for profiles
-- Allow users to view their own profile
CREATE POLICY view_own_profile ON public.profiles
  FOR SELECT USING (auth.uid() = id);

-- Allow users to update their own profile
CREATE POLICY update_own_profile ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- Allow admins to view all profiles
CREATE POLICY admin_view_all_profiles ON public.profiles
  FOR SELECT USING (is_admin());

-- Allow admins to update any profile
CREATE POLICY admin_update_any_profile ON public.profiles
  FOR UPDATE USING (is_admin());

-- Step 7: Create RLS policies for services
-- Allow anyone to view services
CREATE POLICY view_services ON public.services
  FOR SELECT USING (true);

-- Allow only admins to manage services
CREATE POLICY admin_manage_services ON public.services
  FOR ALL USING (is_admin());

-- Step 8: Create RLS policies for storage
-- Allow anyone to read service images
CREATE POLICY "Public Read Access for Service Images" ON storage.objects
  FOR SELECT USING (bucket_id = 'service-images');

-- Allow only admins to upload service images
CREATE POLICY "Admin Upload for Service Images" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'service-images' AND
    (storage.extension(name) IN ('jpg', 'jpeg', 'png', 'gif', 'webp')) AND
    is_admin()
  );

-- Allow only admins to update service images
CREATE POLICY "Admin Update for Service Images" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'service-images' AND
    is_admin()
  );

-- Allow only admins to delete service images
CREATE POLICY "Admin Delete for Service Images" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'service-images' AND
    is_admin()
  );

-- Step 9: Create policies for bookings
CREATE POLICY "Enable read access" ON public.bookings
  FOR SELECT USING (auth.role() = 'authenticated');

-- Step 10: Create policies for settings
CREATE POLICY "Enable read access" ON public.settings
  FOR SELECT USING (auth.role() = 'authenticated');

-- Step 11: Create policies for customers
CREATE POLICY "Enable read access" ON public.customers
  FOR SELECT USING (auth.role() = 'authenticated');

-- Step 12: Insert sample data
-- Insert initial services
INSERT INTO services (name, description, duration, price, category)
VALUES 
('Basic Wash', 'Exterior wash with hand dry', 30, 499, 'Wash'),
('Premium Wash', 'Exterior wash, hand dry, and interior vacuum', 45, 799, 'Wash'),
('Steam Wash', 'Deep cleaning with steam technology', 60, 999, 'Wash'),
('Interior Detailing', 'Complete interior cleaning and conditioning', 120, 1499, 'Detailing'),
('Exterior Detailing', 'Clay bar treatment, polishing, and waxing', 180, 1999, 'Detailing'),
('Full Detailing', 'Complete interior and exterior detailing package', 300, 2999, 'Detailing'),
('Paint Protection Film', 'Premium PPF installation', 480, 15999, 'Protection')
ON CONFLICT DO NOTHING;

-- Insert booking closure setting
INSERT INTO settings (key, value)
VALUES ('booking_closure', '{"isClosed": false, "endTime": null}')
ON CONFLICT (key) DO NOTHING;

-- Create an admin user if it doesn't exist yet
-- Note: This will only work if you manually create a user with this email through the Supabase UI first
INSERT INTO public.profiles (id, email, role)
SELECT 
    id,
    email,
    'admin'  -- Make this user an admin
FROM auth.users 
WHERE email = 'admin@diamondsteamcarwash.com'  -- Replace with your admin email
ON CONFLICT (id) DO UPDATE SET role = 'admin'; 