import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Middleware را موقتاً غیرفعال می‌کنیم تا از client-side navigation استفاده کنیم
export function middleware(request: NextRequest) {
  return NextResponse.next();
}

// Matcher را محدود می‌کنیم تا فقط routes خاص را پوشش دهد
export const config = {
  matcher: [
    // فعلاً matcher را خالی می‌گذاریم
  ],
};
