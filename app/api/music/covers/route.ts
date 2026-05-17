import { NextResponse } from 'next/server'
import { neon } from '@neondatabase/serverless'

const sql = neon(process.env.DATABASE_URL!)

async function init() {
  await sql`
    CREATE TABLE IF NOT EXISTS "CoverImage" (
      id TEXT PRIMARY KEY,
      label TEXT NOT NULL DEFAULT '',
      data TEXT NOT NULL,
      "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `
}

export async function GET() {
  try {
    await init()
    const rows = await sql`SELECT * FROM "CoverImage" ORDER BY "createdAt" DESC`
    return NextResponse.json(rows)
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    await init()
    const { label, data } = await req.json()
    const id = crypto.randomUUID()
    const rows = await sql`
      INSERT INTO "CoverImage" (id, label, data, "createdAt")
      VALUES (${id}, ${label || ''}, ${data}, NOW())
      RETURNING id, label, "createdAt"
    `
    return NextResponse.json({ ...rows[0], data })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
