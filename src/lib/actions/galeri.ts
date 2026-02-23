"use server";

import { createClient }   from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import type { ActionState } from "./profil";

export async function createGalleryItem(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const supabase   = await createClient();
  const title      = (formData.get("title")       as string)?.trim();
  const description= (formData.get("description") as string)?.trim() || null;
  const image_url  = (formData.get("image_url")   as string)?.trim() || null;
  const category   = (formData.get("category")    as string)?.trim() || null;

  if (!title) return { success: false, message: "Judul foto wajib diisi." };

  const { data: last } = await supabase
    .from("gallery")
    .select("sort_order")
    .order("sort_order", { ascending: false })
    .limit(1)
    .maybeSingle();

  const { error } = await supabase.from("gallery").insert({
    title, description, image_url, category,
    sort_order: (last?.sort_order ?? 0) + 1,
    is_active: true,
  });

  if (error) return { success: false, message: `Gagal: ${error.message}` };

  revalidatePath("/admin/galeri");
  revalidatePath("/galeri");
  revalidatePath("/");
  return { success: true, message: "Foto berhasil ditambahkan!" };
}

export async function deleteGalleryItem(id: string): Promise<ActionState> {
  const supabase = await createClient();
  const { error } = await supabase.from("gallery").delete().eq("id", id);
  if (error) return { success: false, message: error.message };

  revalidatePath("/admin/galeri");
  revalidatePath("/galeri");
  revalidatePath("/");
  return { success: true, message: "Foto berhasil dihapus." };
}

export async function toggleGalleryItem(
  id: string, current: boolean
): Promise<ActionState> {
  const supabase = await createClient();
  const { error } = await supabase
    .from("gallery")
    .update({ is_active: !current })
    .eq("id", id);
  if (error) return { success: false, message: error.message };

  revalidatePath("/admin/galeri");
  revalidatePath("/galeri");
  return { success: true, message: !current ? "Foto ditampilkan." : "Foto disembunyikan." };
}