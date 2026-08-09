import { NextResponse } from 'next/server';
import { db } from '@/db';
import { sql } from 'drizzle-orm';
export const dynamic = 'force-dynamic';
export async function GET() {
  try {
    const res = await db.execute(sql`SELECT 1 as val`);
    return NextResponse.json({ success: true, url: process.env.DATABASE_URL ? 'set' : 'not set', res });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message, stack: err.stack, url: process.env.DATABASE_URL ? 'set' : 'not set' });
  }
}
