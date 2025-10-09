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
  createFaculty,
  updateFaculty,
  deleteFaculty,
} from "@/app/admin/actions/faculty-actions";

export type Lecturer = { id: string; name: string | null };
export type Faculty = {
  id: string;
  name: string | null;
  description: string | null;
  hod?: string | null;
};

export function AddFacultyForm({ lecturers }: { lecturers: Lecturer[] }) {
  const router = useRouter();
  const [submitting, setSubmitting] = React.useState(false);
  const [name, setName] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [hod, setHod] = React.useState<string>("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Name is required");
      return;
    }

    if (hod === "none") {
      setHod("");
    }
    setSubmitting(true);
    try {
      const fd = new FormData();
      fd.set("name", name.trim());
      fd.set("description", description.trim());
      fd.set("hod", hod);
      await createFaculty(fd);
      toast.success("Faculty created successfully");
      setName("");
      setDescription("");
      setHod("");
      router.refresh();
    } catch (err: any) {
      toast.error(err?.message || "Failed to create faculty");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>Add Faculty</CardTitle>
        <CardDescription>
          Create a new faculty and set an optional HOD.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="grid gap-4">
          <div>
            <label className="text-sm font-medium">Name</label>
            <Input
              name="name"
              placeholder="e.g. Computer Science"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={submitting}
            />
          </div>
          <div>
            <label className="text-sm font-medium">Description</label>
            <Textarea
              name="description"
              placeholder="Short description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={submitting}
            />
          </div>
          <div>
            <label className="text-sm font-medium">
              Head of Department (HOD)
            </label>
            <Select value={hod} onValueChange={setHod}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="None" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                {lecturers.map((lec) => (
                  <SelectItem key={lec.id} value={lec.id}>
                    {lec.name ?? "Unnamed"}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button type="submit" disabled={submitting}>
            {submitting ? "Creating..." : "Create Faculty"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

export function FacultyCard({
  fac,
  lecturers,
}: {
  fac: Faculty;
  lecturers: Lecturer[];
}) {
  const router = useRouter();
  const [editing, setEditing] = React.useState(false);
  const [saving, setSaving] = React.useState(false);
  const [deleting, setDeleting] = React.useState(false);

  const [name, setName] = React.useState(fac.name ?? "");
  const [description, setDescription] = React.useState(fac.description ?? "");
  const [hod, setHod] = React.useState<string>(fac.hod ?? "");

  const lecturerNameById = React.useMemo(() => {
    const map = new Map<string, string>();
    lecturers.forEach((l) => map.set(l.id, l.name ?? "Unnamed"));
    return map;
  }, [lecturers]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const fd = new FormData();
      fd.set("id", fac.id);
      fd.set("name", name.trim());
      fd.set("description", description.trim());
      fd.set("hod", hod);
      await updateFaculty(fd);
      toast.success("Faculty updated");
      setEditing(false);
      router.refresh();
    } catch (err: any) {
      toast.error(err?.message || "Failed to update faculty");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      const fd = new FormData();
      fd.set("id", fac.id);
      await deleteFaculty(fd);
      toast.success("Faculty deleted");
      router.refresh();
    } catch (err: any) {
      toast.error(err?.message || "Failed to delete faculty");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>{fac.name}</span>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" size="sm" disabled={deleting}>
                Delete
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete faculty?</AlertDialogTitle>
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
          {fac.description ? fac.description : "No description"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 text-sm text-gray-600 mb-4">
          <div>
            HOD: {hod ? lecturerNameById.get(hod) ?? hod : "Not assigned"}
          </div>
        </div>

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
              <label className="text-sm font-medium">
                Head of Department (HOD)
              </label>
              <Select value={hod} onValueChange={setHod}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="None" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  {lecturers.map((lec) => (
                    <SelectItem key={lec.id} value={lec.id}>
                      {lec.name ?? "Unnamed"}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button type="submit" variant="outline" disabled={saving}>
              {saving ? "Saving..." : "Update Faculty"}
            </Button>
          </form>
        </details>
      </CardContent>
    </Card>
  );
}
