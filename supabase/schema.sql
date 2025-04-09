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
  name TEXT NOT NULL,
  description TEXT,
  duration INTEGER NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  category TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'Active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
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