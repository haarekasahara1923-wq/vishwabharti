import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { aboutContent } from "@/db/schema";
import { eq } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const items = await db.select().from(aboutContent);
    return NextResponse.json({ success: true, items });
  } catch (error) {
    console.error("Failed to fetch about content:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { role, name, designation, message, photoUrl, photoPublicId, displayOrder } = data;

    if (!role || !name) {
      return NextResponse.json({ error: "Role and name are required" }, { status: 400 });
    }

    const newItem = await db.insert(aboutContent).values({
      role,
      name,
      designation,
      message,
      photoUrl,
      photoPublicId: photoPublicId || null,
      displayOrder: displayOrder || 0,
    }).returning();

    revalidatePath("/about");
    revalidatePath("/");

    return NextResponse.json({ success: true, item: newItem[0] });
  } catch (error) {
    console.error("Failed to insert about content:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const data = await request.json();
    const { id, role, name, designation, message, photoUrl, photoPublicId, displayOrder } = data;

    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    const updateData: any = { role, name, designation, message, photoUrl };
    if (photoPublicId !== undefined) updateData.photoPublicId = photoPublicId;
    if (displayOrder !== undefined) updateData.displayOrder = displayOrder;

    const updated = await db.update(aboutContent)
      .set(updateData)
      .where(eq(aboutContent.id, id))
      .returning();

    revalidatePath("/about");
    revalidatePath("/");

    return NextResponse.json({ success: true, item: updated[0] });
  } catch (error) {
    console.error("Failed to update about content:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

