"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/utils/supabase/server";
import { logActivity } from "@/app/admin/actions/activity-actions";

// Data fetchers
export async function getDepartments() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("department")
    .select("*")
    .order("name", { ascending: true });
  if (error) throw error;
  return data ?? [];
}

export async function getDepartmentById(id: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("department")
    .select("*")
    .eq("id", id)
    .single();
  if (error) throw error;
  return data;
}

// Create
export async function createDepartment(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const actor = (user?.user_metadata as any)?.name || user?.email || "Unknown user";

  const name = String(formData.get("name") ?? "").trim();
  const faculty = String(formData.get("faculty") ?? "").trim();
  const hod = String(formData.get("hod") ?? "").trim();

  if (!name) throw new Error("Department name is required");
  if (!hod) throw new Error("HOD is required"); // column is NOT NULL

  const payload: Record<string, any> = {
    name,
    hod,
  };
  if (faculty) payload.faculty = faculty;

  const { data, error } = await supabase
    .from("department")
    .insert(payload)
    .select("id")
    .single();
  if (error) throw error;

  await logActivity(
    "Department created",
    `${actor} created department "${name}"`,
    { action: "create", table: "department", recordId: data?.id }
  );

  revalidatePath("/admin/departments");
}

// Update
export async function updateDepartment(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const actor = (user?.user_metadata as any)?.name || user?.email || "Unknown user";

  const id = String(formData.get("id") ?? "").trim();
  const name = String(formData.get("name") ?? "").trim();
  const faculty = String(formData.get("faculty") ?? "").trim();
  const hod = String(formData.get("hod") ?? "").trim();

  const payload: Record<string, any> = {
    name: name || null,
    hod: hod || null, // if client clears, we'll set null (DB will error if NOT NULL on update; but UI prevents empty)
  };
  if (faculty) payload.faculty = faculty; else payload.faculty = null;

  const { error } = await supabase.from("department").update(payload).eq("id", id);
  if (error) throw error;

  await logActivity(
    "Department updated",
    `${actor} updated department "${name || id}"`,
    { action: "update", table: "department", recordId: id }
  );

  revalidatePath("/admin/departments");
}

// Delete
export async function deleteDepartment(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const actor = (user?.user_metadata as any)?.name || user?.email || "Unknown user";
  const id = String(formData.get("id") ?? "").trim();
  const { error } = await supabase.from("department").delete().eq("id", id);
  if (error) throw error;
  await logActivity(
    "Department deleted",
    `${actor} deleted department ${id}`,
    { action: "delete", table: "department", recordId: id }
  );
  revalidatePath("/admin/departments");
}