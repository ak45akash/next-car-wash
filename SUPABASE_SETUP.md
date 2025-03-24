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

## 4. Configure Authentication (Optional)

If you want to restrict dashboard access:

1. Go to Authentication > Settings
2. Enable Email provider
3. Configure any additional providers you want (Google, GitHub, etc.)
4. Set up email templates for password recovery

## 5. Configure Your Next.js App

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

## 6. Test Your Application

Once deployed:

1. Visit your Vercel app URL or run locally with `npm run dev`
2. Try creating a booking
3. Check the Supabase Table Editor to see if the booking was created in these tables:
   - `bookings` - primary booking data
   - `customers` - new customers are automatically added when bookings are created
4. Check that booking closure functionality works correctly by toggling it in the admin dashboard

## 7. Database Schema Details

The application uses the following tables:

### Bookings Table
- Contains all booking information including customer details, service details, date/time, and status
- Automatically created when a customer submits a booking form

### Services Table
- Pre-populated with car washing services
- Each service has a name, description, duration, price, and category
- You can manage services from the admin dashboard

### Settings Table
- Stores application configuration settings
- Currently used for booking closure functionality
- Key/value structure allows for easy addition of new settings

### Customers Table
- Automatically populated when new bookings are created
- Stores unique customer information for future reference

## 8. Additional Configuration

### Email Integration (Optional)

To enable email notifications for bookings:

1. Set up a service like SendGrid, Mailgun, or AWS SES
2. Create Supabase Edge Functions to handle email sending
3. Set up triggers on the bookings table

### Storage Setup (Optional)

If you need to store images (like car photos):

1. Go to Storage in your Supabase dashboard
2. Create a new bucket called "car-images"
3. Set up appropriate access policies

## Troubleshooting

If you encounter issues:

1. Check the Supabase logs in the Dashboard > Logs section
2. Verify environment variables are set correctly
3. Check browser console for errors
4. Ensure your API routes are correctly formatted

Need help? Contact support at [your-support-email]. 