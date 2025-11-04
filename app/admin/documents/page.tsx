"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
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
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { toast } from "sonner";

type DbFolder = { id: string; name: string | null };
type DbFile = {
  id: string;
  name: string | null;
  file_type: string | null;
  size: number | null;
  file_path: string;
  url: string | null;
  status: string;
  created_at: string;
  folder: DbFolder | null;
};

interface DocumentItem {
  id: string;
  name: string;
  type: string;
  sizeBytes: number;
  folder: string;
  createdAt: string;
  url: string | null;
  filePath: string;
  status: string;
}

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [documentToDelete, setDocumentToDelete] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const isAuthenticated = localStorage.getItem("adminAuthenticated");
    if (!isAuthenticated) {
      router.push("/admin");
      return;
    }
    const supabase = createClient();
    async function load() {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("file")
          .select(
            "id,name,file_type,size,file_path,url,status,created_at,folder:folder(id,name)"
          )
          .order("created_at", { ascending: false });
        if (error) throw error;
        const mapped: DocumentItem[] = (data as any as DbFile[]).map((f) => ({
          id: f.id,
          name: f.name ?? "Untitled",
          type: (f.file_type ?? "FILE").toUpperCase(),
          sizeBytes: Number(f.size ?? 0),
          folder: f.folder?.name ?? "Uncategorized",
          createdAt: f.created_at,
          url: f.url ?? null,
          filePath: f.file_path,
          status: f.status,
        }));
        setDocuments(mapped);
      } catch (e) {
        console.error("Failed to load files", e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [router]);

  const filteredDocuments = documents.filter((doc) => {
    const q = searchTerm.toLowerCase();
    return (
      doc.name.toLowerCase().includes(q) ||
      doc.folder.toLowerCase().includes(q) ||
      doc.type.toLowerCase().includes(q)
    );
  });

  const handleDeleteDocument = (documentId: string) => {
    setDocumentToDelete(documentId);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!documentToDelete) return;
    const supabase = createClient();
    try {
      const target = documents.find((d) => d.id === documentToDelete);
      if (!target) {
        toast.error("File not found in the list");
        return;
      }
      const filePath = target.filePath;
      // Expect file_path in format "bucket/key..."; split bucket and path
      const firstSlash = filePath.indexOf("/");
      if (firstSlash <= 0) {
        toast.error("Invalid storage path for file");
        return;
      }
      const bucket = "knowledge";

      // 1) Delete from storage first
      const { error: storageError } = await supabase.storage
        .from(bucket)
        .remove([filePath]);
      if (storageError) {
        console.error("Storage delete failed", storageError);
        toast.error("Could not delete file from storage");
        return;
      }

      // 2) Only if storage deletion succeeded, delete DB reference
      const { error: dbError } = await supabase
        .from("file")
        .delete()
        .eq("id", documentToDelete);
      if (dbError) {
        console.error("DB delete failed", dbError);
        toast.error("Storage deleted, but failed to delete database record");
        return;
      }

      setDocuments((prev) => prev.filter((doc) => doc.id !== documentToDelete));
      toast.success("File deleted successfully");
    } catch (e) {
      console.error("Failed to delete file", e);
      toast.error("Failed to delete file");
    } finally {
      setDeleteDialogOpen(false);
      setDocumentToDelete(null);
    }
  };

  const getFileIcon = (type: string) => {
    return <FileText className="h-5 w-5 text-red-600" />;
  };

  const getTypeColor = (type: string) => {
    const colors: { [key: string]: string } = {
      PDF: "bg-red-100 text-red-800",
      DOCX: "bg-blue-100 text-blue-800",
      XLSX: "bg-green-100 text-green-800",
      PPTX: "bg-orange-100 text-orange-800",
    };
    return colors[type] || "bg-gray-100 text-gray-800";
  };

  const formatSize = (bytes: number) => {
    if (!bytes || bytes <= 0) return "—";
    const units = ["B", "KB", "MB", "GB", "TB"];
    let i = 0;
    let n = bytes;
    while (n >= 1024 && i < units.length - 1) {
      n /= 1024;
      i++;
    }
    return `${n.toFixed(n < 10 && i > 0 ? 1 : 0)} ${units[i]}`;
  };

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
                <h1 className="text-xl font-semibold text-gray-900">
                  Document Library
                </h1>
                <p className="text-sm text-gray-600">
                  Manage all uploaded documents
                </p>
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
          {loading && (
            <div className="text-sm text-gray-600">Loading documents…</div>
          )}
          {!loading &&
            filteredDocuments.map((document) => (
              <Card
                key={document.id}
                className="hover:shadow-md transition-shadow"
              >
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="bg-gray-100 p-3 rounded-lg">
                        {getFileIcon(document.type)}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {document.name}
                        </h3>
                        <div className="flex items-center gap-4 mt-1 text-sm text-gray-600">
                          <span>Folder: {document.folder}</span>
                          <span>Size: {formatSize(document.sizeBytes)}</span>
                          <span>Status: {document.status}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Badge className={getTypeColor(document.type)}>
                        {document.type}
                      </Badge>
                      <div className="text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {new Date(document.createdAt).toLocaleDateString()}
                        </div>
                      </div>

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => {
                              if (document.url)
                                window.open(document.url, "_blank");
                            }}
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            Preview
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => {
                              if (document.url)
                                window.open(document.url, "_blank");
                            }}
                          >
                            <Download className="h-4 w-4 mr-2" />
                            Download
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-red-600"
                            onClick={() => handleDeleteDocument(document.id)}
                          >
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

        {!loading && filteredDocuments.length === 0 && (
          <div className="text-center py-12">
            <div className="bg-gray-100 p-4 rounded-full w-fit mx-auto mb-4">
              <FileText className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No documents found
            </h3>
            <p className="text-gray-600 mb-4">
              {searchTerm
                ? "No documents match your search criteria."
                : "Start by uploading your first document."}
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
              Are you sure you want to delete this document? This action cannot
              be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete Document
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
