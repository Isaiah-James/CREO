import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  const isLoggedIn = request.cookies.has('__Host_CREO-AUTH');

  // Allow public routes
  if (pathname.startsWith('/login') || pathname.startsWith('/register')) {
    return NextResponse.next();
  }

  // If not logged in, redirect to auth
  if (!isLoggedIn) {
    const redirectUri = `https://creoco.net/auth/callback?redirect=${encodeURIComponent(
      'https://creoco.net' + pathname + search
    )}`;

    // Redirect to auth frontend, which will handle OIDC with identity.creoco.net
    const url = new URL('https://auth.creoco.net/login');
    url.searchParams.set('callbackUrl', redirectUri);

    return NextResponse.redirect(url);
  }

  // Otherwise continue as normal
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next|favicon.ico|.*\\.(?:png|jpg|jpeg|gif|webp|svg|ico)).*)',
  ],
};
