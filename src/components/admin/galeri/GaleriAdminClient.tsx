"use client";

import { useState, useTransition } from "react";
import { Plus, Trash2, Eye, EyeOff, Loader2 } from "lucide-react";
import {
  createGalleryItem, deleteGalleryItem, toggleGalleryItem,
} from "@/lib/actions/galeri";
import type { GalleryItem } from "@/types/database";

const INITIAL = { success: false, message: "" };

const CATEGORIES = [
  "Infrastruktur","Kegiatan","Pertanian",
  "Kesehatan","Pendidikan","Lainnya",
];

function Toast({ toast }: { toast: { msg: string; ok: boolean } | null }) {
  if (!toast) return null;
  return (
    <div style={{
      position: "fixed", bottom: "28px", right: "28px",
      padding: "14px 20px", borderRadius: "14px",
      background: toast.ok ? "#1a6b3c" : "#ef4444",
      color: "white", fontSize: "13px", fontWeight: 600,
      boxShadow: "0 8px 32px rgba(0,0,0,0.18)", zIndex: 9999,
      display: "flex", alignItems: "center", gap: "8px",
      animation: "slideIn 0.3s ease",
    }}>
      {toast.ok ? "✅" : "❌"} {toast.msg}
    </div>
  );
}

export default function GaleriAdminClient({ items: initItems }: {
  items: GalleryItem[];
}) {
  const [items, setItems] = useState<GalleryItem[]>(initItems);
  const [showForm, setShowForm] = useState(false);
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null);
  const [isPending, startTransition] = useTransition();

  // Add form state
  const [title,       setTitle]       = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl,    setImageUrl]    = useState("");
  const [category,    setCategory]    = useState("Kegiatan");
  const [focusField,  setFocusField]  = useState<string | null>(null);

  function showToast(msg: string, ok: boolean) {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 3200);
  }

  function inp(field: string): React.CSSProperties {
    return {
      width: "100%", padding: "9px 12px", borderRadius: "10px",
      border: `1.5px solid ${focusField === field ? "#1a6b3c" : "#e5e7eb"}`,
      fontSize: "13px", color: "#111827", outline: "none",
      boxSizing: "border-box", background: "white",
      transition: "border-color 0.2s",
    };
  }

  function handleAdd(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    startTransition(async () => {
      const res = await createGalleryItem(INITIAL, fd);
      showToast(res.message, res.success);
      if (res.success) {
        setItems((prev) => [...prev, {
          id: Date.now().toString(),
          title, description: description || null,
          image_url: imageUrl || null,
          category,
          sort_order: prev.length + 1,
          is_active: true,
          created_at: new Date().toISOString(),
        } as GalleryItem]);
        setTitle(""); setDescription(""); setImageUrl("");
        setCategory("Kegiatan"); setShowForm(false);
      }
    });
  }

  function handleDelete(id: string) {
    startTransition(async () => {
      const res = await deleteGalleryItem(id);
      showToast(res.message, res.success);
      if (res.success) setItems((prev) => prev.filter((i) => i.id !== id));
    });
  }

  function handleToggle(id: string, current: boolean) {
    startTransition(async () => {
      const res = await toggleGalleryItem(id, current);
      showToast(res.message, res.success);
      if (res.success)
        setItems((prev) =>
          prev.map((i) => i.id === id ? { ...i, is_active: !current } : i)
        );
    });
  }

  return (
    <>
      {/* Add button */}
      {!showForm && (
        <button
          onClick={() => setShowForm(true)}
          style={{
            display: "inline-flex", alignItems: "center", gap: "8px",
            padding: "11px 22px", borderRadius: "12px", border: "none",
            background: "linear-gradient(135deg, #1a6b3c, #2d9158)",
            color: "white", fontWeight: 700, fontSize: "13px",
            cursor: "pointer",
            boxShadow: "0 4px 16px rgba(26,107,60,0.25)",
            marginBottom: "20px",
          }}
        >
          <Plus size={15} /> Tambah Foto
        </button>
      )}

      {/* Add form */}
      {showForm && (
        <form onSubmit={handleAdd} style={{
          padding: "20px", borderRadius: "16px",
          background: "#f0fdf4", border: "1.5px dashed #86efac",
          marginBottom: "20px",
        }}>
          <p style={{ fontSize: "13px", fontWeight: 700, color: "#1a6b3c", marginBottom: "14px" }}>
            + Tambah Foto Baru
          </p>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "10px", marginBottom: "10px",
          }}>
            <div>
              <label style={{
                display: "block", fontSize: "11px", fontWeight: 700,
                color: "#6b7280", marginBottom: "5px",
                textTransform: "uppercase",
              }}>
                Judul *
              </label>
              <input
                name="title" value={title} required
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Nama / judul foto"
                style={inp("title")}
                onFocus={() => setFocusField("title")}
                onBlur={() => setFocusField(null)}
              />
            </div>
            <div>
              <label style={{
                display: "block", fontSize: "11px", fontWeight: 700,
                color: "#6b7280", marginBottom: "5px",
                textTransform: "uppercase",
              }}>
                Kategori
              </label>
              <select
                name="category" value={category}
                onChange={(e) => setCategory(e.target.value)}
                style={{
                  ...inp("cat"),
                  appearance: "auto",
                } as React.CSSProperties}
                onFocus={() => setFocusField("cat")}
                onBlur={() => setFocusField(null)}
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          <div style={{ marginBottom: "10px" }}>
            <label style={{
              display: "block", fontSize: "11px", fontWeight: 700,
              color: "#6b7280", marginBottom: "5px",
              textTransform: "uppercase",
            }}>
              URL Gambar
            </label>
            <input
              name="image_url" type="url" value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://..."
              style={inp("url")}
              onFocus={() => setFocusField("url")}
              onBlur={() => setFocusField(null)}
            />
          </div>

          {/* Preview */}
          {imageUrl && (
            <div style={{
              marginBottom: "12px", borderRadius: "12px",
              overflow: "hidden", height: "140px", background: "#e8f5e9",
            }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={imageUrl} alt="preview"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                onError={(e) => ((e.target as HTMLImageElement).style.display = "none")}
              />
            </div>
          )}

          <div style={{ marginBottom: "14px" }}>
            <label style={{
              display: "block", fontSize: "11px", fontWeight: 700,
              color: "#6b7280", marginBottom: "5px",
              textTransform: "uppercase",
            }}>
              Deskripsi
            </label>
            <input
              name="description" value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Deskripsi singkat foto (opsional)"
              style={inp("desc")}
              onFocus={() => setFocusField("desc")}
              onBlur={() => setFocusField(null)}
            />
          </div>

          <div style={{ display: "flex", gap: "8px" }}>
            <button
              type="submit" disabled={isPending || !title}
              style={{
                display: "inline-flex", alignItems: "center", gap: "6px",
                padding: "9px 18px", borderRadius: "10px", border: "none",
                background: isPending || !title ? "#9ca3af" : "#1a6b3c",
                color: "white", fontWeight: 600, fontSize: "13px",
                cursor: isPending || !title ? "not-allowed" : "pointer",
              }}
            >
              {isPending
                ? <Loader2 size={13} style={{ animation: "spin 1s linear infinite" }} />
                : <Plus size={13} />
              }
              Simpan Foto
            </button>
            <button
              type="button" onClick={() => setShowForm(false)}
              style={{
                padding: "9px 16px", borderRadius: "10px",
                border: "1.5px solid #e5e7eb",
                background: "white", fontWeight: 600,
                fontSize: "13px", cursor: "pointer", color: "#374151",
              }}
            >
              Batal
            </button>
          </div>
        </form>
      )}

      {/* Grid */}
      {items.length === 0 && !showForm ? (
        <div style={{
          textAlign: "center", padding: "60px 20px",
          background: "white", borderRadius: "20px",
          border: "1px solid #e8f5e9",
        }}>
          <div style={{ fontSize: "48px", marginBottom: "14px" }}>📸</div>
          <p style={{ fontSize: "15px", fontWeight: 600, color: "#374151" }}>
            Galeri masih kosong
          </p>
        </div>
      ) : (
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
          gap: "14px",
        }}>
          {items.map((item) => (
            <div key={item.id} style={{
              borderRadius: "16px", overflow: "hidden",
              background: "white", border: "1px solid #e8f5e9",
              boxShadow: "0 2px 8px rgba(26,107,60,0.04)",
              opacity: item.is_active ? 1 : 0.55,
              transition: "opacity 0.2s",
            }}>
              {/* Thumbnail */}
              <div style={{
                height: "160px",
                background: item.image_url
                  ? `url(${item.image_url}) center/cover no-repeat`
                  : "linear-gradient(135deg, #1a6b3c, #2d9158)",
                display: "flex", alignItems: "center",
                justifyContent: "center", position: "relative",
              }}>
                {!item.image_url && (
                  <span style={{ fontSize: "40px" }}>🌾</span>
                )}
                {/* Category badge */}
                {item.category && (
                  <div style={{
                    position: "absolute", top: "8px", left: "8px",
                    padding: "2px 8px", borderRadius: "9999px",
                    background: "rgba(0,0,0,0.5)",
                    color: "white", fontSize: "10px", fontWeight: 600,
                  }}>
                    {item.category}
                  </div>
                )}
              </div>

              {/* Info */}
              <div style={{ padding: "12px 14px" }}>
                <p style={{
                  fontSize: "13px", fontWeight: 600, color: "#111827",
                  marginBottom: "4px",
                  overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                }}>
                  {item.title}
                </p>
                {item.description && (
                  <p style={{
                    fontSize: "11px", color: "#9ca3af",
                    overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                  }}>
                    {item.description}
                  </p>
                )}

                {/* Actions */}
                <div style={{
                  display: "flex", gap: "6px", marginTop: "10px",
                  paddingTop: "10px", borderTop: "1px solid #f3f4f6",
                }}>
                  <button
                    onClick={() => handleToggle(item.id, item.is_active)}
                    disabled={isPending}
                    title={item.is_active ? "Sembunyikan" : "Tampilkan"}
                    style={{
                      flex: 1, height: "30px", borderRadius: "8px",
                      display: "flex", alignItems: "center",
                      justifyContent: "center", gap: "4px",
                      cursor: "pointer", border: "1.5px solid",
                      fontSize: "11px", fontWeight: 600,
                      backgroundColor: item.is_active ? "#e8f5e9" : "#f3f4f6",
                      borderColor:     item.is_active ? "#86efac" : "#e5e7eb",
                      color:           item.is_active ? "#1a6b3c" : "#9ca3af",
                    }}
                  >
                    {item.is_active
                      ? <><Eye size={11} /> Tampil</>
                      : <><EyeOff size={11} /> Tersembunyi</>
                    }
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    disabled={isPending}
                    style={{
                      width: "30px", height: "30px", borderRadius: "8px",
                      background: "#fef2f2", border: "1px solid #fecaca",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      cursor: "pointer", color: "#ef4444",
                    }}
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Toast toast={toast} />
      <style>{`
        @keyframes spin    { to { transform: rotate(360deg); } }
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(20px); }
          to   { opacity: 1; transform: translateX(0); }
        }
      `}</style>
    </>
  );
}