-- Drop the problematic policies that cause recursion
DROP POLICY IF EXISTS admin_view_all_profiles ON public.profiles;
DROP POLICY IF EXISTS update_own_profile ON public.profiles;
DROP POLICY IF EXISTS admin_update_any_profile ON public.profiles;
DROP POLICY IF EXISTS admin_manage_services ON public.services;
DROP POLICY IF EXISTS "Admin Upload for Service Images" ON storage.objects;
DROP POLICY IF EXISTS "Admin Update for Service Images" ON storage.objects;
DROP POLICY IF EXISTS "Admin Delete for Service Images" ON storage.objects;

-- Create a helper function to check admin status
CREATE OR REPLACE FUNCTION is_admin() 
RETURNS BOOLEAN AS $$
BEGIN
  RETURN (SELECT role = 'admin' FROM public.profiles WHERE id = auth.uid());
EXCEPTION
  WHEN OTHERS THEN
    RETURN FALSE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recreate policies without circular references
-- Allow users to update their own profile (but not change role)
CREATE POLICY update_own_profile ON public.profiles
  FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Allow admins to view all profiles
CREATE POLICY admin_view_all_profiles ON public.profiles
  FOR SELECT
  USING (is_admin());

-- Allow admins to update any profile
CREATE POLICY admin_update_any_profile ON public.profiles
  FOR UPDATE
  USING (is_admin());

-- Allow only admins to insert/update/delete services
CREATE POLICY admin_manage_services ON public.services
  FOR ALL
  USING (is_admin());

-- Allow admin-only uploads to service images 
CREATE POLICY "Admin Upload for Service Images"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'service-images' AND
  (storage.extension(name) IN ('jpg', 'jpeg', 'png', 'gif', 'webp')) AND
  is_admin()
);

-- Allow admin-only updates to service images
CREATE POLICY "Admin Update for Service Images"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'service-images' AND
  is_admin()
);

-- Allow admin-only deletions from service images
CREATE POLICY "Admin Delete for Service Images"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'service-images' AND
  is_admin()
); 