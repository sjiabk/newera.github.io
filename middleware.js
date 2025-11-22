import { NextResponse } from 'next/server';

export function middleware(request) {
    const path = request.nextUrl.pathname;

    // Define paths that require authentication
    const isProtectedPath = path.startsWith('/admin');
    const isLoginPath = path === '/admin/login';

    // Check for the admin session cookie
    const isAuthenticated = request.cookies.has('admin_session');

    // If trying to access a protected path without auth, redirect to login
    if (isProtectedPath && !isLoginPath && !isAuthenticated) {
        return NextResponse.redirect(new URL('/admin/login', request.url));
    }

    // If trying to access login page while authenticated, redirect to dashboard
    if (isLoginPath && isAuthenticated) {
        return NextResponse.redirect(new URL('/admin', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/admin/:path*'],
};
