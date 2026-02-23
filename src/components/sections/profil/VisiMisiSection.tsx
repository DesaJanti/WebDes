"use client";

import { motion } from "framer-motion";
import { Target, Eye } from "lucide-react";

interface Props {
  visi: string | null;
  misiList: string[];
}

export default function VisiMisiSection({ visi, misiList }: Props) {
  const defaultVisi =
    "Terwujudnya Desa Janti yang maju, mandiri, dan sejahtera berlandaskan nilai-nilai gotong royong dan kearifan lokal.";
  const defaultMisi = [
    "Meningkatkan kualitas pelayanan publik berbasis teknologi informasi",
    "Mengembangkan potensi ekonomi lokal melalui penguatan BUMDES",
    "Membangun infrastruktur desa yang merata dan berkualitas",
    "Memberdayakan masyarakat melalui pendidikan dan pelatihan keterampilan",
    "Melestarikan budaya dan kearifan lokal Desa Janti",
  ];

  const visiText  = visi || defaultVisi;
  const misiItems = misiList.length > 0 ? misiList : defaultMisi;

  return (
    <section style={{ background: "white", padding: "80px 24px" }}>
      <div style={{ maxWidth: "72rem", margin: "0 auto" }}>

        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{ textAlign: "center", marginBottom: "56px" }}
        >
          <div className="section-tag" style={{ marginBottom: "14px" }}>
            🎯 Arah Pembangunan
          </div>
          <h2 className="section-title">
            Visi & <span>Misi</span>
          </h2>
        </motion.div>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: "28px",
        }}>
          {/* VISI */}
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55 }}
            style={{
              padding: "36px 32px",
              borderRadius: "24px",
              background: "linear-gradient(135deg, #0d3d22, #1a6b3c)",
              position: "relative",
              overflow: "hidden",
            }}
          >
            {/* Decorative */}
            <div style={{
              position: "absolute", top: "-30px", right: "-30px",
              width: "140px", height: "140px", borderRadius: "50%",
              background: "rgba(240,192,80,0.08)", pointerEvents: "none",
            }} />

            <div style={{
              width: "48px", height: "48px", borderRadius: "14px",
              background: "rgba(240,192,80,0.2)",
              display: "flex", alignItems: "center", justifyContent: "center",
              marginBottom: "20px",
            }}>
              <Eye size={22} style={{ color: "#f0c050" }} />
            </div>

            <p style={{
              fontFamily: "var(--font-playfair)",
              fontSize: "1.4rem", fontWeight: 700,
              color: "#f0c050", marginBottom: "18px",
            }}>
              Visi
            </p>

            <p style={{
              fontSize: "15px", lineHeight: 1.85,
              color: "rgba(255,255,255,0.82)",
              fontStyle: "italic",
              borderLeft: "3px solid rgba(240,192,80,0.5)",
              paddingLeft: "16px",
            }}>
              &ldquo;{visiText}&rdquo;
            </p>
          </motion.div>

          {/* MISI */}
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, delay: 0.1 }}
            style={{
              padding: "36px 32px",
              borderRadius: "24px",
              background: "#f2f7f4",
              border: "1px solid #e8f5e9",
            }}
          >
            <div style={{
              width: "48px", height: "48px", borderRadius: "14px",
              background: "#e8f5e9",
              display: "flex", alignItems: "center", justifyContent: "center",
              marginBottom: "20px",
            }}>
              <Target size={22} style={{ color: "#1a6b3c" }} />
            </div>

            <p style={{
              fontFamily: "var(--font-playfair)",
              fontSize: "1.4rem", fontWeight: 700,
              color: "#1a6b3c", marginBottom: "22px",
            }}>
              Misi
            </p>

            <ol style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "14px" }}>
              {misiItems.map((m, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: 14 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.35, delay: i * 0.07 }}
                  style={{ display: "flex", gap: "14px", alignItems: "flex-start" }}
                >
                  <span style={{
                    width: "26px", height: "26px", borderRadius: "8px",
                    background: "#1a6b3c", color: "white",
                    fontSize: "12px", fontWeight: 700,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    flexShrink: 0, marginTop: "1px",
                  }}>
                    {i + 1}
                  </span>
                  <span style={{ fontSize: "14px", lineHeight: 1.7, color: "#374151" }}>
                    {m}
                  </span>
                </motion.li>
              ))}
            </ol>
          </motion.div>
        </div>
      </div>
    </section>
  );
}