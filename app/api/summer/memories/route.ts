import { NextResponse } from 'next/server'
import { neon } from '@neondatabase/serverless'

const sql = neon(process.env.DATABASE_URL!)

async function init() {
  await sql`
    CREATE TABLE IF NOT EXISTS "SummerMemory" (
      id TEXT PRIMARY KEY,
      data TEXT NOT NULL,
      caption TEXT NOT NULL DEFAULT '',
      date TEXT NOT NULL DEFAULT '',
      location TEXT NOT NULL DEFAULT '',
      rotation FLOAT NOT NULL DEFAULT 0,
      "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `
}

export async function GET() {
  try {
    await init()
    const rows = await sql`SELECT * FROM "SummerMemory" ORDER BY "createdAt" DESC`
    return NextResponse.json(rows)
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    await init()
    const { data, caption, date, location, rotation } = await req.json()
    const id = crypto.randomUUID()
    const rows = await sql`
      INSERT INTO "SummerMemory" (id, data, caption, date, location, rotation, "createdAt")
      VALUES (${id}, ${data}, ${caption || ''}, ${date || ''}, ${location || ''}, ${rotation ?? 0}, NOW())
      RETURNING id, caption, date, location, rotation, "createdAt"
    `
    return NextResponse.json({ ...rows[0], data })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
