"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, MapPin, Calendar, Ruler } from "lucide-react";

interface Props {
  profile: {
    village_name: string;
    tagline: string | null;
    kecamatan: string;
    kabupaten: string;
    established_year: number | null;
    area_ha: number | null;
    address: string | null;
  };
}

export default function ProfilHeroSection({ profile }: Props) {
  const stats = [
    { icon: <MapPin size={15} />,    label: "Kecamatan",    value: profile.kecamatan },
    { icon: <MapPin size={15} />,    label: "Kabupaten",    value: profile.kabupaten },
    { icon: <Calendar size={15} />,  label: "Berdiri",      value: profile.established_year ? `Tahun ${profile.established_year}` : "—" },
    { icon: <Ruler size={15} />,     label: "Luas Wilayah", value: profile.area_ha ? `${profile.area_ha.toLocaleString("id-ID")} Ha` : "—" },
  ];

  return (
    <div style={{
      background: "linear-gradient(145deg, #071a0e 0%, #0d3d22 45%, #1a6b3c 100%)",
      padding: "120px 24px 80px",
      position: "relative",
      overflow: "hidden",
    }}>
      {/* Decorative circles */}
      <div style={{
        position: "absolute", top: "-60px", right: "-60px",
        width: "400px", height: "400px", borderRadius: "50%",
        background: "radial-gradient(circle, rgba(240,192,80,0.07) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />
      <div style={{
        position: "absolute", bottom: "0", left: "-40px",
        width: "300px", height: "300px", borderRadius: "50%",
        background: "radial-gradient(circle, rgba(76,175,118,0.08) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />

      <div style={{ maxWidth: "72rem", margin: "0 auto", position: "relative", zIndex: 1 }}>
        <motion.div
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Link
            href="/"
            style={{
              display: "inline-flex", alignItems: "center", gap: "6px",
              fontSize: "13px", color: "rgba(255,255,255,0.55)",
              textDecoration: "none", marginBottom: "28px",
            }}
          >
            <ArrowLeft size={13} /> Kembali ke Beranda
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div style={{
            display: "inline-flex", alignItems: "center", gap: "6px",
            padding: "4px 14px", borderRadius: "9999px",
            background: "rgba(240,192,80,0.15)",
            border: "1px solid rgba(240,192,80,0.25)",
            color: "#f0c050", fontSize: "12px", fontWeight: 600,
            marginBottom: "16px",
          }}>
            🏡 Profil Desa
          </div>
          <h1 style={{
            fontFamily: "var(--font-playfair)",
            fontSize: "clamp(2.2rem, 5vw, 3.5rem)",
            fontWeight: 700, color: "white",
            lineHeight: 1.15, marginBottom: "12px",
          }}>
            {profile.village_name}
          </h1>
          {profile.tagline && (
            <p style={{
              fontSize: "1.1rem",
              color: "rgba(255,255,255,0.55)",
              fontStyle: "italic",
              marginBottom: "40px",
            }}>
              &ldquo;{profile.tagline}&rdquo;
            </p>
          )}
        </motion.div>

        {/* Stat chips */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.25 }}
          style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}
        >
          {stats.map((s, i) => (
            <div
              key={i}
              style={{
                display: "flex", alignItems: "center", gap: "8px",
                padding: "10px 18px", borderRadius: "14px",
                background: "rgba(255,255,255,0.08)",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(255,255,255,0.12)",
              }}
            >
              <span style={{ color: "#f0c050" }}>{s.icon}</span>
              <div>
                <p style={{ fontSize: "10px", color: "rgba(255,255,255,0.45)", marginBottom: "1px" }}>
                  {s.label}
                </p>
                <p style={{ fontSize: "13px", fontWeight: 600, color: "white" }}>
                  {s.value}
                </p>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}