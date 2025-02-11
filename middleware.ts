import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })

  const {
    data: { session },
  } = await supabase.auth.getSession()

  // Paths that always require authentication
  const protectedPaths = ['/dashboard', '/audits', '/reports', '/settings']
  const isProtectedPath = protectedPaths.some(path => req.nextUrl.pathname.startsWith(path))

  // Auth paths that should redirect to dashboard if already authenticated
  const authPaths = ['/auth/login', '/auth/register']
  const isAuthPath = authPaths.some(path => req.nextUrl.pathname.startsWith(path))

  // If user is authenticated and trying to access auth pages, redirect to dashboard
  if (session && isAuthPath) {
    return NextResponse.redirect(new URL('/dashboard', req.url))
  }

  // If user is not authenticated and trying to access protected routes, redirect to login
  if (!session && isProtectedPath) {
    const redirectUrl = new URL('/auth/login', req.url)
    redirectUrl.searchParams.set('redirectedFrom', req.nextUrl.pathname)
    return NextResponse.redirect(redirectUrl)
  }

  // Allow all other requests
  return res
}

// Specify which routes this middleware should run for
export const config = {
  matcher: [
    '/dashboard/:path*',
    '/audits/:path*',
    '/reports/:path*',
    '/settings/:path*',
    '/auth/login',
    '/auth/register',
  ],
} 