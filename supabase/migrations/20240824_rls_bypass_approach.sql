-- Drop all existing policies
DO $$
BEGIN
  -- Drop profile policies
  EXECUTE 'DROP POLICY IF EXISTS view_own_profile ON public.profiles';
  EXECUTE 'DROP POLICY IF EXISTS update_own_profile ON public.profiles';
  EXECUTE 'DROP POLICY IF EXISTS admin_view_all_profiles ON public.profiles';
  EXECUTE 'DROP POLICY IF EXISTS admin_update_any_profile ON public.profiles';
  
  -- Drop any other policies with any name
  EXECUTE 'DROP POLICY IF EXISTS profiles_self_read ON public.profiles';
  EXECUTE 'DROP POLICY IF EXISTS profiles_self_update ON public.profiles'; 
  EXECUTE 'DROP POLICY IF EXISTS profiles_admin_read_all ON public.profiles';
  
  -- Drop service policies
  EXECUTE 'DROP POLICY IF EXISTS view_services ON public.services';
  EXECUTE 'DROP POLICY IF EXISTS view_active_services ON public.services'; 
  EXECUTE 'DROP POLICY IF EXISTS admin_manage_services ON public.services';
  EXECUTE 'DROP POLICY IF EXISTS services_read ON public.services';
  EXECUTE 'DROP POLICY IF EXISTS services_admin_all ON public.services';
  
  -- Drop storage policies 
  EXECUTE 'DROP POLICY IF EXISTS "Public Read Access for Service Images" ON storage.objects';
  EXECUTE 'DROP POLICY IF EXISTS "Admin Upload for Service Images" ON storage.objects';
  EXECUTE 'DROP POLICY IF EXISTS "Admin Update for Service Images" ON storage.objects';
  EXECUTE 'DROP POLICY IF EXISTS "Admin Delete for Service Images" ON storage.objects';
  EXECUTE 'DROP POLICY IF EXISTS storage_public_read ON storage.objects';
  EXECUTE 'DROP POLICY IF EXISTS storage_admin_insert ON storage.objects';
  EXECUTE 'DROP POLICY IF EXISTS storage_admin_update ON storage.objects';
  EXECUTE 'DROP POLICY IF EXISTS storage_admin_delete ON storage.objects';
  
  -- Drop existing functions
  EXECUTE 'DROP FUNCTION IF EXISTS is_admin()';
  EXECUTE 'DROP FUNCTION IF EXISTS is_admin_basic()';
END $$;

-- Create a function to check admin status by bypassing RLS
CREATE OR REPLACE FUNCTION is_admin_secure() 
RETURNS BOOLEAN AS $$
DECLARE
  user_role TEXT;
  current_user_id UUID;
BEGIN
  -- Get current user ID
  current_user_id := auth.uid();
  
  -- Temporarily disable RLS for this query
  SET LOCAL row_security = off;
  
  -- Direct query to the profiles table
  SELECT role INTO user_role 
  FROM public.profiles 
  WHERE id = current_user_id;
  
  -- Re-enable RLS
  RESET row_security;
  
  -- Return result (null-safe comparison)
  RETURN user_role = 'admin';
EXCEPTION
  WHEN OTHERS THEN
    -- Re-enable RLS in case of error
    RESET row_security;
    RETURN FALSE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create simplified, non-recursive policies

-- Basic self-access for profiles
CREATE POLICY basic_user_read_own ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY basic_user_update_own ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- Admin access using the secure function
CREATE POLICY admin_read_all ON public.profiles
  FOR SELECT USING (is_admin_secure());

CREATE POLICY admin_update_all ON public.profiles
  FOR UPDATE USING (is_admin_secure());

-- Service policies
CREATE POLICY service_read_public ON public.services
  FOR SELECT USING (true);

CREATE POLICY service_admin_all ON public.services
  FOR ALL USING (is_admin_secure());

-- Storage policies
CREATE POLICY storage_read_public ON storage.objects
  FOR SELECT USING (bucket_id = 'service-images');

CREATE POLICY storage_admin_write ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'service-images' AND 
    is_admin_secure()
  );

CREATE POLICY storage_admin_modify ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'service-images' AND 
    is_admin_secure()
  );

CREATE POLICY storage_admin_remove ON storage.objects
  FOR DELETE USING (
    bucket_id = 'service-images' AND 
    is_admin_secure()
  ); 