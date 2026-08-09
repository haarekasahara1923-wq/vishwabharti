import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { siteSettings } from "@/db/schema";
import { eq } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const settings = await db.select().from(siteSettings);
    return NextResponse.json({ success: true, settings });
  } catch (error) {
    console.error("Failed to fetch settings:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { settings } = await request.json();

    if (!Array.isArray(settings)) {
      return NextResponse.json({ error: "Invalid data format" }, { status: 400 });
    }

    // Upsert each setting
    for (const { key, value } of settings) {
      const existing = await db.select().from(siteSettings).where(eq(siteSettings.key, key)).limit(1);
      if (existing.length > 0) {
        await db.update(siteSettings)
          .set({ value, updatedAt: new Date() })
          .where(eq(siteSettings.key, key));
      } else {
        await db.insert(siteSettings).values({ key, value });
      }
    }

    revalidatePath("/");
    revalidatePath("/about");
    revalidatePath("/contact");
    revalidatePath("/gallery");
    revalidatePath("/admin/dashboard/settings");

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to save settings:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

