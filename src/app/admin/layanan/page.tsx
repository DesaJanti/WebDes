import { createClient }    from "@/lib/supabase/server";
import LayananAdminClient  from "@/components/admin/layanan/LayananAdminClient";
import type { VillageService } from "@/types/database";

export default async function AdminLayananPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("village_services")
    .select("*")
    .order("sort_order");

  const services = (data as VillageService[] | null) ?? [];

  return (
    <div>
      <div style={{ marginBottom: "28px" }}>
        <h1 style={{
          fontFamily: "var(--font-playfair)",
          fontSize: "1.6rem", fontWeight: 700, color: "#111827",
        }}>
          Kelola Layanan
        </h1>
        <p style={{ fontSize: "13px", color: "#6b7280", marginTop: "3px" }}>
          {services.filter((s) => s.is_active).length} layanan aktif dari {services.length} total
        </p>
      </div>
      <LayananAdminClient services={services} />
    </div>
  );
}