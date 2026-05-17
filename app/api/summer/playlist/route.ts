import { NextResponse } from 'next/server'
import { neon } from '@neondatabase/serverless'

const sql = neon(process.env.DATABASE_URL!)

async function init() {
  await sql`
    CREATE TABLE IF NOT EXISTS "SummerTrack" (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      artist TEXT NOT NULL DEFAULT '',
      url TEXT NOT NULL DEFAULT '',
      note TEXT NOT NULL DEFAULT '',
      "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `
}

export async function GET() {
  try {
    await init()
    const rows = await sql`SELECT * FROM "SummerTrack" ORDER BY "createdAt" ASC`
    return NextResponse.json(rows)
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    await init()
    const { title, artist, url, note } = await req.json()
    const id = crypto.randomUUID()
    const rows = await sql`
      INSERT INTO "SummerTrack" (id, title, artist, url, note, "createdAt")
      VALUES (${id}, ${title}, ${artist || ''}, ${url || ''}, ${note || ''}, NOW())
      RETURNING *
    `
    return NextResponse.json(rows[0])
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
