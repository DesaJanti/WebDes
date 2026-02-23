import { createClient }      from "@/lib/supabase/server";
import type { Metadata }     from "next";
import StatistikClient       from "@/components/sections/statistik/StatistikClient";
import type {
  PopulationStats,
  AgeDistribution,
  OccupationDistribution,
  EducationDistribution,
} from "@/types/database";

export const metadata: Metadata = {
  title: "Statistik Desa",
  description: "Data statistik kependudukan lengkap Desa Janti.",
};

const FALLBACK_STATS: PopulationStats = {
  id: "fallback", year: new Date().getFullYear(),
  total_population: 3240, total_male: 1598, total_female: 1642,
  total_families: 890, total_rw: 3, total_rt: 9,
  notes: null, is_current: true,
  recorded_at: new Date().toISOString(),
};

export default async function StatistikPage() {
  const supabase = await createClient();

  const [statsRes, allStatsRes] = await Promise.all([
    supabase.from("population_stats").select("*").eq("is_current", true).single(),
    supabase.from("population_stats").select("*").order("year", { ascending: false }),
  ]);

  const stats     = (statsRes.data    as PopulationStats   | null) ?? FALLBACK_STATS;
  const allStats  = (allStatsRes.data as PopulationStats[] | null) ?? [FALLBACK_STATS];

  let ageData:        AgeDistribution[]        = [];
  let occupationData: OccupationDistribution[] = [];
  let educationData:  EducationDistribution[]  = [];

  if (stats.id !== "fallback") {
    const [ageRes, occRes, eduRes] = await Promise.all([
      supabase.from("age_distribution").select("*").eq("stats_id", stats.id),
      supabase.from("occupation_distribution").select("*").eq("stats_id", stats.id),
      supabase.from("education_distribution").select("*").eq("stats_id", stats.id),
    ]);
    ageData        = (ageRes.data as AgeDistribution[]        | null) ?? [];
    occupationData = (occRes.data as OccupationDistribution[] | null) ?? [];
    educationData  = (eduRes.data as EducationDistribution[]  | null) ?? [];
  }

  return (
    <main style={{ backgroundColor: "#fdfbf5", minHeight: "100vh" }}>
      <StatistikClient
        stats={stats}
        allStats={allStats}
        ageData={ageData}
        occupationData={occupationData}
        educationData={educationData}
      />
    </main>
  );
}