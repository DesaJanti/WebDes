import { createClient }  from "@/lib/supabase/server";
import ProfilAdminClient from "@/components/admin/profil/ProfilAdminClient";
import type {
  KadesProfile, PriorityProgram, VillageOfficial,
} from "@/types/database";

export default async function AdminProfilPage() {
  const supabase = await createClient();

  const [kadesRes, profileRes, programsRes, officialsRes] = await Promise.all([
    supabase.from("kades_profile").select("*").eq("id", 1).single(),
    supabase.from("village_profile").select("visi, misi").eq("id", 1).single(),
    supabase.from("priority_programs").select("*").eq("is_active", true).order("sort_order"),
    supabase.from("village_officials").select("*").eq("is_active", true).order("sort_order"),
  ]);

  const kades     = kadesRes.data    as KadesProfile    | null;
  const profile   = profileRes.data  as { visi: string | null; misi: string | null } | null;
  const programs  = (programsRes.data  as PriorityProgram[]  | null) ?? [];
  const officials = (officialsRes.data as VillageOfficial[]  | null) ?? [];

  // Parse misi
  let misiText = "";
  if (profile?.misi) {
    try {
      const arr = JSON.parse(profile.misi) as string[];
      misiText = arr.join("\n");
    } catch {
      misiText = profile.misi;
    }
  }

  return (
    <div>
      <div style={{ marginBottom: "28px" }}>
        <h1 style={{
          fontFamily: "var(--font-playfair)",
          fontSize: "1.6rem", fontWeight: 700, color: "#111827",
        }}>
          Kelola Profil Desa
        </h1>
        <p style={{ fontSize: "13px", color: "#6b7280", marginTop: "3px" }}>
          Update profil kepala desa, visi misi, program prioritas, dan perangkat desa
        </p>
      </div>

      <ProfilAdminClient
        kades={kades}
        visi={profile?.visi ?? ""}
        misiText={misiText}
        programs={programs}
        officials={officials}
      />
    </div>
  );
}