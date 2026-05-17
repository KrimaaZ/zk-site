import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// PATCH /api/goals/[id] — toggle done or update text
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const body = await req.json()
  const goal = await prisma.goal.update({ where: { id }, data: body })
  return NextResponse.json(goal)
}

// DELETE /api/goals/[id]
export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  await prisma.goal.delete({ where: { id } })
  return NextResponse.json({ ok: true })
}
