"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  createCourse,
  updateCourse,
  deleteCourse,
} from "@/app/admin/actions/course-actions";

type Lecturer = { id: string; name: string | null };
type Department = { id: string; name: string | null };
type Course = {
  id: string;
  title: string | null;
  code: string | null;
  units: number | null;
  lecturer?: string | null;
  department?: string | null;
};

export function AddCourseForm({
  lecturers,
  departments,
}: {
  lecturers: Lecturer[];
  departments: Department[];
}) {
  const router = useRouter();
  const [submitting, setSubmitting] = React.useState(false);
  const [title, setTitle] = React.useState("");
  const [code, setCode] = React.useState("");
  const [units, setUnits] = React.useState<string>("");
  const [lecturer, setLecturer] = React.useState<string>("");
  const [department, setDepartment] = React.useState<string>("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      toast.error("Title is required");
      return;
    }
    if (!code.trim()) {
      toast.error("Code is required");
      return;
    }
    setSubmitting(true);
    try {
      const fd = new FormData();
      fd.set("title", title.trim());
      fd.set("code", code.trim());
      fd.set("units", units);
      fd.set("lecturer", lecturer === "none" ? "" : lecturer);
      fd.set("department", department === "none" ? "" : department);
      await createCourse(fd);
      toast.success("Course created successfully");
      setTitle("");
      setCode("");
      setUnits("");
      setLecturer("");
      setDepartment("");
      router.refresh();
    } catch (err: any) {
      toast.error(err?.message || "Failed to create course");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>Add Course</CardTitle>
        <CardDescription>
          Create a course and assign lecturer/department.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="grid gap-4">
          <div>
            <label className="text-sm font-medium">Title</label>
            <Input
              name="title"
              placeholder="e.g. Data Structures"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={submitting}
            />
          </div>
          <div>
            <label className="text-sm font-medium">Code</label>
            <Input
              name="code"
              placeholder="e.g. CSE201"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              disabled={submitting}
            />
          </div>
          <div>
            <label className="text-sm font-medium">Units</label>
            <Input
              type="number"
              name="units"
              placeholder="e.g. 3"
              value={units}
              onChange={(e) => setUnits(e.target.value)}
              disabled={submitting}
            />
          </div>
          <div>
            <label className="text-sm font-medium">Lecturer</label>
            <Select value={lecturer} onValueChange={setLecturer}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="None" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                {lecturers.map((l) => (
                  <SelectItem key={l.id} value={l.id}>
                    {l.name ?? "Unnamed"}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-sm font-medium">Department</label>
            <Select value={department} onValueChange={setDepartment}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="None" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                {departments.map((d) => (
                  <SelectItem key={d.id} value={d.id}>
                    {d.name ?? "Unnamed"}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button type="submit" disabled={submitting}>
            {submitting ? "Creating..." : "Create Course"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

export function CourseCard({
  course,
  lecturers,
  departments,
}: {
  course: Course;
  lecturers: Lecturer[];
  departments: Department[];
}) {
  const router = useRouter();
  const [editing, setEditing] = React.useState(false);
  const [saving, setSaving] = React.useState(false);
  const [deleting, setDeleting] = React.useState(false);

  const [title, setTitle] = React.useState(course.title ?? "");
  const [code, setCode] = React.useState(course.code ?? "");
  const [units, setUnits] = React.useState<string>(
    course.units != null ? String(course.units) : ""
  );
  const [lecturer, setLecturer] = React.useState<string>(course.lecturer ?? "");
  const [department, setDepartment] = React.useState<string>(
    course.department ?? ""
  );

  const lecturerNameById = React.useMemo(() => {
    const map = new Map<string, string>();
    lecturers.forEach((l) => map.set(l.id, l.name ?? "Unnamed"));
    return map;
  }, [lecturers]);

  const departmentNameById = React.useMemo(() => {
    const map = new Map<string, string>();
    departments.forEach((d) => map.set(d.id, d.name ?? "Unnamed"));
    return map;
  }, [departments]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      toast.error("Title is required");
      return;
    }
    if (!code.trim()) {
      toast.error("Code is required");
      return;
    }
    if (!units.trim()) {
      toast.error("Units is required");
      return;
    }
    setSaving(true);
    try {
      const fd = new FormData();
      fd.set("id", course.id);
      fd.set("title", title.trim());
      fd.set("code", code.trim());
      fd.set("units", units);
      fd.set("lecturer", lecturer === "none" ? "" : lecturer);
      fd.set("department", department === "none" ? "" : department);
      await updateCourse(fd);
      toast.success("Course updated");
      setEditing(false);
      router.refresh();
    } catch (err: any) {
      toast.error(err?.message || "Failed to update course");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      const fd = new FormData();
      fd.set("id", course.id);
      await deleteCourse(fd);
      toast.success("Course deleted");
      router.refresh();
    } catch (err: any) {
      toast.error(err?.message || "Failed to delete course");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>{course.title}</span>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" size="sm" disabled={deleting}>
                Delete
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete course?</AlertDialogTitle>
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
          Code: {course.code} • Units: {course.units ?? "-"} • Lecturer:{" "}
          {course.lecturer
            ? lecturerNameById.get(course.lecturer) ?? course.lecturer
            : "None"}{" "}
          • Department:{" "}
          {course.department
            ? departmentNameById.get(course.department) ?? course.department
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
              <label className="text-sm font-medium">Title</label>
              <Input
                name="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Code</label>
              <Input
                name="code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Units</label>
              <Input
                type="number"
                name="units"
                value={units}
                onChange={(e) => setUnits(e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Lecturer</label>
              <Select value={lecturer} onValueChange={setLecturer}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="None" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  {lecturers.map((l) => (
                    <SelectItem key={l.id} value={l.id}>
                      {l.name ?? "Unnamed"}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium">Department</label>
              <Select value={department} onValueChange={setDepartment}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="None" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  {departments.map((d) => (
                    <SelectItem key={d.id} value={d.id}>
                      {d.name ?? "Unnamed"}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button type="submit" variant="outline" disabled={saving}>
              {saving ? "Saving..." : "Update Course"}
            </Button>
          </form>
        </details>
      </CardContent>
    </Card>
  );
}
