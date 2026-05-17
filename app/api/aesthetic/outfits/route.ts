import { NextResponse } from 'next/server'
import { neon } from '@neondatabase/serverless'
const sql = neon(process.env.DATABASE_URL!)
async function init() {
  await sql`CREATE TABLE IF NOT EXISTS "AestheticOutfit" (id TEXT PRIMARY KEY, data TEXT NOT NULL, label TEXT NOT NULL DEFAULT '', "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW())`
}
export async function GET() {
  try { await init(); const r = await sql`SELECT * FROM "AestheticOutfit" ORDER BY "createdAt" DESC`; return NextResponse.json(r) }
  catch (e: any) { return NextResponse.json({ error: e.message }, { status: 500 }) }
}
export async function POST(req: Request) {
  try {
    await init(); const { data, label } = await req.json(); const id = crypto.randomUUID()
    const r = await sql`INSERT INTO "AestheticOutfit" (id, data, label, "createdAt") VALUES (${id}, ${data}, ${label||''}, NOW()) RETURNING *`
    return NextResponse.json(r[0])
  } catch (e: any) { return NextResponse.json({ error: e.message }, { status: 500 }) }
}
