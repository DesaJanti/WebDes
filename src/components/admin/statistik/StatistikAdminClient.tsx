"use client";

import { useState, useTransition } from "react";
import { Plus, Trash2, Loader2, Save } from "lucide-react";
import { upsertStatistik } from "@/lib/actions/statistik";
import type {
  PopulationStats, AgeDistribution,
  OccupationDistribution, EducationDistribution,
} from "@/types/database";

const INITIAL_STATE = { success: false, message: "" };

const DEFAULT_AGE_GROUPS = [
  "0–4","5–14","15–24","25–34","35–44","45–54","55–64","65+",
];
const DEFAULT_OCC = [
  "Petani","Wiraswasta","PNS/TNI","Buruh","Pelajar","Lainnya",
];
const DEFAULT_EDU = [
  "Belum Sekolah","SD","SMP","SMA","D3/S1","S2+",
];

function NumberInput({ name, value, onChange, label, required }: {
  name: string; value: string; onChange: (v: string) => void;
  label: string; required?: boolean;
}) {
  const [focus, setFocus] = useState(false);
  return (
    <div>
      <label style={{
        display: "block", fontSize: "11px", fontWeight: 700,
        color: "#6b7280", marginBottom: "5px",
        textTransform: "uppercase", letterSpacing: "0.05em",
      }}>
        {label} {required && <span style={{ color: "#ef4444" }}>*</span>}
      </label>
      <input
        name={name} type="number" min={0} value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        style={{
          width: "100%", padding: "9px 12px", borderRadius: "10px",
          border: `1.5px solid ${focus ? "#1a6b3c" : "#e5e7eb"}`,
          fontSize: "14px", fontWeight: 600, color: "#111827",
          outline: "none", boxSizing: "border-box", background: "white",
        }}
        onFocus={() => setFocus(true)}
        onBlur={() => setFocus(false)}
      />
    </div>
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

interface Props {
  current: PopulationStats | null;
  history: PopulationStats[];
  ageData: AgeDistribution[];
  occData: OccupationDistribution[];
  eduData: EducationDistribution[];
}

export default function StatistikAdminClient({
  current, history, ageData, occData, eduData,
}: Props) {
  const [isPending, startTransition] = useTransition();
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null);

  // Main stats
  const [year,           setYear]           = useState(String(current?.year           ?? new Date().getFullYear()));
  const [totalPop,       setTotalPop]       = useState(String(current?.total_population ?? ""));
  const [totalMale,      setTotalMale]      = useState(String(current?.total_male       ?? ""));
  const [totalFemale,    setTotalFemale]    = useState(String(current?.total_female     ?? ""));
  const [totalFamilies,  setTotalFamilies]  = useState(String(current?.total_families   ?? ""));
  const [totalRW,        setTotalRW]        = useState(String(current?.total_rw         ?? ""));
  const [totalRT,        setTotalRT]        = useState(String(current?.total_rt         ?? ""));
  const [notes,          setNotes]          = useState(current?.notes ?? "");

  // Age distribution
  const [ageGroups, setAgeGroups] = useState<{ age_group: string; male_count: string; female_count: string }[]>(
    ageData.length > 0
      ? ageData.map((a) => ({
          age_group: a.age_group,
          male_count: String(a.male_count),
          female_count: String(a.female_count),
        }))
      : DEFAULT_AGE_GROUPS.map((g) => ({ age_group: g, male_count: "", female_count: "" }))
  );

  // Occupation
  const [occs, setOccs] = useState<{ occupation: string; count: string }[]>(
    occData.length > 0
      ? occData.map((o) => ({ occupation: o.occupation, count: String(o.count) }))
      : DEFAULT_OCC.map((o) => ({ occupation: o, count: "" }))
  );

  // Education
  const [edus, setEdus] = useState<{ level: string; count: string }[]>(
    eduData.length > 0
      ? eduData.map((e) => ({ level: e.level, count: String(e.count) }))
      : DEFAULT_EDU.map((l) => ({ level: l, count: "" }))
  );

  function showToast(msg: string, ok: boolean) {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 3200);
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);

    // Inject JSON distributions
    const ageJson = JSON.stringify(
      ageGroups
        .filter((g) => g.male_count || g.female_count)
        .map((g) => ({
          age_group: g.age_group,
          male_count: parseInt(g.male_count) || 0,
          female_count: parseInt(g.female_count) || 0,
        }))
    );
    const occJson = JSON.stringify(
      occs
        .filter((o) => o.count)
        .map((o) => ({ occupation: o.occupation, count: parseInt(o.count) || 0 }))
    );
    const eduJson = JSON.stringify(
      edus
        .filter((e) => e.count)
        .map((e) => ({ level: e.level, count: parseInt(e.count) || 0 }))
    );

    fd.set("age_groups",  ageJson);
    fd.set("occupations", occJson);
    fd.set("educations",  eduJson);

    startTransition(async () => {
      const res = await upsertStatistik(INITIAL_STATE, fd);
      showToast(res.message, res.success);
    });
  }

  const sectionBox: React.CSSProperties = {
    background: "white", borderRadius: "20px",
    border: "1px solid #e8f5e9",
    boxShadow: "0 2px 12px rgba(26,107,60,0.05)",
    overflow: "hidden", marginBottom: "20px",
  };
  const sectionHead: React.CSSProperties = {
    padding: "18px 24px", borderBottom: "1px solid #f0f0f0",
    display: "flex", alignItems: "center", gap: "10px",
  };

  return (
    <>
      <form onSubmit={handleSubmit}>

        {/* Main stats */}
        <div style={sectionBox}>
          <div style={sectionHead}>
            <span style={{ fontSize: "18px" }}>📊</span>
            <h2 style={{ fontSize: "15px", fontWeight: 700, color: "#111827" }}>
              Data Kependudukan Utama
            </h2>
          </div>
          <div style={{ padding: "24px" }}>
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
              gap: "14px", marginBottom: "14px",
            }}>
              <NumberInput name="year"             value={year}          onChange={setYear}          label="Tahun"              required />
              <NumberInput name="total_population" value={totalPop}      onChange={setTotalPop}      label="Total Penduduk"     required />
              <NumberInput name="total_male"       value={totalMale}     onChange={setTotalMale}     label="Laki-laki"          />
              <NumberInput name="total_female"     value={totalFemale}   onChange={setTotalFemale}   label="Perempuan"          />
              <NumberInput name="total_families"   value={totalFamilies} onChange={setTotalFamilies} label="Kepala Keluarga"    />
              <NumberInput name="total_rw"         value={totalRW}       onChange={setTotalRW}       label="Jumlah RW"          />
              <NumberInput name="total_rt"         value={totalRT}       onChange={setTotalRT}       label="Jumlah RT"          />
            </div>
            <div>
              <label style={{
                display: "block", fontSize: "11px", fontWeight: 700,
                color: "#6b7280", marginBottom: "5px",
                textTransform: "uppercase", letterSpacing: "0.05em",
              }}>
                Catatan
              </label>
              <textarea
                name="notes" value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={2} placeholder="Catatan tambahan (opsional)..."
                style={{
                  width: "100%", padding: "9px 12px", borderRadius: "10px",
                  border: "1.5px solid #e5e7eb", fontSize: "13px",
                  color: "#374151", outline: "none", resize: "vertical",
                  boxSizing: "border-box", background: "white",
                }}
              />
            </div>
          </div>
        </div>

        {/* Age distribution */}
        <div style={sectionBox}>
          <div style={sectionHead}>
            <span style={{ fontSize: "18px" }}>👶</span>
            <h2 style={{ fontSize: "15px", fontWeight: 700, color: "#111827" }}>
              Distribusi Usia
            </h2>
          </div>
          <div style={{ padding: "24px" }}>
            <div style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              gap: "8px", marginBottom: "8px",
            }}>
              {["Kelompok Usia","Laki-laki","Perempuan"].map((h) => (
                <p key={h} style={{
                  fontSize: "11px", fontWeight: 700, color: "#9ca3af",
                  textTransform: "uppercase", letterSpacing: "0.05em",
                }}>
                  {h}
                </p>
              ))}
            </div>
            {ageGroups.map((g, i) => (
              <div key={i} style={{
                display: "grid", gridTemplateColumns: "1fr 1fr 1fr",
                gap: "8px", marginBottom: "8px",
              }}>
                <div style={{
                  padding: "9px 12px", borderRadius: "10px",
                  background: "#f8faf8", border: "1px solid #e8f5e9",
                  fontSize: "13px", fontWeight: 600, color: "#374151",
                  display: "flex", alignItems: "center",
                }}>
                  {g.age_group}
                </div>
                <input
                  type="number" min={0} value={g.male_count}
                  onChange={(e) => setAgeGroups((prev) => prev.map((a, j) => j === i ? { ...a, male_count: e.target.value } : a))}
                  placeholder="0"
                  style={{
                    padding: "9px 12px", borderRadius: "10px",
                    border: "1.5px solid #e5e7eb", fontSize: "14px",
                    color: "#111827", outline: "none", boxSizing: "border-box",
                    width: "100%",
                  }}
                />
                <input
                  type="number" min={0} value={g.female_count}
                  onChange={(e) => setAgeGroups((prev) => prev.map((a, j) => j === i ? { ...a, female_count: e.target.value } : a))}
                  placeholder="0"
                  style={{
                    padding: "9px 12px", borderRadius: "10px",
                    border: "1.5px solid #e5e7eb", fontSize: "14px",
                    color: "#111827", outline: "none", boxSizing: "border-box",
                    width: "100%",
                  }}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Occupation + Education side by side */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: "20px", marginBottom: "20px",
        }}>
          {/* Occupation */}
          <div style={sectionBox}>
            <div style={sectionHead}>
              <span style={{ fontSize: "18px" }}>💼</span>
              <h2 style={{ fontSize: "15px", fontWeight: 700, color: "#111827" }}>
                Mata Pencaharian
              </h2>
            </div>
            <div style={{ padding: "20px" }}>
              {occs.map((o, i) => (
                <div key={i} style={{
                  display: "grid", gridTemplateColumns: "1fr 100px",
                  gap: "8px", marginBottom: "8px",
                }}>
                  <div style={{
                    padding: "8px 12px", borderRadius: "10px",
                    background: "#f8faf8", border: "1px solid #e8f5e9",
                    fontSize: "13px", color: "#374151",
                    display: "flex", alignItems: "center",
                  }}>
                    {o.occupation}
                  </div>
                  <input
                    type="number" min={0} value={o.count}
                    onChange={(e) => setOccs((prev) => prev.map((x, j) => j === i ? { ...x, count: e.target.value } : x))}
                    placeholder="0"
                    style={{
                      padding: "8px 12px", borderRadius: "10px",
                      border: "1.5px solid #e5e7eb", fontSize: "14px",
                      color: "#111827", outline: "none",
                      boxSizing: "border-box", width: "100%",
                    }}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Education */}
          <div style={sectionBox}>
            <div style={sectionHead}>
              <span style={{ fontSize: "18px" }}>🎓</span>
              <h2 style={{ fontSize: "15px", fontWeight: 700, color: "#111827" }}>
                Tingkat Pendidikan
              </h2>
            </div>
            <div style={{ padding: "20px" }}>
              {edus.map((e, i) => (
                <div key={i} style={{
                  display: "grid", gridTemplateColumns: "1fr 100px",
                  gap: "8px", marginBottom: "8px",
                }}>
                  <div style={{
                    padding: "8px 12px", borderRadius: "10px",
                    background: "#f8faf8", border: "1px solid #e8f5e9",
                    fontSize: "13px", color: "#374151",
                    display: "flex", alignItems: "center",
                  }}>
                    {e.level}
                  </div>
                  <input
                    type="number" min={0} value={e.count}
                    onChange={(e2) => setEdus((prev) => prev.map((x, j) => j === i ? { ...x, count: e2.target.value } : x))}
                    placeholder="0"
                    style={{
                      padding: "8px 12px", borderRadius: "10px",
                      border: "1.5px solid #e5e7eb", fontSize: "14px",
                      color: "#111827", outline: "none",
                      boxSizing: "border-box", width: "100%",
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit" disabled={isPending}
          style={{
            display: "inline-flex", alignItems: "center", gap: "8px",
            padding: "13px 28px", borderRadius: "14px", border: "none",
            background: isPending
              ? "#9ca3af"
              : "linear-gradient(135deg, #1a6b3c, #2d9158)",
            color: "white", fontWeight: 700, fontSize: "14px",
            cursor: isPending ? "not-allowed" : "pointer",
            boxShadow: isPending ? "none" : "0 4px 16px rgba(26,107,60,0.28)",
            marginBottom: "32px",
          }}
        >
          {isPending
            ? <><Loader2 size={15} style={{ animation: "spin 1s linear infinite" }} /> Menyimpan...</>
            : <><Save size={15} /> Simpan sebagai Data Terkini</>
          }
        </button>
      </form>

      {/* History table */}
      {history.length > 0 && (
        <div style={{
          background: "white", borderRadius: "20px",
          border: "1px solid #e8f5e9",
          boxShadow: "0 2px 12px rgba(26,107,60,0.05)",
          overflow: "hidden",
        }}>
          <div style={{ padding: "18px 24px", borderBottom: "1px solid #f0f0f0" }}>
            <h2 style={{ fontSize: "15px", fontWeight: 700, color: "#111827" }}>
              📋 Riwayat Data
            </h2>
          </div>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "#f8faf8" }}>
                  {["Tahun","Total","Laki-laki","Perempuan","KK","Status"].map((h) => (
                    <th key={h} style={{
                      padding: "12px 20px", textAlign: "left",
                      fontSize: "11px", fontWeight: 700, color: "#9ca3af",
                      textTransform: "uppercase", letterSpacing: "0.05em",
                    }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {history.map((s, i) => (
                  <tr key={s.id} style={{
                    borderTop: i === 0 ? "none" : "1px solid #f3f4f6",
                    background: s.is_current ? "#f0fdf4" : "white",
                  }}>
                    <td style={{ padding: "14px 20px", fontSize: "14px", fontWeight: s.is_current ? 700 : 400 }}>
                      {s.year}
                    </td>
                    <td style={{ padding: "14px 20px", fontSize: "14px" }}>
                      {s.total_population.toLocaleString("id-ID")}
                    </td>
                    <td style={{ padding: "14px 20px", fontSize: "14px" }}>
                      {s.total_male.toLocaleString("id-ID")}
                    </td>
                    <td style={{ padding: "14px 20px", fontSize: "14px" }}>
                      {s.total_female.toLocaleString("id-ID")}
                    </td>
                    <td style={{ padding: "14px 20px", fontSize: "14px" }}>
                      {s.total_families.toLocaleString("id-ID")}
                    </td>
                    <td style={{ padding: "14px 20px" }}>
                      {s.is_current && (
                        <span style={{
                          padding: "3px 10px", borderRadius: "9999px",
                          fontSize: "11px", fontWeight: 600,
                          background: "#e8f5e9", color: "#1a6b3c",
                        }}>
                          Terkini
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
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