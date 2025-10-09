"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  createFolder,
  updateFolder,
  deleteFolder,
} from "@/app/admin/actions/folder-actions";

type Faculty = { id: string; name: string | null };
type Folder = {
  id: string;
  name: string | null;
  description?: string | null;
  public?: boolean | null;
  faculty?: string | null;
};

export function AddFolderForm({ faculties }: { faculties: Faculty[] }) {
  const router = useRouter();
  const [submitting, setSubmitting] = React.useState(false);
  const [name, setName] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [faculty, setFaculty] = React.useState<string>("");
  const [isPublic, setIsPublic] = React.useState<string>("true");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Name is required");
      return;
    }
    setSubmitting(true);
    try {
      const fd = new FormData();
      fd.set("name", name.trim());
      fd.set("description", description);
      fd.set("faculty", faculty);
      fd.set("public", isPublic);
      await createFolder(fd);
      toast.success("Folder created successfully");
      setName("");
      setDescription("");
      setFaculty("");
      setIsPublic("true");
      router.refresh();
    } catch (err: any) {
      toast.error(err?.message || "Failed to create folder");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>Add Folder</CardTitle>
        <CardDescription>
          Create a folder and set visibility/faculty.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="grid gap-4">
          <div>
            <label className="text-sm font-medium">Name</label>
            <Input
              name="name"
              placeholder="e.g. Semester 1 Resources"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={submitting}
            />
          </div>
          <div>
            <label className="text-sm font-medium">Description</label>
            <Textarea
              name="description"
              placeholder="Optional description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={submitting}
            />
          </div>
          <div>
            <label className="text-sm font-medium">Faculty</label>
            <Select value={faculty} onValueChange={setFaculty}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="None" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                {faculties.map((f) => (
                  <SelectItem key={f.id} value={f.id}>
                    {f.name ?? "Unnamed"}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-sm font-medium">Visibility</label>
            <Select value={isPublic} onValueChange={setIsPublic}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select visibility" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="true">Public</SelectItem>
                <SelectItem value="false">Private</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button type="submit" disabled={submitting}>
            {submitting ? "Creating..." : "Create Folder"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

export function FolderCard({
  folder,
  faculties,
}: {
  folder: Folder;
  faculties: Faculty[];
}) {
  const router = useRouter();
  const [editing, setEditing] = React.useState(false);
  const [saving, setSaving] = React.useState(false);
  const [deleting, setDeleting] = React.useState(false);

  const [name, setName] = React.useState(folder.name ?? "");
  const [description, setDescription] = React.useState(
    folder.description ?? ""
  );
  const [faculty, setFaculty] = React.useState<string>(folder.faculty ?? "");
  const [isPublic, setIsPublic] = React.useState<string>(
    folder.public ? "true" : "false"
  );

  const facultyNameById = React.useMemo(() => {
    const map = new Map<string, string>();
    faculties.forEach((f) => map.set(f.id, f.name ?? "Unnamed"));
    return map;
  }, [faculties]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Name is required");
      return;
    }
    setSaving(true);
    try {
      const fd = new FormData();
      fd.set("id", folder.id);
      fd.set("name", name.trim());
      fd.set("description", description);
      fd.set("faculty", faculty);
      fd.set("public", isPublic);
      await updateFolder(fd);
      toast.success("Folder updated");
      setEditing(false);
      router.refresh();
    } catch (err: any) {
      toast.error(err?.message || "Failed to update folder");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      const fd = new FormData();
      fd.set("id", folder.id);
      await deleteFolder(fd);
      toast.success("Folder deleted");
      router.refresh();
    } catch (err: any) {
      toast.error(err?.message || "Failed to delete folder");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>{folder.name}</span>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" size="sm" disabled={deleting}>
                Delete
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete folder?</AlertDialogTitle>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete}>
                  Confirm
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardTitle>
        <CardDescription>
          Visibility: {folder.public ? "Public" : "Private"} • Faculty:{" "}
          {folder.faculty
            ? facultyNameById.get(folder.faculty) ?? folder.faculty
            : "None"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <details
          open={editing}
          onToggle={(e) => setEditing((e.target as HTMLDetailsElement).open)}
        >
          <summary className="cursor-pointer text-sm text-gray-700">
            {editing ? "Close" : "Edit"}
          </summary>
          <form onSubmit={handleUpdate} className="grid gap-3 mt-3">
            <div>
              <label className="text-sm font-medium">Name</label>
              <Input
                name="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Description</label>
              <Textarea
                name="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Faculty</label>
              <Select value={faculty} onValueChange={setFaculty}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="None" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  {faculties.map((f) => (
                    <SelectItem key={f.id} value={f.id}>
                      {f.name ?? "Unnamed"}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium">Visibility</label>
              <Select value={isPublic} onValueChange={setIsPublic}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select visibility" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="true">Public</SelectItem>
                  <SelectItem value="false">Private</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button type="submit" variant="outline" disabled={saving}>
              {saving ? "Saving..." : "Update Folder"}
            </Button>
          </form>
        </details>
      </CardContent>
    </Card>
  );
}
