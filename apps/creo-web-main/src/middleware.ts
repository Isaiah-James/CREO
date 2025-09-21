import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/_next/image') ||  
    pathname === '/favicon.ico' ||
    pathname.startsWith('/api/') ||
    pathname.startsWith('/images/') ||
    /\.(png|jpe?g|gif|webp|svg|ico)$/.test(pathname)
  ) {
    return NextResponse.next();
  }

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
  matcher: ['/:path*'], 
};
