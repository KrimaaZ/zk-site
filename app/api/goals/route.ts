import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/goals — fetch all goals
export async function GET() {
  const goals = await prisma.goal.findMany({ orderBy: [{ tab: 'asc' }, { position: 'asc' }, { createdAt: 'asc' }] })
  return NextResponse.json(goals)
}

// POST /api/goals — create a goal
export async function POST(req: NextRequest) {
  const { tab, text, position } = await req.json()
  const goal = await prisma.goal.create({ data: { tab, text, position: position ?? 0 } })
  return NextResponse.json(goal)
}
