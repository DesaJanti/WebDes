"use client";

import { useState, useTransition, useActionState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  createBerita, updateBerita,
  type BeritaFormState,
} from "@/lib/actions/berita";
import { ArrowLeft, Loader2, Eye, EyeOff, Save } from "lucide-react";
import type { NewsItem } from "@/types/database";

const CATEGORIES = ["Umum", "Kegiatan", "Pengumuman", "Pembangunan"];

const INITIAL_STATE: BeritaFormState = { success: false, message: "" };

// ── Simple rich text toolbar ──────────────────────────────────
function SimpleEditor({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  function wrap(tag: string) {
    const sel = window.getSelection()?.toString();
    if (sel) onChange(value.replace(sel, `<${tag}>${sel}</${tag}>`));
  }

  const tools = [
    { label: "B",  tag: "strong", style: { fontWeight: 800 } },
    { label: "I",  tag: "em",     style: { fontStyle: "italic" } },
    { label: "U",  tag: "u",      style: { textDecoration: "underline" } },
  ];

  function insertBlock(html: string) {
    onChange(value + html);
  }

  return (
    <div style={{
      border: "1.5px solid #e5e7eb", borderRadius: "14px",
      overflow: "hidden",
      transition: "border-color 0.2s",
    }}>
      {/* Toolbar */}
      <div style={{
        display: "flex", alignItems: "center", gap: "4px",
        padding: "8px 12px",
        background: "#f8faf8",
        borderBottom: "1px solid #e5e7eb",
        flexWrap: "wrap",
      }}>
        {tools.map((t) => (
          <button
            key={t.tag}
            type="button"
            onClick={() => wrap(t.tag)}
            style={{
              width: "30px", height: "30px", borderRadius: "7px",
              border: "1px solid #e5e7eb",
              background: "white", cursor: "pointer",
              fontSize: "13px", ...t.style,
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "#374151",
            }}
          >
            {t.label}
          </button>
        ))}
        <div style={{ width: "1px", height: "24px", background: "#e5e7eb", margin: "0 4px" }} />
        <button type="button" onClick={() => insertBlock("\n<h2></h2>\n")}
          style={{ padding: "4px 10px", borderRadius: "7px", border: "1px solid #e5e7eb",
            background: "white", cursor: "pointer", fontSize: "11px", color: "#374151", fontWeight: 700 }}>
          H2
        </button>
        <button type="button" onClick={() => insertBlock("\n<p></p>\n")}
          style={{ padding: "4px 10px", borderRadius: "7px", border: "1px solid #e5e7eb",
            background: "white", cursor: "pointer", fontSize: "11px", color: "#374151" }}>
          P
        </button>
        <button type="button" onClick={() => insertBlock("\n<ul>\n  <li></li>\n</ul>\n")}
          style={{ padding: "4px 10px", borderRadius: "7px", border: "1px solid #e5e7eb",
            background: "white", cursor: "pointer", fontSize: "11px", color: "#374151" }}>
          UL
        </button>
        <span style={{ fontSize: "11px", color: "#9ca3af", marginLeft: "auto" }}>
          HTML Editor
        </span>
      </div>

      {/* Textarea */}
      <textarea
        name="content"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="<p>Tulis konten berita di sini...</p>"
        required
        style={{
          width: "100%", minHeight: "360px",
          padding: "16px", border: "none",
          fontSize: "13px", fontFamily: "monospace",
          color: "#374151", lineHeight: 1.7,
          resize: "vertical", outline: "none",
          boxSizing: "border-box",
          background: "white",
        }}
      />

      {/* Preview toggle */}
      <div style={{
        padding: "8px 16px",
        borderTop: "1px solid #f0f0f0",
        background: "#fafafa",
      }}>
        <span style={{ fontSize: "11px", color: "#9ca3af" }}>
          💡 Tip: Konten mendukung HTML. Gunakan &lt;p&gt;, &lt;h2&gt;, &lt;ul&gt;, &lt;strong&gt;, &lt;em&gt;
        </span>
      </div>
    </div>
  );
}

// ── Field wrapper ─────────────────────────────────────────────
function Field({ label, required, hint, children }: {
  label: string; required?: boolean; hint?: string; children: React.ReactNode;
}) {
  return (
    <div style={{ marginBottom: "20px" }}>
      <label style={{
        display: "block", fontSize: "12px", fontWeight: 700,
        color: "#374151", marginBottom: "6px",
        textTransform: "uppercase", letterSpacing: "0.05em",
      }}>
        {label} {required && <span style={{ color: "#ef4444" }}>*</span>}
      </label>
      {children}
      {hint && (
        <p style={{ fontSize: "11px", color: "#9ca3af", marginTop: "5px" }}>
          {hint}
        </p>
      )}
    </div>
  );
}

function inputStyle(focus: boolean): React.CSSProperties {
  return {
    width: "100%", padding: "11px 14px",
    borderRadius: "12px",
    border: `1.5px solid ${focus ? "#1a6b3c" : "#e5e7eb"}`,
    fontSize: "14px", color: "#111827",
    outline: "none", transition: "border-color 0.2s",
    boxSizing: "border-box", background: "white",
  };
}

// ── Main form ─────────────────────────────────────────────────
export default function BeritaFormClient({ news }: { news: NewsItem | null }) {
  const router     = useRouter();
  const isNew      = !news;
  const [isPending, startTransition] = useTransition();

  const [title,      setTitle]      = useState(news?.title     ?? "");
  const [excerpt,    setExcerpt]    = useState(news?.excerpt   ?? "");
  const [content,    setContent]    = useState(news?.content   ?? "");
  const [category,   setCategory]   = useState(news?.category  ?? "Umum");
  const [coverUrl,   setCoverUrl]   = useState(news?.cover_url ?? "");
  const [published,  setPublished]  = useState(news?.is_published ?? false);
  const [preview,    setPreview]    = useState(false);
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null);

  const [focusField, setFocusField] = useState<string | null>(null);

  function showToast(msg: string, ok: boolean) {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 3500);
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    formData.set("is_published", String(published));

    startTransition(async () => {
      const res = isNew
        ? await createBerita(INITIAL_STATE, formData)
        : await updateBerita(news.id, INITIAL_STATE, formData);

      showToast(res.message, res.success);
      if (res.success) {
        setTimeout(() => router.push("/admin/berita"), 1200);
      }
    });
  }

  return (
    <div style={{ maxWidth: "900px" }}>

      {/* Back */}
      <Link
        href="/admin/berita"
        style={{
          display: "inline-flex", alignItems: "center", gap: "6px",
          fontSize: "13px", color: "#6b7280", textDecoration: "none",
          marginBottom: "20px",
        }}
      >
        <ArrowLeft size={13} /> Kembali ke Daftar Berita
      </Link>

      <form onSubmit={handleSubmit}>
        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr 300px",
          gap: "20px",
          alignItems: "start",
        }}>

          {/* ── Left column: main content ── */}
          <div>
            {/* Title */}
            <Field label="Judul Berita" required>
              <input
                name="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Masukkan judul berita..."
                required
                style={{
                  ...inputStyle(focusField === "title"),
                  fontSize: "16px", fontWeight: 600,
                  fontFamily: "var(--font-playfair)",
                }}
                onFocus={() => setFocusField("title")}
                onBlur={() => setFocusField(null)}
              />
            </Field>

            {/* Excerpt */}
            <Field
              label="Ringkasan"
              hint="Ditampilkan di halaman daftar berita. Maks 200 karakter."
            >
              <textarea
                name="excerpt"
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                placeholder="Tulis ringkasan singkat berita..."
                maxLength={200}
                rows={3}
                style={{
                  ...inputStyle(focusField === "excerpt"),
                  resize: "vertical",
                }}
                onFocus={() => setFocusField("excerpt")}
                onBlur={() => setFocusField(null)}
              />
              <p style={{ fontSize: "11px", color: "#9ca3af", marginTop: "4px", textAlign: "right" }}>
                {excerpt.length}/200
              </p>
            </Field>

            {/* Content */}
            <Field label="Konten Berita" required>
              <SimpleEditor value={content} onChange={setContent} />
            </Field>

            {/* Preview toggle */}
            {content && (
              <div style={{ marginBottom: "20px" }}>
                <button
                  type="button"
                  onClick={() => setPreview((v) => !v)}
                  style={{
                    display: "inline-flex", alignItems: "center", gap: "6px",
                    padding: "8px 16px", borderRadius: "10px",
                    border: "1.5px solid #e5e7eb",
                    background: "white", cursor: "pointer",
                    fontSize: "12px", fontWeight: 600, color: "#374151",
                  }}
                >
                  {preview ? <EyeOff size={13} /> : <Eye size={13} />}
                  {preview ? "Tutup Preview" : "Preview Konten"}
                </button>

                {preview && (
                  <div style={{
                    marginTop: "12px", padding: "20px 24px",
                    borderRadius: "14px", background: "white",
                    border: "1.5px solid #e5e7eb",
                    fontSize: "14px", lineHeight: 1.9, color: "#374151",
                  }}
                    dangerouslySetInnerHTML={{ __html: content }}
                  />
                )}
              </div>
            )}
          </div>

          {/* ── Right column: settings ── */}
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>

            {/* Publish panel */}
            <div style={{
              background: "white", borderRadius: "16px",
              border: "1px solid #e8f5e9",
              boxShadow: "0 2px 12px rgba(26,107,60,0.05)",
              overflow: "hidden",
            }}>
              <div style={{ padding: "16px 18px", borderBottom: "1px solid #f0f0f0" }}>
                <p style={{ fontSize: "13px", fontWeight: 700, color: "#111827" }}>
                  📤 Publikasi
                </p>
              </div>
              <div style={{ padding: "16px 18px" }}>
                {/* Status toggle */}
                <div style={{
                  display: "flex", alignItems: "center",
                  justifyContent: "space-between", marginBottom: "16px",
                }}>
                  <span style={{ fontSize: "13px", color: "#374151", fontWeight: 500 }}>
                    Status
                  </span>
                  <button
                    type="button"
                    onClick={() => setPublished((v) => !v)}
                    style={{
                      display: "flex", alignItems: "center", gap: "6px",
                      padding: "5px 12px", borderRadius: "8px",
                      border: "1.5px solid",
                      fontSize: "12px", fontWeight: 600,
                      cursor: "pointer", transition: "all 0.2s",
                      backgroundColor: published ? "#e8f5e9" : "#f9fafb",
                      borderColor:     published ? "#86efac" : "#e5e7eb",
                      color:           published ? "#1a6b3c" : "#6b7280",
                    }}
                  >
                    {published
                      ? <><Eye size={11} /> Publik</>
                      : <><EyeOff size={11} /> Draft</>
                    }
                  </button>
                </div>

                <p style={{ fontSize: "11px", color: "#9ca3af", marginBottom: "16px", lineHeight: 1.6 }}>
                  {published
                    ? "Berita akan langsung terlihat oleh semua pengunjung."
                    : "Berita disimpan sebagai draft, tidak tampil di website."}
                </p>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={isPending}
                  style={{
                    width: "100%", padding: "12px",
                    borderRadius: "12px", border: "none",
                    background: isPending
                      ? "#9ca3af"
                      : "linear-gradient(135deg, #1a6b3c, #2d9158)",
                    color: "white", fontWeight: 700,
                    fontSize: "14px",
                    cursor: isPending ? "not-allowed" : "pointer",
                    display: "flex", alignItems: "center",
                    justifyContent: "center", gap: "8px",
                    boxShadow: isPending ? "none" : "0 4px 14px rgba(26,107,60,0.28)",
                  }}
                >
                  {isPending
                    ? <><Loader2 size={15} style={{ animation: "spin 1s linear infinite" }} /> Menyimpan...</>
                    : <><Save size={15} /> {isNew ? "Simpan Berita" : "Update Berita"}</>
                  }
                </button>
              </div>
            </div>

            {/* Category */}
            <div style={{
              background: "white", borderRadius: "16px",
              border: "1px solid #e8f5e9",
              boxShadow: "0 2px 12px rgba(26,107,60,0.05)",
              overflow: "hidden",
            }}>
              <div style={{ padding: "16px 18px", borderBottom: "1px solid #f0f0f0" }}>
                <p style={{ fontSize: "13px", fontWeight: 700, color: "#111827" }}>
                  🏷️ Kategori
                </p>
              </div>
              <div style={{ padding: "12px" }}>
                <input type="hidden" name="category" value={category} />
                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setCategory(cat)}
                      style={{
                        padding: "9px 14px", borderRadius: "10px",
                        border: "1.5px solid",
                        fontSize: "13px", fontWeight: 500,
                        cursor: "pointer", textAlign: "left",
                        transition: "all 0.15s",
                        backgroundColor: category === cat ? "#1a6b3c" : "white",
                        borderColor:     category === cat ? "#1a6b3c" : "#e5e7eb",
                        color:           category === cat ? "white"   : "#374151",
                      }}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Cover URL */}
            <div style={{
              background: "white", borderRadius: "16px",
              border: "1px solid #e8f5e9",
              boxShadow: "0 2px 12px rgba(26,107,60,0.05)",
              overflow: "hidden",
            }}>
              <div style={{ padding: "16px 18px", borderBottom: "1px solid #f0f0f0" }}>
                <p style={{ fontSize: "13px", fontWeight: 700, color: "#111827" }}>
                  🖼️ Cover
                </p>
              </div>
              <div style={{ padding: "16px 18px" }}>
                <input
                  name="cover_url"
                  type="url"
                  value={coverUrl}
                  onChange={(e) => setCoverUrl(e.target.value)}
                  placeholder="https://..."
                  style={{
                    ...inputStyle(focusField === "cover"),
                    fontSize: "12px",
                  }}
                  onFocus={() => setFocusField("cover")}
                  onBlur={() => setFocusField(null)}
                />
                {coverUrl && (
                  <div style={{
                    marginTop: "10px", borderRadius: "10px",
                    overflow: "hidden", height: "120px",
                    background: "#f0f0f0",
                  }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={coverUrl}
                      alt="preview"
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = "none";
                      }}
                    />
                  </div>
                )}
                <p style={{ fontSize: "11px", color: "#9ca3af", marginTop: "6px" }}>
                  Masukkan URL gambar dari internet atau Supabase Storage
                </p>
              </div>
            </div>

          </div>
        </div>
      </form>

      {/* Toast */}
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
        @media (max-width: 768px) {
          form > div { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}