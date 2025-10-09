"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/utils/supabase/server";
import { logActivity } from "@/app/admin/actions/activity-actions";

// Data fetchers
export async function getLecturers(fileds = "*") {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("lecturer")
    .select(fileds)
    .order("created_at", { ascending: false });
  if (error) throw error;
  console.log(data);
  return data ?? [];
}

export async function getLecturerById(id: string, fileds = "*") {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("lecturer")
    .select(fileds)
    .eq("id", id)
    .single();
  if (error) throw error;
  return data;
}

// Helper to parse comma-separated list inputs to arrays
function parseList(value: FormDataEntryValue | null): string[] | null {
  if (!value) return null;
  const str = String(value).trim();
  if (!str) return null;
  return str
    .split(",")
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
}

// Create
export async function createLecturer(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const actor = (user?.user_metadata as any)?.name || user?.email || "Unknown user";

  const name = String(formData.get("name") ?? "").trim();
  const specialization = parseList(formData.get("specialization"));
  const contact = parseList(formData.get("contact"));
  const achievement = parseList(formData.get("achievement"));
  const education = parseList(formData.get("education"));

  const { data, error } = await supabase
    .from("lecturer")
    .insert({
    name: name || null,
    specialization,
    contact,
    achievement,
    education,
  })
    .select("id")
    .single();
  if (error) throw error;

  await logActivity(
    "Lecturer created",
    `${actor} created lecturer "${name || "Unnamed"}"`,
    {
      action: "create",
      table: "lecturer",
      recordId: data?.id,
    }
  );

  revalidatePath("/admin/lecturers");
}

// Update
export async function updateLecturer(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const actor = (user?.user_metadata as any)?.name || user?.email || "Unknown user";

  const id = String(formData.get("id") ?? "");
  const name = String(formData.get("name") ?? "").trim();
  const specialization = parseList(formData.get("specialization"));
  const contact = parseList(formData.get("contact"));
  const achievement = parseList(formData.get("achievement"));
  const education = parseList(formData.get("education"));

  const { error } = await supabase
    .from("lecturer")
    .update({
      name: name || null,
      specialization,
      contact,
      achievement,
      education,
    })
    .eq("id", id);

  if (error) throw error;

  await logActivity(
    "Lecturer updated",
    `${actor} updated lecturer "${name || id}"`,
    {
      action: "update",
      table: "lecturer",
      recordId: id,
    }
  );

  revalidatePath("/admin/lecturers");
}

// Delete
export async function deleteLecturer(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const actor = (user?.user_metadata as any)?.name || user?.email || "Unknown user";
  const id = String(formData.get("id") ?? "");
  const { error } = await supabase.from("lecturer").delete().eq("id", id);
  if (error) throw error;

  await logActivity(
    "Lecturer deleted",
    `${actor} deleted lecturer ${id}`,
    { action: "delete", table: "lecturer", recordId: id }
  );
  revalidatePath("/admin/lecturers");
}
