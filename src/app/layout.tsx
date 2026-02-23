import type { Metadata } from "next";
import "./globals.css";
import Navbar       from "@/components/layout/Navbar";
import Footer       from "@/components/layout/Footer";
import LoadingScreen from "@/components/ui/LoadingScreen";

export const metadata: Metadata = {
  title: {
    default: "Desa Janti — Kec. Slahung, Kab. Ponorogo",
    template: "%s | Desa Janti",
  },
  description: "Website resmi Desa Janti, Kecamatan Slahung, Kabupaten Ponorogo.",
  keywords: ["Desa Janti", "Slahung", "Ponorogo", "website desa"],
  openGraph: {
    title: "Desa Janti — Kec. Slahung, Kab. Ponorogo",
    description: "Website resmi Desa Janti.",
    locale: "id_ID",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body style={{
        fontFamily: "var(--font-sans, system-ui, sans-serif)",
        backgroundColor: "#fdfbf5",
        color: "#111827",
        overflowX: "hidden",
      }}>
        <LoadingScreen />
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}