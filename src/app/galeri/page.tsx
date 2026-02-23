import { createClient }  from "@/lib/supabase/server";
import GaleriSection     from "@/components/sections/GaleriSection";
import Link              from "next/link";
import { ArrowLeft }     from "lucide-react";
import type { Metadata } from "next";
import type { GalleryItem } from "@/types/database";

export const metadata: Metadata = {
  title: "Galeri Desa",
  description: "Koleksi foto dan dokumentasi kegiatan Desa Janti.",
};

export default async function GaleriPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("gallery")
    .select("*")
    .eq("is_active", true)
    .order("sort_order");

  const items = (data as GalleryItem[] | null) ?? [];

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
            📸 Dokumentasi
          </div>
          <h1 style={{
            fontFamily: "var(--font-playfair)",
            fontSize: "clamp(2rem, 5vw, 3rem)",
            fontWeight: 700, color: "white",
          }}>
            Galeri <span style={{ color: "#f0c050" }}>Desa Janti</span>
          </h1>
          <p style={{ color: "rgba(255,255,255,0.55)", marginTop: "10px", fontSize: "14px" }}>
            Dokumentasi kegiatan, infrastruktur, dan kehidupan warga Desa Janti
          </p>
        </div>
      </div>

      <GaleriSection items={items} />
    </main>
  );
}