import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/goals — fetch all goals
export async function GET() {
  try {
    const goals = await prisma.goal.findMany({ orderBy: [{ tab: 'asc' }, { position: 'asc' }, { createdAt: 'asc' }] })
    return NextResponse.json(goals)
  } catch (e) {
    console.error('[GET /api/goals]', e)
    return NextResponse.json({ error: String(e) }, { status: 500 })
  }
}

// POST /api/goals — create a goal
export async function POST(req: NextRequest) {
  try {
    const { tab, text, position } = await req.json()
    const goal = await prisma.goal.create({ data: { tab, text, position: position ?? 0 } })
    return NextResponse.json(goal)
  } catch (e) {
    console.error('[POST /api/goals]', e)
    return NextResponse.json({ error: String(e) }, { status: 500 })
  }
}
