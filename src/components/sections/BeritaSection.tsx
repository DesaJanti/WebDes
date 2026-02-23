"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Calendar, Eye, ArrowRight, Tag } from "lucide-react";
import { formatDate } from "@/lib/utils";
import type { NewsItem } from "@/types/database";

// ── Category badge color map ──────────────────────────────────
const CATEGORY_STYLES: Record<string, { bg: string; color: string; dot: string }> = {
  Umum:         { bg: "#e8f5e9", color: "#1a6b3c", dot: "#1a6b3c" },
  Kegiatan:     { bg: "#fdf8ef", color: "#b45309", dot: "#f0c050" },
  Pengumuman:   { bg: "#fef2f2", color: "#991b1b", dot: "#ef4444" },
  Pembangunan:  { bg: "#eff6ff", color: "#1e40af", dot: "#3b82f6" },
};

function CategoryBadge({ category }: { category: string }) {
  const style = CATEGORY_STYLES[category] ?? CATEGORY_STYLES["Umum"];
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "5px",
        padding: "3px 10px",
        borderRadius: "9999px",
        fontSize: "11px",
        fontWeight: 600,
        backgroundColor: style.bg,
        color: style.color,
      }}
    >
      <span
        style={{
          width: "5px", height: "5px",
          borderRadius: "50%",
          backgroundColor: style.dot,
          flexShrink: 0,
        }}
      />
      {category}
    </span>
  );
}

// ── Featured (big) card ───────────────────────────────────────
function FeaturedCard({ news }: { news: NewsItem }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.55 }}
      style={{
        borderRadius: "24px",
        overflow: "hidden",
        background: "white",
        boxShadow: "0 4px 24px rgba(26,107,60,0.09)",
        border: "1px solid #e8f5e9",
        display: "flex",
        flexDirection: "column",
        height: "100%",
        cursor: "pointer",
        transition: "all 0.3s ease",
      }}
      whileHover={{ y: -4, boxShadow: "0 16px 48px rgba(26,107,60,0.16)" }}
    >
      <Link href={`/berita/${news.slug}`} style={{ textDecoration: "none", display: "flex", flexDirection: "column", height: "100%" }}>
        {/* Cover image */}
        <div
          style={{
            height: "220px",
            background: news.cover_url
              ? `url(${news.cover_url}) center/cover no-repeat`
              : "linear-gradient(135deg, #1a6b3c 0%, #2d9158 50%, #f0c050 100%)",
            position: "relative",
            flexShrink: 0,
          }}
        >
          {/* Overlay gradient */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "linear-gradient(to top, rgba(0,0,0,0.45) 0%, transparent 60%)",
            }}
          />
          {/* Category badge on image */}
          <div style={{ position: "absolute", top: "16px", left: "16px" }}>
            <CategoryBadge category={news.category} />
          </div>
          {/* No image placeholder */}
          {!news.cover_url && (
            <div
              style={{
                position: "absolute",
                inset: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "56px",
                opacity: 0.3,
              }}
            >
              📰
            </div>
          )}
        </div>

        {/* Content */}
        <div style={{ padding: "24px", flex: 1, display: "flex", flexDirection: "column" }}>
          <h3
            style={{
              fontFamily: "var(--font-playfair)",
              fontSize: "1.2rem",
              fontWeight: 700,
              color: "#111827",
              lineHeight: 1.4,
              marginBottom: "10px",
              flex: 1,
              display: "-webkit-box",
              WebkitLineClamp: 3,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {news.title}
          </h3>

          {news.excerpt && (
            <p
              style={{
                fontSize: "13px",
                color: "#6b7280",
                lineHeight: 1.7,
                marginBottom: "16px",
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              }}
            >
              {news.excerpt}
            </p>
          )}

          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginTop: "auto",
              paddingTop: "14px",
              borderTop: "1px solid #f3f4f6",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
              <span
                style={{
                  display: "flex", alignItems: "center", gap: "5px",
                  fontSize: "11px", color: "#9ca3af",
                }}
              >
                <Calendar size={12} />
                {news.published_at ? formatDate(news.published_at) : "—"}
              </span>
              <span
                style={{
                  display: "flex", alignItems: "center", gap: "5px",
                  fontSize: "11px", color: "#9ca3af",
                }}
              >
                <Eye size={12} />
                {news.views.toLocaleString("id-ID")}
              </span>
            </div>
            <span
              style={{
                display: "flex", alignItems: "center", gap: "4px",
                fontSize: "12px", fontWeight: 600, color: "#1a6b3c",
              }}
            >
              Baca <ArrowRight size={12} />
            </span>
          </div>
        </div>
      </Link>
    </motion.article>
  );
}

// ── Compact horizontal card ───────────────────────────────────
function CompactCard({ news, delay }: { news: NewsItem; delay: number }) {
  return (
    <motion.article
      initial={{ opacity: 0, x: 20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay }}
      style={{
        display: "flex",
        gap: "14px",
        padding: "14px",
        borderRadius: "16px",
        background: "white",
        border: "1px solid #e8f5e9",
        cursor: "pointer",
        transition: "all 0.25s ease",
      }}
      whileHover={{ backgroundColor: "#f2f7f4", x: 4 }}
    >
      <Link
        href={`/berita/${news.slug}`}
        style={{ textDecoration: "none", display: "flex", gap: "14px", width: "100%" }}
      >
        {/* Thumbnail */}
        <div
          style={{
            width: "72px",
            height: "72px",
            borderRadius: "12px",
            flexShrink: 0,
            background: news.cover_url
              ? `url(${news.cover_url}) center/cover no-repeat`
              : "linear-gradient(135deg, #1a6b3c, #2d9158)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "24px",
            overflow: "hidden",
          }}
        >
          {!news.cover_url && "📰"}
        </div>

        {/* Text */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ marginBottom: "6px" }}>
            <CategoryBadge category={news.category} />
          </div>
          <h4
            style={{
              fontSize: "13px",
              fontWeight: 600,
              color: "#111827",
              lineHeight: 1.4,
              marginBottom: "6px",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {news.title}
          </h4>
          <span
            style={{
              display: "flex", alignItems: "center", gap: "4px",
              fontSize: "11px", color: "#9ca3af",
            }}
          >
            <Calendar size={10} />
            {news.published_at ? formatDate(news.published_at) : "—"}
          </span>
        </div>
      </Link>
    </motion.article>
  );
}

// ── Empty state ───────────────────────────────────────────────
function EmptyBerita() {
  return (
    <div
      style={{
        gridColumn: "1 / -1",
        textAlign: "center",
        padding: "60px 20px",
        color: "#9ca3af",
      }}
    >
      <div style={{ fontSize: "48px", marginBottom: "16px" }}>📰</div>
      <p style={{ fontSize: "15px", fontWeight: 600, color: "#6b7280", marginBottom: "6px" }}>
        Belum ada berita
      </p>
      <p style={{ fontSize: "13px" }}>
        Admin belum mempublikasikan berita. Pantau terus!
      </p>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────
interface BeritaSectionProps {
  newsList: NewsItem[];
}

export default function BeritaSection({ newsList }: BeritaSectionProps) {
  const featured = newsList.slice(0, 3);    // 3 kartu besar
  const compact  = newsList.slice(3, 7);    // 4 kartu kecil di sidebar

  return (
    <section id="berita" style={{ background: "white" }}>
      <div className="section-inner">

        {/* ── Header ── */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            marginBottom: "44px",
            flexWrap: "wrap",
            gap: "16px",
          }}
        >
          <div>
            <div className="section-tag" style={{ marginBottom: "12px" }}>
              📰 Informasi Terkini
            </div>
            <h2 className="section-title">
              Berita <span>Desa Janti</span>
            </h2>
          </div>

          <Link
            href="/berita"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              padding: "10px 20px",
              borderRadius: "9999px",
              fontSize: "13px",
              fontWeight: 600,
              color: "#1a6b3c",
              border: "1.5px solid #1a6b3c",
              textDecoration: "none",
              transition: "all 0.2s ease",
              whiteSpace: "nowrap",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.background = "#1a6b3c";
              (e.currentTarget as HTMLElement).style.color = "white";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.background = "transparent";
              (e.currentTarget as HTMLElement).style.color = "#1a6b3c";
            }}
          >
            Semua Berita <ArrowRight size={14} />
          </Link>
        </div>

        {/* ── Content grid ── */}
        {newsList.length === 0 ? (
          <EmptyBerita />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
  
          {/* Featured cards — 8 cols on Desktop, 1 col on Mobile */}
          <div 
            className={`grid grid-cols-1 md:grid-cols-2 ${
              featured.length >= 3 ? "lg:grid-cols-3" : ""
            } gap-5 items-start ${
              compact.length > 0 ? "lg:col-span-8" : "lg:col-span-12"
            }`}
          >
            {featured.map((news) => (
              <FeaturedCard key={news.id} news={news} />
            ))}
          </div>

            {/* Compact sidebar — 4 cols */}
            {compact.length > 0 && (
              <div
                style={{
                  gridColumn: "9 / 13",
                  display: "flex",
                  flexDirection: "column",
                  gap: "12px",
                }}
              >
                <p
                  style={{
                    fontSize: "12px",
                    fontWeight: 700,
                    color: "#9ca3af",
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    marginBottom: "4px",
                  }}
                >
                  <Tag size={11} style={{ display: "inline", marginRight: "4px" }} />
                  Berita Lainnya
                </p>
                {compact.map((news, i) => (
                  <CompactCard key={news.id} news={news} delay={i * 0.07} />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}