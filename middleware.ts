import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Routes که نیاز به احراز هویت دارند
const protectedRoutes = ['/admin', '/manager', '/student', '/teacher', '/user'];

// Routes عمومی که همه می‌توانند دسترسی داشته باشند
const publicRoutes = [
  '/',
  '/about',
  '/blog',
  '/courses',
  '/teachers',
  '/send-otp',
  '/verify-otp',
  '/onboarding',
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('authToken')?.value;

  // بررسی اینکه آیا route محافظت شده است
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  // بررسی اینکه آیا route عمومی است
  const isPublicRoute = publicRoutes.some(
    (route) => pathname === route || pathname.startsWith(route + '/')
  );

  // اگر route محافظت شده است و کاربر token ندارد
  if (isProtectedRoute && !token) {
    return NextResponse.redirect(new URL('/send-otp', request.url));
  }

  // اگر کاربر token دارد و در صفحه لاگین است، به داشبورد هدایت شود
  if (token && (pathname === '/send-otp' || pathname === '/verify-otp')) {
    // برای سادگی، همه را به admin فرستادیم - این بعداً بر اساس نقش تغییر خواهد کرد
    return NextResponse.redirect(new URL('/admin', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public folder)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.jpg$|.*\\.jpeg$|.*\\.gif$|.*\\.svg$|.*\\.webp$).*)',
  ],
};
