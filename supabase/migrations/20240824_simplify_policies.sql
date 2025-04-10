-- IMPORTANT: Drop existing policies first
DROP POLICY IF EXISTS view_own_profile ON public.profiles;
DROP POLICY IF EXISTS update_own_profile ON public.profiles;
DROP POLICY IF EXISTS admin_view_all_profiles ON public.profiles;
DROP POLICY IF EXISTS admin_update_any_profile ON public.profiles;

-- Drop the services policies
DROP POLICY IF EXISTS view_services ON public.services;
DROP POLICY IF EXISTS view_active_services ON public.services;
DROP POLICY IF EXISTS admin_manage_services ON public.services;

-- Drop the storage policies
DROP POLICY IF EXISTS "Public Read Access for Service Images" ON storage.objects;
DROP POLICY IF EXISTS "Admin Upload for Service Images" ON storage.objects;
DROP POLICY IF EXISTS "Admin Update for Service Images" ON storage.objects;
DROP POLICY IF EXISTS "Admin Delete for Service Images" ON storage.objects;

-- Drop any existing is_admin function to recreate it
DROP FUNCTION IF EXISTS is_admin();

-- Create simplified policies for profiles

-- Step 1: Simple self-read policy (no role check)
CREATE POLICY profiles_self_read ON public.profiles
  FOR SELECT USING (auth.uid() = id);

-- Step 2: Simple self-update policy (no role check)
CREATE POLICY profiles_self_update ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- Step 3: Create a very simple admin check function that avoids recursion
CREATE OR REPLACE FUNCTION public.is_admin_basic()
RETURNS BOOLEAN AS $$
DECLARE
  user_role VARCHAR;
BEGIN
  -- Direct query with no policy dependency
  SELECT role INTO user_role FROM public.profiles WHERE id = auth.uid();
  RETURN user_role = 'admin';
EXCEPTION
  WHEN OTHERS THEN
    RETURN FALSE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Step 4: Add a basic admin read-all policy
CREATE POLICY profiles_admin_read_all ON public.profiles 
  FOR SELECT USING (public.is_admin_basic());

-- Step 5: Add minimal essential policies for services
CREATE POLICY services_read ON public.services
  FOR SELECT USING (true);

CREATE POLICY services_admin_all ON public.services
  FOR ALL USING (public.is_admin_basic());

-- Step 6: Add minimal storage policies
CREATE POLICY storage_public_read ON storage.objects
  FOR SELECT USING (bucket_id = 'service-images');

CREATE POLICY storage_admin_insert ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'service-images' AND 
    public.is_admin_basic()
  );

CREATE POLICY storage_admin_update ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'service-images' AND 
    public.is_admin_basic()
  );

CREATE POLICY storage_admin_delete ON storage.objects
  FOR DELETE USING (
    bucket_id = 'service-images' AND 
    public.is_admin_basic()
  ); 