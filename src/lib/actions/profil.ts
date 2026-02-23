"use server";

import { createClient }   from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export type ActionState = { success: boolean; message: string };

// ── Kades profile ─────────────────────────────────────────────
export async function updateKades(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const supabase = await createClient();

  const { error } = await supabase.from("kades_profile").update({
    full_name:      (formData.get("full_name")      as string)?.trim(),
    title:          (formData.get("title")          as string)?.trim() || null,
    period:         (formData.get("period")         as string)?.trim() || null,
    photo_url:      (formData.get("photo_url")      as string)?.trim() || null,
    welcome_speech: (formData.get("welcome_speech") as string)?.trim() || null,
  }).eq("id", 1);

  if (error) return { success: false, message: `Gagal: ${error.message}` };

  revalidatePath("/admin/profil");
  revalidatePath("/profil");
  revalidatePath("/");
  return { success: true, message: "Profil kepala desa berhasil diupdate!" };
}

// ── Visi misi ─────────────────────────────────────────────────
export async function updateVisiMisi(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const supabase = await createClient();

  const visi     = (formData.get("visi")  as string)?.trim() || null;
  const misiRaw  = (formData.get("misi")  as string)?.trim() || "";
  const misiList = misiRaw.split("\n").map((s) => s.trim()).filter(Boolean);

  const { error } = await supabase.from("village_profile").update({
    visi,
    misi: misiList.length > 0 ? JSON.stringify(misiList) : null,
  }).eq("id", 1);

  if (error) return { success: false, message: `Gagal: ${error.message}` };

  revalidatePath("/admin/profil");
  revalidatePath("/profil");
  return { success: true, message: "Visi & misi berhasil diupdate!" };
}

// ── Priority programs ─────────────────────────────────────────
export async function createProgram(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const supabase = await createClient();

  const title       = (formData.get("title")       as string)?.trim();
  const description = (formData.get("description") as string)?.trim() || null;
  const icon        = (formData.get("icon")        as string)?.trim() || "🏛️";

  if (!title) return { success: false, message: "Judul program wajib diisi." };

  const { data: last } = await supabase
    .from("priority_programs")
    .select("sort_order")
    .order("sort_order", { ascending: false })
    .limit(1)
    .maybeSingle();

  const { error } = await supabase.from("priority_programs").insert({
    title, description, icon,
    sort_order: (last?.sort_order ?? 0) + 1,
    is_active: true,
  });

  if (error) return { success: false, message: `Gagal: ${error.message}` };

  revalidatePath("/admin/profil");
  revalidatePath("/");
  return { success: true, message: "Program berhasil ditambahkan!" };
}

export async function deleteProgram(id: string): Promise<ActionState> {
  const supabase = await createClient();
  const { error } = await supabase.from("priority_programs").delete().eq("id", id);
  if (error) return { success: false, message: error.message };

  revalidatePath("/admin/profil");
  revalidatePath("/");
  return { success: true, message: "Program dihapus." };
}

// ── Village officials ─────────────────────────────────────────
export async function createOfficial(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const supabase   = await createClient();

  const full_name  = (formData.get("full_name") as string)?.trim();
  const position   = (formData.get("position")  as string)?.trim();
  const photo_url  = (formData.get("photo_url") as string)?.trim() || null;

  if (!full_name || !position)
    return { success: false, message: "Nama dan jabatan wajib diisi." };

  const { data: last } = await supabase
    .from("village_officials")
    .select("sort_order")
    .order("sort_order", { ascending: false })
    .limit(1)
    .maybeSingle();

  const { error } = await supabase.from("village_officials").insert({
    full_name, position, photo_url,
    sort_order: (last?.sort_order ?? 0) + 1,
    is_active: true,
  });

  if (error) return { success: false, message: `Gagal: ${error.message}` };

  revalidatePath("/admin/profil");
  revalidatePath("/profil");
  return { success: true, message: "Perangkat desa berhasil ditambahkan!" };
}

export async function deleteOfficial(id: string): Promise<ActionState> {
  const supabase = await createClient();
  const { error } = await supabase.from("village_officials").delete().eq("id", id);
  if (error) return { success: false, message: error.message };

  revalidatePath("/admin/profil");
  revalidatePath("/profil");
  return { success: true, message: "Perangkat desa dihapus." };
}