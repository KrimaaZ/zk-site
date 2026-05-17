import { neon } from '@neondatabase/serverless'
import { NextRequest, NextResponse } from 'next/server'

const sql = neon(process.env.DATABASE_URL!)

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const body = await req.json()
    if (typeof body.done === 'boolean') {
      const rows = await sql`UPDATE "Goal" SET done = ${body.done} WHERE id = ${id} RETURNING *`
      return NextResponse.json(rows[0])
    }
    if (typeof body.text === 'string') {
      const rows = await sql`UPDATE "Goal" SET text = ${body.text} WHERE id = ${id} RETURNING *`
      return NextResponse.json(rows[0])
    }
    return NextResponse.json({ error: 'Nothing to update' }, { status: 400 })
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 })
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    await sql`DELETE FROM "Goal" WHERE id = ${id}`
    return NextResponse.json({ ok: true })
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 })
  }
}
