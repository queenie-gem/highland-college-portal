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
  createDepartment,
  updateDepartment,
  deleteDepartment,
} from "@/app/admin/actions/department-actions";

type Lecturer = { id: string; name: string | null };
type Faculty = { id: string; name: string | null };
type Department = {
  id: string;
  name: string | null;
  faculty?: string | null;
  hod: string;
  description?: string | null;
};

export function AddDepartmentForm({
  lecturers,
  faculties,
}: {
  lecturers: Lecturer[];
  faculties: Faculty[];
}) {
  const router = useRouter();
  const [submitting, setSubmitting] = React.useState(false);
  const [name, setName] = React.useState("");
  const [faculty, setFaculty] = React.useState<string>("");
  const [hod, setHod] = React.useState<string>("");
  const [description, setDescription] = React.useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Name is required");
      return;
    }
    if (!hod) {
      toast.error("HOD is required");
      return;
    }
    setSubmitting(true);
    try {
      const fd = new FormData();
      fd.set("name", name.trim());
      fd.set("faculty", faculty === "none" ? "" : faculty);
      fd.set("hod", hod === "none" ? "" : hod);
      fd.set("description", description.trim());
      await createDepartment(fd);
      toast.success("Department created successfully");
      setName("");
      setFaculty("");
      setHod("");
      setDescription("");
      router.refresh();
    } catch (err: any) {
      toast.error(err?.message || "Failed to create department");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>Add Department</CardTitle>
        <CardDescription>
          Create a new department and assign a HOD.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="grid gap-4">
          <div>
            <label className="text-sm font-medium">Name</label>
            <Input
              name="name"
              placeholder="e.g. Software Engineering"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={submitting}
            />
          </div>
          <div>
            <label className="text-sm font-medium">Description</label>
            <Textarea
              name="description"
              placeholder="Short summary of this department"
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
            <label className="text-sm font-medium">
              Head of Department (HOD)
            </label>
            <Select value={hod} onValueChange={setHod}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a HOD" />
              </SelectTrigger>
              <SelectContent>
                {lecturers.map((l) => (
                  <SelectItem key={l.id} value={l.id}>
                    {l.name ?? "Unnamed"}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button type="submit" disabled={submitting}>
            {submitting ? "Creating..." : "Create Department"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

export function DepartmentCard({
  dep,
  lecturers,
  faculties,
}: {
  dep: Department;
  lecturers: Lecturer[];
  faculties: Faculty[];
}) {
  const router = useRouter();
  const [editing, setEditing] = React.useState(false);
  const [saving, setSaving] = React.useState(false);
  const [deleting, setDeleting] = React.useState(false);

  const [name, setName] = React.useState(dep.name ?? "");
  const [faculty, setFaculty] = React.useState<string>(dep.faculty ?? "");
  const [hod, setHod] = React.useState<string>(dep.hod ?? "");
  const [description, setDescription] = React.useState<string>(dep.description ?? "");

  const lecturerNameById = React.useMemo(() => {
    const map = new Map<string, string>();
    lecturers.forEach((l) => map.set(l.id, l.name ?? "Unnamed"));
    return map;
  }, [lecturers]);

  const facultyNameById = React.useMemo(() => {
    const map = new Map<string, string>();
    faculties.forEach((f) => map.set(f.id, f.name ?? "Unnamed"));
    return map;
  }, [faculties]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!hod) {
      toast.error("HOD is required");
      return;
    }
    setSaving(true);
    try {
      const fd = new FormData();
      fd.set("id", dep.id);
      fd.set("name", name.trim());
      fd.set("faculty", faculty);
      fd.set("hod", hod);
      fd.set("description", description.trim());
      await updateDepartment(fd);
      toast.success("Department updated");
      setEditing(false);
      router.refresh();
    } catch (err: any) {
      toast.error(err?.message || "Failed to update department");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      const fd = new FormData();
      fd.set("id", dep.id);
      await deleteDepartment(fd);
      toast.success("Department deleted");
      router.refresh();
    } catch (err: any) {
      toast.error(err?.message || "Failed to delete department");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>{dep.name}</span>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" size="sm" disabled={deleting}>
                Delete
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete department?</AlertDialogTitle>
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
          Faculty: {faculty ? facultyNameById.get(faculty) ?? faculty : "None"}{" "}
          • HOD: {hod ? lecturerNameById.get(hod) ?? hod : "Not assigned"}
          {dep.description ? (
            <span className="block mt-1 text-gray-700">{dep.description}</span>
          ) : null}
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
              <label className="text-sm font-medium">
                Head of Department (HOD)
              </label>
              <Select value={hod} onValueChange={setHod}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a HOD" />
                </SelectTrigger>
                <SelectContent>
                  {lecturers.map((l) => (
                    <SelectItem key={l.id} value={l.id}>
                      {l.name ?? "Unnamed"}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button type="submit" variant="outline" disabled={saving}>
              {saving ? "Saving..." : "Update Department"}
            </Button>
          </form>
        </details>
      </CardContent>
    </Card>
  );
}
