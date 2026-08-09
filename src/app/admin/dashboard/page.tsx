import { db } from "@/db";
import { galleryItems, announcements } from "@/db/schema";
import { eq, count } from "drizzle-orm";

export const revalidate = 0;

export default async function DashboardHome() {
  let galleryCount = 0;
  let announcementCount = 0;

  try {
    const [gc] = await db.select({ count: count() }).from(galleryItems);
    const [ac] = await db.select({ count: count() }).from(announcements).where(eq(announcements.isActive, true));
    galleryCount = Number(gc?.count ?? 0);
    announcementCount = Number(ac?.count ?? 0);
  } catch {
    // ignore
  }

  return (
    <div>
      <h1 style={{ fontSize: "2rem", color: "var(--secondary-color)", marginBottom: "30px" }}>Dashboard Overview</h1>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "20px" }}>
        <div style={{ background: "white", padding: "25px", borderRadius: "10px", boxShadow: "0 4px 6px rgba(0,0,0,0.05)" }}>
          <h3 style={{ color: "#888", marginBottom: "10px" }}>🖼️ Total Gallery Items</h3>
          <p style={{ fontSize: "2.5rem", fontWeight: "bold", color: "var(--primary-color)", margin: 0 }}>{galleryCount}</p>
        </div>

        <div style={{ background: "white", padding: "25px", borderRadius: "10px", boxShadow: "0 4px 6px rgba(0,0,0,0.05)" }}>
          <h3 style={{ color: "#888", marginBottom: "10px" }}>📢 Active Announcements</h3>
          <p style={{ fontSize: "2.5rem", fontWeight: "bold", color: "var(--primary-color)", margin: 0 }}>{announcementCount}</p>
        </div>

        <div style={{ background: "white", padding: "25px", borderRadius: "10px", boxShadow: "0 4px 6px rgba(0,0,0,0.05)" }}>
          <h3 style={{ color: "#888", marginBottom: "10px" }}>🌐 Website Status</h3>
          <p style={{ fontSize: "1.2rem", fontWeight: "bold", color: "#2e7d32", margin: 0 }}>✅ Live</p>
        </div>
      </div>

      <div style={{ marginTop: "30px", background: "white", padding: "25px", borderRadius: "10px", boxShadow: "0 4px 6px rgba(0,0,0,0.05)" }}>
        <h3 style={{ color: "#444", marginBottom: "15px" }}>Quick Links</h3>
        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
          {[
            { label: "📸 Manage Gallery", href: "/admin/dashboard/gallery" },
            { label: "📢 Manage Announcements", href: "/admin/dashboard/announcements" },
            { label: "👥 Update About Us", href: "/admin/dashboard/about" },
            { label: "📞 Update Contact Info", href: "/admin/dashboard/contact" },
            { label: "⚙️ Site Settings", href: "/admin/dashboard/settings" },
          ].map((link) => (
            <a
              key={link.href}
              href={link.href}
              style={{ padding: "10px 18px", background: "#f0f4ff", color: "#1a237e", borderRadius: "8px", textDecoration: "none", fontWeight: "500", fontSize: "0.9rem" }}
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
