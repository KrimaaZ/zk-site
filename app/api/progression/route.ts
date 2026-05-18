import { NextResponse } from 'next/server'
import { neon } from '@neondatabase/serverless'

const sql = neon(process.env.DATABASE_URL!)

async function init() {
  await sql`
    CREATE TABLE IF NOT EXISTS "HabitDay" (
      date    TEXT    PRIMARY KEY,
      count   INT     NOT NULL,
      "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `
}

export async function GET() {
  try {
    await init()
    const rows = await sql`SELECT * FROM "HabitDay" ORDER BY date DESC`
    return NextResponse.json(rows)
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    await init()
    const { date, count } = await req.json()
    const rows = await sql`
      INSERT INTO "HabitDay" (date, count, "createdAt")
      VALUES (${date}, ${count}, NOW())
      ON CONFLICT (date) DO UPDATE SET count = EXCLUDED.count
      RETURNING *
    `
    return NextResponse.json(rows[0])
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
