"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import dynamic from "next/dynamic";
import { useCountUp } from "@/lib/hooks/useCountUp";
import type {
  PopulationStats,
  AgeDistribution,
  OccupationDistribution,
  EducationDistribution,
} from "@/types/database";

// ── Lazy-load Nivo charts (no SSR) ───────────────────────────
const ResponsiveBar = dynamic(
  () => import("@nivo/bar").then((m) => m.ResponsiveBar),
  { ssr: false, loading: () => <ChartSkeleton /> }
);
const ResponsivePie = dynamic(
  () => import("@nivo/pie").then((m) => m.ResponsivePie),
  { ssr: false, loading: () => <ChartSkeleton /> }
);

function ChartSkeleton() {
  return (
    <div
      style={{
        width: "100%", height: "100%",
        borderRadius: "12px",
        background: "linear-gradient(90deg,#e8f5e9 25%,#c8e6c9 50%,#e8f5e9 75%)",
        backgroundSize: "200% 100%",
        animation: "shimmer 1.5s infinite",
      }}
    />
  );
}

// ── Stat card with count-up ───────────────────────────────────
function StatCard({
  value,
  suffix = "",
  label,
  icon,
  delay,
  accent = false,
}: {
  value: number;
  suffix?: string;
  label: string;
  icon: string;
  delay: number;
  accent?: boolean;
}) {
  const { ref, display } = useCountUp({ end: value, duration: 2200, suffix });

  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      style={{
        padding: "28px 24px",
        borderRadius: "20px",
        background: accent
          ? "linear-gradient(135deg,#1a6b3c,#2d9158)"
          : "white",
        border: accent ? "none" : "1px solid #e8f5e9",
        boxShadow: accent
          ? "0 12px 40px rgba(26,107,60,0.25)"
          : "0 2px 16px rgba(26,107,60,0.06)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background decoration */}
      {accent && (
        <div
          style={{
            position: "absolute", top: "-20px", right: "-20px",
            width: "100px", height: "100px",
            borderRadius: "50%",
            background: "rgba(255,255,255,0.06)",
          }}
        />
      )}

      <div style={{ fontSize: "28px", marginBottom: "12px" }}>{icon}</div>

      {/* Count-up number */}
      <p
        ref={ref as React.RefObject<HTMLParagraphElement>}
        style={{
          fontFamily: "var(--font-playfair)",
          fontSize: "clamp(1.75rem, 4vw, 2.5rem)",
          fontWeight: 700,
          color: accent ? "white" : "#111827",
          lineHeight: 1,
          marginBottom: "6px",
        }}
      >
        {display}
      </p>

      <p style={{ fontSize: "13px", color: accent ? "rgba(255,255,255,0.7)" : "#6b7280" }}>
        {label}
      </p>
    </motion.div>
  );
}

// ── Section props ─────────────────────────────────────────────
interface StatistikSectionProps {
  stats: PopulationStats;
  ageData: AgeDistribution[];
  occupationData: OccupationDistribution[];
  educationData: EducationDistribution[];
}

// ── Nivo shared theme ─────────────────────────────────────────
const nivoTheme = {
  fontFamily: "var(--font-sans, system-ui)",
  fontSize: 11,
  textColor: "#6b7280",
  axis: {
    ticks: { text: { fill: "#9ca3af", fontSize: 11 } },
    legend: { text: { fill: "#374151", fontSize: 12 } },
  },
  grid: { line: { stroke: "#f0fdf4", strokeWidth: 1 } },
  tooltip: {
    container: {
      background: "white",
      borderRadius: "10px",
      boxShadow: "0 8px 24px rgba(0,0,0,0.10)",
      fontSize: "12px",
      padding: "10px 14px",
    },
  },
};

// ── Fallback data (dipakai saat DB kosong) ────────────────────
const FALLBACK_AGE: AgeDistribution[] = [
  { id: "1", stats_id: "", age_group: "0–4",  male_count: 95,  female_count: 88  },
  { id: "2", stats_id: "", age_group: "5–14", male_count: 180, female_count: 172 },
  { id: "3", stats_id: "", age_group: "15–24",male_count: 210, female_count: 198 },
  { id: "4", stats_id: "", age_group: "25–34",male_count: 225, female_count: 218 },
  { id: "5", stats_id: "", age_group: "35–44",male_count: 195, female_count: 190 },
  { id: "6", stats_id: "", age_group: "45–54",male_count: 160, female_count: 155 },
  { id: "7", stats_id: "", age_group: "55–64",male_count: 110, female_count: 118 },
  { id: "8", stats_id: "", age_group: "65+",  male_count: 70,  female_count: 82  },
];

const FALLBACK_OCCUPATION: OccupationDistribution[] = [
  { id: "1", stats_id: "", occupation: "Petani",      count: 820 },
  { id: "2", stats_id: "", occupation: "Wiraswasta",  count: 340 },
  { id: "3", stats_id: "", occupation: "PNS/TNI",     count: 120 },
  { id: "4", stats_id: "", occupation: "Buruh",       count: 280 },
  { id: "5", stats_id: "", occupation: "Pelajar",     count: 410 },
  { id: "6", stats_id: "", occupation: "Lainnya",     count: 190 },
];

const FALLBACK_EDUCATION: EducationDistribution[] = [
  { id: "1", stats_id: "", level: "Belum Sekolah", count: 180 },
  { id: "2", stats_id: "", level: "SD",            count: 520 },
  { id: "3", stats_id: "", level: "SMP",           count: 410 },
  { id: "4", stats_id: "", level: "SMA",           count: 380 },
  { id: "5", stats_id: "", level: "D3/S1",         count: 150 },
  { id: "6", stats_id: "", level: "S2+",           count: 28  },
];

// ── Main component ────────────────────────────────────────────
export default function StatistikSection({
  stats,
  ageData,
  occupationData,
  educationData,
}: StatistikSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);

  const ages  = ageData.length        > 0 ? ageData        : FALLBACK_AGE;
  const occs  = occupationData.length > 0 ? occupationData : FALLBACK_OCCUPATION;
  const edus  = educationData.length  > 0 ? educationData  : FALLBACK_EDUCATION;

  // ── Transform data for Nivo ──
  const barAgeData = ages.map((d) => ({
    "Kelompok Usia": d.age_group,
    "Laki-laki": d.male_count,
    "Perempuan": d.female_count,
  }));

  const pieOccData = occs.map((d, i) => ({
    id: d.occupation,
    label: d.occupation,
    value: d.count,
    color: [
      "#1a6b3c","#2d9158","#3dab6e","#f0c050",
      "#e8a820","#96c0a8",
    ][i % 6],
  }));

  const barEduData = edus.map((d) => ({
    "Pendidikan": d.level,
    "Jumlah": d.count,
  }));

  return (
    <section
      id="statistik"
      ref={sectionRef}
      style={{ background: "#f2f7f4" }}
    >
      <div className="section-inner">

        {/* ── Header ── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          style={{ textAlign: "center", marginBottom: "56px" }}
        >
          <div className="section-tag" style={{ marginBottom: "16px" }}>
            📊 Data Kependudukan {stats.year}
          </div>
          <h2 className="section-title">
            Statistik <span>Desa Janti</span>
          </h2>
          <p style={{ color: "#6b7280", marginTop: "12px", maxWidth: "480px", margin: "12px auto 0" }}>
            Data real-time kependudukan dan profil demografis warga Desa Janti.
          </p>
        </motion.div>

        {/* ── Stat cards grid ── */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: "16px",
            marginBottom: "56px",
          }}
        >
          <StatCard
            value={stats.total_population}
            label="Total Penduduk"
            icon="👥"
            delay={0}
            accent
          />
          <StatCard
            value={stats.total_male}
            label="Laki-laki"
            icon="👨"
            delay={0.08}
          />
          <StatCard
            value={stats.total_female}
            label="Perempuan"
            icon="👩"
            delay={0.16}
          />
          <StatCard
            value={stats.total_families}
            label="Kepala Keluarga"
            icon="🏠"
            delay={0.24}
          />
          <StatCard
            value={stats.total_rt}
            label="RT"
            icon="🏘️"
            delay={0.32}
          />
        </div>

        {/* ── Charts row ── */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "24px",
          }}
        >

          {/* Chart 1: Distribusi Usia (Grouped Bar) */}
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, delay: 0 }}
            style={{
              background: "white",
              borderRadius: "20px",
              padding: "28px 20px 20px",
              boxShadow: "0 2px 16px rgba(26,107,60,0.06)",
              gridColumn: "span 2",
            }}
          >
            <p style={{ fontSize: "14px", fontWeight: 700, color: "#111827", marginBottom: "4px" }}>
              📊 Distribusi Usia
            </p>
            <p style={{ fontSize: "12px", color: "#9ca3af", marginBottom: "20px" }}>
              Perbandingan laki-laki & perempuan per kelompok usia
            </p>
            <div style={{ height: "280px" }}>
              <ResponsiveBar
                data={barAgeData}
                keys={["Laki-laki", "Perempuan"]}
                indexBy="Kelompok Usia"
                groupMode="grouped"
                margin={{ top: 10, right: 20, bottom: 50, left: 50 }}
                padding={0.25}
                innerPadding={3}
                colors={["#1a6b3c", "#f0c050"]}
                borderRadius={4}
                theme={nivoTheme}
                axisBottom={{
                  tickSize: 0,
                  tickPadding: 10,
                  legend: "Kelompok Usia",
                  legendPosition: "middle",
                  legendOffset: 40,
                }}
                axisLeft={{
                  tickSize: 0,
                  tickPadding: 10,
                  legend: "Jiwa",
                  legendPosition: "middle",
                  legendOffset: -40,
                }}
                enableLabel={false}
                legends={[{
                  dataFrom: "keys",
                  anchor: "top-right",
                  direction: "row",
                  translateY: -20,
                  itemWidth: 90,
                  itemHeight: 20,
                  symbolSize: 10,
                  symbolShape: "circle",
                }]}
                role="img"
                ariaLabel="Grafik distribusi usia"
              />
            </div>
          </motion.div>

          {/* Chart 2: Pekerjaan (Pie) */}
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, delay: 0.1 }}
            style={{
              background: "white",
              borderRadius: "20px",
              padding: "28px 20px 20px",
              boxShadow: "0 2px 16px rgba(26,107,60,0.06)",
            }}
          >
            <p style={{ fontSize: "14px", fontWeight: 700, color: "#111827", marginBottom: "4px" }}>
              💼 Mata Pencaharian
            </p>
            <p style={{ fontSize: "12px", color: "#9ca3af", marginBottom: "20px" }}>
              Distribusi pekerjaan warga desa
            </p>
            <div style={{ height: "280px" }}>
              <ResponsivePie
                data={pieOccData}
                margin={{ top: 20, right: 80, bottom: 20, left: 80 }}
                innerRadius={0.55}
                padAngle={2}
                cornerRadius={4}
                colors={{ datum: "data.color" }}
                theme={nivoTheme}
                arcLinkLabelsSkipAngle={10}
                arcLinkLabelsTextColor="#374151"
                arcLinkLabelsThickness={1}
                arcLinkLabelsColor={{ from: "color" }}
                arcLabelsSkipAngle={15}
                arcLabelsTextColor="white"
                enableArcLabels={false}
                legends={[{
                  anchor: "right",
                  direction: "column",
                  translateX: 80,
                  itemWidth: 75,
                  itemHeight: 18,
                  symbolSize: 10,
                  symbolShape: "circle",
                }]}
              />
            </div>
          </motion.div>

          {/* Chart 3: Pendidikan (Horizontal Bar) */}
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, delay: 0.2 }}
            style={{
              background: "white",
              borderRadius: "20px",
              padding: "28px 20px 20px",
              boxShadow: "0 2px 16px rgba(26,107,60,0.06)",
            }}
          >
            <p style={{ fontSize: "14px", fontWeight: 700, color: "#111827", marginBottom: "4px" }}>
              🎓 Tingkat Pendidikan
            </p>
            <p style={{ fontSize: "12px", color: "#9ca3af", marginBottom: "20px" }}>
              Distribusi jenjang pendidikan warga
            </p>
            <div style={{ height: "280px" }}>
              <ResponsiveBar
                data={barEduData}
                keys={["Jumlah"]}
                indexBy="Pendidikan"
                layout="horizontal"
                margin={{ top: 10, right: 30, bottom: 30, left: 90 }}
                padding={0.3}
                colors={["#2d9158"]}
                borderRadius={4}
                theme={nivoTheme}
                axisLeft={{
                  tickSize: 0,
                  tickPadding: 10,
                }}
                axisBottom={{
                  tickSize: 0,
                  tickPadding: 8,
                }}
                enableLabel
                label={({ value }) => `${value?.toLocaleString("id-ID")}`}
                labelSkipWidth={30}
                labelTextColor="white"
                role="img"
                ariaLabel="Grafik pendidikan"
              />
            </div>
          </motion.div>
        </div>

        {/* ── Footer note ── */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          style={{
            textAlign: "center",
            fontSize: "12px",
            color: "#9ca3af",
            marginTop: "32px",
          }}
        >
          📅 Data per {stats.year} · Sumber: Administrasi Desa Janti
          {stats.notes && ` · ${stats.notes}`}
        </motion.p>
      </div>

      {/* Shimmer animation */}
      <style>{`
        @keyframes shimmer {
          0%   { background-position: -200% 0; }
          100% { background-position:  200% 0; }
        }
      `}</style>
    </section>
  );
}