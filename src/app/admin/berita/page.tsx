import { createClient }  from "@/lib/supabase/server";
import BeritaListClient  from "@/components/admin/berita/BeritaListClient";
import type { NewsItem } from "@/types/database";

export default async function AdminBeritaPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("news")
    .select("*")
    .order("created_at", { ascending: false });

  const newsList = (data as NewsItem[] | null) ?? [];

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: "28px" }}>
        <h1 style={{
          fontFamily: "var(--font-playfair)",
          fontSize: "1.6rem", fontWeight: 700, color: "#111827",
        }}>
          Kelola Berita
        </h1>
        <p style={{ fontSize: "13px", color: "#6b7280", marginTop: "3px" }}>
          {newsList.length} berita total ·{" "}
          {newsList.filter((n) => n.is_published).length} dipublikasikan ·{" "}
          {newsList.filter((n) => !n.is_published).length} draft
        </p>
      </div>

      <BeritaListClient newsList={newsList} />
    </div>
  );
}