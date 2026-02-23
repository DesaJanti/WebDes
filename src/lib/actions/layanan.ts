"use server";

import { createClient }   from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import type { ActionState } from "./profil";

export async function createLayanan(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const supabase = await createClient();

  const title        = (formData.get("title")        as string)?.trim();
  const description  = (formData.get("description")  as string)?.trim() || null;
  const requirements = (formData.get("requirements") as string)?.trim() || null;
  const icon         = (formData.get("icon")         as string)?.trim() || "📋";

  if (!title) return { success: false, message: "Judul layanan wajib diisi." };

  const { data: last } = await supabase
    .from("village_services")
    .select("sort_order")
    .order("sort_order", { ascending: false })
    .limit(1)
    .maybeSingle();

  const { error } = await supabase.from("village_services").insert({
    title, description, requirements, icon,
    sort_order: (last?.sort_order ?? 0) + 1,
    is_active: true,
  });

  if (error) return { success: false, message: `Gagal: ${error.message}` };

  revalidatePath("/admin/layanan");
  revalidatePath("/layanan");
  revalidatePath("/");
  return { success: true, message: "Layanan berhasil ditambahkan!" };
}

export async function updateLayanan(
  id: string,
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const supabase = await createClient();

  const { error } = await supabase.from("village_services").update({
    title:        (formData.get("title")        as string)?.trim(),
    description:  (formData.get("description")  as string)?.trim() || null,
    requirements: (formData.get("requirements") as string)?.trim() || null,
    icon:         (formData.get("icon")         as string)?.trim() || "📋",
  }).eq("id", id);

  if (error) return { success: false, message: `Gagal: ${error.message}` };

  revalidatePath("/admin/layanan");
  revalidatePath("/layanan");
  revalidatePath("/");
  return { success: true, message: "Layanan berhasil diupdate!" };
}

export async function deleteLayanan(id: string): Promise<ActionState> {
  const supabase = await createClient();
  const { error } = await supabase.from("village_services").delete().eq("id", id);
  if (error) return { success: false, message: error.message };

  revalidatePath("/admin/layanan");
  revalidatePath("/layanan");
  revalidatePath("/");
  return { success: true, message: "Layanan berhasil dihapus." };
}

export async function toggleLayanan(
  id: string, current: boolean
): Promise<ActionState> {
  const supabase = await createClient();
  const { error } = await supabase
    .from("village_services")
    .update({ is_active: !current })
    .eq("id", id);
  if (error) return { success: false, message: error.message };

  revalidatePath("/admin/layanan");
  revalidatePath("/layanan");
  return { success: true, message: !current ? "Layanan diaktifkan." : "Layanan dinonaktifkan." };
}