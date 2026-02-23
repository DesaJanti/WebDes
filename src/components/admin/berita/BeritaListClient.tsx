"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { formatDate } from "@/lib/utils";
import { togglePublishBerita, deleteBerita } from "@/lib/actions/berita";
import { Eye, EyeOff, Pencil, Trash2, ExternalLink, Loader2 } from "lucide-react";
import type { NewsItem } from "@/types/database";

const CATEGORY_STYLES: Record<string, { bg: string; color: string }> = {
  Umum:        { bg: "#e8f5e9", color: "#1a6b3c" },
  Kegiatan:    { bg: "#fdf8ef", color: "#b45309" },
  Pengumuman:  { bg: "#fef2f2", color: "#991b1b" },
  Pembangunan: { bg: "#eff6ff", color: "#1e40af" },
};

type FilterType = "Semua" | "Dipublikasikan" | "Draft";

// ── Confirm delete dialog ─────────────────────────────────────
function ConfirmDialog({
  title, message, onConfirm, onCancel, loading,
}: {
  title: string; message: string;
  onConfirm: () => void; onCancel: () => void; loading: boolean;
}) {
  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 9999,
      backgroundColor: "rgba(0,0,0,0.45)",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: "20px",
    }}>
      <div style={{
        background: "white", borderRadius: "20px",
        padding: "32px", maxWidth: "400px", width: "100%",
        boxShadow: "0 24px 60px rgba(0,0,0,0.2)",
      }}>
        <div style={{
          width: "48px", height: "48px", borderRadius: "14px",
          background: "#fef2f2", display: "flex",
          alignItems: "center", justifyContent: "center",
          marginBottom: "16px", fontSize: "22px",
        }}>
          🗑️
        </div>
        <h3 style={{ fontSize: "16px", fontWeight: 700, color: "#111827", marginBottom: "8px" }}>
          {title}
        </h3>
        <p style={{ fontSize: "13px", color: "#6b7280", lineHeight: 1.7, marginBottom: "24px" }}>
          {message}
        </p>
        <div style={{ display: "flex", gap: "10px" }}>
          <button
            onClick={onCancel}
            style={{
              flex: 1, padding: "10px",
              borderRadius: "10px", border: "1.5px solid #e5e7eb",
              background: "white", fontSize: "13px", fontWeight: 600,
              color: "#374151", cursor: "pointer",
            }}
          >
            Batal
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            style={{
              flex: 1, padding: "10px",
              borderRadius: "10px", border: "none",
              background: "#ef4444", fontSize: "13px", fontWeight: 600,
              color: "white", cursor: loading ? "not-allowed" : "pointer",
              display: "flex", alignItems: "center",
              justifyContent: "center", gap: "6px",
            }}
          >
            {loading
              ? <><Loader2 size={14} style={{ animation: "spin 1s linear infinite" }} /> Menghapus...</>
              : "Ya, Hapus"
            }
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────
export default function BeritaListClient({ newsList }: { newsList: NewsItem[] }) {
  const [items, setItems]       = useState<NewsItem[]>(newsList);
  const [filter, setFilter]     = useState<FilterType>("Semua");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [toast, setToast]       = useState<{ msg: string; ok: boolean } | null>(null);
  const [isPending, startTransition] = useTransition();

  // Computed filtered list
  const filtered = items.filter((n) => {
    if (filter === "Dipublikasikan") return n.is_published;
    if (filter === "Draft")          return !n.is_published;
    return true;
  });

  function showToast(msg: string, ok: boolean) {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 3000);
  }

  // Toggle publish
  function handleToggle(id: string, current: boolean) {
    startTransition(async () => {
      const res = await togglePublishBerita(id, current);
      if (res.success) {
        setItems((prev) =>
          prev.map((n) => n.id === id ? { ...n, is_published: !current } : n)
        );
      }
      showToast(res.message, res.success);
    });
  }

  // Delete
  function handleDelete(id: string) {
    startTransition(async () => {
      const res = await deleteBerita(id);
      if (res.success) setItems((prev) => prev.filter((n) => n.id !== id));
      setDeleteId(null);
      showToast(res.message, res.success);
    });
  }

  // ── Empty state ───────────────────────────────────────────
  if (items.length === 0) {
    return (
      <div style={{
        textAlign: "center", padding: "80px 20px",
        background: "white", borderRadius: "20px",
        border: "1px solid #e8f5e9",
      }}>
        <div style={{ fontSize: "52px", marginBottom: "16px" }}>📰</div>
        <p style={{ fontSize: "15px", fontWeight: 600, color: "#374151", marginBottom: "6px" }}>
          Belum ada berita
        </p>
        <p style={{ fontSize: "13px", color: "#9ca3af", marginBottom: "20px" }}>
          Mulai tulis berita pertama untuk warga Desa Janti.
        </p>
        <Link
          href="/admin/berita/baru"
          style={{
            display: "inline-flex", padding: "10px 24px",
            borderRadius: "10px",
            background: "linear-gradient(135deg,#1a6b3c,#2d9158)",
            color: "white", fontWeight: 600,
            fontSize: "13px", textDecoration: "none",
          }}
        >
          + Buat Berita Pertama
        </Link>
      </div>
    );
  }

  return (
    <>
      {/* ── Filter tabs + Tombol Tambah ── */}
      <div style={{
        display: "flex", alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap", gap: "12px",
        marginBottom: "16px",
      }}>
        {/* Tabs */}
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
          {(["Semua", "Dipublikasikan", "Draft"] as FilterType[]).map((f) => {
            const count =
              f === "Semua"           ? items.length
              : f === "Dipublikasikan" ? items.filter((n) => n.is_published).length
              :                         items.filter((n) => !n.is_published).length;
            return (
              <button
                key={f}
                onClick={() => setFilter(f)}
                style={{
                  display: "inline-flex", alignItems: "center", gap: "6px",
                  padding: "7px 14px", borderRadius: "9999px",
                  fontSize: "12px", fontWeight: 600,
                  cursor: "pointer", border: "1.5px solid",
                  transition: "all 0.2s",
                  background:  filter === f ? "#1a6b3c" : "white",
                  borderColor: filter === f ? "#1a6b3c" : "#e5e7eb",
                  color:       filter === f ? "white"   : "#6b7280",
                }}
              >
                {f}
                <span style={{
                  padding: "1px 7px", borderRadius: "9999px",
                  fontSize: "10px", fontWeight: 700,
                  background: filter === f ? "rgba(255,255,255,0.25)" : "#f3f4f6",
                  color:      filter === f ? "white" : "#9ca3af",
                }}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Tombol tambah — selalu terlihat */}
        <Link
          href="/admin/berita/baru"
          style={{
            display: "inline-flex", alignItems: "center", gap: "8px",
            padding: "9px 18px", borderRadius: "11px",
            background: "linear-gradient(135deg, #1a6b3c, #2d9158)",
            color: "white", fontWeight: 700, fontSize: "13px",
            textDecoration: "none",
            boxShadow: "0 4px 14px rgba(26,107,60,0.25)",
            whiteSpace: "nowrap",
          }}
        >
          + Berita Baru
        </Link>
      </div>

      {/* ── Table ── */}
      <div style={{
        background: "white", borderRadius: "20px",
        border: "1px solid #e8f5e9",
        boxShadow: "0 2px 12px rgba(26,107,60,0.05)",
        overflow: "hidden",
      }}>
        {/* Table header */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr 120px 130px 110px 110px",
          padding: "12px 20px",
          background: "#f8faf8",
          borderBottom: "1px solid #f0f0f0",
        }}>
          {["Judul Berita", "Kategori", "Tanggal", "Status", "Aksi"].map((h) => (
            <span key={h} style={{
              fontSize: "11px", fontWeight: 700, color: "#9ca3af",
              textTransform: "uppercase", letterSpacing: "0.06em",
            }}>
              {h}
            </span>
          ))}
        </div>

        {/* Rows */}
        {filtered.length === 0 ? (
          <div style={{
            padding: "48px 20px", textAlign: "center",
            color: "#9ca3af", fontSize: "14px",
          }}>
            {filter === "Dipublikasikan"
              ? "Belum ada berita yang dipublikasikan."
              : "Tidak ada berita draft."}
          </div>
        ) : (
          filtered.map((news, i) => {
            const catStyle = CATEGORY_STYLES[news.category] ?? CATEGORY_STYLES["Umum"];
            return (
              <div
                key={news.id}
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 120px 130px 110px 110px",
                  padding: "16px 20px",
                  borderTop: i === 0 ? "none" : "1px solid #f3f4f6",
                  alignItems: "center",
                  transition: "background 0.15s",
                }}
                onMouseEnter={(e: React.MouseEvent<HTMLElement>) =>
                  (e.currentTarget.style.background = "#fafafa")
                }
                onMouseLeave={(e: React.MouseEvent<HTMLElement>) =>
                  (e.currentTarget.style.background = "white")
                }
              >
                {/* Title */}
                <div style={{ minWidth: 0, paddingRight: "16px" }}>
                  <p style={{
                    fontSize: "13px", fontWeight: 600, color: "#111827",
                    marginBottom: "3px",
                    overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                  }}>
                    {news.title}
                  </p>
                  <p style={{
                    fontSize: "11px", color: "#9ca3af",
                    overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                  }}>
                    /berita/{news.slug}
                  </p>
                </div>

                {/* Category */}
                <div>
                  <span style={{
                    padding: "3px 9px", borderRadius: "9999px",
                    fontSize: "11px", fontWeight: 600,
                    backgroundColor: catStyle.bg, color: catStyle.color,
                  }}>
                    {news.category}
                  </span>
                </div>

                {/* Date */}
                <p style={{ fontSize: "12px", color: "#6b7280" }}>
                  {news.published_at
                    ? formatDate(news.published_at)
                    : formatDate(news.created_at)}
                </p>

                {/* Status toggle */}
                <div>
                  <button
                    onClick={() => handleToggle(news.id, news.is_published)}
                    disabled={isPending}
                    style={{
                      display: "inline-flex", alignItems: "center", gap: "5px",
                      padding: "5px 10px", borderRadius: "8px",
                      border: "1.5px solid",
                      fontSize: "11px", fontWeight: 600,
                      cursor: isPending ? "not-allowed" : "pointer",
                      transition: "all 0.2s",
                      backgroundColor: news.is_published ? "#e8f5e9" : "#f9fafb",
                      borderColor:     news.is_published ? "#86efac" : "#e5e7eb",
                      color:           news.is_published ? "#1a6b3c" : "#6b7280",
                    }}
                  >
                    {news.is_published
                      ? <><Eye size={11} /> Publik</>
                      : <><EyeOff size={11} /> Draft</>
                    }
                  </button>
                </div>

                {/* Actions */}
                <div style={{ display: "flex", gap: "6px" }}>
                  {/* Edit */}
                  <Link
                    href={`/admin/berita/${news.id}`}
                    title="Edit"
                    style={{
                      width: "32px", height: "32px", borderRadius: "8px",
                      background: "#f0fdf4", border: "1px solid #bbf7d0",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      color: "#1a6b3c", textDecoration: "none",
                    }}
                  >
                    <Pencil size={13} />
                  </Link>

                  {/* Preview — buka di tab baru, works untuk draft & publik */}
                  <Link
                    href={`/berita/${news.slug}`}
                    target="_blank"
                    title="Preview"
                    style={{
                      width: "32px", height: "32px", borderRadius: "8px",
                      background: "#eff6ff", border: "1px solid #bfdbfe",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      color: "#1e40af", textDecoration: "none",
                    }}
                  >
                    <ExternalLink size={13} />
                  </Link>

                  {/* Delete */}
                  <button
                    onClick={() => setDeleteId(news.id)}
                    title="Hapus"
                    style={{
                      width: "32px", height: "32px", borderRadius: "8px",
                      background: "#fef2f2", border: "1px solid #fecaca",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      color: "#ef4444", cursor: "pointer",
                    } as React.CSSProperties}
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* ── Confirm delete dialog ── */}
      {deleteId && (
        <ConfirmDialog
          title="Hapus Berita?"
          message="Berita yang dihapus tidak dapat dikembalikan. Apakah kamu yakin ingin menghapus berita ini?"
          onConfirm={() => handleDelete(deleteId)}
          onCancel={() => setDeleteId(null)}
          loading={isPending}
        />
      )}

      {/* ── Toast ── */}
      {toast && (
        <div style={{
          position: "fixed", bottom: "28px", right: "28px",
          padding: "14px 20px", borderRadius: "14px",
          background: toast.ok ? "#1a6b3c" : "#ef4444",
          color: "white", fontSize: "13px", fontWeight: 600,
          boxShadow: "0 8px 32px rgba(0,0,0,0.18)",
          zIndex: 9999,
          display: "flex", alignItems: "center", gap: "8px",
          animation: "slideInRight 0.3s ease",
        }}>
          {toast.ok ? "✅" : "❌"} {toast.msg}
        </div>
      )}

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(20px); }
          to   { opacity: 1; transform: translateX(0); }
        }
      `}</style>
    </>
  );
}