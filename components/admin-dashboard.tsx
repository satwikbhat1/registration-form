"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import {
  Search,
  Eye,
  Edit,
  Trash2,
  Download,
  Users,
  FileText,
  Calendar,
  ChevronLeft,
  ChevronRight,
  LogOut,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"

interface Registration {
  id: string
  fullName: string
  email: string
  mobileNumber: string
  aadhaarNumber: string
  state: string
  city: string
  gender: string
  createdAt: string
  photoUrl?: string
  videoUrl?: string
}

export function AdminDashboard() {
  const [registrations, setRegistrations] = useState<Registration[]>([])
  const [filteredData, setFilteredData] = useState<Registration[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [stateFilter, setStateFilter] = useState("all")
  const [genderFilter, setGenderFilter] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedRegistration, setSelectedRegistration] = useState<Registration | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()
  const router = useRouter()

  const itemsPerPage = 10

  useEffect(() => {
    fetchRegistrations()
  }, [])

  useEffect(() => {
    filterData()
  }, [registrations, searchTerm, stateFilter, genderFilter])

  const fetchRegistrations = async () => {
    try {
      const response = await fetch("/api/admin/registrations")
      if (response.ok) {
        const data = await response.json()
        setRegistrations(data)
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch registrations",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const filterData = () => {
    let filtered = registrations

    if (searchTerm) {
      filtered = filtered.filter(
        (reg) =>
          reg.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          reg.mobileNumber.includes(searchTerm) ||
          reg.aadhaarNumber.includes(searchTerm),
      )
    }

    if (stateFilter !== "all") {
      filtered = filtered.filter((reg) => reg.state === stateFilter)
    }

    if (genderFilter !== "all") {
      filtered = filtered.filter((reg) => reg.gender === genderFilter)
    }

    setFilteredData(filtered)
    setCurrentPage(1)
  }

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this registration?")) {
      try {
        const response = await fetch(`/api/admin/registrations/${id}`, {
          method: "DELETE",
        })
        if (response.ok) {
          setRegistrations(registrations.filter((reg) => reg.id !== id))
          toast({
            title: "Success",
            description: "Registration deleted successfully",
          })
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete registration",
          variant: "destructive",
        })
      }
    }
  }

  const exportData = () => {
    const csvContent = [
      ["Name", "Email", "Mobile", "Aadhaar", "State", "City", "Gender", "Date"].join(","),
      ...filteredData.map((reg) =>
        [
          reg.fullName,
          reg.email,
          reg.mobileNumber,
          reg.aadhaarNumber,
          reg.state,
          reg.city,
          reg.gender,
          new Date(reg.createdAt).toLocaleDateString(),
        ].join(","),
      ),
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "registrations.csv"
    a.click()
  }

  const paginatedData = filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  const totalPages = Math.ceil(filteredData.length / itemsPerPage)

  const stats = {
    total: registrations.length,
    male: registrations.filter((r) => r.gender === "male").length,
    female: registrations.filter((r) => r.gender === "female").length,
    today: registrations.filter((r) => new Date(r.createdAt).toDateString() === new Date().toDateString()).length,
  }

  const handleLogout = async () => {
    try {
      const response = await fetch("/api/admin/logout", {
        method: "POST",
      })

      if (response.ok) {
        router.push("/admin/login")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to logout",
        variant: "destructive",
      })
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-600">Manage registration applications</p>
          </div>
          <div className="flex items-center gap-4">
            <Button onClick={exportData} className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Export Data
            </Button>
            <Button variant="outline" onClick={handleLogout} className="flex items-center gap-2">
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Registrations</p>
                  <p className="text-2xl font-bold">{stats.total}</p>
                </div>
                <Users className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Male Applicants</p>
                  <p className="text-2xl font-bold">{stats.male}</p>
                </div>
                <FileText className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Female Applicants</p>
                  <p className="text-2xl font-bold">{stats.female}</p>
                </div>
                <FileText className="h-8 w-8 text-pink-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Today's Registrations</p>
                  <p className="text-2xl font-bold">{stats.today}</p>
                </div>
                <Calendar className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle>Filters & Search</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by name, mobile, or Aadhaar..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={stateFilter} onValueChange={setStateFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by State" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All States</SelectItem>
                  <SelectItem value="Maharashtra">Maharashtra</SelectItem>
                  <SelectItem value="Delhi">Delhi</SelectItem>
                  <SelectItem value="Karnataka">Karnataka</SelectItem>
                  <SelectItem value="Tamil Nadu">Tamil Nadu</SelectItem>
                </SelectContent>
              </Select>
              <Select value={genderFilter} onValueChange={setGenderFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by Gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Genders</SelectItem>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm("")
                  setStateFilter("all")
                  setGenderFilter("all")
                }}
              >
                Clear Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Data Table */}
        <Card>
          <CardHeader>
            <CardTitle>Registration Applications</CardTitle>
            <CardDescription>
              Showing {paginatedData.length} of {filteredData.length} registrations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Mobile</TableHead>
                    <TableHead>State</TableHead>
                    <TableHead>City</TableHead>
                    <TableHead>Gender</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedData.map((registration) => (
                    <TableRow key={registration.id}>
                      <TableCell className="font-medium">{registration.fullName}</TableCell>
                      <TableCell>{registration.email}</TableCell>
                      <TableCell>{registration.mobileNumber}</TableCell>
                      <TableCell>{registration.state}</TableCell>
                      <TableCell>{registration.city}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            registration.gender === "male"
                              ? "default"
                              : registration.gender === "female"
                                ? "secondary"
                                : "outline"
                          }
                        >
                          {registration.gender}
                        </Badge>
                      </TableCell>
                      <TableCell>{new Date(registration.createdAt).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="outline" size="sm" onClick={() => setSelectedRegistration(registration)}>
                                <Eye className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl">
                              <DialogHeader>
                                <DialogTitle>Registration Details</DialogTitle>
                              </DialogHeader>
                              {selectedRegistration && (
                                <div className="space-y-4">
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <label className="text-sm font-medium">Full Name</label>
                                      <p className="text-sm text-gray-600">{selectedRegistration.fullName}</p>
                                    </div>
                                    <div>
                                      <label className="text-sm font-medium">Email</label>
                                      <p className="text-sm text-gray-600">{selectedRegistration.email}</p>
                                    </div>
                                    <div>
                                      <label className="text-sm font-medium">Mobile</label>
                                      <p className="text-sm text-gray-600">{selectedRegistration.mobileNumber}</p>
                                    </div>
                                    <div>
                                      <label className="text-sm font-medium">Aadhaar</label>
                                      <p className="text-sm text-gray-600">{selectedRegistration.aadhaarNumber}</p>
                                    </div>
                                  </div>
                                  {selectedRegistration.photoUrl && (
                                    <div>
                                      <label className="text-sm font-medium">Photo</label>
                                      <img
                                        src={selectedRegistration.photoUrl || "/placeholder.svg"}
                                        alt="Applicant"
                                        className="mt-2 h-32 w-32 object-cover rounded"
                                      />
                                    </div>
                                  )}
                                  {selectedRegistration.videoUrl && (
                                    <div>
                                      <label className="text-sm font-medium">Video</label>
                                      <video
                                        src={selectedRegistration.videoUrl}
                                        controls
                                        className="mt-2 h-48 w-full rounded"
                                      />
                                    </div>
                                  )}
                                </div>
                              )}
                            </DialogContent>
                          </Dialog>
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => handleDelete(registration.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between mt-4">
              <p className="text-sm text-gray-600">
                Page {currentPage} of {totalPages}
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
