import { createClient }      from "@/lib/supabase/server";
import HeroSection           from "@/components/sections/HeroSection";
import ProfilSection         from "@/components/sections/ProfilSection";
import StatistikSection      from "@/components/sections/StatistikSection";
import BeritaSection         from "@/components/sections/BeritaSection";
import LayananSection        from "@/components/sections/LayananSection";
import GaleriSection         from "@/components/sections/GaleriSection";
import type {
  KadesProfile, PriorityProgram, PopulationStats,
  AgeDistribution, OccupationDistribution, EducationDistribution,
  NewsItem, VillageService, GalleryItem,
} from "@/types/database";

const FALLBACK_KADES: KadesProfile = {
  id: 1, full_name: "Nama Kepala Desa", title: "S.IP",
  period: "2021–2027", photo_url: null, welcome_speech: null,
  updated_at: new Date().toISOString(),
};

const FALLBACK_STATS: PopulationStats = {
  id: "fallback", year: new Date().getFullYear(),
  total_population: 3240, total_male: 1598, total_female: 1642,
  total_families: 890, total_rw: 3, total_rt: 9,
  notes: null, is_current: true,
  recorded_at: new Date().toISOString(),
};

export default async function HomePage() {
  const supabase = await createClient();

  const [kadesRes, programsRes, statsRes, newsRes, servicesRes, galleryRes] =
    await Promise.all([
      supabase.from("kades_profile").select("*").eq("id", 1).single(),
      supabase.from("priority_programs").select("*").eq("is_active", true).order("sort_order"),
      supabase.from("population_stats").select("*").eq("is_current", true).single(),
      supabase.from("news").select("*").eq("is_published", true)
        .order("published_at", { ascending: false }).limit(7),
      supabase.from("village_services").select("*").eq("is_active", true).order("sort_order"),
      supabase.from("gallery").select("*").eq("is_active", true)
        .order("sort_order").limit(8),
    ]);

  const kades      = (kadesRes.data    as KadesProfile    | null) ?? FALLBACK_KADES;
  const programs   = (programsRes.data as PriorityProgram[] | null) ?? [];
  const stats      = (statsRes.data    as PopulationStats  | null) ?? FALLBACK_STATS;
  const newsList   = (newsRes.data     as NewsItem[]       | null) ?? [];
  const services   = (servicesRes.data as VillageService[] | null) ?? [];
  const galleryItems = (galleryRes.data as GalleryItem[]   | null) ?? [];

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
    <>
      <HeroSection />
      <ProfilSection kades={kades} programs={programs} />
      <StatistikSection
        stats={stats} ageData={ageData}
        occupationData={occupationData} educationData={educationData}
      />
      <BeritaSection  newsList={newsList} />
      <LayananSection services={services} />
      <GaleriSection  items={galleryItems} />
    </>
  );
}