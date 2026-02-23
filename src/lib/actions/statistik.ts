"use server";

import { createClient }   from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import type { ActionState } from "./profil";

export async function upsertStatistik(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const supabase = await createClient();

  const year             = parseInt(formData.get("year")             as string);
  const total_population = parseInt(formData.get("total_population") as string);
  const total_male       = parseInt(formData.get("total_male")       as string);
  const total_female     = parseInt(formData.get("total_female")     as string);
  const total_families   = parseInt(formData.get("total_families")   as string);
  const total_rw         = parseInt(formData.get("total_rw")         as string);
  const total_rt         = parseInt(formData.get("total_rt")         as string);
  const notes            = (formData.get("notes") as string)?.trim() || null;

  if (isNaN(year) || isNaN(total_population)) {
    return { success: false, message: "Tahun dan total penduduk wajib diisi." };
  }

  // Set semua existing jadi not current
  await supabase
    .from("population_stats")
    .update({ is_current: false })
    .neq("id", "00000000-0000-0000-0000-000000000000");

  // Insert new current record
  const { data: newStats, error } = await supabase
    .from("population_stats")
    .insert({
      year, total_population, total_male, total_female,
      total_families, total_rw, total_rt, notes,
      is_current: true,
      recorded_at: new Date().toISOString(),
    })
    .select("id")
    .single();

  if (error) return { success: false, message: `Gagal: ${error.message}` };

  // Insert age distribution
  const ageGroupsRaw = formData.get("age_groups") as string;
  if (ageGroupsRaw) {
    try {
      const ageGroups = JSON.parse(ageGroupsRaw) as {
        age_group: string; male_count: number; female_count: number;
      }[];
      if (ageGroups.length > 0) {
        await supabase.from("age_distribution").insert(
          ageGroups.map((g) => ({ ...g, stats_id: newStats.id }))
        );
      }
    } catch {}
  }

  // Insert occupation distribution
  const occRaw = formData.get("occupations") as string;
  if (occRaw) {
    try {
      const occs = JSON.parse(occRaw) as { occupation: string; count: number }[];
      if (occs.length > 0) {
        await supabase.from("occupation_distribution").insert(
          occs.map((o) => ({ ...o, stats_id: newStats.id }))
        );
      }
    } catch {}
  }

  // Insert education distribution
  const eduRaw = formData.get("educations") as string;
  if (eduRaw) {
    try {
      const edus = JSON.parse(eduRaw) as { level: string; count: number }[];
      if (edus.length > 0) {
        await supabase.from("education_distribution").insert(
          edus.map((e) => ({ ...e, stats_id: newStats.id }))
        );
      }
    } catch {}
  }

  revalidatePath("/admin/statistik");
  revalidatePath("/statistik");
  revalidatePath("/");
  return { success: true, message: "Data statistik berhasil disimpan sebagai data terkini!" };
}