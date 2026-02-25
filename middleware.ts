import { auth } from './src/lib/auth'
import { NextResponse } from 'next/server'

export default auth((req) => {
    const isLoggedIn = !!req.auth
    const pathname = req.nextUrl.pathname

    // Allow auth pages, API routes and static assets through
    const isAuthPage = pathname === '/signin' || pathname === '/signup'
    const isPublic = pathname.startsWith('/api') || pathname.startsWith('/_next') || pathname.includes('.')

    if (isPublic) return NextResponse.next()

    // Redirect logged-in users away from auth pages
    if (isLoggedIn && isAuthPage) {
        return NextResponse.redirect(new URL('/', req.nextUrl))
    }

    // Redirect unauthenticated users to sign-in
    if (!isLoggedIn && !isAuthPage) {
        return NextResponse.redirect(new URL('/signin', req.nextUrl))
    }

    return NextResponse.next()
})

export const config = {
    matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
