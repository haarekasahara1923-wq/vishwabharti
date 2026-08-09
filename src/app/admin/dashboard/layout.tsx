import AdminSidebar from "@/components/AdminSidebar";

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <AdminSidebar />
      <main style={{ flex: 1, padding: '30px', overflowY: 'auto' }}>
        {children}
      </main>
    </div>
  );
}
