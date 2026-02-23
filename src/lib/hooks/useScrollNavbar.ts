"use client";

import { useEffect, useState } from "react";

interface ScrollState {
  isScrolled: boolean;   // sudah scroll dari top?
  isVisible: boolean;    // navbar visible atau hidden?
}

export function useScrollNavbar(threshold = 50): ScrollState {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastY, setLastY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;

      // Sudah melewati threshold → aktifkan glassmorphism
      setIsScrolled(currentY > threshold);

      // Scroll ke atas → tampilkan navbar
      // Scroll ke bawah → sembunyikan navbar
      if (currentY < threshold) {
        setIsVisible(true);
      } else if (currentY < lastY) {
        setIsVisible(true);
      } else if (currentY > lastY + 10) {
        // tambah buffer 10px agar tidak flicker
        setIsVisible(false);
      }

      setLastY(currentY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastY, threshold]);

  return { isScrolled, isVisible };
}