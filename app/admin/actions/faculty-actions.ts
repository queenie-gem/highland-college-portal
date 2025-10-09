"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/utils/supabase/server";

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

  const name = String(formData.get("name") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const hod = String(formData.get("hod") ?? "").trim();

  const payload: Record<string, any> = {
    name,
    description: description || null,
  };
  if (hod) payload.hod = hod;

  const { error } = await supabase.from("faculty").insert(payload);
  if (error) throw error;

  revalidatePath("/admin/faculties");
}

// Update
export async function updateFaculty(formData: FormData) {
  const supabase = await createClient();

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

  revalidatePath("/admin/faculties");
}

// Delete
export async function deleteFaculty(formData: FormData) {
  const supabase = await createClient();
  const id = String(formData.get("id") ?? "").trim();
  const { error } = await supabase.from("faculty").delete().eq("id", id);
  if (error) throw error;
  revalidatePath("/admin/faculties");
}