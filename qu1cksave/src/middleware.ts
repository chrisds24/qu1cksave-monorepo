import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const isAuthenticated = request.cookies.has('session');

  // // Authenticated and at home page, go to jobs
  // if(isAuthenticated && (request.nextUrl.pathname === '/')) {
  //   return NextResponse.redirect(new URL('/jobs', request.url))
  // }
  // // Authenticated and at login route, go to jobs route
  // if(isAuthenticated && request.nextUrl.pathname.startsWith('/login')) {
  //   return NextResponse.redirect(new URL('/jobs', request.url))
  // }
  // // Authenticated and at signup route, go to jobs route
  // if(isAuthenticated && request.nextUrl.pathname.startsWith('/login')) {
  //   return NextResponse.redirect(new URL('/jobs', request.url))
  // }

  // Authenticated and not at jobs route, go to jobs
  // TODO: Remove this once other authenticated routes have been added, use the
  //   ones above instead.
  if(isAuthenticated && !request.nextUrl.pathname.startsWith('/jobs')) {
    return NextResponse.redirect(new URL('/jobs', request.url))
  }

  // Not authenticated at at jobs route, go to login
  if(!isAuthenticated && request.nextUrl.pathname.startsWith('/jobs')) {
    return NextResponse.redirect(new URL('/login', request.url))
  }
}
 
export const config = {
  matcher: ['/', '/login/:path*', '/signup/:path*', '/jobs/:path*']
}