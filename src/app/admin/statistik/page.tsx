import { createClient }      from "@/lib/supabase/server";
import StatistikAdminClient  from "@/components/admin/statistik/StatistikAdminClient";
import type {
  PopulationStats, AgeDistribution,
  OccupationDistribution, EducationDistribution,
} from "@/types/database";

export default async function AdminStatistikPage() {
  const supabase = await createClient();

  const [currentRes, historyRes] = await Promise.all([
    supabase.from("population_stats").select("*").eq("is_current", true).single(),
    supabase.from("population_stats").select("*").order("year", { ascending: false }),
  ]);

  const current = currentRes.data as PopulationStats | null;

  let ageData: AgeDistribution[]        = [];
  let occData: OccupationDistribution[] = [];
  let eduData: EducationDistribution[]  = [];

  if (current) {
    const [ageRes, occRes, eduRes] = await Promise.all([
      supabase.from("age_distribution").select("*").eq("stats_id", current.id),
      supabase.from("occupation_distribution").select("*").eq("stats_id", current.id),
      supabase.from("education_distribution").select("*").eq("stats_id", current.id),
    ]);
    ageData = (ageRes.data as AgeDistribution[]        | null) ?? [];
    occData = (occRes.data as OccupationDistribution[] | null) ?? [];
    eduData = (eduRes.data as EducationDistribution[]  | null) ?? [];
  }

  return (
    <div>
      <div style={{ marginBottom: "28px" }}>
        <h1 style={{
          fontFamily: "var(--font-playfair)",
          fontSize: "1.6rem", fontWeight: 700, color: "#111827",
        }}>
          Kelola Statistik
        </h1>
        <p style={{ fontSize: "13px", color: "#6b7280", marginTop: "3px" }}>
          Update data kependudukan desa · Data terkini: Tahun {current?.year ?? "—"}
        </p>
      </div>

      <StatistikAdminClient
        current={current}
        history={(historyRes.data as PopulationStats[] | null) ?? []}
        ageData={ageData}
        occData={occData}
        eduData={eduData}
      />
    </div>
  );
}