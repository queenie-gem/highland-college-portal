"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Folder, Search, Plus, MoreVertical, Edit, Trash2, FileText, Calendar, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

interface FolderItem {
  id: string
  name: string
  description: string
  documentCount: number
  createdAt: string
  updatedAt: string
}

export default function FoldersPage() {
  const [folders, setFolders] = useState<FolderItem[]>([
    {
      id: "1",
      name: "Academic Resources",
      description: "Academic calendars, schedules, and institutional documents",
      documentCount: 15,
      createdAt: "2024-01-15",
      updatedAt: "2024-01-20",
    },
    {
      id: "2",
      name: "Admission Documents",
      description: "Application forms, requirements, and admission guidelines",
      documentCount: 8,
      createdAt: "2024-01-10",
      updatedAt: "2024-01-18",
    },
    {
      id: "3",
      name: "Student Handbooks",
      description: "Student guides, policies, and handbook materials",
      documentCount: 12,
      createdAt: "2024-01-12",
      updatedAt: "2024-01-19",
    },
    {
      id: "4",
      name: "Faculty Resources",
      description: "Teaching materials, faculty guidelines, and resources",
      documentCount: 6,
      createdAt: "2024-01-08",
      updatedAt: "2024-01-16",
    },
  ])
  const [searchTerm, setSearchTerm] = useState("")
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [folderToDelete, setFolderToDelete] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    const isAuthenticated = localStorage.getItem("adminAuthenticated")
    if (!isAuthenticated) {
      router.push("/admin")
    }
  }, [router])

  const filteredFolders = folders.filter(
    (folder) =>
      folder.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      folder.description.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleDeleteFolder = (folderId: string) => {
    setFolderToDelete(folderId)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = () => {
    if (folderToDelete) {
      setFolders(folders.filter((folder) => folder.id !== folderToDelete))
      setDeleteDialogOpen(false)
      setFolderToDelete(null)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/admin/dashboard">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Dashboard
                </Link>
              </Button>
              <div className="bg-purple-100 p-2 rounded-lg">
                <Folder className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">Manage Folders</h1>
                <p className="text-sm text-gray-600">Organize and manage document folders</p>
              </div>
            </div>

            <Button asChild>
              <Link href="/admin/folders/create">
                <Plus className="h-4 w-4 mr-2" />
                Create Folder
              </Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filters */}
        <div className="mb-6">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search folders..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </div>

        {/* Folders Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredFolders.map((folder) => (
            <Card key={folder.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="bg-blue-100 p-2 rounded-lg">
                      <Folder className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{folder.name}</CardTitle>
                      <Badge variant="secondary" className="mt-1">
                        {folder.documentCount} documents
                      </Badge>
                    </div>
                  </div>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit Folder
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-red-600" onClick={() => handleDeleteFolder(folder.id)}>
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete Folder
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>

              <CardContent>
                <CardDescription className="mb-4">{folder.description}</CardDescription>

                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>Created: {new Date(folder.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    <span>Updated: {new Date(folder.updatedAt).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="flex gap-2 mt-4">
                  <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                    View Documents
                  </Button>
                  <Button size="sm" className="flex-1" asChild>
                    <Link href={`/admin/documents/upload?folder=${folder.id}`}>Add Documents</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredFolders.length === 0 && (
          <div className="text-center py-12">
            <div className="bg-gray-100 p-4 rounded-full w-fit mx-auto mb-4">
              <Folder className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No folders found</h3>
            <p className="text-gray-600 mb-4">
              {searchTerm ? "No folders match your search criteria." : "Get started by creating your first folder."}
            </p>
            <Button asChild>
              <Link href="/admin/folders/create">
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Folder
              </Link>
            </Button>
          </div>
        )}
      </main>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Folder</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this folder? This action cannot be undone and will also delete all
              documents within the folder.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700">
              Delete Folder
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
