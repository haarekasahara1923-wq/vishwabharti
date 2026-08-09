import { neon } from "@neondatabase/serverless";
import * as fs from "fs";
import * as path from "path";

// Read .env manually
const envContent = fs.readFileSync(path.resolve(process.cwd(), ".env"), "utf-8");
const dbUrlMatch = envContent.match(/^DATABASE_URL=(.*)$/m);
const url = dbUrlMatch ? dbUrlMatch[1].trim() : null;

console.log("DB URL present:", !!url);

async function test() {
  if (!url) return;
  const sql = neon(url);
  try {
    const res = await sql`SELECT table_name FROM information_schema.tables WHERE table_schema='public';`;
    console.log("Tables in DB:", res);
  } catch (err) {
    console.error("DB Error:", err);
  }
}

test();
