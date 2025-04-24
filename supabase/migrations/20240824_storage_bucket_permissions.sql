-- Enable storage management for authenticated users
ALTER TABLE storage.buckets ENABLE ROW LEVEL SECURITY;

-- Drop existing bucket policies if any
DROP POLICY IF EXISTS "Allow bucket creation" ON storage.buckets;
DROP POLICY IF EXISTS "Allow bucket access" ON storage.buckets;

-- Allow authenticated users to create buckets
CREATE POLICY "Allow bucket creation"
ON storage.buckets
FOR INSERT
WITH CHECK (auth.role() = 'authenticated');

-- Allow authenticated users to access buckets
CREATE POLICY "Allow bucket access"
ON storage.buckets
FOR SELECT
USING (auth.role() = 'authenticated');

-- Create the service-images bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('service-images', 'service-images', true)
ON CONFLICT (id) DO NOTHING;

-- Enable RLS on objects within buckets
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Drop existing object policies if any
DROP POLICY IF EXISTS "Allow public read" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated uploads" ON storage.objects;

-- Allow public read access to objects in service-images bucket
CREATE POLICY "Allow public read"
ON storage.objects
FOR SELECT
USING (bucket_id = 'service-images');

-- Allow authenticated users to upload objects
CREATE POLICY "Allow authenticated uploads"
ON storage.objects
FOR INSERT
WITH CHECK (
    bucket_id = 'service-images'
    AND auth.role() = 'authenticated'
    AND (storage.extension(name) IN ('jpg', 'jpeg', 'png', 'gif', 'webp'))
); 