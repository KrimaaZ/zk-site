import { neon } from '@neondatabase/serverless'
import { NextRequest, NextResponse } from 'next/server'

const sql = neon(process.env.DATABASE_URL!)

export async function GET() {
  try {
    const goals = await sql`SELECT * FROM "Goal" ORDER BY tab ASC, position ASC, "createdAt" ASC`
    return NextResponse.json(goals)
  } catch (e) {
    console.error('[GET /api/goals]', e)
    return NextResponse.json({ error: String(e) }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const { tab, text, position } = await req.json()
    const id = crypto.randomUUID()
    const rows = await sql`
      INSERT INTO "Goal" (id, tab, text, done, position, "createdAt")
      VALUES (${id}, ${tab}, ${text}, false, ${position ?? 0}, NOW())
      RETURNING *`
    return NextResponse.json(rows[0])
  } catch (e) {
    console.error('[POST /api/goals]', e)
    return NextResponse.json({ error: String(e) }, { status: 500 })
  }
}
