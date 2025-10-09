"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
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
import { TagInput } from "@/components/ui/tag-input";
import {
  createLecturer,
  updateLecturer,
  deleteLecturer,
} from "@/app/admin/actions/lecturer-actions";

type Lecturer = {
  id: string;
  name: string | null;
  specialization: string[] | null;
  contact: string[] | null;
  achievement: string[] | null;
  education: string[] | null;
};

export function AddLecturerForm() {
  const router = useRouter();
  const [submitting, setSubmitting] = React.useState(false);
  const [name, setName] = React.useState("");
  const [specialization, setSpecialization] = React.useState<string[]>([]);
  const [contact, setContact] = React.useState<string[]>([]);
  const [achievement, setAchievement] = React.useState<string[]>([]);
  const [education, setEducation] = React.useState<string[]>([]);

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
      fd.set("specialization", specialization.join(", "));
      fd.set("contact", contact.join(", "));
      fd.set("achievement", achievement.join(", "));
      fd.set("education", education.join(", "));
      await createLecturer(fd);
      toast.success("Lecturer created successfully");
      setName("");
      setSpecialization([]);
      setContact([]);
      setAchievement([]);
      setEducation([]);
      router.refresh();
    } catch (err: any) {
      toast.error(err?.message || "Failed to create lecturer");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>Add Lecturer</CardTitle>
        <CardDescription>Provide details and save to the database.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="grid gap-4">
          <div>
            <label className="text-sm font-medium">Name</label>
            <Input
              name="name"
              placeholder="e.g. Dr. Jane Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={submitting}
            />
          </div>
          <div>
            <label className="text-sm font-medium">Specialization</label>
            <TagInput
              value={specialization}
              onChange={setSpecialization}
              placeholder="Add specialization and press Enter"
              disabled={submitting}
              addLabel="Add"
            />
          </div>
          <div>
            <label className="text-sm font-medium">Contact</label>
            <TagInput
              value={contact}
              onChange={setContact}
              placeholder="Add email/phone and press Enter"
              disabled={submitting}
              addLabel="Add"
            />
          </div>
          <div>
            <label className="text-sm font-medium">Achievements</label>
            <TagInput
              value={achievement}
              onChange={setAchievement}
              placeholder="Add achievement and press Enter"
              disabled={submitting}
              addLabel="Add"
            />
          </div>
          <div>
            <label className="text-sm font-medium">Education</label>
            <TagInput
              value={education}
              onChange={setEducation}
              placeholder="Add education and press Enter"
              disabled={submitting}
              addLabel="Add"
            />
          </div>
          <Button type="submit" disabled={submitting}>
            {submitting ? "Creating..." : "Create Lecturer"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

export function LecturerCard({ lec }: { lec: Lecturer }) {
  const router = useRouter();
  const [editing, setEditing] = React.useState(false);
  const [saving, setSaving] = React.useState(false);
  const [deleting, setDeleting] = React.useState(false);

  const [name, setName] = React.useState(lec.name ?? "");
  const [specialization, setSpecialization] = React.useState<string[]>(lec.specialization ?? []);
  const [contact, setContact] = React.useState<string[]>(lec.contact ?? []);
  const [achievement, setAchievement] = React.useState<string[]>(lec.achievement ?? []);
  const [education, setEducation] = React.useState<string[]>(lec.education ?? []);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const fd = new FormData();
      fd.set("id", lec.id);
      fd.set("name", name.trim());
      fd.set("specialization", specialization.join(", "));
      fd.set("contact", contact.join(", "));
      fd.set("achievement", achievement.join(", "));
      fd.set("education", education.join(", "));
      await updateLecturer(fd);
      toast.success("Lecturer updated");
      setEditing(false);
      router.refresh();
    } catch (err: any) {
      toast.error(err?.message || "Failed to update lecturer");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      const fd = new FormData();
      fd.set("id", lec.id);
      await deleteLecturer(fd);
      toast.success("Lecturer deleted");
      router.refresh();
    } catch (err: any) {
      toast.error(err?.message || "Failed to delete lecturer");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>{lec.name ?? "Unnamed Lecturer"}</span>
          <div className="flex items-center gap-2">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" size="sm" disabled={deleting}>Delete</Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete lecturer?</AlertDialogTitle>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDelete}>
                    Confirm
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </CardTitle>
        {specialization.length > 0 ? (
          <CardDescription className="flex flex-wrap gap-2 mt-2">
            {specialization.map((spec, i) => (
              <Badge key={`${spec}-${i}`} variant="outline">
                {spec}
              </Badge>
            ))}
          </CardDescription>
        ) : null}
      </CardHeader>
      <CardContent>
        <div className="space-y-2 text-sm text-gray-600 mb-4">
          {contact.length ? <div>Contact: {contact.join(", ")}</div> : null}
          {achievement.length ? <div>Achievements: {achievement.join(", ")}</div> : null}
          {education.length ? <div>Education: {education.join(", ")}</div> : null}
        </div>

        <details open={editing} onToggle={(e) => setEditing((e.target as HTMLDetailsElement).open)}>
          <summary className="cursor-pointer text-sm text-gray-700">{editing ? "Close" : "Edit"}</summary>
          <form onSubmit={handleUpdate} className="grid gap-3 mt-3">
            <div>
              <label className="text-sm font-medium">Name</label>
              <Input name="name" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div>
              <label className="text-sm font-medium">Specialization</label>
              <TagInput value={specialization} onChange={setSpecialization} placeholder="Add specialization" />
            </div>
            <div>
              <label className="text-sm font-medium">Contact</label>
              <TagInput value={contact} onChange={setContact} placeholder="Add contact" />
            </div>
            <div>
              <label className="text-sm font-medium">Achievements</label>
              <TagInput value={achievement} onChange={setAchievement} placeholder="Add achievement" />
            </div>
            <div>
              <label className="text-sm font-medium">Education</label>
              <TagInput value={education} onChange={setEducation} placeholder="Add education" />
            </div>
            <Button type="submit" variant="outline" disabled={saving}>
              {saving ? "Saving..." : "Update Lecturer"}
            </Button>
          </form>
        </details>
      </CardContent>
    </Card>
  );
}