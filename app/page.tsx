import { RegistrationForm } from "@/components/registration-form"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Registration Portal</h1>
          <p className="text-gray-600">Complete your registration by filling out the form below</p>
        </div>
        <RegistrationForm />
      </div>
    </div>
  )
}
