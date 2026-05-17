import { NextResponse } from 'next/server'
import { neon } from '@neondatabase/serverless'
const sql = neon(process.env.DATABASE_URL!)
async function init() {
  await sql`CREATE TABLE IF NOT EXISTS "AestheticPhysique" (id TEXT PRIMARY KEY, data TEXT NOT NULL, date TEXT NOT NULL DEFAULT '', note TEXT NOT NULL DEFAULT '', "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW())`
}
export async function GET() {
  try { await init(); const r = await sql`SELECT * FROM "AestheticPhysique" ORDER BY date DESC, "createdAt" DESC`; return NextResponse.json(r) }
  catch (e: any) { return NextResponse.json({ error: e.message }, { status: 500 }) }
}
export async function POST(req: Request) {
  try {
    await init(); const { data, date, note } = await req.json(); const id = crypto.randomUUID()
    const r = await sql`INSERT INTO "AestheticPhysique" (id, data, date, note, "createdAt") VALUES (${id}, ${data}, ${date||''}, ${note||''}, NOW()) RETURNING *`
    return NextResponse.json(r[0])
  } catch (e: any) { return NextResponse.json({ error: e.message }, { status: 500 }) }
}
