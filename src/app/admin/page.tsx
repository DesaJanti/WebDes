import { createClient }    from "@/lib/supabase/server";
import { DashboardSummaryCard, QuickActionItem } from "@/components/admin/DashboardCard";
import { Newspaper, Building2, Image, Users, BarChart3, User } from "lucide-react";

async function getStats() {
  const supabase = await createClient();
  const [newsRes, servicesRes, galleryRes, statsRes] = await Promise.all([
    supabase.from("news").select("id, is_published"),
    supabase.from("village_services").select("id", { count: "exact" }),
    supabase.from("gallery").select("id", { count: "exact" }),
    supabase.from("population_stats").select("total_population, year").eq("is_current", true).single(),
  ]);
  return {
    totalNews:     newsRes.data?.length ?? 0,
    publishedNews: newsRes.data?.filter((n) => n.is_published).length ?? 0,
    totalServices: servicesRes.count ?? 0,
    totalGallery:  galleryRes.count  ?? 0,
    population:    statsRes.data?.total_population ?? 0,
    statsYear:     statsRes.data?.year ?? new Date().getFullYear(),
  };
}

export default async function AdminDashboard() {
  const stats = await getStats();

  return (
    <div>
      <div style={{ marginBottom: "32px" }}>
        <h1 style={{
          fontFamily: "var(--font-playfair)",
          fontSize: "1.75rem", fontWeight: 700, color: "#111827", marginBottom: "6px",
        }}>
          Dashboard
        </h1>
        <p style={{ fontSize: "14px", color: "#6b7280" }}>
          Selamat datang kembali, Admin Desa Janti 👋
        </p>
      </div>

      {/* Summary cards */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
        gap: "16px", marginBottom: "36px",
      }}>
        <DashboardSummaryCard
          label="Total Berita" value={stats.totalNews}
          sub={`${stats.publishedNews} dipublikasikan`}
          icon={<Newspaper size={20} />} href="/admin/berita" accent
        />
        <DashboardSummaryCard
          label="Layanan Desa" value={stats.totalServices ?? 0}
          sub="layanan aktif"
          icon={<Building2 size={20} />} href="/admin/layanan"
        />
        <DashboardSummaryCard
          label="Foto Galeri" value={stats.totalGallery ?? 0}
          sub="foto tersimpan"
          icon={<Image size={20} />} href="/admin/galeri"
        />
        <DashboardSummaryCard
          label="Penduduk" value={stats.population.toLocaleString("id-ID")}
          sub={`Data tahun ${stats.statsYear}`}
          icon={<Users size={20} />} href="/admin/statistik"
        />
      </div>

      {/* Quick actions + guide */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
        gap: "20px",
      }}>
        {/* Quick actions */}
        <div style={{
          background: "white", borderRadius: "20px",
          border: "1px solid #e8f5e9",
          boxShadow: "0 2px 12px rgba(26,107,60,0.05)",
          overflow: "hidden",
        }}>
          <div style={{ padding: "20px 24px 14px", borderBottom: "1px solid #f3f4f6" }}>
            <h2 style={{ fontSize: "15px", fontWeight: 700, color: "#111827" }}>⚡ Aksi Cepat</h2>
            <p style={{ fontSize: "12px", color: "#9ca3af", marginTop: "2px" }}>
              Kelola konten website desa
            </p>
          </div>
          <div style={{ padding: "8px 12px 12px" }}>
            <QuickActionItem label="Edit Profil Kades"  desc="Update sambutan & program prioritas" icon={<User size={16} />}      href="/admin/profil"    />
            <QuickActionItem label="Tambah Berita"      desc="Tulis & publikasikan berita baru"    icon={<Newspaper size={16} />}  href="/admin/berita"    />
            <QuickActionItem label="Update Statistik"   desc="Update data kependudukan terkini"    icon={<BarChart3 size={16} />}  href="/admin/statistik" />
            <QuickActionItem label="Upload Foto Galeri" desc="Tambah dokumentasi foto desa"        icon={<Image size={16} />}      href="/admin/galeri"    />
            <QuickActionItem label="Kelola Layanan"     desc="Edit persyaratan layanan desa"        icon={<Building2 size={16} />}  href="/admin/layanan"   />
          </div>
        </div>

        {/* Panduan */}
        <div style={{
          background: "white", borderRadius: "20px",
          border: "1px solid #e8f5e9",
          boxShadow: "0 2px 12px rgba(26,107,60,0.05)",
          padding: "24px",
        }}>
          <h2 style={{ fontSize: "15px", fontWeight: 700, color: "#111827", marginBottom: "20px" }}>
            📌 Panduan Admin
          </h2>
          {[
            { title: "Kelola Berita",    desc: "Buat, edit, dan publikasikan berita desa. Gunakan kategori yang tepat.",      dot: "#1a6b3c" },
            { title: "Update Statistik", desc: "Perbarui data kependudukan setiap tahun. Data baru otomatis jadi terkini.",   dot: "#f0c050" },
            { title: "Atur Profil Desa", desc: "Edit profil kades, sambutan, program prioritas, visi misi & perangkat desa.", dot: "#2d9158" },
            { title: "Upload Galeri",    desc: "Tambahkan foto kegiatan & infrastruktur. Format JPG/PNG, maks 5MB.",          dot: "#ef4444" },
          ].map((item, i) => (
            <div key={i} style={{
              display: "flex", gap: "12px",
              alignItems: "flex-start",
              marginBottom: i < 3 ? "16px" : 0,
            }}>
              <div style={{
                width: "8px", height: "8px", borderRadius: "50%",
                background: item.dot, flexShrink: 0, marginTop: "5px",
              }} />
              <div>
                <p style={{ fontSize: "13px", fontWeight: 600, color: "#111827", marginBottom: "2px" }}>
                  {item.title}
                </p>
                <p style={{ fontSize: "12px", color: "#6b7280", lineHeight: 1.6 }}>
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}