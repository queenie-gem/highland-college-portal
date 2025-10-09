"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/utils/supabase/server";
import { logActivity } from "@/app/admin/actions/activity-actions";

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
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const actor = (user?.user_metadata as any)?.name || user?.email || "Unknown user";
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

  const { data, error } = await supabase
    .from("folder")
    .insert(payload)
    .select("id")
    .single();
  if (error) throw new Error(error.message);
  await logActivity(
    "Folder created",
    `${actor} created folder "${name}"`,
    { action: "create", table: "folder", recordId: data?.id }
  );
  revalidatePath("/admin/folders");
  return { success: true };
}

export async function updateFolder(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const actor = (user?.user_metadata as any)?.name || user?.email || "Unknown user";
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
  await logActivity(
    "Folder updated",
    `${actor} updated folder "${name || id}"`,
    { action: "update", table: "folder", recordId: id }
  );
  revalidatePath("/admin/folders");
  return { success: true };
}

export async function deleteFolder(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const actor = (user?.user_metadata as any)?.name || user?.email || "Unknown user";
  const id = String(formData.get("id") || "").trim();
  if (!id) throw new Error("ID is required");
  const { error } = await supabase.from("folder").delete().eq("id", id);
  if (error) throw new Error(error.message);
  await logActivity(
    "Folder deleted",
    `${actor} deleted folder ${id}`,
    { action: "delete", table: "folder", recordId: id }
  );
  revalidatePath("/admin/folders");
  return { success: true };
}
