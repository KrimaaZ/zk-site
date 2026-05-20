import { NextResponse } from 'next/server'
import { neon } from '@neondatabase/serverless'

const sql = neon(process.env.DATABASE_URL!)

export async function DELETE(
  _: Request,
  { params }: { params: Promise<{ section: string; id: string }> }
) {
  const { section, id } = await params
  try {
    if (section === 'notes')     { await sql`DELETE FROM "ItalianNote"     WHERE id = ${id}`; return NextResponse.json({ ok: true }) }
    if (section === 'videos')    { await sql`DELETE FROM "ItalianVideo"    WHERE id = ${id}`; return NextResponse.json({ ok: true }) }
    if (section === 'exercises') { await sql`DELETE FROM "ItalianExercise" WHERE id = ${id}`; return NextResponse.json({ ok: true }) }
    if (section === 'audios')    { await sql`DELETE FROM "ItalianAudio"    WHERE id = ${id}`; return NextResponse.json({ ok: true }) }
    return NextResponse.json({ error: 'Section invalide' }, { status: 400 })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ section: string; id: string }> }
) {
  const { section, id } = await params
  const body = await req.json()
  try {
    if (section === 'notes') {
      const { title, content } = body
      const [row] = await sql`UPDATE "ItalianNote" SET title=${title}, content=${content}, "createdAt"="createdAt" WHERE id=${id} RETURNING *`
      return NextResponse.json(row)
    }
    if (section === 'exercises') {
      const { done } = body
      const [row] = await sql`UPDATE "ItalianExercise" SET done=${done} WHERE id=${id} RETURNING *`
      return NextResponse.json(row)
    }
    // Fetch audio data for playback
    if (section === 'audios') {
      const [row] = await sql`SELECT data FROM "ItalianAudio" WHERE id=${id}`
      return NextResponse.json(row ?? { error: 'Not found' })
    }
    return NextResponse.json({ error: 'Section invalide' }, { status: 400 })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
