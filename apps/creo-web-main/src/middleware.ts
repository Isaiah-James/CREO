import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isLoggedIn = request.cookies.has(
    '__Host_CREO-SURFTlRJVFktVkVSSUZJQ0FUSU9OLUVNQkVERElORw'
  );

  // Redirect unauthenticated users away from protected routes
  if (!isLoggedIn && !pathname.startsWith('/login') && !pathname.startsWith('/register')) {
    const url = new URL('https://auth.creoco.net/login');

    if (pathname !== '/') {
      url.searchParams.set('redirect', pathname + request.nextUrl.search);
    }

    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next|favicon.ico|.*\\.(?:png|jpg|jpeg|gif|webp|svg|ico)).*)',
  ],
};
