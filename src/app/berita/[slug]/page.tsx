import { createClient }  from "@/lib/supabase/server";
import Link              from "next/link";
import { notFound }      from "next/navigation";
import { formatDate }    from "@/lib/utils";
import { Calendar, Eye, ArrowLeft, Tag } from "lucide-react";
import type { NewsItem } from "@/types/database";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ slug: string }>;
}

type RelatedNews = {
  id: string;
  slug: string;
  title: string;
  cover_url: string | null;
  published_at: string | null;
  category: string;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const supabase  = await createClient();
  const { data }  = await supabase
    .from("news")
    .select("title, excerpt")
    .eq("slug", slug)
    .single();
  if (!data) return { title: "Berita tidak ditemukan" };
  return {
    title:       data.title,
    description: data.excerpt ?? undefined,
  };
}

const CATEGORY_STYLES: Record<string, { bg: string; color: string }> = {
  Umum:        { bg: "#e8f5e9", color: "#1a6b3c" },
  Kegiatan:    { bg: "#fdf8ef", color: "#b45309" },
  Pengumuman:  { bg: "#fef2f2", color: "#991b1b" },
  Pembangunan: { bg: "#eff6ff", color: "#1e40af" },
};

export default async function BeritaDetailPage({ params }: Props) {
  const { slug } = await params;
  const supabase  = await createClient();

  // Tanpa filter is_published — admin bisa preview draft
  const { data: news } = await supabase
    .from("news")
    .select("*")
    .eq("slug", slug)
    .single();

  if (!news) notFound();

  const item     = news as NewsItem;
  const isDraft  = !item.is_published;
  const catStyle = CATEGORY_STYLES[item.category] ?? CATEGORY_STYLES["Umum"];

  // Increment views hanya untuk berita publik (non-blocking)
  if (!isDraft) {
    supabase
      .from("news")
      .update({ views: item.views + 1 })
      .eq("id", item.id)
      .then(() => {});
  }

  // Related — hanya berita publik, kategori sama
  const { data: related } = await supabase
    .from("news")
    .select("id, slug, title, cover_url, published_at, category")
    .eq("is_published", true)
    .eq("category", item.category)
    .neq("slug", slug)
    .limit(3);

  const relatedList: RelatedNews[] = (related as RelatedNews[] | null) ?? [];

  return (
    <main style={{ backgroundColor: "#fdfbf5", minHeight: "100vh" }}>

      {/* ── Draft banner ── */}
      {isDraft && (
        <div style={{
          background: "#fef3c7",
          borderBottom: "2px solid #f59e0b",
          padding: "12px 24px",
          display: "flex", alignItems: "center",
          justifyContent: "space-between",
          gap: "12px", flexWrap: "wrap",
          position: "sticky", top: 0, zIndex: 40,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ fontSize: "16px" }}>⚠️</span>
            <span style={{ fontSize: "13px", fontWeight: 600, color: "#92400e" }}>
              Pratinjau <strong>Draft</strong> — belum dipublikasikan ke publik
            </span>
          </div>
          <div style={{ display: "flex", gap: "8px" }}>
            <Link
              href={`/admin/berita/${item.id}`}
              style={{
                padding: "6px 14px", borderRadius: "8px",
                background: "#f59e0b", color: "white",
                fontSize: "12px", fontWeight: 700,
                textDecoration: "none",
              }}
            >
              ✏️ Edit Berita
            </Link>
            <Link
              href="/admin/berita"
              style={{
                padding: "6px 14px", borderRadius: "8px",
                background: "rgba(0,0,0,0.10)", color: "#92400e",
                fontSize: "12px", fontWeight: 600,
                textDecoration: "none",
              }}
            >
              ← Kembali ke Admin
            </Link>
          </div>
        </div>
      )}

      {/* ── Cover header ── */}
      <div style={{
        minHeight: "420px",
        background: item.cover_url
          ? `linear-gradient(to bottom, rgba(0,0,0,0.25), rgba(10,40,20,0.88)),
             url(${item.cover_url}) center/cover no-repeat`
          : "linear-gradient(135deg, #0a2e18 0%, #1a6b3c 100%)",
        display: "flex", flexDirection: "column",
        justifyContent: "flex-end",
        padding: "120px 24px 52px",
      }}>
        <div style={{ maxWidth: "800px", margin: "0 auto", width: "100%" }}>

          <Link
            href="/berita"
            style={{
              display: "inline-flex", alignItems: "center", gap: "6px",
              fontSize: "13px", color: "rgba(255,255,255,0.6)",
              textDecoration: "none", marginBottom: "20px",
            }}
          >
            <ArrowLeft size={13} /> Semua Berita
          </Link>

          {/* Badges */}
          <div style={{ display: "flex", gap: "8px", marginBottom: "18px", flexWrap: "wrap" }}>
            <span style={{
              padding: "4px 12px", borderRadius: "9999px",
              fontSize: "12px", fontWeight: 600,
              backgroundColor: catStyle.bg, color: catStyle.color,
            }}>
              {item.category}
            </span>
            {isDraft && (
              <span style={{
                padding: "4px 12px", borderRadius: "9999px",
                fontSize: "12px", fontWeight: 600,
                backgroundColor: "#fef3c7", color: "#92400e",
              }}>
                Draft
              </span>
            )}
          </div>

          {/* Title */}
          <h1 style={{
            fontFamily: "var(--font-playfair)",
            fontSize: "clamp(1.6rem, 4vw, 2.6rem)",
            fontWeight: 700, color: "white",
            lineHeight: 1.25, marginBottom: "20px",
          }}>
            {item.title}
          </h1>

          {/* Meta */}
          <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
            <span style={{
              display: "flex", alignItems: "center", gap: "6px",
              fontSize: "13px", color: "rgba(255,255,255,0.6)",
            }}>
              <Calendar size={13} />
              {item.published_at ? formatDate(item.published_at) : "Belum dipublikasikan"}
            </span>
            {!isDraft && (
              <span style={{
                display: "flex", alignItems: "center", gap: "6px",
                fontSize: "13px", color: "rgba(255,255,255,0.6)",
              }}>
                <Eye size={13} />
                {item.views.toLocaleString("id-ID")} pembaca
              </span>
            )}
          </div>
        </div>
      </div>

      {/* ── Article body ── */}
      <div style={{ maxWidth: "800px", margin: "0 auto", padding: "48px 24px 80px" }}>

        {/* Excerpt / lead */}
        {item.excerpt && (
          <p style={{
            fontSize: "17px", lineHeight: 1.8,
            color: "#374151", fontWeight: 500,
            borderLeft: "4px solid #1a6b3c",
            paddingLeft: "20px", marginBottom: "32px",
            fontStyle: "italic",
          }}>
            {item.excerpt}
          </p>
        )}

        {/* Content HTML */}
        <div
          style={{
            fontSize: "15px", lineHeight: 1.95,
            color: "#374151",
          }}
          dangerouslySetInnerHTML={{ __html: item.content }}
        />

        {/* ── Footer bar ── */}
        <div style={{
          marginTop: "52px", paddingTop: "28px",
          borderTop: "1px solid #e8f5e9",
          display: "flex", alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap", gap: "12px",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <Tag size={14} style={{ color: "#9ca3af" }} />
            <span style={{
              padding: "4px 12px", borderRadius: "9999px",
              fontSize: "12px", fontWeight: 600,
              backgroundColor: catStyle.bg, color: catStyle.color,
            }}>
              {item.category}
            </span>
          </div>

          {isDraft ? (
            <Link
              href={`/admin/berita/${item.id}`}
              style={{
                display: "inline-flex", alignItems: "center", gap: "6px",
                padding: "10px 20px", borderRadius: "9999px",
                border: "1.5px solid #f59e0b", fontSize: "13px",
                fontWeight: 600, color: "#b45309", textDecoration: "none",
              }}
            >
              ✏️ Edit & Publikasikan
            </Link>
          ) : (
            <Link
              href="/berita"
              style={{
                display: "inline-flex", alignItems: "center", gap: "6px",
                padding: "10px 20px", borderRadius: "9999px",
                border: "1.5px solid #1a6b3c", fontSize: "13px",
                fontWeight: 600, color: "#1a6b3c", textDecoration: "none",
              }}
            >
              <ArrowLeft size={13} /> Kembali ke Berita
            </Link>
          )}
        </div>

        {/* ── Related articles ── */}
        {!isDraft && relatedList.length > 0 && (
          <div style={{ marginTop: "60px" }}>
            <h2 style={{
              fontFamily: "var(--font-playfair)",
              fontSize: "1.3rem", fontWeight: 700,
              color: "#111827", marginBottom: "20px",
            }}>
              Berita Terkait
            </h2>
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
              gap: "16px",
            }}>
              {relatedList.map((rel: RelatedNews) => (
                <Link
                  key={rel.id}
                  href={`/berita/${rel.slug}`}
                  style={{ textDecoration: "none" }}
                >
                  <div style={{
                    borderRadius: "16px", overflow: "hidden",
                    border: "1px solid #e8f5e9", background: "white",
                    transition: "transform 0.25s, box-shadow 0.25s",
                  }}
                    onMouseEnter={(e: React.MouseEvent<HTMLElement>) => {
                      e.currentTarget.style.transform = "translateY(-3px)";
                      e.currentTarget.style.boxShadow = "0 12px 32px rgba(26,107,60,0.12)";
                    }}
                    onMouseLeave={(e: React.MouseEvent<HTMLElement>) => {
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.boxShadow = "none";
                    }}
                  >
                    <div style={{
                      height: "130px",
                      background: rel.cover_url
                        ? `url(${rel.cover_url}) center/cover no-repeat`
                        : "linear-gradient(135deg, #1a6b3c, #2d9158)",
                    }} />
                    <div style={{ padding: "14px" }}>
                      <p style={{
                        fontSize: "13px", fontWeight: 600,
                        color: "#111827", lineHeight: 1.4,
                        marginBottom: "8px",
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                      }}>
                        {rel.title}
                      </p>
                      <p style={{
                        fontSize: "11px", color: "#9ca3af",
                        display: "flex", alignItems: "center", gap: "4px",
                      }}>
                        <Calendar size={10} />
                        {rel.published_at ? formatDate(rel.published_at) : "—"}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Global article styles */}
      <style>{`
        /* Styling untuk konten HTML dari editor */
        .article-content h2 {
          font-family: var(--font-playfair);
          font-size: 1.35rem;
          font-weight: 700;
          color: #111827;
          margin: 2rem 0 1rem;
        }
        .article-content p  { margin-bottom: 1.2rem; }
        .article-content ul,
        .article-content ol { padding-left: 1.5rem; margin-bottom: 1.2rem; }
        .article-content li { margin-bottom: 0.4rem; }
        .article-content strong { color: #111827; }
        .article-content a  { color: #1a6b3c; text-decoration: underline; }
        .article-content blockquote {
          border-left: 4px solid #1a6b3c;
          padding-left: 1rem;
          color: #6b7280;
          font-style: italic;
          margin: 1.5rem 0;
        }
      `}</style>
    </main>
  );
}
