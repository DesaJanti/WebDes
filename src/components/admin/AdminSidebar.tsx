"use client";

import { useState }    from "react";
import Link            from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import {
  LayoutDashboard, User, BarChart3, Newspaper,
  Building2, Image, LogOut, Menu, X, ChevronRight,
} from "lucide-react";

const NAV_ITEMS = [
  { href: "/admin",           label: "Dashboard",   icon: LayoutDashboard },
  { href: "/admin/profil",    label: "Profil Desa", icon: User            },
  { href: "/admin/statistik", label: "Statistik",   icon: BarChart3       },
  { href: "/admin/berita",    label: "Berita",      icon: Newspaper       },
  { href: "/admin/layanan",   label: "Layanan",     icon: Building2       },
  { href: "/admin/galeri",    label: "Galeri",      icon: Image           },
];

function isActive(pathname: string, href: string) {
  if (href === "/admin") return pathname === "/admin";
  return pathname.startsWith(href);
}

// ── Sidebar content (shared desktop & mobile) ─────────────────
function SidebarContent({
  pathname,
  onLinkClick,
  onLogout,
  loggingOut,
}: {
  pathname: string;
  onLinkClick: () => void;
  onLogout: () => void;
  loggingOut: boolean;
}) {
  return (
    <div style={{
      height: "100%",
      display: "flex", flexDirection: "column",
      background: "linear-gradient(180deg, #071a0e 0%, #0d3d22 100%)",
    }}>
      {/* Logo */}
      <div style={{
        padding: "28px 20px 24px",
        borderBottom: "1px solid rgba(255,255,255,0.07)",
        flexShrink: 0,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div style={{
            width: "40px", height: "40px", borderRadius: "12px",
            background: "linear-gradient(135deg, #1a6b3c, #2d9158)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "18px", flexShrink: 0,
          }}>
            🌾
          </div>
          <div>
            <p style={{
              fontFamily: "var(--font-playfair)",
              fontWeight: 700, fontSize: "14px", color: "white",
            }}>
              Desa Janti
            </p>
            <p style={{ fontSize: "10px", color: "rgba(255,255,255,0.4)" }}>
              Panel Administrasi
            </p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav style={{
        flex: 1, padding: "16px 12px",
        display: "flex", flexDirection: "column",
        gap: "4px", overflowY: "auto",
      }}>
        <p style={{
          fontSize: "10px", fontWeight: 700,
          color: "rgba(255,255,255,0.3)",
          textTransform: "uppercase", letterSpacing: "0.1em",
          padding: "0 8px", marginBottom: "8px",
        }}>
          Menu Utama
        </p>

        {NAV_ITEMS.map((item) => {
          const active = isActive(pathname, item.href);
          const Icon   = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onLinkClick}
              style={{
                display: "flex", alignItems: "center",
                justifyContent: "space-between",
                padding: "10px 12px", borderRadius: "12px",
                textDecoration: "none",
                transition: "all 0.2s ease",
                background: active
                  ? "rgba(255,255,255,0.10)"
                  : "transparent",
                border: active
                  ? "1px solid rgba(255,255,255,0.10)"
                  : "1px solid transparent",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <div style={{
                  width: "32px", height: "32px", borderRadius: "9px",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  background: active
                    ? "linear-gradient(135deg, #1a6b3c, #2d9158)"
                    : "rgba(255,255,255,0.06)",
                  flexShrink: 0,
                  transition: "background 0.2s",
                }}>
                  <Icon size={15} color={active ? "white" : "rgba(255,255,255,0.5)"} />
                </div>
                <span style={{
                  fontSize: "13px",
                  fontWeight: active ? 600 : 400,
                  color: active ? "white" : "rgba(255,255,255,0.55)",
                  transition: "color 0.2s",
                }}>
                  {item.label}
                </span>
              </div>
              {active && (
                <ChevronRight size={14} style={{ color: "rgba(255,255,255,0.4)" }} />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div style={{
        padding: "16px 12px",
        borderTop: "1px solid rgba(255,255,255,0.07)",
        flexShrink: 0,
      }}>
        {/* Lihat Website */}
        <Link
          href="/"
          style={{
            display: "flex", alignItems: "center", gap: "10px",
            padding: "10px 12px", borderRadius: "12px",
            textDecoration: "none", marginBottom: "8px",
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.06)",
            transition: "background 0.2s",
          }}
          onMouseEnter={(e: React.MouseEvent<HTMLAnchorElement>) =>
            (e.currentTarget.style.background = "rgba(255,255,255,0.09)")
          }
          onMouseLeave={(e: React.MouseEvent<HTMLAnchorElement>) =>
            (e.currentTarget.style.background = "rgba(255,255,255,0.04)")
          }
        >
          <span style={{ fontSize: "14px" }}>🌐</span>
          <span style={{ fontSize: "13px", color: "rgba(255,255,255,0.5)" }}>
            Lihat Website
          </span>
        </Link>

        {/* Logout */}
        <button
          onClick={onLogout}
          disabled={loggingOut}
          style={{
            width: "100%",
            display: "flex", alignItems: "center", gap: "10px",
            padding: "10px 12px", borderRadius: "12px",
            background: "rgba(239,68,68,0.10)",
            border: "1px solid rgba(239,68,68,0.15)",
            cursor: loggingOut ? "not-allowed" : "pointer",
            transition: "background 0.2s",
          }}
          onMouseEnter={(e: React.MouseEvent<HTMLButtonElement>) => {
            if (!loggingOut)
              e.currentTarget.style.background = "rgba(239,68,68,0.18)";
          }}
          onMouseLeave={(e: React.MouseEvent<HTMLButtonElement>) =>
            (e.currentTarget.style.background = "rgba(239,68,68,0.10)")
          }
        >
          <LogOut size={15} style={{ color: "#f87171" }} />
          <span style={{ fontSize: "13px", color: "#f87171", fontWeight: 500 }}>
            {loggingOut ? "Keluar..." : "Keluar"}
          </span>
        </button>
      </div>
    </div>
  );
}

// ── Main export ───────────────────────────────────────────────
export default function AdminSidebar() {
  const pathname = usePathname();
  const router   = useRouter();
  const supabase = createClient();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  async function handleLogout() {
    setLoggingOut(true);
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <>
      {/* ── Desktop sidebar ── */}
      <aside className="admin-sidebar-desktop" style={{
        width: "240px", flexShrink: 0,
        height: "100vh", position: "sticky", top: 0,
      }}>
        <SidebarContent
          pathname={pathname}
          onLinkClick={() => {}}
          onLogout={handleLogout}
          loggingOut={loggingOut}
        />
      </aside>

      {/* ── Mobile topbar ── */}
      <div
        className="admin-topbar-mobile"
        style={{
          position: "fixed", top: 0, left: 0, right: 0,
          zIndex: 50, height: "60px",
          background: "#0d3d22",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 16px",
          boxShadow: "0 2px 16px rgba(0,0,0,0.2)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <span style={{ fontSize: "20px" }}>🌾</span>
          <span style={{
            fontFamily: "var(--font-playfair)",
            fontWeight: 700, fontSize: "14px", color: "white",
          }}>
            Admin Desa Janti
          </span>
        </div>
        <button
          onClick={() => setMobileOpen((v) => !v)}
          style={{
            background: "rgba(255,255,255,0.10)",
            border: "none", borderRadius: "10px",
            width: "36px", height: "36px",
            display: "flex", alignItems: "center", justifyContent: "center",
            cursor: "pointer", color: "white",
          }}
        >
          {mobileOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      {/* ── Mobile drawer ── */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              style={{
                position: "fixed", inset: 0, zIndex: 40,
                background: "rgba(0,0,0,0.5)",
              }}
            />
            {/* Drawer */}
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              style={{
                position: "fixed", top: 0, left: 0, bottom: 0,
                width: "260px", zIndex: 50,
              }}
            >
              <SidebarContent
                pathname={pathname}
                onLinkClick={() => setMobileOpen(false)}
                onLogout={handleLogout}
                loggingOut={loggingOut}
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ── Responsive styles ── */}
      <style>{`
        .admin-sidebar-desktop { display: none;  }
        .admin-topbar-mobile   { display: flex;  }
        .admin-mobile-pad      { display: block; }

        @media (min-width: 1024px) {
          .admin-sidebar-desktop { display: block !important; }
          .admin-topbar-mobile   { display: none  !important; }
          .admin-mobile-pad      { display: none  !important; }
        }
      `}</style>
    </>
  );
}