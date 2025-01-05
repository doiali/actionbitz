import { prisma } from '@/lib/prisma'
import { withAuth } from '@/auth'
import { NextResponse } from 'next/server'
import { EntryData, EntryJson } from '@/entities/entry'

export const GET = withAuth(async function GET(
  req,
  { params }
) {
  const userId = req?.auth?.user?.id
  const { id } = await params as { id: string }
  if (!userId)
    return NextResponse.json({ message: "Not authenticated" }, { status: 401 })

  const entry = await prisma.entry.findFirst({
    where: { userId, id: Number(id) },
  })

  if (!entry)
    return NextResponse.json({ message: "Not Found" }, { status: 404 })

  return NextResponse.json(({ ...entry, id: Number(entry?.id) } satisfies EntryData), { status: 200 })
})

export const PUT = withAuth(async function PUT(
  req,
  { params }
) {
  const userId = req?.auth?.user?.id
  const { id } = await (params as unknown) as { id: string }
  if (!userId)
    return NextResponse.json({ message: "Not authenticated" }, { status: 401 })
  const { title, description, datetime, type, completed } = await req.json() as EntryJson

  const entry = await prisma.entry.findFirst({
    where: { userId, id: Number(id) },
  })

  if (!entry)
    return NextResponse.json({ message: "Not Found" }, { status: 404 })

  const newEntry = await prisma.entry.update({
    where: { id: Number(id), userId },
    data: {
      title,
      type,
      description,
      datetime,
      completed,
    }
  })

  return NextResponse.json(({ ...newEntry, id: Number(newEntry?.id) } satisfies EntryData), { status: 200 })
})

export const DELETE = withAuth(async function DELETE(req, { params }) {
  const userId = req?.auth?.user?.id
  const { id } = await (params as unknown) as { id: string }
  if (!userId)
    return NextResponse.json({ message: "Not authenticated" }, { status: 401 })

  const entry = await prisma.entry.findFirst({
    where: { userId, id: Number(id) },
  })

  if (!entry)
    return NextResponse.json({ message: "Not Found" }, { status: 404 })

  await prisma.entry.delete({
    where: { id: Number(id), userId },
  })

  return NextResponse.json(null, { status: 200 })
})

