"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { X, ZoomIn, ChevronLeft, ChevronRight } from "lucide-react";
import type { GalleryItem } from "@/types/database";

// ── Lightbox ──────────────────────────────────────────────────
function Lightbox({
  items,
  index,
  onClose,
  onPrev,
  onNext,
}: {
  items: GalleryItem[];
  index: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}) {
  const item = items[index];
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, zIndex: 9998,
        backgroundColor: "rgba(0,0,0,0.92)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "20px",
      }}
    >
      {/* Close */}
      <button
        onClick={onClose}
        style={{
          position: "absolute", top: "20px", right: "20px",
          width: "40px", height: "40px", borderRadius: "50%",
          background: "rgba(255,255,255,0.12)", border: "none",
          display: "flex", alignItems: "center", justifyContent: "center",
          cursor: "pointer", color: "white",
        }}
      >
        <X size={18} />
      </button>

      {/* Prev */}
      {index > 0 && (
        <button
          onClick={(e) => { e.stopPropagation(); onPrev(); }}
          style={{
            position: "absolute", left: "20px",
            width: "44px", height: "44px", borderRadius: "50%",
            background: "rgba(255,255,255,0.12)", border: "none",
            display: "flex", alignItems: "center", justifyContent: "center",
            cursor: "pointer", color: "white",
          }}
        >
          <ChevronLeft size={22} />
        </button>
      )}

      {/* Next */}
      {index < items.length - 1 && (
        <button
          onClick={(e) => { e.stopPropagation(); onNext(); }}
          style={{
            position: "absolute", right: "20px",
            width: "44px", height: "44px", borderRadius: "50%",
            background: "rgba(255,255,255,0.12)", border: "none",
            display: "flex", alignItems: "center", justifyContent: "center",
            cursor: "pointer", color: "white",
          }}
        >
          <ChevronRight size={22} />
        </button>
      )}

      {/* Image */}
      <motion.div
        key={index}
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: "900px", width: "100%",
          borderRadius: "20px", overflow: "hidden",
          boxShadow: "0 32px 80px rgba(0,0,0,0.5)",
        }}
      >
        {item.image_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={item.image_url}
            alt={item.title}
            style={{ width: "100%", maxHeight: "75vh", objectFit: "cover", display: "block" }}
          />
        ) : (
          <div style={{
            height: "400px",
            background: "linear-gradient(135deg,#1a6b3c,#2d9158)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "80px",
          }}>
            🌾
          </div>
        )}
        <div style={{ background: "white", padding: "20px 24px" }}>
          <p style={{ fontWeight: 700, color: "#111827", marginBottom: "4px" }}>{item.title}</p>
          {item.description && (
            <p style={{ fontSize: "13px", color: "#6b7280" }}>{item.description}</p>
          )}
          <p style={{ fontSize: "11px", color: "#9ca3af", marginTop: "6px" }}>
            {index + 1} / {items.length}
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ── Gallery card ──────────────────────────────────────────────
function GalleryCard({
  item, index, onClick,
}: {
  item: GalleryItem;
  index: number;
  onClick: () => void;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.94 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: (index % 6) * 0.07 }}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        borderRadius: "16px",
        overflow: "hidden",
        cursor: "pointer",
        position: "relative",
        background: "#e8f5e9",
        aspectRatio: index % 5 === 0 ? "1 / 1.2" : "1 / 1",
        boxShadow: hovered
          ? "0 16px 48px rgba(26,107,60,0.20)"
          : "0 2px 12px rgba(0,0,0,0.06)",
        transition: "box-shadow 0.3s ease",
      }}
    >
      {/* Image */}
      {item.image_url ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={item.image_url}
          alt={item.title}
          style={{
            width: "100%", height: "100%",
            objectFit: "cover", display: "block",
            transform: hovered ? "scale(1.06)" : "scale(1)",
            transition: "transform 0.4s ease",
          }}
        />
      ) : (
        <div style={{
          width: "100%", height: "100%",
          background: "linear-gradient(135deg,#1a6b3c,#2d9158)",
          display: "flex", alignItems: "center",
          justifyContent: "center", fontSize: "48px",
        }}>
          🌾
        </div>
      )}

      {/* Overlay */}
      <motion.div
        animate={{ opacity: hovered ? 1 : 0 }}
        transition={{ duration: 0.25 }}
        style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(to top, rgba(10,40,20,0.85) 0%, rgba(0,0,0,0.1) 60%)",
          display: "flex", flexDirection: "column",
          justifyContent: "flex-end", padding: "16px",
        }}
      >
        <div style={{
          display: "flex", alignItems: "center",
          justifyContent: "space-between", gap: "8px",
        }}>
          <p style={{
            color: "white", fontWeight: 600,
            fontSize: "13px", lineHeight: 1.3,
          }}>
            {item.title}
          </p>
          <div style={{
            width: "32px", height: "32px", borderRadius: "50%",
            background: "rgba(255,255,255,0.2)",
            backdropFilter: "blur(8px)",
            display: "flex", alignItems: "center", justifyContent: "center",
            flexShrink: 0,
          }}>
            <ZoomIn size={14} color="white" />
          </div>
        </div>
        {item.category && (
          <span style={{
            display: "inline-block", marginTop: "6px",
            padding: "2px 8px", borderRadius: "9999px",
            fontSize: "10px", fontWeight: 600,
            backgroundColor: "rgba(240,192,80,0.3)",
            color: "#f0c050",
          }}>
            {item.category}
          </span>
        )}
      </motion.div>
    </motion.div>
  );
}

// ── Fallback gallery data ─────────────────────────────────────
const FALLBACK_GALLERY: GalleryItem[] = [
  { id:"1", title:"Kantor Desa Janti",        description:"Gedung kantor pelayanan", image_url:"", category:"Infrastruktur", sort_order:1, is_active:true, created_at:"" },
  { id:"2", title:"Jalan Desa",               description:"Infrastruktur jalan desa", image_url:"", category:"Infrastruktur", sort_order:2, is_active:true, created_at:"" },
  { id:"3", title:"Sawah Desa Janti",         description:"Area pertanian warga",     image_url:"", category:"Pertanian",    sort_order:3, is_active:true, created_at:"" },
  { id:"4", title:"Gotong Royong",            description:"Kegiatan bersama warga",   image_url:"", category:"Kegiatan",     sort_order:4, is_active:true, created_at:"" },
  { id:"5", title:"Posyandu Balita",          description:"Pelayanan kesehatan desa", image_url:"", category:"Kesehatan",    sort_order:5, is_active:true, created_at:"" },
  { id:"6", title:"Musyawarah Desa",          description:"Rapat bersama warga",      image_url:"", category:"Kegiatan",     sort_order:6, is_active:true, created_at:"" },
  { id:"7", title:"Lapangan Desa",            description:"Fasilitas olahraga warga", image_url:"", category:"Infrastruktur",sort_order:7, is_active:true, created_at:"" },
  { id:"8", title:"Pemuda Karang Taruna",     description:"Organisasi pemuda desa",   image_url:"", category:"Kegiatan",     sort_order:8, is_active:true, created_at:"" },
];

// ── Main component ────────────────────────────────────────────
interface GaleriSectionProps { items: GalleryItem[]; }

export default function GaleriSection({ items }: GaleriSectionProps) {
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);
  const [activeCategory, setActiveCategory] = useState("Semua");

  const data = items.length > 0 ? items : FALLBACK_GALLERY;

  // Unique categories
  const categories = ["Semua", ...Array.from(new Set(data.map((d) => d.category)))];

  const filtered = activeCategory === "Semua"
    ? data
    : data.filter((d) => d.category === activeCategory);

  return (
    <section id="galeri" style={{ background: "white" }}>
      <div className="section-inner">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          style={{ textAlign: "center", marginBottom: "40px" }}
        >
          <div className="section-tag" style={{ marginBottom: "14px" }}>
            📸 Dokumentasi Desa
          </div>
          <h2 className="section-title">
            Galeri <span>Desa Janti</span>
          </h2>
          <p style={{ color: "#6b7280", marginTop: "10px", fontSize: "14px" }}>
            Potret kehidupan dan kegiatan warga Desa Janti
          </p>
        </motion.div>

        {/* Category filter */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.1 }}
          style={{
            display: "flex", gap: "8px",
            flexWrap: "wrap", justifyContent: "center",
            marginBottom: "36px",
          }}
        >
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              style={{
                padding: "8px 18px", borderRadius: "9999px",
                fontSize: "13px", fontWeight: 600,
                cursor: "pointer", border: "1.5px solid",
                transition: "all 0.2s ease",
                backgroundColor: activeCategory === cat ? "#1a6b3c" : "white",
                borderColor:     activeCategory === cat ? "#1a6b3c" : "#e5e7eb",
                color:           activeCategory === cat ? "white"   : "#6b7280",
              }}
            >
              {cat}
            </button>
          ))}
        </motion.div>

        {/* Masonry-style grid */}
        <motion.div
          layout
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
            gap: "14px",
          }}
        >
          <AnimatePresence>
            {filtered.map((item, i) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
              >
                <GalleryCard
                  item={item}
                  index={i}
                  onClick={() => setLightboxIdx(i)}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxIdx !== null && (
          <Lightbox
            items={filtered}
            index={lightboxIdx}
            onClose={() => setLightboxIdx(null)}
            onPrev={() => setLightboxIdx((p) => Math.max(0, (p ?? 0) - 1))}
            onNext={() => setLightboxIdx((p) => Math.min(filtered.length - 1, (p ?? 0) + 1))}
          />
        )}
      </AnimatePresence>
    </section>
  );
}