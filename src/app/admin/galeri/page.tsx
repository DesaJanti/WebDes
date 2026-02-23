import { createClient }  from "@/lib/supabase/server";
import GaleriAdminClient from "@/components/admin/galeri/GaleriAdminClient";
import type { GalleryItem } from "@/types/database";

export default async function AdminGaleriPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("gallery")
    .select("*")
    .order("sort_order");

  const items = (data as GalleryItem[] | null) ?? [];

  return (
    <div>
      <div style={{ marginBottom: "28px" }}>
        <h1 style={{
          fontFamily: "var(--font-playfair)",
          fontSize: "1.6rem", fontWeight: 700, color: "#111827",
        }}>
          Kelola Galeri
        </h1>
        <p style={{ fontSize: "13px", color: "#6b7280", marginTop: "3px" }}>
          {items.filter((i) => i.is_active).length} foto ditampilkan dari {items.length} total
        </p>
      </div>
      <GaleriAdminClient items={items} />
    </div>
  );
}