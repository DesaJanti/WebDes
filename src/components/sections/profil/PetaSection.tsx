"use client";

import { motion } from "framer-motion";
import { MapPin, Phone, Clock, Navigation } from "lucide-react";
import React from "react";

interface Props {
  mapsEmbedUrl: string | null;
  address: string | null;
}

const INFO_ITEMS = [
  {
    icon: <MapPin size={18} />,
    label: "Alamat Kantor",
    value: "Jl. Raya Ngumpul Slahung, Krajan, Janti, Kec. Slahung, Kabupaten Ponorogo, Jawa Timur 63463",
  },
  {
    icon: <Phone size={18} />,
    label: "Telepon",
    value: "+62 81333933683",
  },
  {
    icon: <Clock size={18} />,
    label: "Jam Pelayanan",
    value: "Senin–Kamis 08.00–14.00 · Jumat 08.00–11.00",
  },
  {
    icon: <Navigation size={18} />,
    label: "Koordinat",
    value: "-7.9746052, 111.4095047",
  },
];

// Link Embed Google Maps resmi untuk Balai Desa Janti, Slahung
const DEFAULT_MAPS_URL = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3950.435555132356!2d111.4073160750529!3d-7.974605192050519!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e79752e83700077%3A0xf73f5cc9baaa9547!2sBalai%20Desa%20Janti!5e0!3m2!1sid!2sid!4v1708570000000!5m2!1sid!2sid";

export default function PetaSection({ mapsEmbedUrl, address }: Props) {
  const embedUrl = mapsEmbedUrl || DEFAULT_MAPS_URL;

  return (
    <section style={{ background: "white", padding: "80px 24px" }}>
      <div style={{ maxWidth: "72rem", margin: "0 auto" }}>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{ textAlign: "center", marginBottom: "48px" }}
        >
          <div className="section-tag" style={{ marginBottom: "14px" }}>
            📍 Lokasi
          </div>
          <h2 className="section-title">
            Balai Desa <span>Janti</span>
          </h2>
          <p style={{ color: "#6b7280", marginTop: "10px", fontSize: "14px" }}>
            Temukan lokasi kantor Desa Janti dan informasi kontak resmi
          </p>
        </motion.div>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: "28px",
          alignItems: "start",
        }}>

          {/* Map embed */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55 }}
            style={{
              borderRadius: "24px",
              overflow: "hidden",
              boxShadow: "0 8px 40px rgba(26,107,60,0.12)",
              border: "1px solid #e8f5e9",
              aspectRatio: "4/3",
            }}
          >
            <iframe
              src={embedUrl}
              width="100%"
              height="100%"
              style={{ border: 0, display: "block" }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Lokasi Balai Desa Janti"
            />
          </motion.div>

          {/* Info cards */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, delay: 0.1 }}
            style={{ display: "flex", flexDirection: "column", gap: "14px" }}
          >
            {INFO_ITEMS.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07 }}
                style={{
                  display: "flex", 
                  gap: "16px",
                  padding: "18px 20px",
                  borderRadius: "16px",
                  background: "#f2f7f4",
                  border: "1px solid #e8f5e9",
                  alignItems: "flex-start",
                }}
              >
                <div style={{
                  width: "40px", height: "40px",
                  borderRadius: "12px",
                  background: "#1a6b3c",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  flexShrink: 0,
                  color: "white",
                }}>
                  {item.icon}
                </div>
                <div>
                  <p style={{ 
                    fontSize: "11px", color: "#9ca3af", fontWeight: 600,
                    textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "4px" 
                  }}>
                    {item.label}
                  </p>
                  <p style={{ fontSize: "14px", color: "#374151", lineHeight: 1.6 }}>
                    {item.value}
                  </p>
                </div>
              </motion.div>
            ))}

            {/* Directions button */}
            <a
              href={`https://www.google.com/maps/dir/?api=1&destination=Balai%20Desa%20Janti%20Slahung%20Ponorogo&destination_place_id=ChIJdwBwgy51eS4RR7WKuslcz_c`}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "flex", 
                alignItems: "center", 
                justifyContent: "center",
                gap: "8px", 
                padding: "14px",
                borderRadius: "16px",
                background: "linear-gradient(135deg, #1a6b3c, #2d9158)",
                color: "white", 
                fontWeight: 700, 
                fontSize: "14px",
                textDecoration: "none",
                boxShadow: "0 4px 20px rgba(26,107,60,0.25)",
                transition: "opacity 0.2s",
              }}
              onMouseEnter={(e: React.MouseEvent<HTMLAnchorElement>) =>
                (e.currentTarget.style.opacity = "0.88")
              }
              onMouseLeave={(e: React.MouseEvent<HTMLAnchorElement>) =>
                (e.currentTarget.style.opacity = "1")
              }
            >
              <Navigation size={16} />
              Petunjuk Arah ke Balai Desa
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}