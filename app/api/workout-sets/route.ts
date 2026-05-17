import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/workout-sets — all sets (optionally filter by logKey)
export async function GET(req: NextRequest) {
  const logKey = req.nextUrl.searchParams.get('logKey')
  const sets = await prisma.workoutSet.findMany({
    where: logKey ? { logKey } : undefined,
    orderBy: { loggedAt: 'asc' },
  })
  return NextResponse.json(sets)
}

// POST /api/workout-sets — add a set
export async function POST(req: NextRequest) {
  const { logKey, reps, kg } = await req.json()
  const set = await prisma.workoutSet.create({ data: { logKey, reps, kg } })
  return NextResponse.json(set)
}

// DELETE /api/workout-sets?id=123
export async function DELETE(req: NextRequest) {
  const id = req.nextUrl.searchParams.get('id')
  if (!id) return NextResponse.json({ ok: false })
  await prisma.workoutSet.delete({ where: { id: parseInt(id) } })
  return NextResponse.json({ ok: true })
}
