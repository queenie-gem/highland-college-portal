"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/utils/supabase/server";
import { logActivity } from "@/app/admin/actions/activity-actions";

// Data fetchers
export async function getFaculties() {
  const supabase = await createClient();
  const { data, error } = await supabase.from("faculty").select("*").order("name", { ascending: true });
  if (error) throw error;
  return data ?? [];
}

export async function getFacultyById(id: string) {
  const supabase = await createClient();
  const { data, error } = await supabase.from("faculty").select("*").eq("id", id).single();
  if (error) throw error;
  return data;
}

// Create
export async function createFaculty(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const actor = (user?.user_metadata as any)?.name || user?.email || "Unknown user";

  const name = String(formData.get("name") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const hod = String(formData.get("hod") ?? "").trim();

  const payload: Record<string, any> = {
    name,
    description: description || null,
  };
  if (hod) payload.hod = hod;

  const { data, error } = await supabase
    .from("faculty")
    .insert(payload)
    .select("id")
    .single();
  if (error) throw error;

  await logActivity(
    "Faculty created",
    `${actor} created faculty "${name || "Unnamed"}"`,
    { action: "create", table: "faculty", recordId: data?.id }
  );

  revalidatePath("/admin/faculties");
}

// Update
export async function updateFaculty(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const actor = (user?.user_metadata as any)?.name || user?.email || "Unknown user";

  const id = String(formData.get("id") ?? "").trim();
  const name = String(formData.get("name") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const hod = String(formData.get("hod") ?? "").trim();

  const payload: Record<string, any> = {
    name: name || null,
    description: description || null,
  };
  if (hod) payload.hod = hod; else payload.hod = null;

  const { error } = await supabase.from("faculty").update(payload).eq("id", id);
  if (error) throw error;

  await logActivity(
    "Faculty updated",
    `${actor} updated faculty "${name || id}"`,
    { action: "update", table: "faculty", recordId: id }
  );

  revalidatePath("/admin/faculties");
}

// Delete
export async function deleteFaculty(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const actor = (user?.user_metadata as any)?.name || user?.email || "Unknown user";
  const id = String(formData.get("id") ?? "").trim();
  const { error } = await supabase.from("faculty").delete().eq("id", id);
  if (error) throw error;
  await logActivity(
    "Faculty deleted",
    `${actor} deleted faculty ${id}`,
    { action: "delete", table: "faculty", recordId: id }
  );
  revalidatePath("/admin/faculties");
}