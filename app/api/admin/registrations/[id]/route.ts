import { type NextRequest, NextResponse } from "next/server"
import { verifyAuthToken } from "@/lib/auth"

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Check authentication
    const token = request.cookies.get("admin-token")
    if (!token || !verifyAuthToken(token.value)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = params

    // In a real app, you'd delete from your database here
    console.log(`Deleting registration with ID: ${id}`)

    return NextResponse.json({ success: true, message: "Registration deleted successfully" })
  } catch (error) {
    console.error("Delete registration error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Check authentication
    const token = request.cookies.get("admin-token")
    if (!token || !verifyAuthToken(token.value)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = params
    const updateData = await request.json()

    // In a real app, you'd update your database here
    console.log(`Updating registration with ID: ${id}`, updateData)

    return NextResponse.json({ success: true, message: "Registration updated successfully" })
  } catch (error) {
    console.error("Update registration error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
