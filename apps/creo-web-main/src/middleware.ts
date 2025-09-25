import { hash } from 'crypto';
import { NextRequest, NextResponse } from 'next/server';

const verifier = `wJ3vYdT5uR8pQ0fK7mXcLbZ6aN2hHqE9tG4sPoV1iUjCkM8rDyFzWnSeAxBlOgTwR7vYdT5uR8pQ0fK7mXcLbZ6aN2hHqE9tG`;

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

    const challenge = encodeURIComponent(hash('sha256', verifier));

    // Redirect to auth frontend, which will handle OIDC with identity.creoco.net
    const url = new URL(`https://auth.creoco.net/login`);

    url.searchParams.set('client_id', 'creo-main');
    url.searchParams.set('redirect_uri', redirectUri);
    url.searchParams.set('response_type', 'code');
    url.searchParams.set('scope', 'openid profile email');
    url.searchParams.set('code_challenge_method', 'S256');
    url.searchParams.set('code_challenge', challenge);
    url.searchParams.set('state', Math.random().toString(36).substring(2, 15));
    url.searchParams.set('nonce', Math.random().toString(36).substring(2, 15));

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
