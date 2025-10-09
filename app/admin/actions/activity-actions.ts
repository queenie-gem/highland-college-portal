"use server";

import { createClient } from "@/utils/supabase/server";

type ActivityMetadata = {
  action: "create" | "update" | "delete";
  table: string;
  recordId?: string;
  title?: string;
  summary?: string;
};

export async function logActivity(
  title: string,
  description: string | null,
  metadata: ActivityMetadata
) {
  const supabase = await createClient();
  const { error } = await supabase.from("activities").insert({
    title,
    description: description || null,
    metadata,
  });
  if (error) throw new Error(error.message);
  return { success: true };
}

export async function getActivities(
  page: number = 1,
  pageSize: number = 20
) {
  const supabase = await createClient();
  const start = (page - 1) * pageSize;
  const end = start + pageSize - 1;
  const { data, error } = await supabase
    .from("activities")
    .select("*")
    .order("created_at", { ascending: false })
    .range(start, end);
  if (error) throw new Error(error.message);
  return data ?? [];
}