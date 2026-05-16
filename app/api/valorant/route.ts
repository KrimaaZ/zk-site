import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const category = searchParams.get('category')
  const tips = await prisma.valorantTip.findMany({
    where: category && category !== 'ALL' ? { category } : undefined,
    orderBy: { createdAt: 'desc' },
  })
  return NextResponse.json(tips)
}

export async function POST(req: Request) {
  const body = await req.json()
  const tip = await prisma.valorantTip.create({
    data: {
      title: body.title,
      content: body.content,
      category: body.category,
      agent: body.agent || null,
      drill: body.drill || null,
    },
  })
  return NextResponse.json(tip, { status: 201 })
}
