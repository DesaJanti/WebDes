"use client";

import { motion } from "framer-motion";
import { Award } from "lucide-react";
import type { KadesProfile, PriorityProgram } from "@/types/database";

interface ProfilSectionProps {
  kades: KadesProfile;
  programs: PriorityProgram[];
}

export default function ProfilSection({ kades, programs }: ProfilSectionProps) {
  const displayName = kades.title
    ? `${kades.full_name}, ${kades.title}`
    : kades.full_name;

  return (
    <section id="profil" style={{ background: "white" }}>
      <div className="section-inner">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* ── Kolom kiri: foto kepala desa ── */}
          <motion.div
            initial={{ opacity: 0, x: -36 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="hidden lg:flex justify-center items-center"
          >
            <div style={{ width: "340px", paddingBottom: "40px", paddingRight: "28px" }}>
              <div style={{ position: "relative", width: "100%", height: "380px" }}>

                {/* Card hijau belakang */}
                <div
                  style={{
                    position: "absolute",
                    top: 0, left: 0,
                    width: "100%", height: "100%",
                    borderRadius: "24px",
                    background: "linear-gradient(135deg,#1a6b3c,#2d9158)",
                  }}
                />

                {/* Label "Kepala Desa" */}
                <div
                  style={{
                    position: "absolute",
                    top: "-14px", left: "20px",
                    padding: "6px 14px",
                    borderRadius: "10px",
                    background: "#f0c050",
                    color: "#111827",
                    fontSize: "12px",
                    fontWeight: 700,
                    boxShadow: "0 4px 12px rgba(240,192,80,0.4)",
                    zIndex: 2,
                  }}
                >
                  🏆 Kepala Desa
                </div>

                {/* Card putih depan — foto / avatar */}
                <div
                  style={{
                    position: "absolute",
                    bottom: "-28px", right: "-24px",
                    width: "272px", height: "312px",
                    borderRadius: "20px",
                    background: kades.photo_url
                      ? "none"
                      : "linear-gradient(135deg,#e8f5e9,#c8e6c9)",
                    border: "3px solid #fdf8ef",
                    boxShadow: "0 20px 60px rgba(26,107,60,0.18)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "80px",
                    overflow: "hidden",
                    zIndex: 1,
                  }}
                >
                  {kades.photo_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={kades.photo_url}
                      alt={kades.full_name}
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                  ) : (
                    "👨‍💼"
                  )}
                </div>

                {/* Badge nama */}
                <div
                  style={{
                    position: "absolute",
                    bottom: "-38px", left: "-4px",
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    padding: "10px 14px",
                    borderRadius: "14px",
                    background: "white",
                    boxShadow: "0 8px 28px rgba(26,107,60,0.14)",
                    zIndex: 3,
                  }}
                >
                  <Award size={22} style={{ color: "#f0c050", flexShrink: 0 }} />
                  <div>
                    <strong style={{ display: "block", fontSize: "13px", color: "#111827" }}>
                      {displayName}
                    </strong>
                    <span style={{ fontSize: "11px", color: "#6b7280" }}>
                      Periode {kades.period}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* ── Kolom kanan: teks sambutan ── */}
          <motion.div
            initial={{ opacity: 0, x: 36 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <div className="section-tag" style={{ marginBottom: "12px" }}>
              👤 Sambutan Kepala Desa
            </div>

            <h2 className="section-title" style={{ marginBottom: "8px" }}>
              Kepala Desa <span>Janti</span>
            </h2>

            <p style={{ fontSize: "14px", fontWeight: 600, color: "#1a6b3c", marginBottom: "18px" }}>
              {displayName} — Kepala Desa {kades.period}
            </p>

            {/* Welcome speech — render baris per baris jika ada \n */}
            {kades.welcome_speech ? (
              kades.welcome_speech.split("\n\n").map((para, i) => (
                <p
                  key={i}
                  style={{
                    fontSize: "14px",
                    lineHeight: 1.8,
                    color: "#6b7280",
                    marginBottom: i < kades.welcome_speech!.split("\n\n").length - 1 ? "14px" : "20px",
                  }}
                >
                  {para}
                </p>
              ))
            ) : (
              <>
                <p style={{ fontSize: "14px", lineHeight: 1.8, color: "#6b7280", marginBottom: "14px" }}>
                  Assalamu&apos;alaikum Warahmatullahi Wabarakatuh. Selamat datang di Website Resmi Desa Janti.
                  Kami berkomitmen untuk terus membangun desa yang maju, sejahtera, dan bermartabat melalui
                  program-program strategis yang berpihak pada kepentingan masyarakat.
                </p>
                <p style={{ fontSize: "14px", lineHeight: 1.8, color: "#6b7280", marginBottom: "20px" }}>
                  Dengan semangat gotong royong dan tekad yang kuat, kami terus berinovasi dalam memberikan
                  pelayanan terbaik bagi seluruh warga Desa Janti.
                </p>
              </>
            )}

            {programs.length > 0 && (
              <>
                <p style={{ fontSize: "14px", fontWeight: 600, color: "#111827", marginBottom: "12px" }}>
                  🎯 Program Prioritas Desa:
                </p>

                <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "10px" }}>
                  {programs.map((p, i) => (
                    <motion.li
                      key={p.id}
                      initial={{ opacity: 0, x: 16 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.35, delay: i * 0.08 }}
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: "12px",
                        padding: "12px 16px",
                        borderRadius: "12px",
                        background: "#fdf8ef",
                        transition: "all 0.25s ease",
                        cursor: "default",
                      }}
                      onMouseEnter={(e) => {
                        const el = e.currentTarget as HTMLElement;
                        el.style.background = "#e8f5e9";
                        el.style.transform = "translateX(4px)";
                      }}
                      onMouseLeave={(e) => {
                        const el = e.currentTarget as HTMLElement;
                        el.style.background = "#fdf8ef";
                        el.style.transform = "";
                      }}
                    >
                      <span
                        style={{
                          width: "24px", height: "24px",
                          borderRadius: "7px",
                          background: "#1a6b3c",
                          color: "white",
                          fontSize: "11px",
                          fontWeight: 700,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                          marginTop: "1px",
                        }}
                      >
                        {p.icon ?? (i + 1)}
                      </span>
                      <span style={{ fontSize: "13px", lineHeight: 1.6, color: "#374151" }}>
                        <strong>{p.title}</strong> — {p.description}
                      </span>
                    </motion.li>
                  ))}
                </ul>
              </>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}