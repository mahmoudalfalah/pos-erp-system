import { auth } from "@/auth";
import { NextResponse } from "next/server";
import { ROLE_REDIRECTS, PUBLIC_ROUTES, DEFAULT_LOGIN } from "@/lib/constants/paths";

export const proxy = auth((req) => {
    const { nextUrl } = req;

    const session = req.auth;

    const isPublicRoute = PUBLIC_ROUTES.includes(nextUrl.pathname);

    if (!session && !isPublicRoute) {
        return NextResponse.redirect(new URL(DEFAULT_LOGIN, req.url));
    }

    if (session && nextUrl.pathname === DEFAULT_LOGIN) {
        const role = session.user.role;

        const redirect = ROLE_REDIRECTS[role] ?? "/";

        return NextResponse.redirect(new URL(redirect, req.url));
    }

    return NextResponse.next();
})

export const config = {
    matcher: [
        "/((?!api|_next/static|_next/image|favicon.ico).*)",
    ],
}