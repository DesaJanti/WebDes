"use client";

import { useState, useTransition } from "react";
import { Trash2, Plus, Loader2, Save } from "lucide-react";
import {
  updateKades, updateVisiMisi,
  createProgram, deleteProgram,
  createOfficial, deleteOfficial,
  type ActionState,
} from "@/lib/actions/profil";
import type { KadesProfile, PriorityProgram, VillageOfficial } from "@/types/database";

const INITIAL: ActionState = { success: false, message: "" };

// ── Reusable components ───────────────────────────────────────
function SectionCard({ title, icon, children }: {
  title: string; icon: string; children: React.ReactNode;
}) {
  return (
    <div style={{
      background: "white", borderRadius: "20px",
      border: "1px solid #e8f5e9",
      boxShadow: "0 2px 12px rgba(26,107,60,0.05)",
      overflow: "hidden", marginBottom: "20px",
    }}>
      <div style={{
        padding: "18px 24px", borderBottom: "1px solid #f0f0f0",
        display: "flex", alignItems: "center", gap: "10px",
      }}>
        <span style={{ fontSize: "18px" }}>{icon}</span>
        <h2 style={{ fontSize: "15px", fontWeight: 700, color: "#111827" }}>
          {title}
        </h2>
      </div>
      <div style={{ padding: "24px" }}>{children}</div>
    </div>
  );
}

function FieldRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: "16px" }}>
      <label style={{
        display: "block", fontSize: "12px", fontWeight: 700,
        color: "#374151", marginBottom: "6px",
        textTransform: "uppercase", letterSpacing: "0.05em",
      }}>
        {label}
      </label>
      {children}
    </div>
  );
}

function Input({ name, value, onChange, placeholder, type = "text" }: {
  name: string; value: string; onChange: (v: string) => void;
  placeholder?: string; type?: string;
}) {
  const [focus, setFocus] = useState(false);
  return (
    <input
      name={name} type={type} value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      style={{
        width: "100%", padding: "10px 13px", borderRadius: "10px",
        border: `1.5px solid ${focus ? "#1a6b3c" : "#e5e7eb"}`,
        fontSize: "14px", color: "#111827", outline: "none",
        transition: "border-color 0.2s", boxSizing: "border-box",
        background: "white",
      }}
      onFocus={() => setFocus(true)}
      onBlur={() => setFocus(false)}
    />
  );
}

function Textarea({ name, value, onChange, placeholder, rows = 4 }: {
  name: string; value: string; onChange: (v: string) => void;
  placeholder?: string; rows?: number;
}) {
  const [focus, setFocus] = useState(false);
  return (
    <textarea
      name={name} value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder} rows={rows}
      style={{
        width: "100%", padding: "10px 13px", borderRadius: "10px",
        border: `1.5px solid ${focus ? "#1a6b3c" : "#e5e7eb"}`,
        fontSize: "14px", color: "#111827", outline: "none",
        transition: "border-color 0.2s", boxSizing: "border-box",
        resize: "vertical", lineHeight: 1.7, background: "white",
      }}
      onFocus={() => setFocus(true)}
      onBlur={() => setFocus(false)}
    />
  );
}

function SaveBtn({ loading, label = "Simpan Perubahan" }: {
  loading: boolean; label?: string;
}) {
  return (
    <button
      type="submit" disabled={loading}
      style={{
        display: "inline-flex", alignItems: "center", gap: "8px",
        padding: "11px 22px", borderRadius: "12px", border: "none",
        background: loading
          ? "#9ca3af"
          : "linear-gradient(135deg, #1a6b3c, #2d9158)",
        color: "white", fontWeight: 700, fontSize: "13px",
        cursor: loading ? "not-allowed" : "pointer",
        boxShadow: loading ? "none" : "0 4px 14px rgba(26,107,60,0.25)",
        marginTop: "8px",
      }}
    >
      {loading
        ? <><Loader2 size={14} style={{ animation: "spin 1s linear infinite" }} /> Menyimpan...</>
        : <><Save size={14} /> {label}</>
      }
    </button>
  );
}

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

// ── Main component ────────────────────────────────────────────
interface Props {
  kades: KadesProfile | null;
  visi: string;
  misiText: string;
  programs: PriorityProgram[];
  officials: VillageOfficial[];
}

export default function ProfilAdminClient({
  kades, visi: initVisi, misiText: initMisi,
  programs: initPrograms, officials: initOfficials,
}: Props) {
  const [isPending, startTransition] = useTransition();
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null);

  // Kades state
  const [kadesName,    setKadesName]    = useState(kades?.full_name      ?? "");
  const [kadesTitle,   setKadesTitle]   = useState(kades?.title          ?? "");
  const [kadesPeriod,  setKadesPeriod]  = useState(kades?.period         ?? "");
  const [kadesPhoto,   setKadesPhoto]   = useState(kades?.photo_url      ?? "");
  const [kadesSpeech,  setKadesSpeech]  = useState(kades?.welcome_speech ?? "");

  // Visi misi state
  const [visi, setVisi] = useState(initVisi);
  const [misi, setMisi] = useState(initMisi);

  // Programs state
  const [programs, setPrograms]           = useState<PriorityProgram[]>(initPrograms);
  const [newProgramTitle, setNewProgramTitle] = useState("");
  const [newProgramDesc,  setNewProgramDesc]  = useState("");
  const [newProgramIcon,  setNewProgramIcon]  = useState("🏛️");

  // Officials state
  const [officials, setOfficials]           = useState<VillageOfficial[]>(initOfficials);
  const [newOfficialName, setNewOfficialName] = useState("");
  const [newOfficialPos,  setNewOfficialPos]  = useState("");
  const [newOfficialPhoto,setNewOfficialPhoto]= useState("");

  function showToast(msg: string, ok: boolean) {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 3200);
  }

  // ── Submit kades
  function handleKadesSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    startTransition(async () => {
      const res = await updateKades(INITIAL, fd);
      showToast(res.message, res.success);
    });
  }

  // ── Submit visi misi
  function handleVisiMisiSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    startTransition(async () => {
      const res = await updateVisiMisi(INITIAL, fd);
      showToast(res.message, res.success);
    });
  }

  // ── Add program
  function handleAddProgram(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    startTransition(async () => {
      const res = await createProgram(INITIAL, fd);
      showToast(res.message, res.success);
      if (res.success) {
        setPrograms((prev) => [
          ...prev,
          {
            id: Date.now().toString(),
            title: newProgramTitle,
            description: newProgramDesc || null,
            icon: newProgramIcon,
            sort_order: prev.length + 1,
            is_active: true,
          } as PriorityProgram,
        ]);
        setNewProgramTitle("");
        setNewProgramDesc("");
        setNewProgramIcon("🏛️");
      }
    });
  }

  // ── Delete program
  function handleDeleteProgram(id: string) {
    startTransition(async () => {
      const res = await deleteProgram(id);
      showToast(res.message, res.success);
      if (res.success) setPrograms((prev) => prev.filter((p) => p.id !== id));
    });
  }

  // ── Add official
  function handleAddOfficial(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    startTransition(async () => {
      const res = await createOfficial(INITIAL, fd);
      showToast(res.message, res.success);
      if (res.success) {
        setOfficials((prev) => [
          ...prev,
          {
            id: Date.now().toString(),
            full_name: newOfficialName,
            position: newOfficialPos,
            photo_url: newOfficialPhoto || null,
            sort_order: prev.length + 1,
            is_active: true,
          } as VillageOfficial,
        ]);
        setNewOfficialName("");
        setNewOfficialPos("");
        setNewOfficialPhoto("");
      }
    });
  }

  // ── Delete official
  function handleDeleteOfficial(id: string) {
    startTransition(async () => {
      const res = await deleteOfficial(id);
      showToast(res.message, res.success);
      if (res.success) setOfficials((prev) => prev.filter((o) => o.id !== id));
    });
  }

  return (
    <>
      {/* ── 1. Profil Kepala Desa ── */}
      <SectionCard title="Profil Kepala Desa" icon="👤">
        <form onSubmit={handleKadesSubmit}>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: "16px",
          }}>
            <FieldRow label="Nama Lengkap">
              <Input name="full_name" value={kadesName} onChange={setKadesName} placeholder="H. Suharto, S.IP" />
            </FieldRow>
            <FieldRow label="Gelar / Title">
              <Input name="title" value={kadesTitle} onChange={setKadesTitle} placeholder="S.IP" />
            </FieldRow>
            <FieldRow label="Periode Jabatan">
              <Input name="period" value={kadesPeriod} onChange={setKadesPeriod} placeholder="2021–2027" />
            </FieldRow>
            <FieldRow label="URL Foto">
              <Input name="photo_url" value={kadesPhoto} onChange={setKadesPhoto} placeholder="https://..." />
            </FieldRow>
          </div>

          {kadesPhoto && (
            <div style={{ marginBottom: "16px" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={kadesPhoto} alt="preview"
                style={{
                  width: "80px", height: "80px",
                  borderRadius: "50%", objectFit: "cover",
                  border: "3px solid #e8f5e9",
                }}
                onError={(e) => ((e.target as HTMLImageElement).style.display = "none")}
              />
            </div>
          )}

          <FieldRow label="Sambutan / Pesan">
            <Textarea
              name="welcome_speech" value={kadesSpeech} onChange={setKadesSpeech}
              placeholder="Assalamu'alaikum..." rows={5}
            />
          </FieldRow>

          <SaveBtn loading={isPending} />
        </form>
      </SectionCard>

      {/* ── 2. Visi & Misi ── */}
      <SectionCard title="Visi & Misi Desa" icon="🎯">
        <form onSubmit={handleVisiMisiSubmit}>
          <FieldRow label="Visi">
            <Textarea
              name="visi" value={visi} onChange={setVisi}
              placeholder="Terwujudnya Desa Janti yang..." rows={3}
            />
          </FieldRow>
          <FieldRow label="Misi (satu poin per baris)">
            <Textarea
              name="misi" value={misi} onChange={setMisi}
              placeholder={"Meningkatkan kualitas pelayanan...\nMengembangkan potensi ekonomi..."}
              rows={7}
            />
            <p style={{ fontSize: "11px", color: "#9ca3af", marginTop: "5px" }}>
              Pisahkan setiap poin misi dengan Enter (baris baru)
            </p>
          </FieldRow>
          <SaveBtn loading={isPending} />
        </form>
      </SectionCard>

      {/* ── 3. Program Prioritas ── */}
      <SectionCard title="Program Prioritas" icon="🏛️">
        {/* Existing list */}
        {programs.length > 0 && (
          <div style={{ marginBottom: "20px", display: "flex", flexDirection: "column", gap: "8px" }}>
            {programs.map((p) => (
              <div key={p.id} style={{
                display: "flex", alignItems: "center",
                justifyContent: "space-between",
                padding: "12px 16px", borderRadius: "12px",
                background: "#f8faf8", border: "1px solid #e8f5e9",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <span style={{ fontSize: "18px" }}>{p.icon}</span>
                  <div>
                    <p style={{ fontSize: "13px", fontWeight: 600, color: "#111827" }}>
                      {p.title}
                    </p>
                    {p.description && (
                      <p style={{ fontSize: "11px", color: "#9ca3af" }}>{p.description}</p>
                    )}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleDeleteProgram(p.id)}
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
            ))}
          </div>
        )}

        {/* Add form */}
        <form onSubmit={handleAddProgram} style={{
          padding: "16px", borderRadius: "14px",
          background: "#f0fdf4", border: "1.5px dashed #86efac",
        }}>
          <p style={{ fontSize: "12px", fontWeight: 700, color: "#1a6b3c", marginBottom: "12px" }}>
            + Tambah Program Baru
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "60px 1fr", gap: "10px", marginBottom: "10px" }}>
            <Input name="icon" value={newProgramIcon} onChange={setNewProgramIcon} placeholder="🏛️" />
            <Input name="title" value={newProgramTitle} onChange={setNewProgramTitle} placeholder="Nama program..." />
          </div>
          <div style={{ marginBottom: "12px" }}>
            <Input name="description" value={newProgramDesc} onChange={setNewProgramDesc} placeholder="Deskripsi singkat (opsional)" />
          </div>
          <button
            type="submit" disabled={isPending || !newProgramTitle}
            style={{
              display: "inline-flex", alignItems: "center", gap: "6px",
              padding: "9px 18px", borderRadius: "10px", border: "none",
              background: isPending || !newProgramTitle ? "#9ca3af" : "#1a6b3c",
              color: "white", fontWeight: 600, fontSize: "13px",
              cursor: isPending || !newProgramTitle ? "not-allowed" : "pointer",
            }}
          >
            <Plus size={13} /> Tambah Program
          </button>
        </form>
      </SectionCard>

      {/* ── 4. Perangkat Desa ── */}
      <SectionCard title="Perangkat Desa" icon="👥">
        {/* Existing list */}
        {officials.length > 0 && (
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
            gap: "10px",
            marginBottom: "20px",
          }}>
            {officials.map((o) => (
              <div key={o.id} style={{
                padding: "12px 14px", borderRadius: "12px",
                background: "#f8faf8", border: "1px solid #e8f5e9",
                display: "flex", alignItems: "center",
                justifyContent: "space-between", gap: "8px",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", minWidth: 0 }}>
                  <div style={{
                    width: "36px", height: "36px", borderRadius: "50%",
                    background: "#1a6b3c", flexShrink: 0,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    overflow: "hidden",
                  }}>
                    {o.photo_url
                      // eslint-disable-next-line @next/next/no-img-element
                      ? <img src={o.photo_url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      : <span style={{ color: "white", fontSize: "12px", fontWeight: 700 }}>
                          {o.full_name[0]}
                        </span>
                    }
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <p style={{
                      fontSize: "12px", fontWeight: 600, color: "#111827",
                      overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                    }}>
                      {o.full_name}
                    </p>
                    <p style={{ fontSize: "11px", color: "#6b7280" }}>{o.position}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleDeleteOfficial(o.id)}
                  disabled={isPending}
                  style={{
                    width: "28px", height: "28px", borderRadius: "7px",
                    background: "#fef2f2", border: "1px solid #fecaca",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    cursor: "pointer", color: "#ef4444", flexShrink: 0,
                  }}
                >
                  <Trash2 size={11} />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Add form */}
        <form onSubmit={handleAddOfficial} style={{
          padding: "16px", borderRadius: "14px",
          background: "#f0fdf4", border: "1.5px dashed #86efac",
        }}>
          <p style={{ fontSize: "12px", fontWeight: 700, color: "#1a6b3c", marginBottom: "12px" }}>
            + Tambah Perangkat Desa
          </p>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: "10px", marginBottom: "10px",
          }}>
            <Input name="full_name" value={newOfficialName} onChange={setNewOfficialName} placeholder="Nama lengkap" />
            <Input name="position"  value={newOfficialPos}  onChange={setNewOfficialPos}  placeholder="Jabatan" />
            <Input name="photo_url" value={newOfficialPhoto}onChange={setNewOfficialPhoto}placeholder="URL foto (opsional)" />
          </div>
          <button
            type="submit" disabled={isPending || !newOfficialName || !newOfficialPos}
            style={{
              display: "inline-flex", alignItems: "center", gap: "6px",
              padding: "9px 18px", borderRadius: "10px", border: "none",
              background: isPending || !newOfficialName || !newOfficialPos ? "#9ca3af" : "#1a6b3c",
              color: "white", fontWeight: 600, fontSize: "13px",
              cursor: isPending || !newOfficialName || !newOfficialPos ? "not-allowed" : "pointer",
            }}
          >
            <Plus size={13} /> Tambah Perangkat
          </button>
        </form>
      </SectionCard>

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