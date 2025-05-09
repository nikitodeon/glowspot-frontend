import { type NextRequest, NextResponse } from 'next/server'

export default function middleware(request: NextRequest) {
	console.log('middleware was called')
	const { url, cookies, nextUrl } = request

	const session = cookies.get('session')?.value

	const isAuthRoute = nextUrl.pathname.startsWith('/account')
	const isDeactivateRoute = nextUrl.pathname === '/account/deactivate'
	const isDashboardRoute = nextUrl.pathname.startsWith('/dashboard')
	const isSearchRoute = nextUrl.pathname.startsWith('/search')

	if (!session && isDashboardRoute) {
		return NextResponse.redirect(new URL('/account/login', url))
	}

	if (!session && isSearchRoute) {
		return NextResponse.redirect(new URL('/account/login', url))
	}
	if (!session && isDeactivateRoute) {
		return NextResponse.redirect(new URL('/account/login', url))
	}

	if (session && isAuthRoute && !isDeactivateRoute) {
		return NextResponse.redirect(new URL('/dashboard/hosting', url))
	}

	return NextResponse.next()
}

export const config = {
	matcher: ['/account/:path*', '/dashboard/:path*', '/search/:path*']
}
