import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return request.cookies.getAll() },
        setAll(cookiesToSet: { name: string; value: string; options?: Parameters<typeof supabaseResponse.cookies.set>[2] }[]) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  // Lounge layout kill-switch (?v=v1 / ?v=v2) is rewritten to a dynamic
  // preview route so the public lounge URL can stay ISR-cached.
  const layout = request.nextUrl.searchParams.get('v')
  if (
    (layout === 'v1' || layout === 'v2') &&
    /^\/airports\/[^/]+\/lounges\/[^/]+$/.test(request.nextUrl.pathname)
  ) {
    const url = request.nextUrl.clone()
    url.pathname = `${request.nextUrl.pathname}/preview`
    const rewritten = NextResponse.rewrite(url)
    supabaseResponse.cookies.getAll().forEach(cookie => {
      rewritten.cookies.set(cookie)
    })
    return rewritten
  }

  // Protect /account routes
  if (!user && request.nextUrl.pathname.startsWith('/account')) {
    const url = request.nextUrl.clone()
    url.pathname = '/auth/login'
    url.searchParams.set('redirectTo', request.nextUrl.pathname)
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
}
