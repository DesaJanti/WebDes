"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { ChevronDown, CheckCircle2 } from "lucide-react";
import type { VillageService } from "@/types/database";

const ICON_MAP: Record<string, string> = {
  FileText: "📄", CreditCard: "💳", Home: "🏠",
  Users: "👥", Baby: "👶", Heart: "❤️",
  Truck: "🚛", Building: "🏢", TreePine: "🌿", Landmark: "🏛️",
};

function resolveIcon(icon: string | null): string {
  if (!icon) return "📋";
  if (icon.length <= 4) return icon;
  return ICON_MAP[icon] ?? "📋";
}

// ── Service accordion card ────────────────────────────────────
function ServiceCard({
  service, index, isOpen, onToggle,
}: {
  service: VillageService;
  index: number;
  isOpen: boolean;
  onToggle: () => void;
}) {
  const icon = resolveIcon(service.icon);

  const reqList: string[] = service.requirements
    ? service.requirements.split(/\n|;/).map((s) => s.trim()).filter(Boolean)
    : [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.06 }}
      style={{
        borderRadius: "16px",
        border: isOpen ? "1.5px solid #1a6b3c" : "1.5px solid #e5e7eb",
        overflow: "hidden",
        transition: "border-color 0.25s ease, box-shadow 0.25s ease",
        boxShadow: isOpen
          ? "0 8px 32px rgba(26,107,60,0.12)"
          : "0 2px 8px rgba(0,0,0,0.04)",
        background: "white",
      }}
    >
      {/* Header */}
      <button
        onClick={onToggle}
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          gap: "16px",
          padding: "20px 22px",
          background: "none",
          border: "none",
          cursor: "pointer",
          textAlign: "left",
        }}
      >
        <div
          style={{
            width: "44px", height: "44px",
            borderRadius: "12px",
            background: isOpen
              ? "linear-gradient(135deg,#1a6b3c,#2d9158)"
              : "#f2f7f4",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "20px",
            flexShrink: 0,
            transition: "background 0.25s ease",
          }}
        >
          {icon}
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{
            fontSize: "15px", fontWeight: 700,
            color: isOpen ? "#1a6b3c" : "#111827",
            marginBottom: "3px",
            transition: "color 0.25s",
          }}>
            {service.title}
          </p>
          {service.description && (
            <p style={{
              fontSize: "12px", color: "#9ca3af", lineHeight: 1.5,
              display: "-webkit-box",
              WebkitLineClamp: 1,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}>
              {service.description}
            </p>
          )}
        </div>

        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.25 }}
          style={{ flexShrink: 0 }}
        >
          <ChevronDown size={18} style={{ color: isOpen ? "#1a6b3c" : "#9ca3af" }} />
        </motion.div>
      </button>

      {/* Accordion body */}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="body"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            style={{ overflow: "hidden" }}
          >
            <div style={{ padding: "0 22px 22px", borderTop: "1px solid #f0fdf4" }}>
              {reqList.length > 0 ? (
                <>
                  <p style={{
                    fontSize: "12px", fontWeight: 700, color: "#6b7280",
                    textTransform: "uppercase", letterSpacing: "0.07em",
                    margin: "16px 0 12px",
                  }}>
                    📋 Persyaratan
                  </p>
                  <ul style={{ display: "flex", flexDirection: "column", gap: "8px", listStyle: "none", padding: 0, margin: 0 }}>
                    {reqList.map((req, i) => (
                      <motion.li
                        key={i}
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.04 }}
                        style={{
                          display: "flex", alignItems: "flex-start", gap: "8px",
                          fontSize: "13px", color: "#374151", lineHeight: 1.5,
                        }}
                      >
                        <CheckCircle2 size={14} style={{ color: "#2d9158", flexShrink: 0, marginTop: "2px" }} />
                        {req}
                      </motion.li>
                    ))}
                  </ul>
                </>
              ) : (
                <p style={{ fontSize: "13px", color: "#9ca3af", marginTop: "14px", fontStyle: "italic" }}>
                  Hubungi kantor desa untuk informasi lebih lanjut.
                </p>
              )}

              {/* CTA row */}
              <div style={{
                marginTop: "18px", padding: "14px 16px",
                borderRadius: "12px", background: "#f2f7f4",
                display: "flex", alignItems: "center",
                justifyContent: "space-between", gap: "12px", flexWrap: "wrap",
              }}>
                <div>
                  <p style={{ fontSize: "12px", fontWeight: 600, color: "#1a6b3c", margin: 0 }}>
                    📍 Kantor Desa Janti
                  </p>
                  <p style={{ fontSize: "11px", color: "#6b7280", margin: 0, marginTop: "4px" }}>
                    Senin – Jumat · 08.00 – 14.00 WIB
                  </p>
                </div>
                
                <a
                  href="https://wa.me/62"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: "inline-flex", alignItems: "center", gap: "6px",
                    padding: "8px 16px", borderRadius: "9999px",
                    backgroundColor: "#25d366", color: "white",
                    fontSize: "12px", fontWeight: 600, textDecoration: "none",
                  }}
                  onMouseEnter={(e: React.MouseEvent<HTMLAnchorElement>) => {
                    e.currentTarget.style.opacity = "0.85";
                  }}
                  onMouseLeave={(e: React.MouseEvent<HTMLAnchorElement>) => {
                    e.currentTarget.style.opacity = "1";
                  }}
                >
                  💬 Tanya via WA
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ── Fallback ──────────────────────────────────────────────────
const FALLBACK_SERVICES: VillageService[] = [
  { id: "1", sort_order: 1, is_active: true, icon: "📄",
    title: "Surat Keterangan Domisili",
    description: "Penerbitan surat keterangan tempat tinggal warga desa",
    requirements: "KTP asli dan fotokopi;KK asli dan fotokopi;Surat pengantar RT/RW" },
  { id: "2", sort_order: 2, is_active: true, icon: "👶",
    title: "Surat Kelahiran",
    description: "Pengajuan akta kelahiran untuk warga baru",
    requirements: "Surat keterangan lahir dari bidan/RS;KTP kedua orang tua;KK asli;Buku nikah" },
  { id: "3", sort_order: 3, is_active: true, icon: "🏠",
    title: "Surat Keterangan Tidak Mampu",
    description: "Surat resmi untuk keperluan beasiswa, BPJS, dan bantuan sosial",
    requirements: "KTP dan KK;Surat pengantar RT/RW;Foto kondisi rumah" },
  { id: "4", sort_order: 4, is_active: true, icon: "✅",
    title: "Legalisasi Surat",
    description: "Legalisasi berbagai dokumen resmi warga desa",
    requirements: "Dokumen asli yang akan dilegalisasi;Fotokopi dokumen (3 rangkap);KTP pemohon" },
  { id: "5", sort_order: 5, is_active: true, icon: "💳",
    title: "Pengantar SKCK",
    description: "Surat pengantar untuk pembuatan SKCK di Polsek Slahung",
    requirements: "KTP asli dan fotokopi;KK;Pas foto 4×6 sebanyak 2 lembar;Surat pengantar RT/RW" },
  { id: "6", sort_order: 6, is_active: true, icon: "🏛️",
    title: "Surat Ahli Waris",
    description: "Pengesahan surat keterangan ahli waris untuk keperluan legal",
    requirements: "KTP semua ahli waris;Akta kematian;KK;Surat nikah almarhum;Surat pengantar RT/RW" },
];

// ── Main component ────────────────────────────────────────────
interface LayananSectionProps {
  services: VillageService[];
}

export default function LayananSection({ services }: LayananSectionProps) {
  const [openId, setOpenId] = useState<string | null>(null);
  const data = services?.length > 0 ? services : FALLBACK_SERVICES;
  const toggle = (id: string) => setOpenId((prev) => (prev === id ? null : id));

  return (
    <section id="layanan" style={{ background: "#f2f7f4" }}>
      <div className="section-inner">

        {/* Header */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr auto",
          alignItems: "flex-end",
          gap: "24px",
          marginBottom: "48px",
        }}>
          <div>
            <div className="section-tag" style={{ marginBottom: "12px" }}>
              🏛️ Pelayanan Publik
            </div>
            <h2 className="section-title">
              Layanan <span>Desa Janti</span>
            </h2>
            <p style={{ color: "#6b7280", marginTop: "10px", maxWidth: "480px", fontSize: "14px" }}>
              Kami hadir untuk membantu kebutuhan administrasi warga.
              Klik layanan untuk melihat persyaratan lengkap.
            </p>
          </div>

          {/* Jam pelayanan — hanya desktop */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="hidden lg:block"
            style={{
              padding: "16px 20px",
              borderRadius: "16px",
              background: "white",
              border: "1px solid #e8f5e9",
              boxShadow: "0 2px 12px rgba(26,107,60,0.07)",
              minWidth: "200px",
            }}
          >
            <p style={{
              fontSize: "11px", color: "#9ca3af", marginBottom: "10px",
              fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em",
            }}>
              Jam Pelayanan
            </p>
            {[
              { day: "Senin – Kamis", time: "08.00 – 14.00", closed: false },
              { day: "Jumat",         time: "08.00 – 11.00", closed: false },
              { day: "Sabtu – Minggu",time: "Tutup",          closed: true  },
            ].map((row) => (
              <div key={row.day} style={{
                display: "flex", justifyContent: "space-between",
                gap: "16px", marginBottom: "5px",
              }}>
                <span style={{ fontSize: "12px", color: "#374151" }}>{row.day}</span>
                <span style={{
                  fontSize: "12px", fontWeight: 600,
                  color: row.closed ? "#ef4444" : "#1a6b3c",
                }}>
                  {row.time}
                </span>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Services grid */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))",
          gap: "14px",
        }}>
          {data.map((service, i) => (
            <ServiceCard
              key={service.id}
              service={service}
              index={i}
              isOpen={openId === service.id}
              onToggle={() => toggle(service.id)}
            />
          ))}
        </div>

        {/* Bottom CTA banner */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          style={{
            marginTop: "40px", padding: "32px 40px",
            borderRadius: "24px",
            background: "linear-gradient(135deg, #0f4d28, #1a6b3c)",
            display: "flex", alignItems: "center",
            justifyContent: "space-between",
            gap: "24px", flexWrap: "wrap",
            position: "relative", overflow: "hidden",
          }}
        >
          {/* Decorative circle */}
          <div style={{
            position: "absolute", top: "-40px", right: "-40px",
            width: "180px", height: "180px", borderRadius: "50%",
            background: "rgba(240,192,80,0.08)", pointerEvents: "none",
          }} />

          <div>
            <p style={{
              fontFamily: "var(--font-playfair)",
              fontSize: "1.3rem", fontWeight: 700,
              color: "white", marginBottom: "6px",
            }}>
              Butuh bantuan layanan lainnya?
            </p>
            <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.6)" }}>
              Tim kami siap membantu. Datang langsung atau hubungi via WhatsApp.
            </p>
          </div>

          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
            
            <a
              href="https://wa.me/6281333933683"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "inline-flex", alignItems: "center", gap: "8px",
                padding: "12px 22px", borderRadius: "9999px",
                backgroundColor: "#25d366", color: "white",
                fontWeight: 700, fontSize: "13px", textDecoration: "none",
                boxShadow: "0 4px 16px rgba(37,211,102,0.35)",
              }}
              onMouseEnter={(e: React.MouseEvent<HTMLAnchorElement>) => {
                e.currentTarget.style.opacity = "0.85";
              }}
              onMouseLeave={(e: React.MouseEvent<HTMLAnchorElement>) => {
                e.currentTarget.style.opacity = "1";
              }}
            >
              💬 WhatsApp
            </a>
            
            <a
              href="/#statistik"
              style={{
                display: "inline-flex", alignItems: "center", gap: "8px",
                padding: "12px 22px", borderRadius: "9999px",
                backgroundColor: "rgba(255,255,255,0.12)", color: "white",
                fontWeight: 600, fontSize: "13px", textDecoration: "none",
                border: "1px solid rgba(255,255,255,0.2)",
              }}
              onMouseEnter={(e: React.MouseEvent<HTMLAnchorElement>) => {
                e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.22)";
              }}
              onMouseLeave={(e: React.MouseEvent<HTMLAnchorElement>) => {
                e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.12)";
              }}
            >
              📊 Lihat Statistik
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}