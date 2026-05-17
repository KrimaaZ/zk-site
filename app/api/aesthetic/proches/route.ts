import { NextResponse } from 'next/server'
import { neon } from '@neondatabase/serverless'
const sql = neon(process.env.DATABASE_URL!)
async function init() {
  await sql`CREATE TABLE IF NOT EXISTS "AestheticProche" (id TEXT PRIMARY KEY, data TEXT NOT NULL, who TEXT NOT NULL DEFAULT '', moment TEXT NOT NULL DEFAULT '', rotation FLOAT NOT NULL DEFAULT 0, "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW())`
}
export async function GET() {
  try { await init(); const r = await sql`SELECT * FROM "AestheticProche" ORDER BY "createdAt" DESC`; return NextResponse.json(r) }
  catch (e: any) { return NextResponse.json({ error: e.message }, { status: 500 }) }
}
export async function POST(req: Request) {
  try {
    await init(); const { data, who, moment, rotation } = await req.json(); const id = crypto.randomUUID()
    const r = await sql`INSERT INTO "AestheticProche" (id, data, who, moment, rotation, "createdAt") VALUES (${id}, ${data}, ${who||''}, ${moment||''}, ${rotation??0}, NOW()) RETURNING id, who, moment, rotation, "createdAt"`
    return NextResponse.json({ ...r[0], data })
  } catch (e: any) { return NextResponse.json({ error: e.message }, { status: 500 }) }
}
