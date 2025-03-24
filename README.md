# Diamond Car Wash Website

A modern, responsive car wash booking website built with Next.js, Tailwind CSS, and Supabase.

## Features

- Modern, responsive design for all devices
- Online booking system with calendar integration
- Interactive service selection
- Admin dashboard for managing bookings and services
- Real-time booking management with Supabase database
- Booking closure system for high-demand periods
- Email notifications (configurable)

## Tech Stack

- **Frontend**: Next.js 15, React, Tailwind CSS, Framer Motion
- **Backend**: Next.js API Routes
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18.x or later
- npm or yarn
- Supabase account (free tier available)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/diamond-car-wash.git
   cd diamond-car-wash
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn
   ```

3. Create a `.env.local` file with your Supabase credentials:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   ```

4. Set up your Supabase database using the schema provided in `supabase/schema.sql`. See `SUPABASE_SETUP.md` for detailed instructions.

5. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

### Database Setup

This application uses Supabase (PostgreSQL) as its database. The schema includes:

- **bookings**: Customer booking information
- **services**: Available services with pricing
- **settings**: Application settings (e.g., booking closure)
- **customers**: Customer information

Follow these steps to set up the database:

1. Create a Supabase project at [supabase.com](https://supabase.com)
2. Get your project URL and anon key from Project Settings > API
3. Add these to your `.env.local` file
4. Run the SQL script in `supabase/schema.sql` from the Supabase SQL Editor

For complete setup instructions, refer to `SUPABASE_SETUP.md`.

### Deployment

The easiest way to deploy this website is through Vercel:

1. Push your code to a Git repository
2. Import your project on Vercel
3. Set environment variables (Supabase URL and anon key)
4. Deploy

## Project Structure

```
/
├── public/              # Static files
│   └── images/          # Images
├── src/
│   ├── app/             # Next.js App Router
│   │   ├── api/         # API routes
│   │   ├── components/  # React components
│   │   ├── contexts/    # Context providers
│   │   ├── dashboard/   # Admin dashboard pages
│   │   └── ...          # Other pages
│   ├── lib/             # Utility functions
│   │   └── supabase.ts  # Supabase client
│   └── ...
├── supabase/            # Supabase configuration
│   └── schema.sql       # Database schema
└── ...
```

## API Routes

The application provides the following API routes:

- `/api/bookings` - Create and retrieve bookings
- `/api/bookings/[id]` - Get, update, or delete a specific booking
- `/api/services` - Get all services or create a new service
- `/api/services/[id]` - Get, update, or delete a specific service
- `/api/settings` - Get all settings or create/update settings
- `/api/settings/[key]` - Get, update, or delete a specific setting

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- [Next.js](https://nextjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Supabase](https://supabase.com/)
- [Vercel](https://vercel.com/)
- [React Icons](https://react-icons.github.io/react-icons/)
