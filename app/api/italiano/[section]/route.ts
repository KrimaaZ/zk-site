import { NextResponse } from 'next/server'
import { neon } from '@neondatabase/serverless'
import { randomUUID } from 'crypto'

const sql = neon(process.env.DATABASE_URL!)

async function init() {
  await sql`CREATE TABLE IF NOT EXISTS "ItalianNote" (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL DEFAULT '',
    content TEXT NOT NULL,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
  )`
  await sql`CREATE TABLE IF NOT EXISTS "ItalianVideo" (
    id TEXT PRIMARY KEY,
    url TEXT NOT NULL,
    title TEXT NOT NULL DEFAULT '',
    note TEXT NOT NULL DEFAULT '',
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
  )`
  await sql`CREATE TABLE IF NOT EXISTS "ItalianExercise" (
    id TEXT PRIMARY KEY,
    question TEXT NOT NULL,
    answer TEXT NOT NULL DEFAULT '',
    done BOOLEAN NOT NULL DEFAULT FALSE,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
  )`
  await sql`CREATE TABLE IF NOT EXISTS "ItalianAudio" (
    id TEXT PRIMARY KEY,
    data TEXT NOT NULL,
    label TEXT NOT NULL DEFAULT '',
    duration INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
  )`
}

export async function GET(_: Request, { params }: { params: Promise<{ section: string }> }) {
  await init()
  const { section } = await params
  try {
    if (section === 'notes') {
      const rows = await sql`SELECT * FROM "ItalianNote" ORDER BY "createdAt" DESC`
      return NextResponse.json(rows)
    }
    if (section === 'videos') {
      const rows = await sql`SELECT * FROM "ItalianVideo" ORDER BY "createdAt" DESC`
      return NextResponse.json(rows)
    }
    if (section === 'exercises') {
      const rows = await sql`SELECT * FROM "ItalianExercise" ORDER BY "createdAt" DESC`
      return NextResponse.json(rows)
    }
    if (section === 'audios') {
      const rows = await sql`SELECT id, label, duration, "createdAt" FROM "ItalianAudio" ORDER BY "createdAt" DESC`
      return NextResponse.json(rows)
    }
    return NextResponse.json({ error: 'Section invalide' }, { status: 400 })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}

export async function POST(req: Request, { params }: { params: Promise<{ section: string }> }) {
  await init()
  const { section } = await params
  const body = await req.json()
  const id = randomUUID()
  try {
    if (section === 'notes') {
      const { title = '', content } = body
      const [row] = await sql`INSERT INTO "ItalianNote" (id, title, content) VALUES (${id}, ${title}, ${content}) RETURNING *`
      return NextResponse.json(row)
    }
    if (section === 'videos') {
      const { url, title = '', note = '' } = body
      const [row] = await sql`INSERT INTO "ItalianVideo" (id, url, title, note) VALUES (${id}, ${url}, ${title}, ${note}) RETURNING *`
      return NextResponse.json(row)
    }
    if (section === 'exercises') {
      const { question, answer = '' } = body
      const [row] = await sql`INSERT INTO "ItalianExercise" (id, question, answer) VALUES (${id}, ${question}, ${answer}) RETURNING *`
      return NextResponse.json(row)
    }
    if (section === 'audios') {
      const { data, label = '', duration = 0 } = body
      const [row] = await sql`INSERT INTO "ItalianAudio" (id, data, label, duration) VALUES (${id}, ${data}, ${label}, ${duration}) RETURNING id, label, duration, "createdAt"`
      return NextResponse.json(row)
    }
    return NextResponse.json({ error: 'Section invalide' }, { status: 400 })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
