"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function LoadingScreen() {
  const [isDone, setIsDone] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsDone(true);
      setTimeout(() => setIsVisible(false), 900);
    }, 2200);
    return () => clearTimeout(timer);
  }, []);

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      {!isDone && (
        <motion.div
          key="loading"
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            scale: 1.04,
            transition: { duration: 0.7, ease: "easeInOut" },
          }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center"
          style={{ backgroundColor: "#0d3d22" }}
        >
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, ease: "backOut" }}
            className="relative w-24 h-24 mb-7"
          >
            <svg
              className="absolute inset-0 w-full h-full"
              style={{ animation: "spin 2s linear infinite" }}
              viewBox="0 0 96 96"
              fill="none"
            >
              <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
              <circle cx="48" cy="48" r="44" stroke="rgba(76,175,118,0.2)" strokeWidth="3" />
              <path d="M48 4 A44 44 0 0 1 92 48" stroke="#4caf76" strokeWidth="3" strokeLinecap="round" />
              <path d="M48 4 A44 44 0 0 0 4 48" stroke="#f0c050" strokeWidth="3" strokeLinecap="round" opacity="0.6" />
            </svg>
            <div
              className="absolute inset-0 flex items-center justify-center text-4xl"
              style={{ animation: "iconPulse 2s ease-in-out infinite" }}
            >
              🌾
              <style>{`
                @keyframes iconPulse {
                  0%, 100% { transform: scale(1); }
                  50%       { transform: scale(1.15); }
                }
              `}</style>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="text-center mb-6"
          >
            <h1
              className="text-xl font-bold text-white mb-1"
              style={{ fontFamily: "var(--font-playfair, Georgia, serif)" }}
            >
              Desa Janti
            </h1>
            <p className="text-sm" style={{ color: "rgba(255,255,255,0.45)" }}>
              Kec. Slahung, Kab. Ponorogo
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.4 }}
            className="w-48"
          >
            <div className="w-full h-1 rounded-full overflow-hidden mb-3" style={{ background: "rgba(255,255,255,0.1)" }}>
              <div
                className="h-full rounded-full"
                style={{
                  background: "linear-gradient(90deg, #4caf76, #f0c050)",
                  animation: "loadBar 2s ease-in-out forwards",
                }}
              />
              <style>{`
                @keyframes loadBar {
                  0%   { width: 0%; }
                  25%  { width: 38%; }
                  55%  { width: 68%; }
                  80%  { width: 88%; }
                  100% { width: 100%; }
                }
              `}</style>
            </div>
            <LoadingStatusText />
          </motion.div>

          <div className="absolute bottom-10 flex gap-2">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="w-1.5 h-1.5 rounded-full"
                style={{ backgroundColor: "#4caf76" }}
                animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.2, 0.8] }}
                transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2, ease: "easeInOut" }}
              />
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function LoadingStatusText() {
  const messages = ["Memuat website desa...", "Menyiapkan data desa...", "Hampir selesai..."];
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const t1 = setTimeout(() => setIdx(1), 700);
    const t2 = setTimeout(() => setIdx(2), 1500);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  return (
    <AnimatePresence mode="wait">
      <motion.p
        key={idx}
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -4 }}
        transition={{ duration: 0.25 }}
        className="text-center text-xs"
        style={{ color: "rgba(255,255,255,0.45)" }}
      >
        {messages[idx]}
      </motion.p>
    </AnimatePresence>
  );
}