import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

const protectedRoutes = ['/access']

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value,
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value,
            ...options,
          })
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value: '',
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value: '',
            ...options,
          })
        },
      },
    }
  )

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
