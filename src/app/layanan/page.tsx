import { createClient }  from "@/lib/supabase/server";
import LayananSection    from "@/components/sections/LayananSection";
import Link              from "next/link";
import { ArrowLeft }     from "lucide-react";
import type { Metadata } from "next";
import type { VillageService } from "@/types/database";

export const metadata: Metadata = {
  title: "Layanan Desa",
  description: "Informasi layanan administrasi dan pelayanan publik Desa Janti.",
};

export default async function LayananPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("village_services")
    .select("*")
    .eq("is_active", true)
    .order("sort_order");

  const services = (data as VillageService[] | null) ?? [];

  return (
    <main style={{ backgroundColor: "#fdfbf5", minHeight: "100vh" }}>
      {/* Page header */}
      <div style={{
        background: "linear-gradient(135deg, #0a2e18 0%, #1a6b3c 100%)",
        padding: "120px 24px 60px",
      }}>
        <div style={{ maxWidth: "72rem", margin: "0 auto" }}>
          <Link
            href="/"
            style={{
              display: "inline-flex", alignItems: "center", gap: "6px",
              fontSize: "13px", color: "rgba(255,255,255,0.6)",
              textDecoration: "none", marginBottom: "20px",
            }}
          >
            <ArrowLeft size={14} /> Kembali ke Beranda
          </Link>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: "6px",
            padding: "4px 14px", borderRadius: "9999px",
            background: "rgba(240,192,80,0.15)",
            border: "1px solid rgba(240,192,80,0.25)",
            color: "#f0c050", fontSize: "12px", fontWeight: 600,
            marginBottom: "16px",
          }}>
            🏛️ Pelayanan Publik
          </div>
          <h1 style={{
            fontFamily: "var(--font-playfair)",
            fontSize: "clamp(2rem, 5vw, 3rem)",
            fontWeight: 700, color: "white",
          }}>
            Layanan <span style={{ color: "#f0c050" }}>Desa Janti</span>
          </h1>
          <p style={{ color: "rgba(255,255,255,0.55)", marginTop: "10px", fontSize: "14px" }}>
            Informasi lengkap persyaratan dan prosedur layanan administrasi desa
          </p>
        </div>
      </div>

      {/* Reuse LayananSection — background di-override */}
      <div style={{ background: "#fdfbf5" }}>
        <LayananSection services={services} />
      </div>
    </main>
  );
}