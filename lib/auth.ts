import { cookies } from "next/headers"
import { redirect } from "next/navigation"

export async function getServerSession() {
  const cookieStore = await cookies()
  const token = cookieStore.get("admin-token")

  return token ? { user: { id: "admin", role: "admin" } } : null
}

export async function requireAuth() {
  const session = await getServerSession()

  if (!session) {
    redirect("/admin/login")
  }

  return session
}

export function createAuthToken(userId: string) {
  // In a real app, you would create a proper JWT token
  // For demo purposes, we're using a simple mock token
  return "mock-jwt-token"
}

export function verifyAuthToken(token: string) {
  // In a real app, you would verify the JWT token
  // For demo purposes, we're just checking if it matches our mock token
  return token === "mock-jwt-token"
}
