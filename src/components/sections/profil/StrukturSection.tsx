"use client";

import { motion } from "framer-motion";

interface Official {
  id: string;
  full_name: string;
  position: string;
  photo_url: string | null;
  sort_order: number;
}

const FALLBACK_OFFICIALS: Official[] = [
  { id: "1", sort_order: 1,  full_name: "H. Suharto, S.IP",    position: "Kepala Desa",            photo_url: null },
  { id: "2", sort_order: 2,  full_name: "Ahmad Fauzi",          position: "Sekretaris Desa",         photo_url: null },
  { id: "3", sort_order: 3,  full_name: "Siti Rahayu",          position: "Kaur Keuangan",           photo_url: null },
  { id: "4", sort_order: 4,  full_name: "Budi Santoso",         position: "Kaur Umum & Perencanaan", photo_url: null },
  { id: "5", sort_order: 5,  full_name: "Dwi Lestari",          position: "Kasi Pemerintahan",       photo_url: null },
  { id: "6", sort_order: 6,  full_name: "Eko Prasetyo",         position: "Kasi Kesejahteraan",      photo_url: null },
  { id: "7", sort_order: 7,  full_name: "Rina Wulandari",       position: "Kasi Pelayanan",          photo_url: null },
  { id: "8", sort_order: 8,  full_name: "Hadi Susanto",         position: "Kadus Dusun I",           photo_url: null },
  { id: "9", sort_order: 9,  full_name: "Slamet Riyadi",        position: "Kadus Dusun II",          photo_url: null },
  { id: "10",sort_order: 10, full_name: "Jumiran",               position: "Kadus Dusun III",         photo_url: null },
];

// Jabatan tier untuk layout hierarchy
const TIER_ORDER: Record<string, number> = {
  "Kepala Desa": 0,
  "Sekretaris Desa": 1,
};

function getInitials(name: string) {
  return name
    .replace(/[,.].*$/, "")         // hapus gelar
    .trim()
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase();
}

const AVATAR_COLORS = [
  "#1a6b3c","#2d9158","#0d3d22","#3dab6e",
  "#1e40af","#b45309","#991b1b","#6d28d9",
];

interface Props { officials: Official[] }

export default function StrukturSection({ officials }: Props) {
  const data = officials.length > 0 ? officials : FALLBACK_OFFICIALS;

  // Pisahkan kepala desa, sekdes, dan staf
  const kepalaDesa = data.find((o) => o.position === "Kepala Desa");
  const sekdes     = data.find((o) => o.position === "Sekretaris Desa");
  const staf       = data.filter(
    (o) => o.position !== "Kepala Desa" && o.position !== "Sekretaris Desa"
  );

  return (
    <section style={{ background: "#f2f7f4", padding: "80px 24px" }}>
      <div style={{ maxWidth: "72rem", margin: "0 auto" }}>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{ textAlign: "center", marginBottom: "56px" }}
        >
          <div className="section-tag" style={{ marginBottom: "14px" }}>
            👥 Aparatur Desa
          </div>
          <h2 className="section-title">
            Struktur <span>Perangkat Desa</span>
          </h2>
          <p style={{ color: "#6b7280", marginTop: "10px", fontSize: "14px" }}>
            Susunan perangkat Desa Janti periode 2021–2027
          </p>
        </motion.div>

        {/* Kepala Desa — center top */}
        {kepalaDesa && (
          <div style={{ display: "flex", justifyContent: "center", marginBottom: "16px" }}>
            <OfficialCard official={kepalaDesa} index={0} highlighted />
          </div>
        )}

        {/* Connector line */}
        {kepalaDesa && sekdes && (
          <div style={{ display: "flex", justifyContent: "center", marginBottom: "0" }}>
            <div style={{ width: "2px", height: "32px", background: "#c2dace" }} />
          </div>
        )}

        {/* Sekdes */}
        {sekdes && (
          <div style={{ display: "flex", justifyContent: "center", marginBottom: "16px" }}>
            <OfficialCard official={sekdes} index={1} />
          </div>
        )}

        {/* Connector to staf */}
        {sekdes && staf.length > 0 && (
          <div style={{ display: "flex", justifyContent: "center", marginBottom: "0" }}>
            <div style={{ width: "2px", height: "32px", background: "#c2dace" }} />
          </div>
        )}

        {/* Horizontal line across staf */}
        {staf.length > 0 && (
          <div style={{ display: "flex", justifyContent: "center", marginBottom: "16px" }}>
            <div style={{
              width: "min(700px, 90%)",
              height: "2px",
              background: "#c2dace",
            }} />
          </div>
        )}

        {/* Staf grid */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
          gap: "16px",
        }}>
          {staf.map((o, i) => (
            <OfficialCard key={o.id} official={o} index={i + 2} />
          ))}
        </div>
      </div>
    </section>
  );
}

function OfficialCard({
  official, index, highlighted = false,
}: {
  official: Official;
  index: number;
  highlighted?: boolean;
}) {
  const initials   = getInitials(official.full_name);
  const avatarBg   = AVATAR_COLORS[index % AVATAR_COLORS.length];

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: (index % 4) * 0.07 }}
      style={{
        padding: highlighted ? "28px 32px" : "20px",
        borderRadius: "20px",
        background: highlighted
          ? "linear-gradient(135deg, #0d3d22, #1a6b3c)"
          : "white",
        border: highlighted ? "none" : "1px solid #e8f5e9",
        boxShadow: highlighted
          ? "0 16px 48px rgba(26,107,60,0.25)"
          : "0 2px 12px rgba(26,107,60,0.06)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
        minWidth: highlighted ? "220px" : "auto",
        transition: "transform 0.25s, box-shadow 0.25s",
      }}
      whileHover={{ y: -4 }}
    >
      {/* Avatar */}
      <div style={{
        width: highlighted ? "80px" : "64px",
        height: highlighted ? "80px" : "64px",
        borderRadius: "50%",
        overflow: "hidden",
        marginBottom: "14px",
        border: highlighted ? "3px solid rgba(240,192,80,0.5)" : "2px solid #e8f5e9",
        background: official.photo_url ? "none" : avatarBg,
        display: "flex", alignItems: "center", justifyContent: "center",
        flexShrink: 0,
      }}>
        {official.photo_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={official.photo_url}
            alt={official.full_name}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        ) : (
          <span style={{
            color: "white",
            fontWeight: 700,
            fontSize: highlighted ? "1.5rem" : "1.1rem",
          }}>
            {initials}
          </span>
        )}
      </div>

      {/* Name */}
      <p style={{
        fontWeight: 700,
        fontSize: highlighted ? "15px" : "13px",
        color: highlighted ? "white" : "#111827",
        marginBottom: "5px",
        lineHeight: 1.3,
      }}>
        {official.full_name}
      </p>

      {/* Position */}
      <span style={{
        display: "inline-block",
        padding: "3px 10px",
        borderRadius: "9999px",
        fontSize: "11px",
        fontWeight: 600,
        background: highlighted ? "rgba(240,192,80,0.2)" : "#e8f5e9",
        color: highlighted ? "#f0c050" : "#1a6b3c",
      }}>
        {official.position}
      </span>
    </motion.div>
  );
}