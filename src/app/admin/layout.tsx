export default function AdminLayout({ children }: { children: React.ReactNode }) {
  // Admin pages have a totally different layout from public pages
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f4f6f8', color: '#333', fontFamily: 'var(--font-body)' }}>
      {children}
    </div>
  );
}
