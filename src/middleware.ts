export { default } from "next-auth/middleware"

export const config = {
    matcher: [
        '/((?!_next/static|favicon.ico|auth/|api/auth/).*)',
    ]
}