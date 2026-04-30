import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // 🧠 VERIFY MIDDLEWARE EXECUTION (TEMP DEBUG)
  console.log('MIDDLEWARE RUNNING:', request.nextUrl.pathname)

  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || "",
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || "",
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

  const { data: { user } } = await supabase.auth.getUser()

  // 🧠 PROTECTED & PUBLIC ROUTE MAPPING
  const publicRoutes = ['/', '/what-is-checkout', '/discover', '/network', '/insights', '/opportunities']
  const isPublic = publicRoutes.some(route =>
    pathname === route || pathname.startsWith(route + '/')
  )

  if (!user && !isPublic) {
    return NextResponse.redirect(new URL('/?mode=signin', request.url))
  }

  return response
}

// 🧠 MIDDLEWARE MATCHER (STRICT)
// Middleware MUST NOT run on: '/', '/onboarding'
export const config = {
  matcher: [
    '/home',
    '/chat',
    '/marketplace',
    '/advisors',
    '/discover',
    '/matches',
    '/profile',
    '/settings'
  ]
}
