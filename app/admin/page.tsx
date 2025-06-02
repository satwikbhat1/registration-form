import { requireAuth } from "@/lib/auth"
import { AdminDashboard } from "@/components/admin-dashboard"

export default async function AdminPage() {
  // This will redirect to login if not authenticated
  await requireAuth()

  return <AdminDashboard />
}
