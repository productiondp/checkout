import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { PROTECTED_ROUTES, PUBLIC_ROUTES } from './lib/routes'

/**
 *  SURGICAL AUTH MIDDLEWARE (V14.1)
 * 
 * Performance-optimized middleware that only executes on protected routes.
 * Ensures Service Workers and static assets are never intercepted.
 */
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  //  CRITICAL BYPASS: Service Worker & PWA Manifest
  if (pathname === '/sw.js' || pathname === '/manifest.json') {
    return NextResponse.next()
  }

  //  ROUTE SAFETY ASSERTION (DEV ONLY)
  // Ensures all new routes are explicitly categorized as protected or public.
  if (process.env.NODE_ENV === 'development') {
    const knownRoutes = new Set([...PROTECTED_ROUTES, ...PUBLIC_ROUTES]);
    if (!knownRoutes.has(pathname) && !pathname.startsWith('/_next') && !pathname.includes('.')) {
      console.warn(`%c[ROUTE WARNING] Unregistered path: ${pathname}`, "color: #E53935; font-weight: bold;");
    }
  }

  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  //  AUTHORITATIVE PROTECTION CHECK
  const isProtected = PROTECTED_ROUTES.some(route =>
    pathname === route || pathname.startsWith(route + '/')
  )

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || "",
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || "",
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({ name, value, ...options })
          response = NextResponse.next({
            request: { headers: request.headers },
          })
          response.cookies.set({ name, value, ...options })
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({ name, value: '', ...options })
          response = NextResponse.next({
            request: { headers: request.headers },
          })
          response.cookies.set({ name, value: '', ...options })
        },
      },
    }
  )

  //  SECURE SESSION VERIFICATION
  const { data: { user } } = await supabase.auth.getUser();

  if (user) {
    console.log(`[MIDDLEWARE] Authenticated access to: ${pathname}`);
  } else if (isProtected) {
    console.warn(`[MIDDLEWARE] Unauthorized access attempt to: ${pathname}. Redirecting to /`);
    return NextResponse.redirect(new URL('/?mode=signin', request.url))
  }

  return response
}

//  SURGICAL MATCHER
// Only run middleware on paths that actually require authentication logic.
export const config = {
  matcher: [
    '/home/:path*',
    '/chat/:path*',
    '/marketplace/:path*',
    '/advisors/:path*',
    '/discover/:path*',
    '/matches/:path*',
    '/profile/:path*',
    '/settings/:path*',
    '/onboarding/:path*',
    '/admin/:path*',
    '/network/:path*',
    '/insights/:path*',
    '/opportunities/:path*',
  ]
}
