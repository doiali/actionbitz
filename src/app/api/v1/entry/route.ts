import { prisma } from '@/lib/prisma'
import { withAuth } from '@/auth'
import { NextResponse } from 'next/server'
import { EntryCreate, EntryData } from '@/entities/entry'

export const GET = withAuth(async function GET(req) {
  const userId = req.auth.user.id
  const entries: EntryData[] = (await prisma.entry.findMany({
    where: { userId },
    select: {
      id: true,
      type: true,
      title: true,
      description: true,
      datetime: true,
      completed: true,
      createdAt: true,
    },
    orderBy: { datetime: 'desc' },
  }))
    .map((entry) => ({ ...entry, id: Number(entry.id) }))


  return NextResponse.json(({ data: entries }), { status: 200 })
})

export const POST = withAuth(async function POST(req) {
  const userId = req.auth.user.id
  const { title, description, datetime, type } = await req.json() as EntryCreate
  const entry = await prisma.entry.create({
    data: {
      title,
      description,
      type,
      datetime,
      userId,
    }
  })
  return NextResponse.json(({ ...entry, id: Number(entry.id) } satisfies EntryData), { status: 200 })
})