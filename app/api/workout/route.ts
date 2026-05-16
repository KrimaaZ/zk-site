import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const type = searchParams.get('type')
  const sessions = await prisma.workoutSession.findMany({
    where: type ? { type } : undefined,
    orderBy: { createdAt: 'desc' },
  })
  return NextResponse.json(sessions)
}

export async function POST(req: Request) {
  const body = await req.json()
  const session = await prisma.workoutSession.create({
    data: {
      type: body.type,
      title: body.title,
      date: body.date,
      exercises: JSON.stringify(body.exercises),
      notes: body.notes || null,
    },
  })
  return NextResponse.json(session, { status: 201 })
}
