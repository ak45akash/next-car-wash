-- Drop existing storage policies
DROP POLICY IF EXISTS "Public Read Access for Service Images" ON storage.objects;
DROP POLICY IF EXISTS "Admin Upload for Service Images" ON storage.objects;
DROP POLICY IF EXISTS "Admin Update for Service Images" ON storage.objects;
DROP POLICY IF EXISTS "Admin Delete for Service Images" ON storage.objects;

-- Create new storage policies
-- Allow public read access to service images
CREATE POLICY "Public Read Access for Service Images"
ON storage.objects FOR SELECT
USING (bucket_id = 'service-images');

-- Allow authenticated users to upload service images
CREATE POLICY "Authenticated Upload for Service Images"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'service-images' AND
  (storage.extension(name) IN ('jpg', 'jpeg', 'png', 'gif', 'webp')) AND
  auth.role() = 'authenticated'
);

-- Allow authenticated users to update service images
CREATE POLICY "Authenticated Update for Service Images"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'service-images' AND
  auth.role() = 'authenticated'
);

-- Allow authenticated users to delete service images
CREATE POLICY "Authenticated Delete for Service Images"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'service-images' AND
  auth.role() = 'authenticated'
); 