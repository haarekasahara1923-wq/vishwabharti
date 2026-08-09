import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { announcements } from "@/db/schema";
import { eq, asc } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const showAll = searchParams.get("all") === "true";

    const items = showAll
      ? await db.select().from(announcements).orderBy(asc(announcements.displayOrder))
      : await db.select().from(announcements).where(eq(announcements.isActive, true)).orderBy(asc(announcements.displayOrder));

    return NextResponse.json({ success: true, announcements: items });
  } catch (error) {
    console.error("Failed to fetch announcements:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { text, isActive, displayOrder } = data;

    if (!text) {
      return NextResponse.json({ error: "Text is required" }, { status: 400 });
    }

    const newItem = await db
      .insert(announcements)
      .values({ text, isActive: isActive ?? true, displayOrder: displayOrder ?? 0 })
      .returning();

    revalidatePath("/");
    revalidatePath("/admin/dashboard");

    return NextResponse.json({ success: true, item: newItem[0] });
  } catch (error) {
    console.error("Failed to create announcement:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const data = await request.json();
    const { id, text, isActive, displayOrder } = data;

    if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

    const updateData: any = {};
    if (text !== undefined) updateData.text = text;
    if (isActive !== undefined) updateData.isActive = isActive;
    if (displayOrder !== undefined) updateData.displayOrder = displayOrder;

    const updated = await db
      .update(announcements)
      .set(updateData)
      .where(eq(announcements.id, id))
      .returning();

    revalidatePath("/");
    revalidatePath("/admin/dashboard");

    return NextResponse.json({ success: true, item: updated[0] });
  } catch (error) {
    console.error("Failed to update announcement:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

    await db.delete(announcements).where(eq(announcements.id, parseInt(id)));

    revalidatePath("/");
    revalidatePath("/admin/dashboard");

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete announcement:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

