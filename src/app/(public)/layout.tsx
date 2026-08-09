import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AnnouncementBar from "@/components/AnnouncementBar";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";
import { db } from "@/db";
import { announcements, contactInfo, siteSettings } from "@/db/schema";
import { eq, asc } from "drizzle-orm";

export const revalidate = 0;

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let announcementTexts: string[] = [];
  let contact: any = null;
  let settingsMap: Record<string, string> = {};

  try {
    const rows = await db
      .select()
      .from(announcements)
      .where(eq(announcements.isActive, true))
      .orderBy(asc(announcements.displayOrder));
    announcementTexts = rows.map((r) => r.text);

    const contactRows = await db.select().from(contactInfo).limit(1);
    if (contactRows.length > 0) contact = contactRows[0];

    const settingsRows = await db.select().from(siteSettings);
    settingsRows.forEach((s) => {
      if (s.key && s.value) settingsMap[s.key] = s.value;
    });
  } catch {
    // fallback if DB fails
  }

  const schoolName = settingsMap["school_name"] || "Vishwa Bharti Higher Secondary School";
  const tagline = settingsMap["school_tagline"] || "Empowering Generations Since 1964 — Gwalior, MP";
  const logoUrl = settingsMap["school_logo_url"] || "";
  const phone = contact?.phone || "+91-9425773348";
  const email = contact?.email || "vishwabhartischool1964@gmail.com";
  const address = contact?.address || "Sainik Colony, Pinto Park, Gwalior (MP)";

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <AnnouncementBar announcements={announcementTexts} />
      <Header phone={phone} schoolName={schoolName} logoUrl={logoUrl} />
      <main style={{ flex: 1 }}>{children}</main>
      <Footer schoolName={schoolName} tagline={tagline} address={address} phone={phone} email={email} logoUrl={logoUrl} />
      <FloatingWhatsApp />
    </div>
  );
}

