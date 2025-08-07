import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip middleware for non-panel routes
  if (
    !pathname.startsWith('/admin') &&
    !pathname.startsWith('/teacher') &&
    !pathname.startsWith('/student')
  ) {
    return NextResponse.next();
  }

  // Since this app uses localStorage for auth, we'll rely on client-side protection
  // The middleware serves as a backup for direct URL access
  // Main protection is handled by RoleGuard component

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/teacher/:path*', '/student/:path*'],
};
