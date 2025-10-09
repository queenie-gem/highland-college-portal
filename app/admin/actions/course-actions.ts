"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/utils/supabase/server";
import { logActivity } from "@/app/admin/actions/activity-actions";

// Data fetchers
export async function getCourses() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("course")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function getCourseById(id: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("course")
    .select("*")
    .eq("id", id)
    .single();
  if (error) throw error;
  return data;
}

// Create
export async function createCourse(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const actor = (user?.user_metadata as any)?.name || user?.email || "Unknown user";

  const title = String(formData.get("title") ?? "").trim();
  const code = String(formData.get("code") ?? "").trim();
  const unitsStr = String(formData.get("units") ?? "").trim();
  const lecturer = String(formData.get("lecturer") ?? "").trim();
  const department = String(formData.get("department") ?? "").trim();

  if (!title) throw new Error("Course title is required");
  if (!code) throw new Error("Course code is required");

  let units: number | null = null;
  if (unitsStr) {
    const parsed = Number(unitsStr);
    if (Number.isNaN(parsed)) throw new Error("Units must be a number");
    units = parsed;
  }

  const payload: Record<string, any> = {
    title,
    code,
    units,
  };
  if (lecturer) payload.lecturer = lecturer;
  if (department) payload.department = department;

  const { data, error } = await supabase
    .from("course")
    .insert(payload)
    .select("id")
    .single();
  if (error) throw error;

  await logActivity(
    "Course created",
    `${actor} created course "${title}"`,
    { action: "create", table: "course", recordId: data?.id }
  );

  revalidatePath("/admin/courses");
}

// Update
export async function updateCourse(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const actor = (user?.user_metadata as any)?.name || user?.email || "Unknown user";

  const id = String(formData.get("id") ?? "").trim();
  const title = String(formData.get("title") ?? "").trim();
  const code = String(formData.get("code") ?? "").trim();
  const unitsStr = String(formData.get("units") ?? "").trim();
  const lecturer = String(formData.get("lecturer") ?? "").trim();
  const department = String(formData.get("department") ?? "").trim();

  let units: number | null = null;
  if (unitsStr) {
    const parsed = Number(unitsStr);
    if (Number.isNaN(parsed)) throw new Error("Units must be a number");
    units = parsed;
  }

  const payload: Record<string, any> = {
    title: title || null,
    code: code || null,
    units,
  };
  if (lecturer) payload.lecturer = lecturer; else payload.lecturer = null;
  if (department) payload.department = department; else payload.department = null;

  const { error } = await supabase.from("course").update(payload).eq("id", id);
  if (error) throw error;

  await logActivity(
    "Course updated",
    `${actor} updated course "${title || id}"`,
    { action: "update", table: "course", recordId: id }
  );

  revalidatePath("/admin/courses");
}

// Delete
export async function deleteCourse(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const actor = (user?.user_metadata as any)?.name || user?.email || "Unknown user";
  const id = String(formData.get("id") ?? "").trim();
  const { error } = await supabase.from("course").delete().eq("id", id);
  if (error) throw error;
  await logActivity(
    "Course deleted",
    `${actor} deleted course ${id}`,
    { action: "delete", table: "course", recordId: id }
  );
  revalidatePath("/admin/courses");
}