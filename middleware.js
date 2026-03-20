import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'your-secret-key');

export async function middleware(request) {
  const { pathname } = request.nextUrl;

  // Public routes that don't require authentication
  const publicRoutes = ['/login', '/admin/login', '/api/login', '/api/admin/login', '/api/init-db', '/api/logout'];
  
  // Check if route is public
  if (publicRoutes.some(route => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  // Get token from cookie or Authorization header
  const token = request.cookies.get('userToken')?.value || 
                request.headers.get('authorization')?.split(' ')[1];

  // Handle /admin root route
  if (pathname === '/admin') {
    if (!token) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
    try {
      const { payload } = await jwtVerify(token, JWT_SECRET);
      if (payload.role !== 'admin') {
        return NextResponse.redirect(new URL('/admin/login', request.url));
      }
      // Logged in admin, redirect to dashboard
      return NextResponse.redirect(new URL('/admin/dashboard', request.url));
    } catch (error) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }

  // Admin routes check (excluding /admin which is handled above)
  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    if (!token) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
    try {
      const { payload } = await jwtVerify(token, JWT_SECRET);
      if (payload.role !== 'admin') {
        return NextResponse.redirect(new URL('/admin/login', request.url));
      }
      return NextResponse.next();
    } catch (error) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }

  // Protected user routes - require authentication
  if (pathname.startsWith('/dashboard') || pathname.startsWith('/facebook') || pathname.startsWith('/api/user') || pathname.startsWith('/api/money-requests') || pathname.startsWith('/api/ads-deposit-requests') || pathname.startsWith('/api/ad-applications')) {
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    try {
      await jwtVerify(token, JWT_SECRET);
      return NextResponse.next();
    } catch (error) {
      // Invalid token, redirect to login
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*', 
    '/facebook/:path*', 
    '/admin',
    '/admin/:path*',
    '/api/user/:path*',
    '/api/money-requests/:path*',
    '/api/ads-deposit-requests/:path*',
    '/api/ad-applications/:path*'
  ]
};
