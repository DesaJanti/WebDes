import { createClient }    from "@/lib/supabase/server";
import type { Metadata }   from "next";
import ProfilHeroSection   from "@/components/sections/profil/ProfilHeroSection";
import VisiMisiSection     from "@/components/sections/profil/VisiMisiSection";
import StrukturSection     from "@/components/sections/profil/StrukturSection";
import PetaSection         from "@/components/sections/profil/PetaSection";
import type { VillageProfile, VillageOfficial } from "@/types/database";

export const metadata: Metadata = {
  title: "Profil Desa",
  description: "Profil lengkap Desa Janti — visi misi, struktur perangkat desa, dan lokasi balai desa.",
};

// Extended types
declare module "@/types/database" {
  interface VillageProfile {
    id: number;
    village_name: string;
    tagline: string | null;
    address: string | null;
    kecamatan: string;
    kabupaten: string;
    visi: string | null;
    misi: string | null;
    established_year: number | null;
    area_ha: number | null;
    maps_embed_url: string | null;
    hero_image_url: string | null;
    updated_at: string;
  }
  interface VillageOfficial {
    id: string;
    full_name: string;
    position: string;
    photo_url: string | null;
    sort_order: number;
    is_active: boolean;
  }
}

const FALLBACK_PROFILE = {
  id: 1,
  village_name: "Desa Janti",
  tagline: "Maju, Sejahtera, Bermartabat",
  address: "Jl. Janti No.1, Kec. Slahung, Kab. Ponorogo",
  kecamatan: "Slahung",
  kabupaten: "Ponorogo",
  visi: "Terwujudnya Desa Janti yang maju, mandiri, dan sejahtera berlandaskan nilai-nilai gotong royong dan kearifan lokal.",
  misi: JSON.stringify([
    "Meningkatkan kualitas pelayanan publik berbasis teknologi informasi",
    "Mengembangkan potensi ekonomi lokal melalui penguatan BUMDES",
    "Membangun infrastruktur desa yang merata dan berkualitas",
    "Memberdayakan masyarakat melalui pendidikan dan pelatihan keterampilan",
    "Melestarikan budaya dan kearifan lokal Desa Janti",
  ]),
  established_year: 1945,
  area_ha: 420.5,
  maps_embed_url: null,
  hero_image_url: null,
  updated_at: new Date().toISOString(),
};

export default async function ProfilPage() {
  const supabase = await createClient();

  const [profileRes, officialsRes] = await Promise.all([
    supabase.from("village_profile").select("*").eq("id", 1).single(),
    supabase
      .from("village_officials")
      .select("*")
      .eq("is_active", true)
      .order("sort_order"),
  ]);

  const profile  = profileRes.data  ?? FALLBACK_PROFILE;
  const officials = (officialsRes.data as VillageOfficial[] | null) ?? [];

  // Parse misi: bisa string JSON array atau plain text per baris
  let misiList: string[] = [];
  if (profile.misi) {
    try {
      misiList = JSON.parse(profile.misi);
    } catch {
      misiList = profile.misi.split("\n").filter(Boolean);
    }
  }

  return (
    <main style={{ backgroundColor: "#fdfbf5", minHeight: "100vh" }}>
      <ProfilHeroSection profile={profile} />
      <VisiMisiSection   visi={profile.visi} misiList={misiList} />
      <StrukturSection   officials={officials} />
      <PetaSection
        mapsEmbedUrl={profile.maps_embed_url}
        address={profile.address}
      />
    </main>
  );
}