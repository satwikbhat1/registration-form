import { type NextRequest, NextResponse } from "next/server"
import { verifyAuthToken } from "@/lib/auth"

// Mock data - replace with real database queries
const mockRegistrations = [
  {
    id: "1",
    fullName: "John Doe",
    email: "john.doe@example.com",
    mobileNumber: "9876543210",
    aadhaarNumber: "123456789012",
    state: "Maharashtra",
    city: "Mumbai",
    gender: "male",
    createdAt: "2024-01-15T10:30:00Z",
    photoUrl: "/placeholder.svg?height=100&width=100",
    videoUrl: "/placeholder.svg?height=200&width=300",
  },
  {
    id: "2",
    fullName: "Jane Smith",
    email: "jane.smith@example.com",
    mobileNumber: "9876543211",
    aadhaarNumber: "123456789013",
    state: "Delhi",
    city: "New Delhi",
    gender: "female",
    createdAt: "2024-01-14T15:45:00Z",
    photoUrl: "/placeholder.svg?height=100&width=100",
    videoUrl: "/placeholder.svg?height=200&width=300",
  },
  {
    id: "3",
    fullName: "Raj Patel",
    email: "raj.patel@example.com",
    mobileNumber: "9876543212",
    aadhaarNumber: "123456789014",
    state: "Gujarat",
    city: "Ahmedabad",
    gender: "male",
    createdAt: "2024-01-13T09:20:00Z",
    photoUrl: "/placeholder.svg?height=100&width=100",
    videoUrl: "/placeholder.svg?height=200&width=300",
  },
]

export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const token = request.cookies.get("admin-token")
    if (!token || !verifyAuthToken(token.value)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // In a real app, you'd query your database here
    return NextResponse.json(mockRegistrations)
  } catch (error) {
    console.error("Get registrations error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
