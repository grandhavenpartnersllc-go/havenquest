import { NextRequest, NextResponse } from 'next/server'

export function proxy(req: NextRequest) {
  const path = req.nextUrl.pathname

  if (path.startsWith('/portal')) {
    const auth = req.cookies.get('hq_auth')
    if (!auth) {
      return NextResponse.redirect(new URL('/login', req.nextUrl))
    }
  }

  const response = NextResponse.next()
  response.headers.set('x-pathname', req.nextUrl.pathname)
  return response
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
}
