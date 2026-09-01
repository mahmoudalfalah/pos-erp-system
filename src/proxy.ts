import { NextResponse } from 'next/server';

import { Role } from '@/features/auth/types/role.types';
import { DEFAULT_LOGIN, PUBLIC_ROUTES, ROLE_REDIRECTS } from '@/lib/constants/paths';
import { auth } from '@/auth';

export const proxy = auth((req) => {
    const { nextUrl } = req;

    const session = req.auth;

    const isPublicRoute = PUBLIC_ROUTES.includes(nextUrl.pathname);

    if (!session && !isPublicRoute) {
        return NextResponse.redirect(new URL(DEFAULT_LOGIN, req.url));
    }

    if (session) {
        const role = session?.user?.role as Role;

        if (nextUrl.pathname === DEFAULT_LOGIN) {
            const redirect = ROLE_REDIRECTS[role] || DEFAULT_LOGIN;
            return NextResponse.redirect(new URL(redirect, req.url));
        }

        if (nextUrl.pathname.startsWith('/dashboard') && role === Role.CASHIER) {
            return NextResponse.redirect(new URL('/pos', req.url));
        }
    }

    return NextResponse.next();
});

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
