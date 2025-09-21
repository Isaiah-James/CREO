import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isLoggedIn = request.cookies.has(
    '__Host_CREO-SURFTlRJVFktVkVSSUZJQ0FUSU9OLUVNQkVERElORw'
  );

  if (isLoggedIn && (pathname.startsWith('/login') || pathname.startsWith('/register'))) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  if (!isLoggedIn && (!pathname.startsWith('/login') || !pathname.startsWith('/register'))) {
    const url = new URL('/login', request.url);
    url.searchParams.set('redirect', pathname + request.nextUrl.search);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!auth|_next|favicon.ico|.*\\.(?:png|jpg|jpeg|gif|webp|svg|ico)).*)',
  ],
};