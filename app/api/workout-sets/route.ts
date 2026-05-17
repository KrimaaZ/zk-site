import { neon } from '@neondatabase/serverless'
import { NextRequest, NextResponse } from 'next/server'

const sql = neon(process.env.DATABASE_URL!)

export async function GET(req: NextRequest) {
  try {
    const logKey = req.nextUrl.searchParams.get('logKey')
    const rows = logKey
      ? await sql`SELECT * FROM "WorkoutSet" WHERE "logKey" = ${logKey} ORDER BY "loggedAt" ASC`
      : await sql`SELECT * FROM "WorkoutSet" ORDER BY "loggedAt" ASC`
    return NextResponse.json(rows)
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const { logKey, reps, kg } = await req.json()
    const rows = await sql`
      INSERT INTO "WorkoutSet" ("logKey", reps, kg, "loggedAt")
      VALUES (${logKey}, ${reps}, ${kg}, NOW())
      RETURNING *`
    return NextResponse.json(rows[0])
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const id = req.nextUrl.searchParams.get('id')
    if (!id) return NextResponse.json({ ok: false })
    await sql`DELETE FROM "WorkoutSet" WHERE id = ${parseInt(id)}`
    return NextResponse.json({ ok: true })
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 })
  }
}
