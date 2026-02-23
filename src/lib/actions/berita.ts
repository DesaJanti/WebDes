"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { slugify } from "@/lib/utils";

export type BeritaFormState = {
  success: boolean;
  message: string;
  id?: string;
};

// ── Create ────────────────────────────────────────────────────
export async function createBerita(
  _prev: BeritaFormState,
  formData: FormData
): Promise<BeritaFormState> {
  const supabase = await createClient();

  const title       = formData.get("title")       as string;
  const excerpt     = formData.get("excerpt")     as string;
  const content     = formData.get("content")     as string;
  const category    = formData.get("category")    as string;
  const cover_url   = formData.get("cover_url")   as string;
  const is_published = formData.get("is_published") === "true";

  if (!title?.trim() || !content?.trim()) {
    return { success: false, message: "Judul dan konten wajib diisi." };
  }

  // Generate unique slug
  let slug = slugify(title);
  const { data: existing } = await supabase
    .from("news")
    .select("id")
    .eq("slug", slug)
    .maybeSingle();
  if (existing) slug = `${slug}-${Date.now()}`;

  const { data, error } = await supabase.from("news").insert({
    slug,
    title:        title.trim(),
    excerpt:      excerpt?.trim() || null,
    content:      content.trim(),
    category:     category || "Umum",
    cover_url:    cover_url?.trim() || null,
    is_published,
    published_at: is_published ? new Date().toISOString() : null,
  }).select("id").single();

  if (error) return { success: false, message: `Gagal menyimpan: ${error.message}` };

  revalidatePath("/admin/berita");
  revalidatePath("/berita");
  revalidatePath("/");

  return { success: true, message: "Berita berhasil disimpan!", id: data.id };
}

// ── Update ────────────────────────────────────────────────────
export async function updateBerita(
  id: string,
  _prev: BeritaFormState,
  formData: FormData
): Promise<BeritaFormState> {
  const supabase = await createClient();

  const title       = formData.get("title")    as string;
  const excerpt     = formData.get("excerpt")  as string;
  const content     = formData.get("content")  as string;
  const category    = formData.get("category") as string;
  const cover_url   = formData.get("cover_url") as string;
  const is_published = formData.get("is_published") === "true";

  if (!title?.trim() || !content?.trim()) {
    return { success: false, message: "Judul dan konten wajib diisi." };
  }

  // Get current state to check if newly published
  const { data: current } = await supabase
    .from("news").select("is_published, published_at").eq("id", id).single();

  const shouldSetPublishedAt =
    is_published && !current?.is_published;

  const { error } = await supabase.from("news").update({
    title:        title.trim(),
    excerpt:      excerpt?.trim() || null,
    content:      content.trim(),
    category:     category || "Umum",
    cover_url:    cover_url?.trim() || null,
    is_published,
    published_at: shouldSetPublishedAt
      ? new Date().toISOString()
      : (current?.published_at ?? null),
    updated_at: new Date().toISOString(),
  }).eq("id", id);

  if (error) return { success: false, message: `Gagal mengupdate: ${error.message}` };

  revalidatePath("/admin/berita");
  revalidatePath("/berita");
  revalidatePath("/");

  return { success: true, message: "Berita berhasil diupdate!" };
}

// ── Delete ────────────────────────────────────────────────────
export async function deleteBerita(id: string): Promise<BeritaFormState> {
  const supabase = await createClient();
  const { error } = await supabase.from("news").delete().eq("id", id);
  if (error) return { success: false, message: `Gagal menghapus: ${error.message}` };

  revalidatePath("/admin/berita");
  revalidatePath("/berita");
  revalidatePath("/");

  return { success: true, message: "Berita berhasil dihapus." };
}

// ── Toggle publish ────────────────────────────────────────────
export async function togglePublishBerita(
  id: string,
  currentState: boolean
): Promise<BeritaFormState> {
  const supabase    = await createClient();
  const newState    = !currentState;

  const { error } = await supabase.from("news").update({
    is_published: newState,
    published_at: newState ? new Date().toISOString() : null,
  }).eq("id", id);

  if (error) return { success: false, message: error.message };

  revalidatePath("/admin/berita");
  revalidatePath("/berita");
  revalidatePath("/");

  return {
    success: true,
    message: newState ? "Berita dipublikasikan." : "Berita disembunyikan.",
  };
}