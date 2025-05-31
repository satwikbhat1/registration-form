import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()

    // Extract form fields
    const registrationData = {
      fullName: formData.get("fullName") as string,
      dateOfBirth: formData.get("dateOfBirth") as string,
      gender: formData.get("gender") as string,
      mobileNumber: formData.get("mobileNumber") as string,
      email: formData.get("email") as string,
      aadhaarNumber: formData.get("aadhaarNumber") as string,
      panNumber: formData.get("panNumber") as string,
      permanentAddress: formData.get("permanentAddress") as string,
      state: formData.get("state") as string,
      city: formData.get("city") as string,
      pincode: formData.get("pincode") as string,
    }

    const photoFile = formData.get("photo") as File
    const videoFile = formData.get("video") as File

    // Validate files
    if (!photoFile || !videoFile) {
      return NextResponse.json({ error: "Photo and video files are required" }, { status: 400 })
    }

    // File validation
    const allowedImageTypes = ["image/jpeg", "image/png"]
    const allowedVideoTypes = ["video/mp4", "video/quicktime"]

    if (!allowedImageTypes.includes(photoFile.type)) {
      return NextResponse.json({ error: "Invalid photo format. Only JPG and PNG are allowed." }, { status: 400 })
    }

    if (!allowedVideoTypes.includes(videoFile.type)) {
      return NextResponse.json({ error: "Invalid video format. Only MP4 and MOV are allowed." }, { status: 400 })
    }

    if (photoFile.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: "Photo size must be less than 5MB" }, { status: 400 })
    }

    if (videoFile.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: "Video size must be less than 10MB" }, { status: 400 })
    }

    // Here you would:
    // 1. Upload files to cloud storage (Cloudinary, AWS S3, etc.)
    // 2. Save registration data to database
    // 3. Return success response

    // Mock file upload URLs
    const photoUrl = `/uploads/photos/${Date.now()}-${photoFile.name}`
    const videoUrl = `/uploads/videos/${Date.now()}-${videoFile.name}`

    // Mock database save
    const registration = {
      id: Date.now().toString(),
      ...registrationData,
      photoUrl,
      videoUrl,
      createdAt: new Date().toISOString(),
    }

    console.log("Registration saved:", registration)

    return NextResponse.json({ message: "Registration submitted successfully", id: registration.id }, { status: 201 })
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
