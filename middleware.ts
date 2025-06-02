import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Check if the request is for admin routes
  if (pathname.startsWith("/admin")) {
    // Skip middleware for login page
    if (pathname === "/admin/login") {
      // If user is already authenticated, redirect to dashboard
      const token = request.cookies.get("admin-token")
      if (token) {
        return NextResponse.redirect(new URL("/admin", request.url))
      }
      return NextResponse.next()
    }

    // For all other admin routes, check authentication
    const token = request.cookies.get("admin-token")

    if (!token) {
      // Redirect to login if not authenticated
      return NextResponse.redirect(new URL("/admin/login", request.url))
    }

    // In a real app, you would verify the JWT token here
    // For now, we'll just check if the token exists
    if (token.value !== "mock-jwt-token") {
      // Invalid token, redirect to login
      const response = NextResponse.redirect(new URL("/admin/login", request.url))
      response.cookies.delete("admin-token")
      return response
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/admin/:path*"],
}
