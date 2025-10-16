"use client";

import type React from "react";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Upload, ArrowLeft, X, FileText, CheckCircle } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { useUser } from "@/hooks/use-user";
import { toast } from "sonner";

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  progress: number;
  status: "uploading" | "completed" | "error";
}

export default function UploadDocumentsPage() {
  const [selectedFolder, setSelectedFolder] = useState("");
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();
  const user = useUser();

  const [folders, setFolders] = useState<{ id: string; name: string }[]>([]);

  useEffect(() => {
    const fetchFolders = async () => {
      if (!user) return;
      // Fetch folders from Supabase or any other source if needed
      // For now, we are using static folders defined above
      const { data, error } = await supabase.from("folder").select("name, id");
      if (error) {
        toast.error(error.message);
        return;
      }

      if (data) {
        setFolders(data);
      }
    };

    fetchFolders();
  }, [user]);

  useEffect(() => {
    const isAuthenticated = localStorage.getItem("adminAuthenticated");
    if (!isAuthenticated) {
      router.push("/admin");
      return;
    }

    // Pre-select folder if provided in URL
    const folderId = searchParams.get("folder");
    if (folderId) {
      setSelectedFolder(folderId);
    }
  }, [router, searchParams]);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(e.target.files);
    }
  };

  const handleFiles = (files: FileList) => {
    const filesArray = Array.from(files);
    setSelectedFiles((prev) => [...prev, ...filesArray]);

    const newFiles: UploadedFile[] = filesArray.map((file) => ({
      id: Math.random().toString(36).substr(2, 9),
      name: file.name,
      size: file.size,
      type: file.type,
      progress: 0,
      status: "uploading" as const,
    }));

    setUploadedFiles((prev) => [...prev, ...newFiles]);
  };

  const uploadFileToAPI = async (file: File, fileId: string) => {
    const formData = new FormData();
    formData.append("file", file);

    try {
      const url = new URL(
        "https://highland-chatbot.onrender.com/api/v1/upload"
      );
      url.searchParams.append("folder", selectedFolder);

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "x-api-key":
            "b4c67848e88194eba8c16b3b75ba7c0f76229a0710c57faa78bdc3545f266beb0d19801248507bcf4975e118487411d936f3592dc4915ec482e7084be2b1778f",
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.statusText}`);
      }

      const result = await response.json();

      setUploadedFiles((prev) =>
        prev.map((f) =>
          f.id === fileId ? { ...f, progress: 100, status: "completed" } : f
        )
      );

      return result;
    } catch (error) {
      console.error("Upload error:", error);
      setUploadedFiles((prev) =>
        prev.map((f) => (f.id === fileId ? { ...f, status: "error" } : f))
      );
      throw error;
    }
  };

  const removeFile = (fileId: string) => {
    setUploadedFiles((prev) => prev.filter((file) => file.id !== fileId));
    setSelectedFiles((prev) => {
      const fileIndex = uploadedFiles.findIndex((f) => f.id === fileId);
      if (fileIndex !== -1) {
        return prev.filter((_, index) => index !== fileIndex);
      }
      return prev;
    });
  };

  const handleSubmit = async () => {
    if (!selectedFolder) {
      toast.error("Please select a folder");
      return;
    }

    if (selectedFiles.length === 0) {
      toast.error("Please upload at least one file");
      return;
    }

    try {
      // Upload files one by one since API accepts only one file
      for (let i = 0; i < selectedFiles.length; i++) {
        const file = selectedFiles[i];
        const uploadFile = uploadedFiles[i];

        // Update progress to show upload starting
        setUploadedFiles((prev) =>
          prev.map((f) =>
            f.id === uploadFile.id
              ? { ...f, progress: 10, status: "uploading" }
              : f
          )
        );

        await uploadFileToAPI(file, uploadFile.id);
      }

      toast.success("All documents uploaded successfully!");
      router.push("/admin/documents");
    } catch (error) {
      toast.error("Failed to upload some documents. Please try again.");
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return (
      Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/admin/documents">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Documents
                </Link>
              </Button>
              <div className="bg-green-100 p-2 rounded-lg">
                <Upload className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">
                  Upload Documents
                </h1>
                <p className="text-sm text-gray-600">
                  Add new documents to your folders
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* Folder Selection */}
          <Card>
            <CardHeader>
              <CardTitle>Select Destination Folder</CardTitle>
              <CardDescription>
                Choose which folder to upload your documents to
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Select value={selectedFolder} onValueChange={setSelectedFolder}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a folder" />
                </SelectTrigger>
                <SelectContent>
                  {folders.map((folder) => (
                    <SelectItem key={folder.id} value={folder.id}>
                      {folder.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          {/* File Upload Area */}
          <Card>
            <CardHeader>
              <CardTitle>Upload Files</CardTitle>
              <CardDescription>
                Drag and drop files or click to browse
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                  dragActive
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-300 hover:border-gray-400"
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Drop files here
                </h3>
                <p className="text-gray-600 mb-4">
                  or click to browse from your computer
                </p>
                <Input
                  type="file"
                  multiple
                  onChange={handleFileInput}
                  className="hidden"
                  id="file-upload"
                  accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt"
                />
                <Button asChild variant="outline">
                  <label htmlFor="file-upload" className="cursor-pointer">
                    Browse Files
                  </label>
                </Button>
                <p className="text-sm text-gray-500 mt-2">
                  Supported formats: PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX, TXT
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Uploaded Files List */}
          {uploadedFiles.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Uploaded Files ({uploadedFiles.length})</CardTitle>
                <CardDescription>
                  Review your uploaded files before saving
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {uploadedFiles.map((file) => (
                    <div
                      key={file.id}
                      className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg"
                    >
                      <div className="bg-white p-2 rounded">
                        {file.status === "completed" ? (
                          <CheckCircle className="h-5 w-5 text-green-600" />
                        ) : (
                          <FileText className="h-5 w-5 text-gray-600" />
                        )}
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-medium text-gray-900">
                            {file.name}
                          </h4>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFile(file.id)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">
                          {formatFileSize(file.size)}
                        </p>
                        {file.status === "uploading" && (
                          <div className="space-y-1">
                            <Progress value={file.progress} className="h-2" />
                            <p className="text-xs text-gray-500">
                              {Math.round(file.progress)}% uploaded
                            </p>
                          </div>
                        )}
                        {file.status === "completed" && (
                          <p className="text-sm text-green-600 font-medium">
                            Upload completed
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Action Buttons */}
          <div className="flex gap-4">
            <Button
              onClick={handleSubmit}
              disabled={!selectedFolder || uploadedFiles.length === 0}
              className="flex-1"
            >
              Save Documents
            </Button>
            <Button variant="outline" asChild>
              <Link href="/admin/documents">Cancel</Link>
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
