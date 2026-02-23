import { createClient } from "@/lib/supabase/server";
import Link             from "next/link";
import { ArrowLeft }    from "lucide-react";
import NewsCard         from "@/components/ui/NewsCard";
import type { NewsItem } from "@/types/database";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Berita Desa",
  description: "Kumpulan berita dan informasi terkini dari Desa Janti, Kec. Slahung, Kab. Ponorogo.",
};

const CATEGORIES = ["Semua", "Umum", "Kegiatan", "Pengumuman", "Pembangunan"];

export default async function BeritaPage({
  searchParams,
}: {
  searchParams: Promise<{ kategori?: string; page?: string }>;
}) {
  const params   = await searchParams;
  const kategori = params.kategori ?? "Semua";
  const page     = parseInt(params.page ?? "1");
  const perPage  = 9;

  const supabase = await createClient();

  let query = supabase
    .from("news")
    .select("*", { count: "exact" })
    .eq("is_published", true)
    .order("published_at", { ascending: false })
    .range((page - 1) * perPage, page * perPage - 1);

  if (kategori !== "Semua") {
    query = query.eq("category", kategori);
  }

  const { data, count } = await query;
  const newsList   = (data as NewsItem[] | null) ?? [];
  const totalPages = Math.ceil((count ?? 0) / perPage);

  return (
    <main style={{ backgroundColor: "#fdfbf5", minHeight: "100vh" }}>

      {/* Page header */}
      <div style={{
        background: "linear-gradient(135deg, #0a2e18 0%, #1a6b3c 100%)",
        padding: "120px 24px 60px",
      }}>
        <div style={{ maxWidth: "72rem", margin: "0 auto" }}>
          <Link
            href="/#berita"
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
            📰 Portal Berita
          </div>
          <h1 style={{
            fontFamily: "var(--font-playfair)",
            fontSize: "clamp(2rem, 5vw, 3rem)",
            fontWeight: 700, color: "white",
          }}>
            Berita <span style={{ color: "#f0c050" }}>Desa Janti</span>
          </h1>
          <p style={{ color: "rgba(255,255,255,0.55)", marginTop: "10px", fontSize: "14px" }}>
            Informasi, pengumuman, dan kegiatan terkini dari Desa Janti
          </p>
        </div>
      </div>

      <div style={{ maxWidth: "72rem", margin: "0 auto", padding: "40px 24px 80px" }}>

        {/* Category filter */}
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "36px" }}>
          {CATEGORIES.map((cat) => {
            const active = cat === kategori;
            return (
              <Link
                key={cat}
                href={`/berita?kategori=${cat}`}
                style={{
                  padding: "8px 18px", borderRadius: "9999px",
                  fontSize: "13px", fontWeight: 600,
                  textDecoration: "none", border: "1.5px solid",
                  transition: "all 0.2s ease",
                  backgroundColor: active ? "#1a6b3c" : "white",
                  borderColor:     active ? "#1a6b3c" : "#e5e7eb",
                  color:           active ? "white"   : "#6b7280",
                }}
              >
                {cat}
              </Link>
            );
          })}
        </div>

        {/* News grid */}
        {newsList.length === 0 ? (
          <div style={{ textAlign: "center", padding: "80px 20px", color: "#9ca3af" }}>
            <div style={{ fontSize: "52px", marginBottom: "16px" }}>📰</div>
            <p style={{ fontSize: "16px", fontWeight: 600, color: "#6b7280", marginBottom: "6px" }}>
              Belum ada berita
            </p>
            <p style={{ fontSize: "13px" }}>
              {kategori !== "Semua"
                ? `Tidak ada berita kategori "${kategori}" saat ini.`
                : "Admin belum mempublikasikan berita."}
            </p>
          </div>
        ) : (
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
            gap: "20px", marginBottom: "48px",
          }}>
            {newsList.map((news) => (
              <NewsCard key={news.id} news={news} />
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div style={{
            display: "flex", justifyContent: "center",
            alignItems: "center", gap: "8px", flexWrap: "wrap",
          }}>
            {page > 1 && (
              <Link
                href={`/berita?kategori=${kategori}&page=${page - 1}`}
                style={{
                  padding: "8px 16px", borderRadius: "9999px",
                  border: "1.5px solid #e5e7eb", fontSize: "13px",
                  color: "#374151", textDecoration: "none", backgroundColor: "white",
                }}
              >
                ← Sebelumnya
              </Link>
            )}
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <Link
                key={p}
                href={`/berita?kategori=${kategori}&page=${p}`}
                style={{
                  width: "36px", height: "36px", borderRadius: "9999px",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "13px", fontWeight: 600, textDecoration: "none",
                  border: "1.5px solid",
                  backgroundColor: p === page ? "#1a6b3c" : "white",
                  borderColor:     p === page ? "#1a6b3c" : "#e5e7eb",
                  color:           p === page ? "white"   : "#374151",
                }}
              >
                {p}
              </Link>
            ))}
            {page < totalPages && (
              <Link
                href={`/berita?kategori=${kategori}&page=${page + 1}`}
                style={{
                  padding: "8px 16px", borderRadius: "9999px",
                  border: "1.5px solid #e5e7eb", fontSize: "13px",
                  color: "#374151", textDecoration: "none", backgroundColor: "white",
                }}
              >
                Berikutnya →
              </Link>
            )}
          </div>
        )}
      </div>
    </main>
  );
}