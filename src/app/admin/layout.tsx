import AdminSidebar from "@/components/admin/AdminSidebar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f8faf8" }}>
      <AdminSidebar />
      <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column" }}>
        {/* Spacer untuk mobile topbar */}
        <div className="admin-mobile-pad" style={{ height: "60px", flexShrink: 0 }} />
        <main style={{ flex: 1, padding: "32px 28px", overflowX: "hidden" }}>
          {children}
        </main>
      </div>
    </div>
  );
}