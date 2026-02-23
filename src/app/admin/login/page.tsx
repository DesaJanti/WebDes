"use client";

import { useState } from "react";
import { motion }   from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import { useRouter }    from "next/navigation";
import { Eye, EyeOff, Loader2 } from "lucide-react";

export default function AdminLoginPage() {
  const router   = useRouter();
  const supabase = createClient();

  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState<string | null>(null);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error: authError } = await supabase.auth.signInWithPassword({
      email, password,
    });

    if (authError) {
      setError("Email atau password salah. Silakan coba lagi.");
      setLoading(false);
      return;
    }

    router.push("/admin");
    router.refresh();
  }

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(145deg, #071a0e 0%, #0d3d22 45%, #1a6b3c 100%)",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: "24px",
      position: "relative", overflow: "hidden",
    }}>
      {/* Decorative orbs */}
      <div style={{
        position: "absolute", top: "-80px", right: "-80px",
        width: "400px", height: "400px", borderRadius: "50%",
        background: "radial-gradient(circle, rgba(240,192,80,0.08) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />
      <div style={{
        position: "absolute", bottom: "-60px", left: "-60px",
        width: "300px", height: "300px", borderRadius: "50%",
        background: "radial-gradient(circle, rgba(76,175,118,0.10) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />

      <motion.div
        initial={{ opacity: 0, y: 28, scale: 0.97 }}
        animate={{ opacity: 1, y: 0,  scale: 1    }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        style={{
          width: "100%", maxWidth: "400px",
          background: "rgba(255,255,255,0.97)",
          borderRadius: "28px",
          padding: "44px 40px",
          boxShadow: "0 32px 80px rgba(0,0,0,0.3)",
          position: "relative", zIndex: 1,
        }}
      >
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, duration: 0.4, ease: "backOut" }}
            style={{
              width: "64px", height: "64px",
              borderRadius: "18px",
              background: "linear-gradient(135deg, #0d3d22, #1a6b3c)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "28px", margin: "0 auto 16px",
              boxShadow: "0 8px 24px rgba(26,107,60,0.30)",
            }}
          >
            🌾
          </motion.div>
          <h1 style={{
            fontFamily: "var(--font-playfair)",
            fontSize: "1.5rem", fontWeight: 700,
            color: "#111827", marginBottom: "4px",
          }}>
            Admin Desa Janti
          </h1>
          <p style={{ fontSize: "13px", color: "#9ca3af" }}>
            Masuk ke panel administrasi desa
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {/* Email */}
          <div>
            <label style={{
              display: "block", fontSize: "12px",
              fontWeight: 600, color: "#374151",
              marginBottom: "6px",
            }}>
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@desajanti.id"
              required
              style={{
                width: "100%", padding: "12px 14px",
                borderRadius: "12px",
                border: "1.5px solid #e5e7eb",
                fontSize: "14px", color: "#111827",
                outline: "none",
                transition: "border-color 0.2s",
                boxSizing: "border-box",
                background: "white",
              }}
              onFocus={(e) => (e.target.style.borderColor = "#1a6b3c")}
              onBlur={(e)  => (e.target.style.borderColor = "#e5e7eb")}
            />
          </div>

          {/* Password */}
          <div>
            <label style={{
              display: "block", fontSize: "12px",
              fontWeight: 600, color: "#374151",
              marginBottom: "6px",
            }}>
              Password
            </label>
            <div style={{ position: "relative" }}>
              <input
                type={showPass ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                style={{
                  width: "100%", padding: "12px 44px 12px 14px",
                  borderRadius: "12px",
                  border: "1.5px solid #e5e7eb",
                  fontSize: "14px", color: "#111827",
                  outline: "none",
                  transition: "border-color 0.2s",
                  boxSizing: "border-box",
                  background: "white",
                }}
                onFocus={(e) => (e.target.style.borderColor = "#1a6b3c")}
                onBlur={(e)  => (e.target.style.borderColor = "#e5e7eb")}
              />
              <button
                type="button"
                onClick={() => setShowPass((v) => !v)}
                style={{
                  position: "absolute", right: "12px", top: "50%",
                  transform: "translateY(-50%)",
                  background: "none", border: "none",
                  cursor: "pointer", color: "#9ca3af",
                  display: "flex", alignItems: "center",
                  padding: "4px",
                }}
              >
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Error message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                padding: "10px 14px", borderRadius: "10px",
                background: "#fef2f2", border: "1px solid #fecaca",
                color: "#991b1b", fontSize: "13px",
              }}
            >
              ⚠️ {error}
            </motion.div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            style={{
              marginTop: "4px",
              padding: "13px",
              borderRadius: "12px",
              background: loading
                ? "#9ca3af"
                : "linear-gradient(135deg, #1a6b3c, #2d9158)",
              color: "white",
              fontWeight: 700, fontSize: "14px",
              border: "none", cursor: loading ? "not-allowed" : "pointer",
              display: "flex", alignItems: "center",
              justifyContent: "center", gap: "8px",
              transition: "opacity 0.2s",
              boxShadow: loading ? "none" : "0 4px 16px rgba(26,107,60,0.30)",
            }}
          >
            {loading ? (
              <>
                <Loader2 size={16} style={{ animation: "spin 1s linear infinite" }} />
                Memproses...
              </>
            ) : (
              "Masuk ke Dashboard"
            )}
          </button>
        </form>

        <p style={{
          textAlign: "center", marginTop: "24px",
          fontSize: "12px", color: "#d1d5db",
        }}>
          Hanya untuk administrator resmi Desa Janti
        </p>
      </motion.div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}