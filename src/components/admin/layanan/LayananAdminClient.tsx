"use client";

import { useState, useTransition } from "react";
import { Pencil, Trash2, Plus, Check, X, Loader2, Save } from "lucide-react";
import {
  createLayanan, updateLayanan,
  deleteLayanan, toggleLayanan,
} from "@/lib/actions/layanan";
import type { VillageService } from "@/types/database";

const INITIAL = { success: false, message: "" };

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

function ServiceForm({
  initial, onSave, onCancel, loading,
}: {
  initial?: Partial<VillageService>;
  onSave: (fd: FormData) => void;
  onCancel: () => void;
  loading: boolean;
}) {
  const [title,        setTitle]        = useState(initial?.title        ?? "");
  const [description,  setDescription]  = useState(initial?.description  ?? "");
  const [requirements, setRequirements] = useState(initial?.requirements ?? "");
  const [icon,         setIcon]         = useState(initial?.icon         ?? "📋");
  const [focusField,   setFocusField]   = useState<string | null>(null);

  function inp(field: string): React.CSSProperties {
    return {
      width: "100%", padding: "9px 12px", borderRadius: "10px",
      border: `1.5px solid ${focusField === field ? "#1a6b3c" : "#e5e7eb"}`,
      fontSize: "13px", color: "#111827", outline: "none",
      boxSizing: "border-box", background: "white",
      transition: "border-color 0.2s",
    };
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    onSave(new FormData(e.currentTarget));
  }

  return (
    <form onSubmit={handleSubmit} style={{
      padding: "20px", borderRadius: "16px",
      background: "#f0fdf4", border: "1.5px dashed #86efac",
      marginBottom: "16px",
    }}>
      <div style={{
        display: "grid",
        gridTemplateColumns: "60px 1fr",
        gap: "10px", marginBottom: "10px",
      }}>
        <input
          name="icon" value={icon}
          onChange={(e) => setIcon(e.target.value)}
          style={{ ...inp("icon"), textAlign: "center", fontSize: "20px" }}
          onFocus={() => setFocusField("icon")}
          onBlur={() => setFocusField(null)}
        />
        <input
          name="title" value={title} required
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Judul layanan..."
          style={inp("title")}
          onFocus={() => setFocusField("title")}
          onBlur={() => setFocusField(null)}
        />
      </div>
      <div style={{ marginBottom: "10px" }}>
        <input
          name="description" value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Deskripsi singkat layanan..."
          style={inp("desc")}
          onFocus={() => setFocusField("desc")}
          onBlur={() => setFocusField(null)}
        />
      </div>
      <div style={{ marginBottom: "14px" }}>
        <textarea
          name="requirements" value={requirements}
          onChange={(e) => setRequirements(e.target.value)}
          placeholder={"KTP asli dan fotokopi\nKartu Keluarga\nSurat pengantar RT/RW"}
          rows={4}
          style={{
            ...inp("req"), resize: "vertical", lineHeight: 1.7,
            fontFamily: "inherit",
          } as React.CSSProperties}
          onFocus={() => setFocusField("req")}
          onBlur={() => setFocusField(null)}
        />
        <p style={{ fontSize: "11px", color: "#9ca3af", marginTop: "4px" }}>
          Pisahkan setiap persyaratan dengan Enter (baris baru)
        </p>
      </div>
      <div style={{ display: "flex", gap: "8px" }}>
        <button
          type="submit" disabled={loading || !title}
          style={{
            display: "inline-flex", alignItems: "center", gap: "6px",
            padding: "9px 18px", borderRadius: "10px", border: "none",
            background: loading || !title ? "#9ca3af" : "#1a6b3c",
            color: "white", fontWeight: 600, fontSize: "13px",
            cursor: loading || !title ? "not-allowed" : "pointer",
          }}
        >
          {loading
            ? <Loader2 size={13} style={{ animation: "spin 1s linear infinite" }} />
            : <Save size={13} />
          }
          {initial?.id ? "Update Layanan" : "Tambah Layanan"}
        </button>
        <button
          type="button" onClick={onCancel}
          style={{
            display: "inline-flex", alignItems: "center", gap: "6px",
            padding: "9px 16px", borderRadius: "10px",
            border: "1.5px solid #e5e7eb",
            background: "white", fontWeight: 600, fontSize: "13px",
            cursor: "pointer", color: "#374151",
          }}
        >
          <X size={13} /> Batal
        </button>
      </div>
    </form>
  );
}

export default function LayananAdminClient({ services: initServices }: {
  services: VillageService[];
}) {
  const [services, setServices]     = useState<VillageService[]>(initServices);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editId, setEditId]         = useState<string | null>(null);
  const [toast, setToast]           = useState<{ msg: string; ok: boolean } | null>(null);
  const [isPending, startTransition] = useTransition();

  function showToast(msg: string, ok: boolean) {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 3200);
  }

  // Create
  function handleCreate(fd: FormData) {
    startTransition(async () => {
      const res = await createLayanan(INITIAL, fd);
      showToast(res.message, res.success);
      if (res.success) {
        setServices((prev) => [
          ...prev,
          {
            id: Date.now().toString(),
            title: fd.get("title") as string,
            description: (fd.get("description") as string) || null,
            requirements: (fd.get("requirements") as string) || null,
            icon: (fd.get("icon") as string) || "📋",
            sort_order: prev.length + 1,
            is_active: true,
          } as VillageService,
        ]);
        setShowAddForm(false);
      }
    });
  }

  // Update
  function handleUpdate(id: string, fd: FormData) {
    startTransition(async () => {
      const res = await updateLayanan(id, INITIAL, fd);
      showToast(res.message, res.success);
      if (res.success) {
        setServices((prev) => prev.map((s) =>
          s.id === id ? {
            ...s,
            title:        fd.get("title")        as string,
            description:  (fd.get("description")  as string) || null,
            requirements: (fd.get("requirements") as string) || null,
            icon:         (fd.get("icon")         as string) || s.icon,
          } : s
        ));
        setEditId(null);
      }
    });
  }

  // Delete
  function handleDelete(id: string) {
    startTransition(async () => {
      const res = await deleteLayanan(id);
      showToast(res.message, res.success);
      if (res.success) setServices((prev) => prev.filter((s) => s.id !== id));
    });
  }

  // Toggle
  function handleToggle(id: string, current: boolean) {
    startTransition(async () => {
      const res = await toggleLayanan(id, current);
      showToast(res.message, res.success);
      if (res.success)
        setServices((prev) =>
          prev.map((s) => s.id === id ? { ...s, is_active: !current } : s)
        );
    });
  }

  return (
    <>
      {/* Add button */}
      {!showAddForm && (
        <button
          onClick={() => setShowAddForm(true)}
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
          <Plus size={15} /> Tambah Layanan Baru
        </button>
      )}

      {/* Add form */}
      {showAddForm && (
        <ServiceForm
          onSave={handleCreate}
          onCancel={() => setShowAddForm(false)}
          loading={isPending}
        />
      )}

      {/* Services list */}
      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {services.map((service) => (
          <div key={service.id}>
            {editId === service.id ? (
              <ServiceForm
                initial={service}
                onSave={(fd) => handleUpdate(service.id, fd)}
                onCancel={() => setEditId(null)}
                loading={isPending}
              />
            ) : (
              <div style={{
                background: "white", borderRadius: "16px",
                border: `1.5px solid ${service.is_active ? "#e8f5e9" : "#f3f4f6"}`,
                boxShadow: "0 2px 8px rgba(26,107,60,0.04)",
                padding: "16px 20px",
                opacity: service.is_active ? 1 : 0.6,
                display: "flex", alignItems: "flex-start",
                justifyContent: "space-between", gap: "16px",
              }}>
                <div style={{ display: "flex", gap: "14px", alignItems: "flex-start", flex: 1, minWidth: 0 }}>
                  <span style={{ fontSize: "22px", flexShrink: 0, marginTop: "2px" }}>
                    {service.icon}
                  </span>
                  <div style={{ minWidth: 0 }}>
                    <p style={{ fontSize: "14px", fontWeight: 700, color: "#111827", marginBottom: "3px" }}>
                      {service.title}
                    </p>
                    {service.description && (
                      <p style={{ fontSize: "12px", color: "#6b7280", marginBottom: "6px" }}>
                        {service.description}
                      </p>
                    )}
                    {service.requirements && (
                      <div style={{ display: "flex", gap: "4px", flexWrap: "wrap" }}>
                        {service.requirements
                          .split(/\n|;/)
                          .filter(Boolean)
                          .slice(0, 3)
                          .map((req, i) => (
                            <span key={i} style={{
                              padding: "2px 8px", borderRadius: "6px",
                              fontSize: "10px", fontWeight: 500,
                              background: "#f0fdf4", color: "#1a6b3c",
                              border: "1px solid #bbf7d0",
                            }}>
                              {req.trim()}
                            </span>
                          ))
                        }
                        {service.requirements.split(/\n|;/).filter(Boolean).length > 3 && (
                          <span style={{
                            padding: "2px 8px", borderRadius: "6px",
                            fontSize: "10px", background: "#f3f4f6", color: "#9ca3af",
                          }}>
                            +{service.requirements.split(/\n|;/).filter(Boolean).length - 3} lainnya
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div style={{ display: "flex", gap: "6px", flexShrink: 0 }}>
                  <button
                    onClick={() => handleToggle(service.id, service.is_active)}
                    disabled={isPending}
                    title={service.is_active ? "Nonaktifkan" : "Aktifkan"}
                    style={{
                      width: "32px", height: "32px", borderRadius: "8px",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      cursor: "pointer", border: "1.5px solid",
                      backgroundColor: service.is_active ? "#e8f5e9" : "#f3f4f6",
                      borderColor:     service.is_active ? "#86efac" : "#e5e7eb",
                      color:           service.is_active ? "#1a6b3c" : "#9ca3af",
                    }}
                  >
                    <Check size={13} />
                  </button>
                  <button
                    onClick={() => setEditId(service.id)}
                    title="Edit"
                    style={{
                      width: "32px", height: "32px", borderRadius: "8px",
                      background: "#f0fdf4", border: "1px solid #bbf7d0",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      cursor: "pointer", color: "#1a6b3c",
                    }}
                  >
                    <Pencil size={13} />
                  </button>
                  <button
                    onClick={() => handleDelete(service.id)}
                    disabled={isPending}
                    title="Hapus"
                    style={{
                      width: "32px", height: "32px", borderRadius: "8px",
                      background: "#fef2f2", border: "1px solid #fecaca",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      cursor: "pointer", color: "#ef4444",
                    }}
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {services.length === 0 && !showAddForm && (
        <div style={{
          textAlign: "center", padding: "60px 20px",
          background: "white", borderRadius: "20px",
          border: "1px solid #e8f5e9",
        }}>
          <div style={{ fontSize: "48px", marginBottom: "14px" }}>🏛️</div>
          <p style={{ fontSize: "15px", fontWeight: 600, color: "#374151" }}>
            Belum ada layanan
          </p>
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