import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"
import { ROUTES } from "@/constants"

/**
 * Auth-only middleware: every matched route requires a valid session.
 * Unauthenticated users are redirected to the login page by next-auth.
 *
 * (RBAC was intentionally removed from this template. To add permission-based
 *  route protection, gate on `token.data.permissions` here.)
 */
export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl

    // Send the authenticated landing route ("/") to the dashboard.
    if (pathname === ROUTES.HOME) {
      return NextResponse.redirect(new URL(ROUTES.DASHBOARD, req.url))
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
)

export const config = {
  matcher: [
    // Protect everything except auth pages, Next internals and static assets.
    "/((?!api/auth|auth|_next/static|_next/image|favicon.ico|.*\\.png|.*\\.jpe?g|.*\\.svg|.*\\.webp).*)",
  ],
}
