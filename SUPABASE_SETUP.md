# Setting Up Supabase for Diamond Car Wash

This guide will walk you through setting up Supabase for your Diamond Car Wash application.

## 1. Create a Supabase Project

1. Go to [supabase.com](https://supabase.com/) and sign up/login
2. Click on "New Project"
3. Enter a name for your project (e.g., "diamond-car-wash")
4. Choose an organization
5. Set a secure database password
6. Choose the region closest to your users (such as Asia-Mumbai or Asia-Singapore)
7. Wait for your project to be created (this may take a few minutes)

## 2. Get API Keys

Once your project is created:

1. Go to Project Settings > API
2. Note down the following:
   - Project URL (`https://[project-id].supabase.co`)
   - `anon` public API key

These will be used as environment variables in your Next.js app.

## 3. Set Up Database Schema

1. In your Supabase dashboard, navigate to the SQL Editor
2. Create a new query
3. Copy and paste the contents of `supabase/schema.sql` from this repository
4. Run the query to set up your database schema and initial data

**Note**: The schema script will:
- Create tables for bookings, services, settings, and customers
- Insert initial service options into the services table
- Set up initial booking closure settings
- Configure Row Level Security (RLS) policies

## 4. Set Up Storage for Service Images

### Create a new storage bucket

1. In your Supabase dashboard, go to the Storage section
2. Click "Create new bucket"
3. Enter the bucket name: `car-images`
4. Check "Public bucket" to enable public access to files
5. Click "Create bucket"

### Configure storage bucket policies

Once the bucket is created, you need to set up access policies:

1. In the bucket settings, go to the "Policies" tab
2. Create the following policies:

#### Allow public read access to images
- Click "New Policy"
- For Policy Type: Select "Select (Read)"
- Policy Name: `Allow public read access for car images`
- Policy Definition: Select "Using custom check"
- Policy: `true` (This allows everyone to read the files)
- Click "Save Policy"

#### Allow authenticated users to upload images
- Click "New Policy"
- For Policy Type: Select "Insert (Create)"
- Policy Name: `Allow authenticated users to upload images`
- Policy Definition: Select "Using custom check"
- Policy: `auth.role() = 'authenticated'`
- Click "Save Policy"

#### Allow users to update their images
- Click "New Policy"
- For Policy Type: Select "Update"
- Policy Name: `Allow users to update their images`
- Policy Definition: Select "Using custom check"
- Policy: `auth.role() = 'authenticated'`
- Click "Save Policy"

#### Allow users to delete their images
- Click "New Policy"
- For Policy Type: Select "Delete"
- Policy Name: `Allow users to delete their images`
- Policy Definition: Select "Using custom check"
- Policy: `auth.role() = 'authenticated'`
- Click "Save Policy"

## 5. Configure Authentication (Optional)

If you want to restrict dashboard access:

1. Go to Authentication > Settings
2. Enable Email provider
3. Configure any additional providers you want (Google, GitHub, etc.)
4. Set up email templates for password recovery

## 6. Configure Your Next.js App

### Add Environment Variables

Create or update your `.env.local` file with:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### Deploy to Vercel

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com/) and sign up/login
3. Click "Add New" > "Project"
4. Import your repository
5. Configure the project:
   - Framework Preset: Next.js
   - Root Directory: ./
   - Environment Variables: Add the Supabase URL and anon key
6. Click "Deploy"

## 7. Test Your Application

Once deployed:

1. Visit your Vercel app URL or run locally with `npm run dev`
2. Try creating a booking
3. Check the Supabase Table Editor to see if the booking was created in these tables:
   - `bookings` - primary booking data
   - `customers` - new customers are automatically added when bookings are created
4. Check that booking closure functionality works correctly by toggling it in the admin dashboard
5. Test image upload functionality by creating or editing a service in the admin dashboard

## 8. Database Schema Details

The application uses the following tables:

### Bookings Table
- Contains all booking information including customer details, service details, date/time, and status
- Automatically created when a customer submits a booking form

### Services Table
- Pre-populated with car washing services
- Each service has a name, description, duration, price, category, status, and image_url
- You can manage services from the admin dashboard

### Settings Table
- Stores application configuration settings
- Currently used for booking closure functionality
- Key/value structure allows for easy addition of new settings

### Customers Table
- Automatically populated when new bookings are created
- Stores unique customer information for future reference

## 9. Storage Usage

The application uses Supabase Storage to store service images:

- Images are stored in the `car-images` bucket
- Service images are stored in the `service-images/` folder within the bucket
- Uploaded images are given unique names to prevent conflicts
- Public URLs for images are stored in the `image_url` field of the services table
- The maximum file size for uploads is 2MB
- Supported file types are common image formats (JPEG, PNG, GIF, etc.)

## Troubleshooting

If you encounter issues:

1. Check the Supabase logs in the Dashboard > Logs section
2. Verify environment variables are set correctly
3. Check browser console for errors
4. Ensure your API routes are correctly formatted
5. For storage issues, check the Storage > Logs section in your Supabase dashboard

Need help? Contact support at [your-support-email]. 