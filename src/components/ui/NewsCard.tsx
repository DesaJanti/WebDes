"use client";

import Link from "next/link";
import { Calendar, Eye } from "lucide-react";
import { formatDate } from "@/lib/utils";
import type { NewsItem } from "@/types/database";

const CATEGORY_STYLES: Record<string, { bg: string; color: string }> = {
  Umum:        { bg: "#e8f5e9", color: "#1a6b3c" },
  Kegiatan:    { bg: "#fdf8ef", color: "#b45309" },
  Pengumuman:  { bg: "#fef2f2", color: "#991b1b" },
  Pembangunan: { bg: "#eff6ff", color: "#1e40af" },
};

export default function NewsCard({ news }: { news: NewsItem }) {
  const catStyle = CATEGORY_STYLES[news.category] ?? CATEGORY_STYLES["Umum"];

  return (
    <Link href={`/berita/${news.slug}`} style={{ textDecoration: "none" }}>
      <article
        style={{
          borderRadius: "20px", overflow: "hidden",
          background: "white", border: "1px solid #e8f5e9",
          boxShadow: "0 2px 12px rgba(26,107,60,0.06)",
          height: "100%", display: "flex", flexDirection: "column",
          transition: "all 0.3s ease",
        }}
        onMouseEnter={(e: React.MouseEvent<HTMLElement>) => {
          e.currentTarget.style.transform = "translateY(-4px)";
          e.currentTarget.style.boxShadow = "0 16px 48px rgba(26,107,60,0.14)";
        }}
        onMouseLeave={(e: React.MouseEvent<HTMLElement>) => {
          e.currentTarget.style.transform = "translateY(0)";
          e.currentTarget.style.boxShadow = "0 2px 12px rgba(26,107,60,0.06)";
        }}
      >
        {/* Cover */}
        <div style={{
          height: "180px", flexShrink: 0, position: "relative",
          background: news.cover_url
            ? `url(${news.cover_url}) center/cover no-repeat`
            : "linear-gradient(135deg,#1a6b3c,#2d9158,#f0c050)",
        }}>
          <div style={{ position: "absolute", top: "12px", left: "12px" }}>
            <span style={{
              padding: "3px 10px", borderRadius: "9999px",
              fontSize: "11px", fontWeight: 600,
              backgroundColor: catStyle.bg, color: catStyle.color,
            }}>
              {news.category}
            </span>
          </div>
        </div>

        {/* Body */}
        <div style={{ padding: "20px", flex: 1, display: "flex", flexDirection: "column" }}>
          <h3 style={{
            fontFamily: "var(--font-playfair)",
            fontSize: "1rem", fontWeight: 700,
            color: "#111827", lineHeight: 1.4,
            marginBottom: "10px", flex: 1,
            display: "-webkit-box",
            WebkitLineClamp: 3,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}>
            {news.title}
          </h3>

          {news.excerpt && (
            <p style={{
              fontSize: "12px", color: "#6b7280", lineHeight: 1.7,
              marginBottom: "14px",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}>
              {news.excerpt}
            </p>
          )}

          <div style={{
            display: "flex", alignItems: "center",
            justifyContent: "space-between",
            paddingTop: "12px",
            borderTop: "1px solid #f3f4f6",
            marginTop: "auto",
          }}>
            <div style={{ display: "flex", gap: "12px" }}>
              <span style={{
                display: "flex", alignItems: "center", gap: "4px",
                fontSize: "11px", color: "#9ca3af",
              }}>
                <Calendar size={11} />
                {news.published_at ? formatDate(news.published_at) : "—"}
              </span>
              <span style={{
                display: "flex", alignItems: "center", gap: "4px",
                fontSize: "11px", color: "#9ca3af",
              }}>
                <Eye size={11} />
                {news.views.toLocaleString("id-ID")}
              </span>
            </div>
            <span style={{ fontSize: "12px", fontWeight: 600, color: "#1a6b3c" }}>
              Baca →
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}