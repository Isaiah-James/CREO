import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isLoggedIn = request.cookies.has(
    '__Host_CREO-SURFTlRJVFktVkVSSUZJQ0FUSU9OLUVNQkVERElORw'
  );

  if (isLoggedIn && pathname.startsWith('/auth')) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  if (!isLoggedIn && !pathname.startsWith('/auth')) {
    const url = new URL('/auth/login', request.url);
    url.searchParams.set('redirect', pathname + request.nextUrl.search);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/projects/:path*',
    '/thinktanks/:path*',
    '/communities/:path*',
    '/extensions/:path*',
    '/'
  ], 
};
