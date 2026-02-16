/**
 * Proxy Configuration (Next.js 16+)
 * Route protection and authentication checks
 * Replaces the deprecated middleware.ts
 */

import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Public routes that DON'T require authentication
const publicRoutes = [
  '/login',
  '/register',
  '/forgot-password',
  '/not-found',
  '/404',
]

// Routes that should redirect to dashboard if already authenticated
const authRoutes = ['/login', '/register', '/login-example']

/**
 * Check if a path matches any of the given routes
 */
function isRouteMatch(pathname: string, routes: string[]): boolean {
  return routes.some((route) => {
    // Exact match or starts with route + /
    return pathname === route || pathname.startsWith(`${route}/`)
  })
}

export default function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Allow styleguide only in development
  if (pathname.startsWith('/styleguide')) {
    if (process.env.NODE_ENV === 'production') {
      return NextResponse.redirect(new URL('/404', request.url))
    }
    // In development, always allow styleguide
    return NextResponse.next()
  }

  // Check if user has authentication token
  // Note: Since we're using localStorage, we can't directly check in proxy
  // We rely on the layout/AuthProvider to handle the actual auth check
  // Here we use cookies as a fallback for better UX
  const accessToken = request.cookies.get('access_token')?.value
  const hasToken = !!accessToken

  // Check if the current route is public
  const isPublicRoute = isRouteMatch(pathname, publicRoutes)

  // Check if the current route is an auth route
  const isAuthRoute = isRouteMatch(pathname, authRoutes)

  // If NOT a public route and NO token, redirect to login
  if (!isPublicRoute && !hasToken) {
    const url = new URL('/login', request.url)
    // Save the attempted URL to redirect after login
    url.searchParams.set('redirect', pathname)
    return NextResponse.redirect(url)
  }

  // If auth route and HAS token, redirect to dashboard
  if (isAuthRoute && hasToken) {
    // Check if there's a redirect parameter
    const redirectUrl = request.nextUrl.searchParams.get('redirect')
    if (redirectUrl && !authRoutes.includes(redirectUrl)) {
      return NextResponse.redirect(new URL(redirectUrl, request.url))
    }
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     * - api routes
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$|api).*)',
  ],
}
