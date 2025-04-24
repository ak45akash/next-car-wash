-- Add image_url column to services table
ALTER TABLE public.services
ADD COLUMN IF NOT EXISTS image_url TEXT;

-- Update RLS policies to allow image_url updates
DROP POLICY IF EXISTS "Allow image_url updates" ON public.services;
CREATE POLICY "Allow image_url updates" ON public.services
FOR UPDATE USING (auth.role() = 'authenticated')
WITH CHECK (auth.role() = 'authenticated'); 