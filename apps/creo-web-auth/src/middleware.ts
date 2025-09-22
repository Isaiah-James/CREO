import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    if (pathname === "/") {
        const cookie = request.cookies.get('CREO_auth');

        if (cookie) {
            const code = await getAuthorizationCode(cookie.value);

            return NextResponse.redirect(
                `https://account.creoco.net/auth/callback?code=${code}`
            );
        };

        return NextResponse.redirect(new URL('/login', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/']
};

async function getAuthorizationCode(token: string) {
    return crypto.randomUUID();
}