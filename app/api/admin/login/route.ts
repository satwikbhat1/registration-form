import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json()

    // Mock authentication - replace with real authentication
    if (username === "admin" && password === "admin123") {
      // In a real app, you'd create a JWT token or session
      const response = NextResponse.json({ success: true })

      // Set authentication cookie
      response.cookies.set("admin-token", "mock-jwt-token", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 60 * 60 * 24 * 7, // 7 days
      })

      return response
    }

    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
