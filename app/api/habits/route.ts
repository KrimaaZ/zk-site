import { neon } from '@neondatabase/serverless'
import { NextRequest, NextResponse } from 'next/server'

const sql = neon(process.env.DATABASE_URL!)

export async function GET(req: NextRequest) {
  try {
    const date = req.nextUrl.searchParams.get('date')
    if (!date) return NextResponse.json({})
    const rows = await sql`SELECT "habitKey", done FROM "HabitEntry" WHERE date = ${date}`
    const result: Record<string, boolean> = {}
    for (const r of rows) result[r.habitKey] = r.done
    return NextResponse.json(result)
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const { date, habitKey, done } = await req.json()
    const rows = await sql`
      INSERT INTO "HabitEntry" (date, "habitKey", done)
      VALUES (${date}, ${habitKey}, ${done})
      ON CONFLICT (date, "habitKey") DO UPDATE SET done = ${done}
      RETURNING *`
    return NextResponse.json(rows[0])
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const date = req.nextUrl.searchParams.get('date')
    if (!date) return NextResponse.json({ ok: false })
    await sql`DELETE FROM "HabitEntry" WHERE date = ${date}`
    return NextResponse.json({ ok: true })
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 })
  }
}
