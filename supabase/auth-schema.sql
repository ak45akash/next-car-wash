-- Create profiles table to store user metadata
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  email VARCHAR NOT NULL,
  role VARCHAR DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create a trigger to update updated_at column when profile is updated
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();

-- Create profiles for existing users (if any)
-- This is useful if migrating an existing database with users but no profiles
INSERT INTO public.profiles (id, email, role)
SELECT
  id,
  email,
  'user' -- Default role
FROM auth.users
WHERE id NOT IN (SELECT id FROM public.profiles);

-- Create a function to create a profile for new users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, role)
  VALUES (NEW.id, NEW.email, 'user');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger the function every time a user is created
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- RLS Policies for profiles table

-- Allow users to view their own profile
CREATE POLICY view_own_profile ON public.profiles
  FOR SELECT
  USING (auth.uid() = id);

-- Allow users to update their own profile (but not change role)
CREATE POLICY update_own_profile ON public.profiles
  FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);
  
-- Create separate admin policies that don't reference the profiles table
CREATE OR REPLACE FUNCTION is_admin() 
RETURNS BOOLEAN AS $$
BEGIN
  RETURN (SELECT role = 'admin' FROM public.profiles WHERE id = auth.uid());
EXCEPTION
  WHEN OTHERS THEN
    RETURN FALSE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Allow admins to view all profiles
CREATE POLICY admin_view_all_profiles ON public.profiles
  FOR SELECT
  USING (is_admin());

-- Allow admins to update any profile
CREATE POLICY admin_update_any_profile ON public.profiles
  FOR UPDATE
  USING (is_admin());

-- Services table RLS policies

-- Allow any authenticated user to view services
CREATE POLICY view_services ON public.services
  FOR SELECT
  TO authenticated
  USING (true);

-- Allow anonymous users to view active services
CREATE POLICY view_active_services ON public.services
  FOR SELECT
  TO anon
  USING (status = 'Active');

-- Allow only admins to insert/update/delete services
CREATE POLICY admin_manage_services ON public.services
  FOR ALL
  USING (is_admin());

-- Storage policies

-- Allow public read access to service images
CREATE POLICY "Public Read Access for Service Images"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'service-images'
);

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