export async function POST(request: Request) {
    const body = await request.json();

    // Step 1: login to API
    const loginRes = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/login?useCookies=true`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
        }
    );

    if (!loginRes.ok) {
        const errorData = await loginRes.json().catch(() => ({}));
        return new Response(JSON.stringify(errorData), {
            status: loginRes.status,
            headers: { "Content-Type": "application/json" },
        });
    }

    // Step 2: grab Set-Cookie header(s) from API
    const cookieHeader = loginRes.headers.get("set-cookie");

    // Step 3: call /users/@me with same cookies
    const userRes = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/users/@me`,
        {
            headers: {
                "Content-Type": "application/json",
                ...(cookieHeader ? { Cookie: cookieHeader } : {}),
            },
        }
    );

    const userData = await userRes.json().catch(() => ({}));

    // Step 4: return userData AND forward cookies to the browser
    const headers: HeadersInit = {
        "Content-Type": "application/json",
    };

    if (cookieHeader) {
        headers["Set-Cookie"] = cookieHeader;
    }

    return new Response(JSON.stringify(userData), {
        status: userRes.status,
        headers,
    });
}
