import { NextResponse } from 'next/server'
import { neon } from '@neondatabase/serverless'

const sql = neon(process.env.DATABASE_URL!)

async function init() {
  await sql`
    CREATE TABLE IF NOT EXISTS "Song" (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL DEFAULT 'Sans titre',
      lyrics TEXT NOT NULL DEFAULT '',
      "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `
}

export async function GET() {
  try {
    await init()
    const songs = await sql`SELECT * FROM "Song" ORDER BY "updatedAt" DESC`
    return NextResponse.json(songs)
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    await init()
    const { title, lyrics } = await req.json()
    const id = crypto.randomUUID()
    const rows = await sql`
      INSERT INTO "Song" (id, title, lyrics, "createdAt", "updatedAt")
      VALUES (${id}, ${title || 'Sans titre'}, ${lyrics || ''}, NOW(), NOW())
      RETURNING *
    `
    return NextResponse.json(rows[0])
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
