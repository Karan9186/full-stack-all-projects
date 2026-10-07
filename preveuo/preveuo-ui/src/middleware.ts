import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Preveuo SaaS Authentication Route Guard Middleware
 * - Protects authenticated routes (/workspace, /create, /edit) -> redirects unauthenticated users to /login
 * - Protects auth routes (/login, /register) -> redirects authenticated users to /workspace
 */
export function middleware(request: NextRequest) {
  const token = request.cookies.get('preveuo_token')?.value;
  const { pathname, search } = request.nextUrl;

  const isAuthRoute = pathname === '/login' || pathname === '/register';
  const isProtectedRoute =
    pathname.startsWith('/workspace') ||
    pathname.startsWith('/demos') ||
    pathname.startsWith('/create') ||
    pathname.startsWith('/edit');

  // 1. Unauthenticated users trying to access protected routes -> Redirect to /login
  if (!token && isProtectedRoute) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('callbackUrl', `${pathname}${search}`);
    return NextResponse.redirect(loginUrl);
  }

  // 2. Authenticated users trying to access /login or /register -> Redirect to /workspace
  if (token && isAuthRoute) {
    const workspaceUrl = new URL('/workspace', request.url);
    return NextResponse.redirect(workspaceUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/workspace/:path*',
    '/demos/:path*',
    '/create/:path*',
    '/edit/:path*',
    '/login',
    '/register',
  ],
};
