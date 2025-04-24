import { NextRequest, NextResponse } from 'next/server';

// This function handles all requests and ensures that protected routes are properly rendered
export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  
  // Log the requested path to help with debugging
  console.log(`Middleware processing path: ${path}`);
  
  // For dashboard and auth routes, ensure they are rendered
  if (path.startsWith('/dashboard') || 
      path.startsWith('/login') || 
      path.startsWith('/signup') || 
      path.startsWith('/forgot-password') || 
      path.startsWith('/reset-password')) {
    // Just pass through, but this ensures the route is known to Next.js
    return NextResponse.next();
  }

  // For all other routes, just continue normally
  return NextResponse.next();
}

// Specify which routes this middleware should run on
export const config = {
  matcher: [
    '/dashboard/:path*',
    '/login',
    '/signup',
    '/forgot-password',
    '/reset-password'
  ],
}; 