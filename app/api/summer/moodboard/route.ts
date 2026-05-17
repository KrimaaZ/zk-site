import { NextResponse } from 'next/server'
import { neon } from '@neondatabase/serverless'

const sql = neon(process.env.DATABASE_URL!)

async function init() {
  await sql`
    CREATE TABLE IF NOT EXISTS "SummerMoodItem" (
      id TEXT PRIMARY KEY,
      type TEXT NOT NULL,
      data TEXT NOT NULL DEFAULT '',
      color TEXT NOT NULL DEFAULT '',
      quote TEXT NOT NULL DEFAULT '',
      author TEXT NOT NULL DEFAULT '',
      label TEXT NOT NULL DEFAULT '',
      "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `
}

export async function GET() {
  try {
    await init()
    const rows = await sql`SELECT * FROM "SummerMoodItem" ORDER BY "createdAt" DESC`
    return NextResponse.json(rows)
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    await init()
    const { type, data, color, quote, author, label } = await req.json()
    const id = crypto.randomUUID()
    const rows = await sql`
      INSERT INTO "SummerMoodItem" (id, type, data, color, quote, author, label, "createdAt")
      VALUES (${id}, ${type}, ${data || ''}, ${color || ''}, ${quote || ''}, ${author || ''}, ${label || ''}, NOW())
      RETURNING *
    `
    return NextResponse.json(rows[0])
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
