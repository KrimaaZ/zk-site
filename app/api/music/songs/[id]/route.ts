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

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await init()
    const { id } = await params
    const { title, lyrics } = await req.json()
    const rows = await sql`
      UPDATE "Song"
      SET title = ${title}, lyrics = ${lyrics}, "updatedAt" = NOW()
      WHERE id = ${id}
      RETURNING *
    `
    if (!rows[0]) return NextResponse.json({ error: 'Song not found' }, { status: 404 })
    return NextResponse.json(rows[0])
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    await sql`DELETE FROM "Song" WHERE id = ${id}`
    return NextResponse.json({ ok: true })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
