import { NextResponse } from 'next/server'
import { getDb } from '@/lib/db'
import mealsJson from '@/data/meals.json'

export async function GET() {
  const db = getDb()
  if (db) {
    try {
      const rows = await db`SELECT id, name, category, protein, kcal, time_min as time FROM meals ORDER BY id`
      return NextResponse.json(rows)
    } catch { /* fall through */ }
  }
  return NextResponse.json(mealsJson)
}
