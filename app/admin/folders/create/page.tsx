"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FolderPlus, ArrowLeft, Save } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function CreateFolderPage() {
  const [folderData, setFolderData] = useState({
    name: "",
    description: "",
    category: "",
    permissions: "public",
  })
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const isAuthenticated = localStorage.getItem("adminAuthenticated")
    if (!isAuthenticated) {
      router.push("/admin")
    }
  }, [router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate folder creation
    setTimeout(() => {
      console.log("Creating folder:", folderData)
      alert("Folder created successfully!")
      router.push("/admin/folders")
    }, 1000)
  }

  const handleInputChange = (field: string, value: string) => {
    setFolderData({ ...folderData, [field]: value })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/admin/folders">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Folders
                </Link>
              </Button>
              <div className="bg-green-100 p-2 rounded-lg">
                <FolderPlus className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">Create New Folder</h1>
                <p className="text-sm text-gray-600">Add a new folder to organize documents</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Folder Details</CardTitle>
            <CardDescription>Provide information about the new folder you want to create</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Folder Name *</Label>
                  <Input
                    id="name"
                    value={folderData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    placeholder="Enter folder name"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select value={folderData.category} onValueChange={(value) => handleInputChange("category", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="academic">Academic Resources</SelectItem>
                      <SelectItem value="admissions">Admissions</SelectItem>
                      <SelectItem value="student-services">Student Services</SelectItem>
                      <SelectItem value="faculty">Faculty Resources</SelectItem>
                      <SelectItem value="administration">Administration</SelectItem>
                      <SelectItem value="policies">Policies & Procedures</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={folderData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  placeholder="Describe what this folder will contain..."
                  rows={4}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="permissions">Access Permissions</Label>
                <Select
                  value={folderData.permissions}
                  onValueChange={(value) => handleInputChange("permissions", value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="public">Public - Visible to all users</SelectItem>
                    <SelectItem value="students">Students Only - Visible to enrolled students</SelectItem>
                    <SelectItem value="faculty">Faculty Only - Visible to faculty members</SelectItem>
                    <SelectItem value="admin">Admin Only - Visible to administrators</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold text-blue-800 mb-2">Folder Guidelines</h4>
                <ul className="text-blue-700 text-sm space-y-1">
                  <li>• Use descriptive names that clearly indicate the folder's purpose</li>
                  <li>• Avoid special characters in folder names</li>
                  <li>• Consider the access permissions carefully before creating</li>
                  <li>• You can always modify folder details later</li>
                </ul>
              </div>

              <div className="flex gap-4 pt-4">
                <Button type="submit" disabled={isLoading || !folderData.name}>
                  {isLoading ? (
                    "Creating..."
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Create Folder
                    </>
                  )}
                </Button>
                <Button type="button" variant="outline" asChild>
                  <Link href="/admin/folders">Cancel</Link>
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
