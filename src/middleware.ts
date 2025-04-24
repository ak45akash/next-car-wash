import { NextRequest, NextResponse } from 'next/server';

// This function handles all requests and ensures that protected routes are properly rendered
export function middleware(request: NextRequest) {
  // Just log the path and pass through
  console.log(`Middleware processing path: ${request.nextUrl.pathname}`);
  return NextResponse.next();
}

// Limit middleware to routes that don't have API or static file patterns
export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}; 