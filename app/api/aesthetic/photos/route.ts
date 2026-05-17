import { NextResponse } from 'next/server'
import { neon } from '@neondatabase/serverless'
const sql = neon(process.env.DATABASE_URL!)
async function init() {
  await sql`CREATE TABLE IF NOT EXISTS "AestheticPhoto" (id TEXT PRIMARY KEY, data TEXT NOT NULL, context TEXT NOT NULL DEFAULT '', "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW())`
}
export async function GET() {
  try { await init(); const r = await sql`SELECT * FROM "AestheticPhoto" ORDER BY "createdAt" DESC`; return NextResponse.json(r) }
  catch (e: any) { return NextResponse.json({ error: e.message }, { status: 500 }) }
}
export async function POST(req: Request) {
  try {
    await init(); const { data, context } = await req.json(); const id = crypto.randomUUID()
    const r = await sql`INSERT INTO "AestheticPhoto" (id, data, context, "createdAt") VALUES (${id}, ${data}, ${context||''}, NOW()) RETURNING *`
    return NextResponse.json(r[0])
  } catch (e: any) { return NextResponse.json({ error: e.message }, { status: 500 }) }
}
