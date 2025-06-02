import { redirect } from "next/navigation"
import { AdminDashboard } from "@/components/admin-dashboard"

// In a real app, you'd check authentication here
async function checkAuth() {
  // Placeholder for authentication check
  // return await getServerSession()
  return true
}

export default async function AdminPage() {
  const isAuthenticated = await checkAuth()

  if (!isAuthenticated) {
    redirect("/admin/login")
  }

  return <AdminDashboard />
}
