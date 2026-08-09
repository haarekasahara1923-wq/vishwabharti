import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as fs from 'fs';
import * as path from 'path';
import * as schema from './src/db/schema.ts'; // We'll just ignore schema for basic select

const envContent = fs.readFileSync(path.resolve(process.cwd(), '.env'), 'utf-8');
const dbUrlMatch = envContent.match(/^DATABASE_URL=(.*)$/m);
const url = dbUrlMatch ? dbUrlMatch[1].trim() : null;

async function test() {
  if (!url) return;
  const sql = neon(url);
  const db = drizzle(sql);
  try {
    const res = await db.execute('SELECT 1 as val');
    console.log('Drizzle DB Success:', res);
  } catch (err) {
    console.error('Drizzle DB Error:', err);
  }
}

test();
