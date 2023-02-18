import { NextRequest, NextResponse, } from "next/server";
import Session from "./lib/session/session";

export async function middleware(request: NextRequest) {
    const token = await Session.validate(request)
        .catch(err => console.error(err));

    if (!token) {
        const loginUrl = new URL('/auth/signin', request.url);
        loginUrl.searchParams.set('from', request.nextUrl.pathname);
        return NextResponse.redirect(loginUrl);
    } else {
        return NextResponse.next();
    }
}

export const config = {
    matcher: [
        '/((?!_next/static|favicon.ico|auth/signin|api/auth/login).*)',
    ]
}