import NextAuth from 'next-auth'
import { authConfig } from './src/lib/auth.config'
import { NextResponse } from 'next/server'

const { auth } = NextAuth(authConfig)

export default auth((req) => {
    const isLoggedIn = !!req.auth
    const { pathname } = req.nextUrl

    const isAuthPage = pathname === '/signin' || pathname === '/signup'

    // Redirect unauthenticated users to sign-in
    if (!isLoggedIn && !isAuthPage) {
        return NextResponse.redirect(new URL('/signin', req.url))
    }

    // Redirect logged-in users away from sign-in/sign-up
    if (isLoggedIn && isAuthPage) {
        return NextResponse.redirect(new URL('/', req.url))
    }

    return NextResponse.next()
})

export const config = {
    // Exclude NextAuth API routes, static files, and images from middleware
    matcher: ['/((?!api/auth|_next/static|_next/image|favicon.ico|.*\\..*).*)'],
}
