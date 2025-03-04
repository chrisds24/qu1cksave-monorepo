import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const isAuthenticated = request.cookies.has('session');

  // Authenticated and at home page, go to jobs
  if(isAuthenticated && (request.nextUrl.pathname === '/')) {
    return NextResponse.redirect(new URL('/jobs', request.url))
  }
  // Authenticated and at login route, go to jobs route
  if(isAuthenticated && request.nextUrl.pathname.startsWith('/login')) {
    return NextResponse.redirect(new URL('/jobs', request.url))
  }
  // Authenticated and at signup route, go to jobs route
  if(isAuthenticated && request.nextUrl.pathname.startsWith('/login')) {
    return NextResponse.redirect(new URL('/jobs', request.url))
  }

  // Not authenticated at at jobs route, go to login
  if(!isAuthenticated && request.nextUrl.pathname.startsWith('/jobs')) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Not authenticated at at documents route, go to login
  if(!isAuthenticated && request.nextUrl.pathname.startsWith('/documents')) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Not authenticated at at statistics route, go to login
  if(!isAuthenticated && request.nextUrl.pathname.startsWith('/statistics')) {
    return NextResponse.redirect(new URL('/login', request.url))
  }
}
 
export const config = {
  matcher: ['/',
    '/login/:path*',
    '/signup/:path*',
    '/jobs/:path*',
    '/documents/:path*',
    '/statistics/:path*'
  ]
}