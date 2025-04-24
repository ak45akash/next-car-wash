// Ensure this route is always server-rendered
export const dynamic = 'force-dynamic';

// This route handler ensures Next.js correctly processes the dashboard routes
export async function GET() {
  // Just return a response to ensure the route exists during build
  return new Response(null, {
    status: 307,
    headers: {
      'Location': '/dashboard',
    },
  });
} 