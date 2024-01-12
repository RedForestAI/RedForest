import { NextResponse, type NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/middleware';

const protectedRoutes = ['/access']

export async function middleware(request: NextRequest) {
  const { supabase, response } = createClient(request)

  // Obtain the user session if available
  let { data } = await supabase.auth.getSession()
 
  // Redirect to /auth/login if no session and entering a protected route
  if (!data?.session) {
    for (const route of protectedRoutes) {
      if (request.nextUrl.pathname.startsWith(route)){
        const redirectURL = new URL("/auth/login", request.nextUrl.origin);
        return NextResponse.redirect(redirectURL.toString())
      }
    }
  } else {

    // Redirect to / if session and entering /auth routes
    if (request.nextUrl.pathname.startsWith("/auth")) {
      const redirectURL = new URL("/access", request.nextUrl.origin);
      return NextResponse.redirect(redirectURL.toString())
    }
  }

  return response
}
