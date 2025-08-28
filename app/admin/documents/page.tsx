"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
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
import {
  FileText,
  Search,
  Upload,
  MoreVertical,
  Download,
  Trash2,
  Eye,
  Calendar,
  ArrowLeft,
  Filter,
} from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

interface Document {
  id: string
  name: string
  type: string
  size: string
  folder: string
  uploadedBy: string
  uploadedAt: string
  downloads: number
}

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<Document[]>([
    {
      id: "1",
      name: "Academic Calendar 2024.pdf",
      type: "PDF",
      size: "2.4 MB",
      folder: "Academic Resources",
      uploadedBy: "Admin",
      uploadedAt: "2024-01-20",
      downloads: 45,
    },
    {
      id: "2",
      name: "Admission Requirements.pdf",
      type: "PDF",
      size: "1.8 MB",
      folder: "Admission Documents",
      uploadedBy: "Admin",
      uploadedAt: "2024-01-18",
      downloads: 123,
    },
    {
      id: "3",
      name: "Student Handbook 2024.pdf",
      type: "PDF",
      size: "5.2 MB",
      folder: "Student Handbooks",
      uploadedBy: "Admin",
      uploadedAt: "2024-01-19",
      downloads: 67,
    },
    {
      id: "4",
      name: "Course Catalog.pdf",
      type: "PDF",
      size: "3.1 MB",
      folder: "Academic Resources",
      uploadedBy: "Admin",
      uploadedAt: "2024-01-17",
      downloads: 89,
    },
    {
      id: "5",
      name: "Faculty Guidelines.docx",
      type: "DOCX",
      size: "890 KB",
      folder: "Faculty Resources",
      uploadedBy: "Admin",
      uploadedAt: "2024-01-16",
      downloads: 23,
    },
  ])
  const [searchTerm, setSearchTerm] = useState("")
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [documentToDelete, setDocumentToDelete] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    const isAuthenticated = localStorage.getItem("adminAuthenticated")
    if (!isAuthenticated) {
      router.push("/admin")
    }
  }, [router])

  const filteredDocuments = documents.filter(
    (doc) =>
      doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.folder.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.type.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleDeleteDocument = (documentId: string) => {
    setDocumentToDelete(documentId)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = () => {
    if (documentToDelete) {
      setDocuments(documents.filter((doc) => doc.id !== documentToDelete))
      setDeleteDialogOpen(false)
      setDocumentToDelete(null)
    }
  }

  const getFileIcon = (type: string) => {
    return <FileText className="h-5 w-5 text-red-600" />
  }

  const getTypeColor = (type: string) => {
    const colors: { [key: string]: string } = {
      PDF: "bg-red-100 text-red-800",
      DOCX: "bg-blue-100 text-blue-800",
      XLSX: "bg-green-100 text-green-800",
      PPTX: "bg-orange-100 text-orange-800",
    }
    return colors[type] || "bg-gray-100 text-gray-800"
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
              <div className="bg-orange-100 p-2 rounded-lg">
                <FileText className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">Document Library</h1>
                <p className="text-sm text-gray-600">Manage all uploaded documents</p>
              </div>
            </div>

            <Button asChild>
              <Link href="/admin/documents/upload">
                <Upload className="h-4 w-4 mr-2" />
                Upload Documents
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
                placeholder="Search documents..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
          </div>
        </div>

        {/* Documents List */}
        <div className="space-y-4">
          {filteredDocuments.map((document) => (
            <Card key={document.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="bg-gray-100 p-3 rounded-lg">{getFileIcon(document.type)}</div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{document.name}</h3>
                      <div className="flex items-center gap-4 mt-1 text-sm text-gray-600">
                        <span>Folder: {document.folder}</span>
                        <span>Size: {document.size}</span>
                        <span>Downloads: {document.downloads}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Badge className={getTypeColor(document.type)}>{document.type}</Badge>
                    <div className="text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {new Date(document.uploadedAt).toLocaleDateString()}
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
                          <Eye className="h-4 w-4 mr-2" />
                          Preview
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600" onClick={() => handleDeleteDocument(document.id)}>
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredDocuments.length === 0 && (
          <div className="text-center py-12">
            <div className="bg-gray-100 p-4 rounded-full w-fit mx-auto mb-4">
              <FileText className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No documents found</h3>
            <p className="text-gray-600 mb-4">
              {searchTerm ? "No documents match your search criteria." : "Start by uploading your first document."}
            </p>
            <Button asChild>
              <Link href="/admin/documents/upload">
                <Upload className="h-4 w-4 mr-2" />
                Upload Your First Document
              </Link>
            </Button>
          </div>
        )}
      </main>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Document</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this document? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700">
              Delete Document
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
