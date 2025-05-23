-- Create tables for Diamond Car Wash

-- Bookings table
CREATE TABLE IF NOT EXISTS bookings (
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
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Services table
CREATE TABLE IF NOT EXISTS services (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  duration INTEGER NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  category VARCHAR(50) NOT NULL,
  status VARCHAR(20) DEFAULT 'Active',
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Settings table (for booking closure and other app settings)
CREATE TABLE IF NOT EXISTS settings (
  id SERIAL PRIMARY KEY,
  key TEXT NOT NULL UNIQUE,
  value TEXT NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Customers table
CREATE TABLE IF NOT EXISTS customers (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  phone TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert initial services data
INSERT INTO services (name, description, duration, price, category) VALUES
('Basic Wash', 'Exterior wash with hand dry', 30, 499, 'Wash'),
('Premium Wash', 'Exterior wash, hand dry, and interior vacuum', 45, 799, 'Wash'),
('Steam Wash', 'Deep cleaning with steam technology', 60, 999, 'Wash'),
('Interior Detailing', 'Complete interior cleaning and conditioning', 120, 1499, 'Detailing'),
('Exterior Detailing', 'Clay bar treatment, polishing, and waxing', 180, 1999, 'Detailing'),
('Full Detailing', 'Complete interior and exterior detailing package', 300, 2999, 'Detailing'),
('Paint Protection Film', 'Premium PPF installation', 480, 15999, 'Protection');

-- Insert booking closure setting with default value
INSERT INTO settings (key, value) 
VALUES ('booking_closure', '{"isClosed": false, "endTime": null}')
ON CONFLICT (key) DO NOTHING;

-- Create policies for security
-- Allow all authenticated users to read all data
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Enable read access for all authenticated users" ON bookings
  FOR SELECT USING (auth.role() = 'authenticated');

ALTER TABLE services ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Enable read access for all authenticated users" ON services
  FOR SELECT USING (auth.role() = 'authenticated');

ALTER TABLE settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Enable read access for all authenticated users" ON settings
  FOR SELECT USING (auth.role() = 'authenticated');

ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Enable read access for all authenticated users" ON customers
  FOR SELECT USING (auth.role() = 'authenticated');

-- Enable authenticated users to insert/update/delete data
CREATE POLICY "Enable insert access for authenticated users" ON bookings
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable update access for authenticated users" ON bookings
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Enable delete access for authenticated users" ON bookings
  FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Enable insert access for authenticated users" ON services
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable update access for authenticated users" ON services
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Enable delete access for authenticated users" ON services
  FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Enable insert access for authenticated users" ON settings
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable update access for authenticated users" ON settings
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Enable delete access for authenticated users" ON settings
  FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Enable insert access for authenticated users" ON customers
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable update access for authenticated users" ON customers
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Enable delete access for authenticated users" ON customers
  FOR DELETE USING (auth.role() = 'authenticated');

-- Allow public read access for services and settings
CREATE POLICY "Allow public to read services" ON services
  FOR SELECT USING (true);

CREATE POLICY "Allow public to read settings" ON settings
  FOR SELECT USING (true);

-- Allow public to create bookings
CREATE POLICY "Allow public to create bookings" ON bookings
  FOR INSERT WITH CHECK (true);

-- Storage configuration for service images
-- Note: This part needs to be run from the Supabase dashboard or using the Supabase CLI
-- These are instructions that need to be followed manually:

/*
## Storage Setup Instructions

1. Create a new storage bucket:
   - Go to Storage in your Supabase dashboard
   - Click "Create bucket"
   - Name: car-images
   - Set "Public bucket" to ON
   - Click "Create bucket"

2. Set up bucket policies (can be done through the Supabase dashboard):
   - Allow public READ access to all files
   - Restrict WRITE access to authenticated users only
   - Example policies:

   # Allow public read access
   CREATE POLICY "Allow public read access for car images"
   ON storage.objects FOR SELECT
   USING (bucket_id = 'car-images');

   # Allow authenticated users to upload files
   CREATE POLICY "Allow authenticated users to upload images"
   ON storage.objects FOR INSERT
   WITH CHECK (
     auth.role() = 'authenticated' AND
     bucket_id = 'car-images'
   );

   # Allow users to update and delete their own files
   CREATE POLICY "Allow users to update their own images"
   ON storage.objects FOR UPDATE
   USING (
     auth.role() = 'authenticated' AND
     bucket_id = 'car-images' AND
     (storage.foldername(name))[1] = auth.uid()
   );

   CREATE POLICY "Allow users to delete their own images"
   ON storage.objects FOR DELETE
   USING (
     auth.role() = 'authenticated' AND
     bucket_id = 'car-images' AND
     (storage.foldername(name))[1] = auth.uid()
   );
*/ 