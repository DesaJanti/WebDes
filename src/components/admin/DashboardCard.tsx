"use client";

import Link from "next/link";

interface Props {
  label: string;
  value: string | number;
  sub: string;
  icon: React.ReactNode;
  href: string;
  accent?: boolean;
}

export function DashboardSummaryCard({ label, value, sub, icon, href, accent = false }: Props) {
  return (
    <Link href={href} style={{ textDecoration: "none" }}>
      <div style={{
        padding: "24px 20px", borderRadius: "20px",
        background: accent ? "linear-gradient(135deg, #0d3d22, #1a6b3c)" : "white",
        border: accent ? "none" : "1px solid #e8f5e9",
        boxShadow: accent ? "0 8px 32px rgba(26,107,60,0.22)" : "0 2px 12px rgba(26,107,60,0.05)",
        transition: "transform 0.2s, box-shadow 0.2s",
        cursor: "pointer",
      }}
        onMouseEnter={(e: React.MouseEvent<HTMLElement>) => {
          e.currentTarget.style.transform = "translateY(-3px)";
          e.currentTarget.style.boxShadow = accent
            ? "0 16px 48px rgba(26,107,60,0.30)"
            : "0 8px 28px rgba(26,107,60,0.12)";
        }}
        onMouseLeave={(e: React.MouseEvent<HTMLElement>) => {
          e.currentTarget.style.transform = "translateY(0)";
          e.currentTarget.style.boxShadow = accent
            ? "0 8px 32px rgba(26,107,60,0.22)"
            : "0 2px 12px rgba(26,107,60,0.05)";
        }}
      >
        <div style={{
          width: "40px", height: "40px", borderRadius: "11px",
          background: accent ? "rgba(255,255,255,0.15)" : "#e8f5e9",
          display: "flex", alignItems: "center", justifyContent: "center",
          marginBottom: "16px",
          color: accent ? "white" : "#1a6b3c",
        }}>
          {icon}
        </div>
        <p style={{
          fontFamily: "var(--font-playfair)",
          fontSize: "1.75rem", fontWeight: 700,
          color: accent ? "white" : "#111827",
          lineHeight: 1, marginBottom: "6px",
        }}>
          {value}
        </p>
        <p style={{ fontSize: "13px", fontWeight: 600, color: accent ? "rgba(255,255,255,0.7)" : "#374151", marginBottom: "2px" }}>
          {label}
        </p>
        <p style={{ fontSize: "11px", color: accent ? "rgba(255,255,255,0.45)" : "#9ca3af" }}>
          {sub}
        </p>
      </div>
    </Link>
  );
}

export function QuickActionItem({ label, desc, icon, href }: {
  label: string; desc: string; icon: React.ReactNode; href: string;
}) {
  return (
    <Link href={href} style={{ textDecoration: "none" }}>
      <div style={{
        display: "flex", alignItems: "center",
        justifyContent: "space-between",
        padding: "12px 12px", borderRadius: "12px",
        transition: "background 0.2s", cursor: "pointer",
      }}
        onMouseEnter={(e: React.MouseEvent<HTMLElement>) =>
          (e.currentTarget.style.background = "#f2f7f4")
        }
        onMouseLeave={(e: React.MouseEvent<HTMLElement>) =>
          (e.currentTarget.style.background = "transparent")
        }
      >
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div style={{
            width: "34px", height: "34px", borderRadius: "10px",
            background: "#e8f5e9", display: "flex",
            alignItems: "center", justifyContent: "center",
            color: "#1a6b3c", flexShrink: 0,
          }}>
            {icon}
          </div>
          <div>
            <p style={{ fontSize: "13px", fontWeight: 600, color: "#111827" }}>{label}</p>
            <p style={{ fontSize: "11px", color: "#9ca3af" }}>{desc}</p>
          </div>
        </div>
        <span style={{ color: "#9ca3af", fontSize: "14px" }}>→</span>
      </div>
    </Link>
  );
}