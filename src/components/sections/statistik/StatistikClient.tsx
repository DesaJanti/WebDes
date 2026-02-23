"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import dynamic from "next/dynamic";
import { ArrowLeft } from "lucide-react";
import { useCountUp } from "@/lib/hooks/useCountUp";
import type {
  PopulationStats, AgeDistribution,
  OccupationDistribution, EducationDistribution,
} from "@/types/database";

const ResponsiveBar = dynamic(
  () => import("@nivo/bar").then((m) => m.ResponsiveBar),
  { ssr: false }
);
const ResponsivePie = dynamic(
  () => import("@nivo/pie").then((m) => m.ResponsivePie),
  { ssr: false }
);
const ResponsiveLine = dynamic(
  () => import("@nivo/line").then((m) => m.ResponsiveLine),
  { ssr: false }
);

const nivoTheme = {
  fontFamily: "var(--font-sans, system-ui)",
  fontSize: 11,
  textColor: "#6b7280",
  grid: { line: { stroke: "#f0fdf4", strokeWidth: 1 } },
  tooltip: {
    container: {
      background: "white", borderRadius: "10px",
      boxShadow: "0 8px 24px rgba(0,0,0,0.10)",
      fontSize: "12px", padding: "10px 14px",
    },
  },
};

// Fallbacks
const FALLBACK_AGE: AgeDistribution[] = [
  { id:"1",stats_id:"",age_group:"0–4",  male_count:95,  female_count:88  },
  { id:"2",stats_id:"",age_group:"5–14", male_count:180, female_count:172 },
  { id:"3",stats_id:"",age_group:"15–24",male_count:210, female_count:198 },
  { id:"4",stats_id:"",age_group:"25–34",male_count:225, female_count:218 },
  { id:"5",stats_id:"",age_group:"35–44",male_count:195, female_count:190 },
  { id:"6",stats_id:"",age_group:"45–54",male_count:160, female_count:155 },
  { id:"7",stats_id:"",age_group:"55–64",male_count:110, female_count:118 },
  { id:"8",stats_id:"",age_group:"65+",  male_count:70,  female_count:82  },
];
const FALLBACK_OCC: OccupationDistribution[] = [
  { id:"1",stats_id:"",occupation:"Petani",    count:820 },
  { id:"2",stats_id:"",occupation:"Wiraswasta",count:340 },
  { id:"3",stats_id:"",occupation:"PNS/TNI",   count:120 },
  { id:"4",stats_id:"",occupation:"Buruh",     count:280 },
  { id:"5",stats_id:"",occupation:"Pelajar",   count:410 },
  { id:"6",stats_id:"",occupation:"Lainnya",   count:190 },
];
const FALLBACK_EDU: EducationDistribution[] = [
  { id:"1",stats_id:"",level:"Belum Sekolah",count:180 },
  { id:"2",stats_id:"",level:"SD",           count:520 },
  { id:"3",stats_id:"",level:"SMP",          count:410 },
  { id:"4",stats_id:"",level:"SMA",          count:380 },
  { id:"5",stats_id:"",level:"D3/S1",        count:150 },
  { id:"6",stats_id:"",level:"S2+",          count:28  },
];

function BigStatCard({ value, suffix = "", label, icon, delay, accent = false }: {
  value: number; suffix?: string; label: string;
  icon: string; delay: number; accent?: boolean;
}) {
  const { ref, display } = useCountUp({ end: value, duration: 2200, suffix });
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      style={{
        padding: "28px 24px", borderRadius: "20px",
        background: accent ? "linear-gradient(135deg,#1a6b3c,#2d9158)" : "white",
        border: accent ? "none" : "1px solid #e8f5e9",
        boxShadow: accent
          ? "0 12px 40px rgba(26,107,60,0.25)"
          : "0 2px 16px rgba(26,107,60,0.06)",
        textAlign: "center",
      }}
    >
      <div style={{ fontSize: "32px", marginBottom: "12px" }}>{icon}</div>
      <p
        ref={ref as React.RefObject<HTMLParagraphElement>}
        style={{
          fontFamily: "var(--font-playfair)",
          fontSize: "clamp(1.8rem, 4vw, 2.6rem)",
          fontWeight: 700,
          color: accent ? "white" : "#111827",
          lineHeight: 1, marginBottom: "8px",
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

function ChartCard({ title, subtitle, children, span = 1 }: {
  title: string; subtitle: string;
  children: React.ReactNode; span?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      style={{
        background: "white", borderRadius: "20px",
        padding: "28px 20px",
        boxShadow: "0 2px 16px rgba(26,107,60,0.06)",
        border: "1px solid #e8f5e9",
        gridColumn: span > 1 ? `span ${span}` : undefined,
      }}
    >
      <p style={{ fontSize: "15px", fontWeight: 700, color: "#111827", marginBottom: "4px" }}>
        {title}
      </p>
      <p style={{ fontSize: "12px", color: "#9ca3af", marginBottom: "20px" }}>
        {subtitle}
      </p>
      {children}
    </motion.div>
  );
}

interface Props {
  stats: PopulationStats;
  allStats: PopulationStats[];
  ageData: AgeDistribution[];
  occupationData: OccupationDistribution[];
  educationData: EducationDistribution[];
}

export default function StatistikClient({
  stats, allStats, ageData, occupationData, educationData,
}: Props) {
  const ages  = ageData.length        > 0 ? ageData        : FALLBACK_AGE;
  const occs  = occupationData.length > 0 ? occupationData : FALLBACK_OCC;
  const edus  = educationData.length  > 0 ? educationData  : FALLBACK_EDU;

  const barAgeData = ages.map((d) => ({
    "Kelompok Usia": d.age_group,
    "Laki-laki": d.male_count,
    "Perempuan": d.female_count,
  }));

  const pieOccData = occs.map((d, i) => ({
    id: d.occupation, label: d.occupation, value: d.count,
    color: ["#1a6b3c","#2d9158","#3dab6e","#f0c050","#e8a820","#96c0a8"][i % 6],
  }));

  const barEduData = edus.map((d) => ({
    "Pendidikan": d.level, "Jumlah": d.count,
  }));

  // Trend chart (jika multi-tahun)
  const trendData = allStats.length > 1
    ? [{
        id: "Penduduk",
        color: "#1a6b3c",
        data: [...allStats]
          .sort((a, b) => a.year - b.year)
          .map((s) => ({ x: s.year.toString(), y: s.total_population })),
      }]
    : null;

  return (
    <>
      {/* Page header */}
      <div style={{
        background: "linear-gradient(135deg, #0a2e18 0%, #1a6b3c 100%)",
        padding: "120px 24px 60px",
      }}>
        <div style={{ maxWidth: "72rem", margin: "0 auto" }}>
          <Link
            href="/"
            style={{
              display: "inline-flex", alignItems: "center", gap: "6px",
              fontSize: "13px", color: "rgba(255,255,255,0.6)",
              textDecoration: "none", marginBottom: "20px",
            }}
          >
            <ArrowLeft size={14} /> Kembali ke Beranda
          </Link>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: "6px",
            padding: "4px 14px", borderRadius: "9999px",
            background: "rgba(240,192,80,0.15)",
            border: "1px solid rgba(240,192,80,0.25)",
            color: "#f0c050", fontSize: "12px", fontWeight: 600,
            marginBottom: "16px",
          }}>
            📊 Data Kependudukan
          </div>
          <h1 style={{
            fontFamily: "var(--font-playfair)",
            fontSize: "clamp(2rem, 5vw, 3rem)",
            fontWeight: 700, color: "white",
          }}>
            Statistik <span style={{ color: "#f0c050" }}>Desa Janti</span>
          </h1>
          <p style={{ color: "rgba(255,255,255,0.55)", marginTop: "10px", fontSize: "14px" }}>
            Data kependudukan Desa Janti · Tahun {stats.year}
          </p>
        </div>
      </div>

      <div style={{ maxWidth: "72rem", margin: "0 auto", padding: "48px 24px 80px" }}>

        {/* Summary cards */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
          gap: "16px", marginBottom: "40px",
        }}>
          <BigStatCard value={stats.total_population} label="Total Penduduk"     icon="👥" delay={0}    accent />
          <BigStatCard value={stats.total_male}        label="Laki-laki"          icon="👨" delay={0.07} />
          <BigStatCard value={stats.total_female}      label="Perempuan"          icon="👩" delay={0.14} />
          <BigStatCard value={stats.total_families}    label="Kepala Keluarga"    icon="🏠" delay={0.21} />
          <BigStatCard value={stats.total_rw}          label="RW"                 icon="🏘️" delay={0.28} />
          <BigStatCard value={stats.total_rt}          label="RT"                 icon="🏡" delay={0.35} />
        </div>

        {/* Gender ratio card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{
            background: "white", borderRadius: "20px",
            padding: "24px 28px", marginBottom: "28px",
            border: "1px solid #e8f5e9",
            boxShadow: "0 2px 16px rgba(26,107,60,0.06)",
          }}
        >
          <p style={{ fontSize: "14px", fontWeight: 700, color: "#111827", marginBottom: "16px" }}>
            ⚖️ Rasio Jenis Kelamin
          </p>
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <span style={{ fontSize: "13px", color: "#1a6b3c", fontWeight: 600, minWidth: "80px" }}>
              Laki-laki {((stats.total_male / stats.total_population) * 100).toFixed(1)}%
            </span>
            <div style={{ flex: 1, height: "12px", borderRadius: "9999px", background: "#f0fdf4", overflow: "hidden" }}>
              <div style={{
                height: "100%", borderRadius: "9999px",
                background: "linear-gradient(90deg, #1a6b3c, #f0c050)",
                width: `${(stats.total_male / stats.total_population) * 100}%`,
                transition: "width 1s ease",
              }} />
            </div>
            <span style={{ fontSize: "13px", color: "#b45309", fontWeight: 600, minWidth: "80px", textAlign: "right" }}>
              {((stats.total_female / stats.total_population) * 100).toFixed(1)}% Perempuan
            </span>
          </div>
        </motion.div>

        {/* Charts grid */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(12, 1fr)",
          gap: "20px",
        }}>
          {/* Age chart — full width */}
          <div style={{ gridColumn: "1 / -1" }}>
            <ChartCard
              title="📊 Distribusi Usia"
              subtitle="Perbandingan laki-laki & perempuan per kelompok usia"
            >
              <div style={{ height: "320px" }}>
                <ResponsiveBar
                  data={barAgeData}
                  keys={["Laki-laki","Perempuan"]}
                  indexBy="Kelompok Usia"
                  groupMode="grouped"
                  margin={{ top: 10, right: 20, bottom: 50, left: 55 }}
                  padding={0.25} innerPadding={3}
                  colors={["#1a6b3c","#f0c050"]}
                  borderRadius={4}
                  theme={nivoTheme}
                  axisBottom={{ tickSize:0, tickPadding:10, legend:"Kelompok Usia", legendPosition:"middle", legendOffset:40 }}
                  axisLeft={{ tickSize:0, tickPadding:10, legend:"Jiwa", legendPosition:"middle", legendOffset:-45 }}
                  enableLabel={false}
                  legends={[{
                    dataFrom:"keys", anchor:"top-right", direction:"row",
                    translateY:-20, itemWidth:90, itemHeight:20,
                    symbolSize:10, symbolShape:"circle",
                  }]}
                />
              </div>
            </ChartCard>
          </div>

          {/* Occupation pie — 5 cols */}
          <div style={{ gridColumn: "1 / 6" }}>
            <ChartCard title="💼 Mata Pencaharian" subtitle="Distribusi pekerjaan warga">
              <div style={{ height: "300px" }}>
                <ResponsivePie
                  data={pieOccData}
                  margin={{ top: 20, right: 100, bottom: 20, left: 20 }}
                  innerRadius={0.55} padAngle={2} cornerRadius={4}
                  colors={{ datum: "data.color" }}
                  theme={nivoTheme}
                  arcLinkLabelsSkipAngle={10}
                  arcLinkLabelsTextColor="#374151"
                  arcLinkLabelsThickness={1}
                  arcLinkLabelsColor={{ from: "color" }}
                  enableArcLabels={false}
                  legends={[{
                    anchor:"right", direction:"column",
                    translateX:100, itemWidth:90,
                    itemHeight:18, symbolSize:10, symbolShape:"circle",
                  }]}
                />
              </div>
            </ChartCard>
          </div>

          {/* Education bar — 7 cols */}
          <div style={{ gridColumn: "6 / -1" }}>
            <ChartCard title="🎓 Tingkat Pendidikan" subtitle="Distribusi jenjang pendidikan warga">
              <div style={{ height: "300px" }}>
                <ResponsiveBar
                  data={barEduData}
                  keys={["Jumlah"]}
                  indexBy="Pendidikan"
                  layout="horizontal"
                  margin={{ top: 10, right: 60, bottom: 30, left: 100 }}
                  padding={0.3}
                  colors={["#2d9158"]}
                  borderRadius={4}
                  theme={nivoTheme}
                  axisLeft={{ tickSize:0, tickPadding:10 }}
                  axisBottom={{ tickSize:0, tickPadding:8 }}
                  enableLabel
                  label={({ value }) => `${value?.toLocaleString("id-ID")}`}
                  labelSkipWidth={30}
                  labelTextColor="white"
                />
              </div>
            </ChartCard>
          </div>

          {/* Trend chart — hanya jika multi-tahun */}
          {trendData && (
            <div style={{ gridColumn: "1 / -1" }}>
              <ChartCard
                title="📈 Tren Pertumbuhan Penduduk"
                subtitle="Perubahan jumlah penduduk dari tahun ke tahun"
              >
                <div style={{ height: "260px" }}>
                  <ResponsiveLine
                    data={trendData}
                    margin={{ top: 20, right: 20, bottom: 50, left: 60 }}
                    xScale={{ type: "point" }}
                    yScale={{ type: "linear", min: "auto", max: "auto" }}
                    curve="monotoneX"
                    colors={["#1a6b3c"]}
                    theme={nivoTheme}
                    pointSize={8}
                    pointColor="white"
                    pointBorderWidth={2}
                    pointBorderColor="#1a6b3c"
                    enableArea
                    areaOpacity={0.08}
                    axisBottom={{ tickSize:0, tickPadding:10, legend:"Tahun", legendPosition:"middle", legendOffset:40 }}
                    axisLeft={{ tickSize:0, tickPadding:10, legend:"Jiwa", legendPosition:"middle", legendOffset:-50 }}
                    enableGridX={false}
                  />
                </div>
              </ChartCard>
            </div>
          )}
        </div>

        {/* Data table */}
        {allStats.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{
              marginTop: "28px", background: "white",
              borderRadius: "20px", overflow: "hidden",
              border: "1px solid #e8f5e9",
              boxShadow: "0 2px 16px rgba(26,107,60,0.06)",
            }}
          >
            <div style={{ padding: "24px 28px 16px" }}>
              <p style={{ fontSize: "15px", fontWeight: 700, color: "#111827" }}>
                📋 Rekap Data Historis
              </p>
            </div>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ background: "#f2f7f4" }}>
                    {["Tahun","Total Penduduk","Laki-laki","Perempuan","KK","RW","RT"].map((h) => (
                      <th key={h} style={{
                        padding: "12px 20px", textAlign: "left",
                        fontSize: "12px", fontWeight: 700,
                        color: "#6b7280", textTransform: "uppercase",
                        letterSpacing: "0.05em", whiteSpace: "nowrap",
                      }}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {allStats.map((s, i) => (
                    <tr
                      key={s.id}
                      style={{
                        borderTop: "1px solid #f3f4f6",
                        background: s.is_current ? "#f0fdf4" : "white",
                      }}
                    >
                      <td style={{ padding: "14px 20px", fontSize: "14px", fontWeight: s.is_current ? 700 : 400, color: "#111827" }}>
                        {s.year} {s.is_current && <span style={{ fontSize: "10px", color: "#1a6b3c", marginLeft: "4px" }}>● Terkini</span>}
                      </td>
                      {[s.total_population, s.total_male, s.total_female, s.total_families, s.total_rw, s.total_rt].map((v, j) => (
                        <td key={j} style={{ padding: "14px 20px", fontSize: "14px", color: "#374151" }}>
                          {v.toLocaleString("id-ID")}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        <p style={{ textAlign: "center", fontSize: "12px", color: "#9ca3af", marginTop: "28px" }}>
          📅 Data per {stats.year} · Sumber: Administrasi Desa Janti
        </p>
      </div>
    </>
  );
}