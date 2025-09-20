import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip Next internals, favicon, and common image extensions
  if (
    pathname.startsWith('/_next/') ||
    pathname === '/favicon.ico' ||
    pathname.startsWith('/api/') ||
    pathname.startsWith('/images/') ||
    /\.(png|jpe?g|gif|webp|svg|ico)$/.test(pathname)
  ) {
    return NextResponse.next();
  }

  // --- Your auth check (ASP.NET companion cookie or your /users/@me call) ---
  const isLoggedIn = request.cookies.has('__Host_CREO-SURFTlRJVFktVkVSSUZJQ0FUSU9OLUVNQkVERElORw'); // or do your fetch check

  if (isLoggedIn && pathname.startsWith('/auth')) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  if (!isLoggedIn && !pathname.startsWith('/auth')) {
    const url = new URL('/auth/login', request.url);
    // preserve original path + query for post-login redirect
    url.searchParams.set('redirect', pathname + request.nextUrl.search);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/:path*'], // no capturing groups used
};