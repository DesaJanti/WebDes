import { createClient }   from "@/lib/supabase/server";
import { notFound }       from "next/navigation";
import BeritaFormClient   from "@/components/admin/berita/BeritaFormClient";
import type { NewsItem }  from "@/types/database";

interface Props { params: Promise<{ id: string }> }

export default async function AdminBeritaFormPage({ params }: Props) {
  const { id } = await params;
  const isNew  = id === "baru";

  let news: NewsItem | null = null;

  if (!isNew) {
    const supabase = await createClient();
    const { data } = await supabase
      .from("news").select("*").eq("id", id).single();
    if (!data) notFound();
    news = data as NewsItem;
  }

  return (
    <div>
      <div style={{ marginBottom: "28px" }}>
        <h1 style={{
          fontFamily: "var(--font-playfair)",
          fontSize: "1.6rem", fontWeight: 700, color: "#111827",
        }}>
          {isNew ? "Berita Baru" : "Edit Berita"}
        </h1>
        <p style={{ fontSize: "13px", color: "#6b7280", marginTop: "3px" }}>
          {isNew
            ? "Tulis dan publikasikan berita untuk warga Desa Janti"
            : `Mengedit: ${news?.title}`}
        </p>
      </div>

      <BeritaFormClient news={news} />
    </div>
  );
}