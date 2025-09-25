import { NextRequest, NextResponse } from 'next/server';

export async function middleware(request: NextRequest) {
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

    const verifier = generateRandomString(128);
    const challenge = await generateChallenge(verifier);


    // Redirect to auth frontend, which will handle OIDC with identity.creoco.net
    const url = new URL(`https://auth.creoco.net/login`);

    url.searchParams.set('client_id', 'creo-main');
    url.searchParams.set('redirect_uri', redirectUri);
    url.searchParams.set('response_type', 'code');
    url.searchParams.set('scope', 'openid profile email');
    url.searchParams.set('code_challenge_method', 'S256');
    url.searchParams.set('code_challenge', challenge);
    url.searchParams.set('state', generateRandomString(128));
    url.searchParams.set('nonce', generateRandomString(128));

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

// Create a code challenge from the verifier
async function generateChallenge(verifier: string) {
  const data = new TextEncoder().encode(verifier);
  const digest = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(digest));
  const base64 = btoa(String.fromCharCode(...hashArray))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, ""); // base64url
  return base64;
}

function generateRandomString(length = 128) {
  const charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~";
  const array = new Uint8Array(length);
  crypto.getRandomValues(array);

  return Array.from(array)
    .map(x => charset[x % charset.length])
    .join("");
}
