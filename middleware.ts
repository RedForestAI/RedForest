import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'

import type { NextRequest } from 'next/server'

const protectedRoutes = ['/access']

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()

  // Create a Supabase client configured to use cookies
  const supabase = createMiddlewareClient({ req, res })

  // Refresh session if expired - required for Server Components
  let { data } = await supabase.auth.getSession()

  // Redirect to /auth/login if no session and entering a protected route
  if (!data?.session) {
    for (const route of protectedRoutes) {
      if (req.nextUrl.pathname.startsWith(route)){
        const redirectURL = new URL("/session/login", req.nextUrl.origin);
        return NextResponse.redirect(redirectURL.toString())
      }
    }
  } else {

    // Redirect to / if session and entering /auth routes
    if (req.nextUrl.pathname.startsWith("/session")) {
      const redirectURL = new URL("/access", req.nextUrl.origin);
      return NextResponse.redirect(redirectURL.toString())
    }
  }

  return res
}

// Ensure the middleware is only called for relevant paths.
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}