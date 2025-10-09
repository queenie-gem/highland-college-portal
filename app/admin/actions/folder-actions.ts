"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/utils/supabase/server";

export async function getFolders() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("folder")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function getFolderById(id: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("folder")
    .select("*")
    .eq("id", id)
    .single();
  if (error) throw new Error(error.message);
  return data;
}

export async function createFolder(formData: FormData) {
  const supabase = await createClient();
  const name = String(formData.get("name") || "").trim();
  const description = String(formData.get("description") || "").trim();
  const faculty = String(formData.get("faculty") || "").trim();
  const publicStr = String(formData.get("public") || "");

  if (!name) throw new Error("Name is required");
  const isPublic = publicStr === "false" ? false : true; // default true

  const payload: any = {
    name,
    public: isPublic,
  };
  if (description) payload.description = description;
  if (faculty) payload.faculty = faculty;

  const { error } = await supabase.from("folder").insert(payload);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/folders");
  return { success: true };
}

export async function updateFolder(formData: FormData) {
  const supabase = await createClient();
  const id = String(formData.get("id") || "").trim();
  const name = String(formData.get("name") || "").trim();
  const description = String(formData.get("description") || "").trim();
  const faculty = String(formData.get("faculty") || "").trim();
  const publicStr = String(formData.get("public") || "");

  if (!id) throw new Error("ID is required");
  if (!name) throw new Error("Name is required");

  const isPublic = publicStr === "false" ? false : true; // default true

  const payload: any = {
    name,
    public: isPublic,
    description: description || null,
    faculty: faculty || null,
  };

  const { error } = await supabase.from("folder").update(payload).eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/folders");
  return { success: true };
}

export async function deleteFolder(formData: FormData) {
  const supabase = await createClient();
  const id = String(formData.get("id") || "").trim();
  if (!id) throw new Error("ID is required");
  const { error } = await supabase.from("folder").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/folders");
  return { success: true };
}
