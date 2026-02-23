"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import Link from "next/link";
import { ArrowDown, MapPin, Users, TreePine } from "lucide-react";

// ── Floating particle component ──────────────────────────────
function Particle({
  x, y, size, duration, delay,
}: {
  x: number; y: number; size: number; duration: number; delay: number;
}) {
  return (
    <motion.div
      className="absolute rounded-full pointer-events-none"
      style={{
        left: `${x}%`,
        top: `${y}%`,
        width: size,
        height: size,
        backgroundColor: "rgba(240,192,80,0.35)",
        filter: "blur(0.5px)",
      }}
      animate={{
        y: [0, -18, 0],
        x: [0, 6, -4, 0],
        opacity: [0.2, 0.8, 0.2],
        scale: [1, 1.3, 1],
      }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    />
  );
}

// ── Stat badge ────────────────────────────────────────────────
function StatBadge({
  icon: Icon,
  label,
  value,
  delay,
  style,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  delay: number;
  style?: React.CSSProperties;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ delay, duration: 0.5, ease: "backOut" }}
      className="absolute flex items-center gap-3 px-4 py-3 rounded-2xl"
      style={{
        backgroundColor: "rgba(255,255,255,0.10)",
        backdropFilter: "blur(12px)",
        border: "1px solid rgba(255,255,255,0.18)",
        boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
        ...style,
      }}
    >
      <div
        className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{ backgroundColor: "rgba(240,192,80,0.25)" }}
      >
        <Icon size={16} style={{ color: "#f0c050" }} />
      </div>
      <div>
        <p className="text-white font-bold text-sm leading-none mb-0.5">{value}</p>
        <p style={{ color: "rgba(255,255,255,0.55)", fontSize: "10px" }}>{label}</p>
      </div>
    </motion.div>
  );
}

// ── Animated rice stalk SVG ───────────────────────────────────
function RiceStalk({ style, delay = 0 }: { style?: React.CSSProperties; delay?: number }) {
  return (
    <motion.svg
      viewBox="0 0 40 120"
      fill="none"
      style={{ position: "absolute", opacity: 0.18, ...style }}
      initial={{ opacity: 0, scaleY: 0 }}
      animate={{ opacity: 0.18, scaleY: 1 }}
      transition={{ delay, duration: 1, ease: "easeOut" }}
    >
      {/* Main stem */}
      <path d="M20 115 Q18 80 20 40 Q22 20 20 5" stroke="#4caf76" strokeWidth="1.5" />
      {/* Grains */}
      {[15, 28, 40, 52, 64].map((y, i) => (
        <motion.ellipse
          key={i}
          cx={i % 2 === 0 ? 14 : 26}
          cy={y}
          rx="5"
          ry="3"
          fill="#f0c050"
          animate={{ rotate: i % 2 === 0 ? [-3, 3, -3] : [3, -3, 3] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: i * 0.3 }}
          style={{ originX: "20px", originY: `${y}px` }}
        />
      ))}
    </motion.svg>
  );
}

// ── Terrain wave SVG layers ───────────────────────────────────
function TerrainLayer({
  d, fill, opacity, delay,
}: { d: string; fill: string; opacity: number; delay: number }) {
  return (
    <motion.path
      d={d}
      fill={fill}
      fillOpacity={opacity}
      initial={{ y: 40, opacity: 0 }}
      animate={{ y: 0, opacity }}
      transition={{ delay, duration: 1.2, ease: "easeOut" }}
    />
  );
}

// ── Main Component ────────────────────────────────────────────
const PARTICLES = [
  { x: 8,  y: 20, size: 4,  duration: 4.2, delay: 0    },
  { x: 15, y: 65, size: 3,  duration: 5.1, delay: 0.8  },
  { x: 25, y: 40, size: 5,  duration: 3.8, delay: 1.5  },
  { x: 72, y: 25, size: 3,  duration: 4.6, delay: 0.3  },
  { x: 80, y: 60, size: 4,  duration: 5.4, delay: 1.1  },
  { x: 90, y: 35, size: 3,  duration: 3.9, delay: 2.0  },
  { x: 55, y: 15, size: 6,  duration: 6.0, delay: 0.6  },
  { x: 48, y: 75, size: 3,  duration: 4.3, delay: 1.8  },
  { x: 35, y: 85, size: 4,  duration: 5.0, delay: 0.4  },
  { x: 62, y: 50, size: 3,  duration: 4.8, delay: 2.2  },
];

export default function HeroSection() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });

  // Parallax transforms
  const bgY        = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const contentY   = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
  const terrainY   = useTransform(scrollYProgress, [0, 1], ["0%", "-10%"]);

  return (
    <section
      id="beranda"
      ref={ref}
      style={{
        position: "relative",
        minHeight: "100vh",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
      }}
    >
      {/* ── Background gradient ── */}
      <motion.div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse 80% 60% at 30% 40%, #0f4d28 0%, #0a2e18 40%, #071a0e 100%)",
          y: bgY,
        }}
      />

      {/* ── Noise texture overlay ── */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
          opacity: 0.04,
          mixBlendMode: "overlay",
          pointerEvents: "none",
        }}
      />

      {/* ── Radial glow (gold accent) ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 2 }}
        style={{
          position: "absolute",
          top: "20%",
          right: "15%",
          width: "480px",
          height: "480px",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(240,192,80,0.07) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      {/* ── Green glow left ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 2 }}
        style={{
          position: "absolute",
          bottom: "10%",
          left: "5%",
          width: "350px",
          height: "350px",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(76,175,118,0.10) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      {/* ── Floating particles ── */}
      {PARTICLES.map((p, i) => (
        <Particle key={i} {...p} />
      ))}

      {/* ── Rice stalks decoration ── */}
      <RiceStalk style={{ width: 50, bottom: 180, left: "6%"  }} delay={1.2} />
      <RiceStalk style={{ width: 36, bottom: 200, left: "10%" }} delay={1.5} />
      <RiceStalk style={{ width: 44, bottom: 185, right: "8%" }} delay={1.0} />
      <RiceStalk style={{ width: 30, bottom: 205, right: "12%"}} delay={1.7} />

      {/* ── Terrain layers ── */}
      <motion.div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          y: terrainY,
          pointerEvents: "none",
        }}
      >
        <svg
          viewBox="0 0 1440 280"
          xmlns="http://www.w3.org/2000/svg"
          style={{ display: "block", width: "100%" }}
          preserveAspectRatio="none"
        >
          <TerrainLayer
            d="M0,200 C200,150 400,240 600,180 C800,120 1000,200 1200,160 C1320,140 1380,170 1440,160 L1440,280 L0,280 Z"
            fill="#163d25"
            opacity={0.6}
            delay={0.8}
          />
          <TerrainLayer
            d="M0,220 C150,190 350,260 550,210 C750,160 950,230 1150,195 C1300,170 1380,210 1440,200 L1440,280 L0,280 Z"
            fill="#0d3d22"
            opacity={0.8}
            delay={1.0}
          />
          <TerrainLayer
            d="M0,250 C200,230 400,270 650,245 C850,222 1100,260 1300,240 C1370,232 1410,248 1440,245 L1440,280 L0,280 Z"
            fill="#fdfbf5"
            opacity={1}
            delay={1.2}
          />
        </svg>
      </motion.div>

      {/* ── Floating stat badges ── */}
      <StatBadge
        icon={Users}
        label="Total Penduduk"
        value="3.240+"
        delay={1.4}
        style={{ top: "22%", right: "8%",  display: "none" }}
      />
      <StatBadge
        icon={MapPin}
        label="Luas Wilayah"
        value="4.2 km²"
        delay={1.6}
        style={{ top: "38%", right: "5%" }}
      />
      <StatBadge
        icon={TreePine}
        label="Desa Hijau"
        value="Sejak 1945"
        delay={1.8}
        style={{ bottom: "30%", right: "9%" }}
      />

      {/* ── Main content ── */}
      <motion.div
        style={{
          position: "relative",
          zIndex: 10,
          width: "100%",
          y: contentY,
        }}
        className="section-inner"
      >
        <div style={{ maxWidth: "720px" }}>

          {/* Location chip */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "6px 14px 6px 8px",
              borderRadius: "9999px",
              backgroundColor: "rgba(240,192,80,0.15)",
              border: "1px solid rgba(240,192,80,0.25)",
              marginBottom: "28px",
            }}
          >
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                width: 22,
                height: 22,
                borderRadius: "50%",
                backgroundColor: "#f0c050",
                fontSize: "11px",
              }}
            >
              📍
            </span>
            <span style={{ color: "#f0c050", fontSize: "12px", fontWeight: 600 }}>
              Kec. Slahung, Kab. Ponorogo, Jawa Timur
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.75, duration: 0.7, ease: "easeOut" }}
            style={{
              fontFamily: "var(--font-playfair)",
              fontSize: "clamp(2.8rem, 7vw, 5rem)",
              fontWeight: 700,
              color: "white",
              lineHeight: 1.1,
              marginBottom: "8px",
              letterSpacing: "-0.02em",
            }}
          >
            Selamat Datang
          </motion.h1>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.7, ease: "easeOut" }}
            style={{
              fontFamily: "var(--font-playfair)",
              fontSize: "clamp(2.8rem, 7vw, 5rem)",
              fontWeight: 700,
              lineHeight: 1.1,
              marginBottom: "28px",
              letterSpacing: "-0.02em",
            }}
          >
            <span style={{ color: "#f0c050" }}>di Desa Janti</span>
            <span style={{ color: "rgba(255,255,255,0.35)", fontSize: "60%", display: "block", fontStyle: "italic", letterSpacing: "0" }}>
              — Maju, Sejahtera, Bermartabat
            </span>
          </motion.h1>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.05, duration: 0.6 }}
            style={{
              color: "rgba(255,255,255,0.60)",
              fontSize: "clamp(0.95rem, 2vw, 1.1rem)",
              lineHeight: 1.8,
              maxWidth: "520px",
              marginBottom: "44px",
            }}
          >
            Portal resmi Desa Janti — menyajikan informasi terkini, statistik kependudukan,
            berita desa, serta layanan administrasi bagi seluruh warga.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.5 }}
            style={{ display: "flex", gap: "14px", flexWrap: "wrap" }}
          >
            <Link
              href="/#profil"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "14px 28px",
                borderRadius: "9999px",
                backgroundColor: "#f0c050",
                color: "#111827",
                fontWeight: 700,
                fontSize: "14px",
                textDecoration: "none",
                transition: "all 0.25s ease",
                boxShadow: "0 8px 32px rgba(240,192,80,0.35)",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.backgroundColor = "#f5cc70";
                (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)";
                (e.currentTarget as HTMLElement).style.boxShadow = "0 12px 40px rgba(240,192,80,0.45)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.backgroundColor = "#f0c050";
                (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
                (e.currentTarget as HTMLElement).style.boxShadow = "0 8px 32px rgba(240,192,80,0.35)";
              }}
            >
              🏡 Profil Desa
            </Link>

            <Link
              href="/#berita"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "14px 28px",
                borderRadius: "9999px",
                backgroundColor: "rgba(255,255,255,0.10)",
                color: "white",
                fontWeight: 600,
                fontSize: "14px",
                textDecoration: "none",
                border: "1px solid rgba(255,255,255,0.22)",
                transition: "all 0.25s ease",
                backdropFilter: "blur(8px)",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.backgroundColor = "rgba(255,255,255,0.18)";
                (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.backgroundColor = "rgba(255,255,255,0.10)";
                (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
              }}
            >
              📰 Berita Terbaru
            </Link>
          </motion.div>

          {/* Quick stats row */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5, duration: 0.6 }}
            style={{
              display: "flex",
              gap: "32px",
              marginTop: "56px",
              flexWrap: "wrap",
            }}
          >
            {[
              { value: "3.240+", label: "Jiwa"         },
              { value: "6",      label: "RT / Dusun"   },
              { value: "2021",   label: "Periode Kades" },
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.5 + i * 0.12 }}
                style={{ display: "flex", flexDirection: "column", gap: "2px" }}
              >
                <span
                  style={{
                    fontFamily: "var(--font-playfair)",
                    fontSize: "1.75rem",
                    fontWeight: 700,
                    color: "white",
                    lineHeight: 1,
                  }}
                >
                  {stat.value}
                </span>
                <span style={{ color: "rgba(255,255,255,0.45)", fontSize: "12px" }}>
                  {stat.label}
                </span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.div>

      {/* ── Scroll indicator ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 0.5 }}
        style={{
          position: "absolute",
          bottom: "40px",
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 10,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "8px",
          cursor: "pointer",
        }}
        onClick={() =>
          document.getElementById("profil")?.scrollIntoView({ behavior: "smooth" })
        }
      >
        <span style={{ color: "rgba(255,255,255,0.40)", fontSize: "10px", letterSpacing: "0.15em" }}>
          SCROLL
        </span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <ArrowDown size={16} style={{ color: "rgba(255,255,255,0.35)" }} />
        </motion.div>
      </motion.div>
    </section>
  );
}