import { withAuth } from '@/auth'
import { prisma } from './prisma'
import { NextRequest, NextResponse } from 'next/server'
import { EntryCreate, EntryData, EntryJson } from '@/entities/entry'


const notFoundResponse = () => NextResponse.json({ message: "Not Found" }, { status: 404 })


// TODO: paginated entries
export const getEntries = (req: NextRequest, ctx: never) => getAllUserEntries(req, ctx)


export const getEntry = withAuth<{ id: string }>(async (req, { params }) => {
  const userId = req?.auth?.user?.id
  const { id } = await params
  if (!userId)
    return NextResponse.json({ message: "Not authenticated" }, { status: 401 })

  const entry = await prisma.entry.findFirst({
    where: { userId, id: Number(id) },
  })

  if (!entry) return notFoundResponse()

  return NextResponse.json(({
    ...entry, id: Number(entry?.id)
  } satisfies EntryData), { status: 200 })
})


export const createEntry = withAuth(async (req) => {
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
  return NextResponse.json(({
    ...entry, id: Number(entry.id)
  } satisfies EntryData), { status: 200 })
})


export const updateEntry = withAuth<{ id: string }>(async (req, { params }) => {
  const userId = req?.auth?.user?.id
  const { id } = await params
  const { title, description, datetime, type, completed } = await req.json() as EntryJson
  const entry = await prisma.entry.findFirst({
    where: { userId, id: Number(id) },
  })
  if (!entry) return notFoundResponse()

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

  return NextResponse.json(({
    ...newEntry, id: Number(newEntry?.id)
  } satisfies EntryData), { status: 200 })
})


export const deleteEntry = withAuth<{ id: string }>(async (req, { params }) => {
  const userId = req?.auth?.user?.id
  const { id } = await (params as unknown) as { id: string }

  const entry = await prisma.entry.findFirst({
    where: { userId, id: Number(id) },
  })

  if (!entry) return notFoundResponse()

  await prisma.entry.delete({
    where: { id: Number(id), userId },
  })

  return NextResponse.json(null, { status: 200 })
})


// Playground
export const getAllUserEntries = withAuth(async (req) => {
  const userId = req.auth.user.id
  const entries: EntryData[] = (await prisma.entry.findMany({
    select: {
      id: true, title: true, description: true,
      datetime: true, completed: true, type: true,
    },
    where: { userId: userId, },
    orderBy: [{ datetime: 'desc', }, { createdAt: 'desc', },]
  })).map((entry) => ({ ...entry, id: Number(entry.id) }))

  return NextResponse.json({
    data: entries.map(entry => ({ ...entry, id: Number(entry.id) })),
  })
})


export const getAuthData = withAuth(async () => {
  try {
    const [
      users,
      accounts,
      sessions,
      tokens,
      authenticators,
    ] = await Promise.all([
      prisma.user.findMany({ select: { id: true, email: true, name: true } }),
      prisma.account.findMany({
        select: {
          userId: true,
          session_state: true,
          provider: true,
        }
      }),
      prisma.session.findMany(),
      prisma.verificationToken.findMany(),
      prisma.authenticator.findMany(),
    ])
    return Response.json({
      users,
      accounts,
      sessions,
      tokens,
      authenticators,
    })
  } catch (error) {
    return Response.json({ error }, { status: 500 })
  }
})
