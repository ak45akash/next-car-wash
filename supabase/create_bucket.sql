-- Create a bucket for service images
INSERT INTO storage.buckets (id, name, public)
VALUES ('service-images', 'Service Images', true)
ON CONFLICT (id) DO NOTHING;

-- Make sure all storage policies are properly set up for this bucket
-- These policies should duplicate what's in the main reset script, just to be safe

-- Allow public read access
CREATE POLICY "Public Read Access for Service Images"
ON storage.objects FOR SELECT
USING (bucket_id = 'service-images')
ON CONFLICT DO NOTHING;

-- Admin upload policy
CREATE POLICY "Admin Upload for Service Images"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'service-images' AND
  (storage.extension(name) IN ('jpg', 'jpeg', 'png', 'gif', 'webp')) AND
  (SELECT role = 'admin' FROM public.profiles WHERE id = auth.uid())
)
ON CONFLICT DO NOTHING;

-- Admin update policy
CREATE POLICY "Admin Update for Service Images"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'service-images' AND
  (SELECT role = 'admin' FROM public.profiles WHERE id = auth.uid())
)
ON CONFLICT DO NOTHING;

-- Admin delete policy
CREATE POLICY "Admin Delete for Service Images"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'service-images' AND
  (SELECT role = 'admin' FROM public.profiles WHERE id = auth.uid())
)
ON CONFLICT DO NOTHING; 