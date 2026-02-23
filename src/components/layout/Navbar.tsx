"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { useScrollNavbar } from "@/lib/hooks/useScrollNavbar";

const NAV_LINKS = [
  { label: "Beranda",   href: "/"          },
  { label: "Profil",    href: "/profil"    },
  { label: "Statistik", href: "/statistik" },
  { label: "Berita",    href: "/berita"    },
  { label: "Layanan",   href: "/layanan"   },
  { label: "Galeri",    href: "/galeri"    },
];

export default function Navbar() {
  const { isScrolled, isVisible } = useScrollNavbar(60);
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      {/* ── Desktop Navbar ── */}
      <motion.header
        initial={{ y: 0, opacity: 1 }}
        animate={{
          y: isVisible ? 0 : -120,
          opacity: isVisible ? 1 : 0,
        }}
        transition={{ duration: 0.35, ease: "easeInOut" }}
        className="fixed top-0 left-0 right-0 z-50 flex justify-center pt-5 px-4"
        style={{ pointerEvents: isVisible ? "auto" : "none" }}
      >
        <motion.nav
          animate={{
            backgroundColor: isScrolled
              ? "rgba(255,255,255,0.75)"
              : "rgba(255,255,255,0)",
            backdropFilter: isScrolled ? "blur(16px)" : "blur(0px)",
            boxShadow: isScrolled
              ? "0 4px 32px rgba(26,107,60,0.10), 0 1px 0 rgba(26,107,60,0.06)"
              : "none",
            borderColor: isScrolled
              ? "rgba(26,107,60,0.12)"
              : "rgba(255,255,255,0)",
          }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
          className="hidden md:flex items-center gap-1 px-3 py-2 rounded-full border"
          style={{ willChange: "background-color, box-shadow" }}
        >
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 px-3 py-1.5 rounded-full mr-2 transition-all duration-200 hover:bg-sage-50"
          >
            <span className="text-xl">🌾</span>
            <div className="leading-tight">
              <p
                className="text-xs font-bold"
                style={{
                  color: isScrolled ? "#1a6b3c" : "white",
                  textShadow: isScrolled ? "none" : "0 1px 4px rgba(0,0,0,0.3)",
                  transition: "color 0.4s",
                  fontFamily: "var(--font-playfair)",
                }}
              >
                Desa Janti
              </p>
              <p
                className="text-xs"
                style={{
                  color: isScrolled ? "#6b7280" : "rgba(255,255,255,0.75)",
                  textShadow: isScrolled ? "none" : "0 1px 4px rgba(0,0,0,0.3)",
                  transition: "color 0.4s",
                  fontSize: "10px",
                }}
              >
                Slahung, Ponorogo
              </p>
            </div>
          </Link>

          {/* Divider */}
          <div
            className="w-px h-5 mx-1 transition-colors duration-400"
            style={{
              backgroundColor: isScrolled
                ? "rgba(26,107,60,0.15)"
                : "rgba(255,255,255,0.2)",
            }}
          />

          {/* Nav Links */}
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="px-4 py-2 rounded-full text-sm font-medium transition-all duration-200"
              style={{
                color: isScrolled ? "#374151" : "rgba(255,255,255,0.9)",
                textShadow: isScrolled ? "none" : "0 1px 4px rgba(0,0,0,0.2)",
              }}
              onMouseEnter={(e) => {
                (e.target as HTMLElement).style.backgroundColor = isScrolled
                  ? "#e8f5e9"
                  : "rgba(255,255,255,0.15)";
                (e.target as HTMLElement).style.color = isScrolled
                  ? "#1a6b3c"
                  : "white";
              }}
              onMouseLeave={(e) => {
                (e.target as HTMLElement).style.backgroundColor = "transparent";
                (e.target as HTMLElement).style.color = isScrolled
                  ? "#374151"
                  : "rgba(255,255,255,0.9)";
              }}
            >
              {link.label}
            </Link>
          ))}

          {/* Divider */}
          <div
            className="w-px h-5 mx-1 transition-colors duration-400"
            style={{
              backgroundColor: isScrolled
                ? "rgba(26,107,60,0.15)"
                : "rgba(255,255,255,0.2)",
            }}
          />

          {/* Admin Button */}
          <Link
            href="/admin"
            className="px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200"
            style={{
              backgroundColor: isScrolled ? "#1a6b3c" : "rgba(255,255,255,0.2)",
              color: "white",
              border: isScrolled ? "none" : "1px solid rgba(255,255,255,0.4)",
            }}
            onMouseEnter={(e) => {
              (e.target as HTMLElement).style.backgroundColor = isScrolled
                ? "#2d9158"
                : "rgba(255,255,255,0.3)";
            }}
            onMouseLeave={(e) => {
              (e.target as HTMLElement).style.backgroundColor = isScrolled
                ? "#1a6b3c"
                : "rgba(255,255,255,0.2)";
            }}
          >
            Admin
          </Link>
        </motion.nav>

        {/* ── Mobile Navbar ── */}
        <motion.div
          animate={{
            backgroundColor: isScrolled || menuOpen
              ? "rgba(255,255,255,0.85)"
              : "rgba(255,255,255,0)",
            backdropFilter: isScrolled || menuOpen ? "blur(16px)" : "blur(0px)",
            boxShadow: isScrolled || menuOpen
              ? "0 4px 32px rgba(26,107,60,0.10)"
              : "none",
            borderColor: isScrolled || menuOpen
              ? "rgba(26,107,60,0.12)"
              : "rgba(255,255,255,0)",
          }}
          transition={{ duration: 0.3 }}
          className="md:hidden flex flex-col w-full max-w-sm mx-auto rounded-3xl border overflow-hidden"
        >
          {/* Mobile Top Bar */}
          <div className="flex items-center justify-between px-5 py-3">
            <Link href="/" className="flex items-center gap-2">
              <span className="text-lg">🌾</span>
              <p
                className="text-sm font-bold"
                style={{
                  color: isScrolled || menuOpen ? "#1a6b3c" : "white",
                  textShadow:
                    isScrolled || menuOpen ? "none" : "0 1px 4px rgba(0,0,0,0.3)",
                  fontFamily: "var(--font-playfair)",
                  transition: "color 0.3s",
                }}
              >
                Desa Janti
              </p>
            </Link>
            <button
              onClick={() => setMenuOpen((v) => !v)}
              className="p-2 rounded-full transition-colors"
              style={{
                color: isScrolled || menuOpen ? "#1a6b3c" : "white",
                backgroundColor:
                  isScrolled || menuOpen
                    ? "rgba(26,107,60,0.08)"
                    : "rgba(255,255,255,0.15)",
              }}
              aria-label="Toggle menu"
            >
              {menuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>

          {/* Mobile Dropdown */}
          <AnimatePresence>
            {menuOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="overflow-hidden"
              >
                <div className="px-4 pb-4 flex flex-col gap-1">
                  {NAV_LINKS.map((link, i) => (
                    <motion.div
                      key={link.href}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                    >
                      <Link
                        href={link.href}
                        onClick={() => setMenuOpen(false)}
                        className="block px-4 py-2.5 rounded-2xl text-sm font-medium text-gray-700 hover:bg-sage-50 hover:text-sage-700 transition-colors"
                        style={{ color: "#374151" }}
                      >
                        {link.label}
                      </Link>
                    </motion.div>
                  ))}
                  <Link
                    href="/admin"
                    onClick={() => setMenuOpen(false)}
                    className="mt-1 text-center px-4 py-2.5 rounded-2xl text-sm font-semibold text-white transition-colors"
                    style={{ backgroundColor: "#1a6b3c" }}
                  >
                    Admin
                  </Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.header>
    </>
  );
}