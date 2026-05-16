import { NextResponse } from 'next/server'
import { getDb } from '@/lib/db'
import exercisesJson from '@/data/exercises.json'

export async function GET() {
  const db = getDb()
  if (db) {
    try {
      const rows = await db`SELECT id, name, muscle, equipment, training_type, steps, footer FROM exercises ORDER BY id`
      return NextResponse.json(rows)
    } catch { /* fall through */ }
  }
  return NextResponse.json(exercisesJson)
}
