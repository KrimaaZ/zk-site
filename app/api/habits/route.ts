import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/habits?date=YYYY-MM-DD
export async function GET(req: NextRequest) {
  const date = req.nextUrl.searchParams.get('date')
  if (!date) return NextResponse.json({})
  const entries = await prisma.habitEntry.findMany({ where: { date } })
  // Return as { habitKey: boolean }
  const result: Record<string, boolean> = {}
  for (const e of entries) result[e.habitKey] = e.done
  return NextResponse.json(result)
}

// POST /api/habits — upsert a habit entry
export async function POST(req: NextRequest) {
  const { date, habitKey, done } = await req.json()
  const entry = await prisma.habitEntry.upsert({
    where:  { date_habitKey: { date, habitKey } },
    update: { done },
    create: { date, habitKey, done },
  })
  return NextResponse.json(entry)
}

// DELETE /api/habits — clear all habits for a date (reset)
export async function DELETE(req: NextRequest) {
  const date = req.nextUrl.searchParams.get('date')
  if (!date) return NextResponse.json({ ok: false })
  await prisma.habitEntry.deleteMany({ where: { date } })
  return NextResponse.json({ ok: true })
}
