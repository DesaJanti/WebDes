"use client";


import Link from "next/link";
import { MapPin, Phone, Mail, Clock } from "lucide-react";

const NAV_LINKS = [
  { label: "Beranda",   href: "/"          },
  { label: "Profil",    href: "/profil"    },
  { label: "Statistik", href: "/statistik" },
  { label: "Berita",    href: "/berita"    },
  { label: "Layanan",   href: "/layanan"   },
  { label: "Galeri",    href: "/galeri"    },
];
export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer
      style={{
        background: "linear-gradient(160deg, #0a2e18 0%, #0d3d22 60%, #071a0e 100%)",
        color: "white",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Top wave separator */}
      <div style={{ lineHeight: 0, marginTop: "-1px" }}>
        <svg
          viewBox="0 0 1440 60"
          preserveAspectRatio="none"
          style={{ display: "block", width: "100%", height: "60px" }}
        >
          <path
            d="M0,0 C360,60 1080,0 1440,40 L1440,0 L0,0 Z"
            fill="white"
          />
        </svg>
      </div>

      {/* Decorative orbs */}
      <div style={{
        position: "absolute", top: "20%", right: "-80px",
        width: "300px", height: "300px", borderRadius: "50%",
        background: "radial-gradient(circle, rgba(240,192,80,0.06) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />
      <div style={{
        position: "absolute", bottom: "10%", left: "-60px",
        width: "250px", height: "250px", borderRadius: "50%",
        background: "radial-gradient(circle, rgba(76,175,118,0.07) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />

      <div
        style={{
          maxWidth: "72rem",
          margin: "0 auto",
          padding: "60px 24px 40px",
        }}
      >
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "48px",
          marginBottom: "56px",
        }}>

          {/* Brand column */}
          <div style={{ gridColumn: "span 1" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "18px" }}>
              <span style={{ fontSize: "28px" }}>🌾</span>
              <div>
                <p style={{
                  fontFamily: "var(--font-playfair)",
                  fontWeight: 700, fontSize: "1.1rem", color: "white",
                }}>
                  Desa Janti
                </p>
                <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.45)" }}>
                  Kec. Slahung, Kab. Ponorogo
                </p>
              </div>
            </div>
            <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.5)", lineHeight: 1.8, marginBottom: "20px" }}>
              Portal resmi Desa Janti. Mewujudkan desa yang maju, transparan, dan sejahtera bagi seluruh warga.
            </p>
            
            <div style={{ display: "flex", gap: "10px" }}>
              {["📘", "📸", "📺"].map((icon, i) => (
                <a
                  key={i}
                  href="#"
                  style={{
                    width: "36px", height: "36px", borderRadius: "10px",
                    background: "rgba(255,255,255,0.08)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "16px", textDecoration: "none",
                    transition: "background 0.2s",
                  }}
                  onMouseEnter={(e: React.MouseEvent<HTMLAnchorElement>) =>
                    (e.currentTarget.style.background = "rgba(255,255,255,0.16)")
                  }
                  onMouseLeave={(e: React.MouseEvent<HTMLAnchorElement>) =>
                    (e.currentTarget.style.background = "rgba(255,255,255,0.08)")
                  }
                >
                  {icon}
                </a>
              ))}
            </div>
          </div>

          {/* Quick links */}
          <div>
            <p style={{
              fontSize: "12px", fontWeight: 700, color: "#f0c050",
              textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "18px",
            }}>
              Navigasi
            </p>
            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "10px" }}>
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    style={{
                      fontSize: "13px", color: "rgba(255,255,255,0.55)",
                      textDecoration: "none", transition: "color 0.2s",
                      display: "inline-flex", alignItems: "center", gap: "6px",
                    }}
                    onMouseEnter={(e: React.MouseEvent<HTMLAnchorElement>) =>
                      (e.currentTarget.style.color = "#f0c050")
                    }
                    onMouseLeave={(e: React.MouseEvent<HTMLAnchorElement>) =>
                      (e.currentTarget.style.color = "rgba(255,255,255,0.55)")
                    }
                  >
                    <span style={{ color: "#2d9158", fontSize: "10px" }}>▶</span>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <p style={{
              fontSize: "12px", fontWeight: 700, color: "#f0c050",
              textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "18px",
            }}>
              Kontak Desa
            </p>
            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "14px" }}>
              {[
                { icon: <MapPin size={14} />, text: "Jl. Janti No.1, Kec. Slahung, Kab. Ponorogo, Jawa Timur" },
                { icon: <Phone size={14} />, text: "+62 xxx-xxxx-xxxx" },
                { icon: <Mail size={14} />,  text: "desajanti@ponorogo.go.id" },
                { icon: <Clock size={14} />, text: "Senin–Jumat, 08.00–14.00 WIB" },
              ].map((item, i) => (
                <li key={i} style={{ display: "flex", gap: "10px", alignItems: "flex-start" }}>
                  <span style={{ color: "#2d9158", flexShrink: 0, marginTop: "2px" }}>
                    {item.icon}
                  </span>
                  <span style={{ fontSize: "13px", color: "rgba(255,255,255,0.5)", lineHeight: 1.6 }}>
                    {item.text}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Jam layanan card */}
          <div>
            <p style={{
              fontSize: "12px", fontWeight: 700, color: "#f0c050",
              textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "18px",
            }}>
              Jam Layanan
            </p>
            <div style={{
              padding: "20px", borderRadius: "16px",
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.08)",
            }}>
              {[
                { day: "Senin – Kamis", time: "08.00 – 14.00" },
                { day: "Jumat",         time: "08.00 – 11.00" },
                { day: "Sabtu",         time: "Tutup"          },
                { day: "Minggu",        time: "Tutup"          },
              ].map((row) => (
                <div
                  key={row.day}
                  style={{
                    display: "flex", justifyContent: "space-between",
                    paddingBottom: "8px", marginBottom: "8px",
                    borderBottom: "1px solid rgba(255,255,255,0.06)",
                  }}
                >
                  <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.45)" }}>{row.day}</span>
                  <span style={{
                    fontSize: "12px", fontWeight: 600,
                    color: row.time === "Tutup" ? "#ef4444" : "#4caf76",
                  }}>
                    {row.time}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div style={{ height: "1px", background: "rgba(255,255,255,0.08)", marginBottom: "28px" }} />

        {/* Bottom bar */}
        <div style={{
          display: "flex", alignItems: "center",
          justifyContent: "space-between", flexWrap: "wrap", gap: "12px",
        }}>
          <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.3)" }}>
            © {year} Pemerintah Desa Janti, Kec. Slahung, Kab. Ponorogo. Hak cipta dilindungi.
          </p>
          <div style={{ display: "flex", gap: "20px" }}>
            {["Kebijakan Privasi", "Syarat Penggunaan"].map((text) => (
              <a
                key={text}
                href="#"
                style={{
                  fontSize: "12px", color: "rgba(255,255,255,0.3)",
                  textDecoration: "none", transition: "color 0.2s",
                }}
                onMouseEnter={(e: React.MouseEvent<HTMLAnchorElement>) =>
                  (e.currentTarget.style.color = "rgba(255,255,255,0.65)")
                }
                onMouseLeave={(e: React.MouseEvent<HTMLAnchorElement>) =>
                  (e.currentTarget.style.color = "rgba(255,255,255,0.3)")
                }
              >
                {text}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}