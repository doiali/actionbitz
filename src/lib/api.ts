'server only'

import { withAuth } from '@/auth'
import { prisma } from './prisma'
import { NextRequest, NextResponse } from 'next/server'
import { EntryCreate, EntryData, EntryJson } from '@/entities/entry'
import { startOfTomorrow, startOfYesterday } from 'date-fns'
import { faker } from '@faker-js/faker'


const DEFAULT_LIMIT = 10
const MAX_LIMIT = 30
const getPaginationParams = (req: NextRequest) => {
  const searchParams = req.nextUrl.searchParams
  let limit = Number(searchParams.get('limit') || DEFAULT_LIMIT)
  limit = limit > MAX_LIMIT ? MAX_LIMIT : limit
  const offset = Number(searchParams.get('offset') || 0)
  return { limit, offset }
}

const notFoundResponse = () => NextResponse.json({ message: "Not Found" }, { status: 404 })


export const getEntries = withAuth(async (req) => {
  const userId = req.auth.user.id
  const entries: EntryData[] = (await prisma.entry.findMany({
    select: {
      id: true, title: true, description: true,
      datetime: true, completed: true, type: true,
    },
    where: { userId: userId, },
    orderBy: [{ datetime: 'desc', }, { createdAt: 'desc', },],
    take: MAX_LIMIT,
  })).map((entry) => ({ ...entry, id: Number(entry.id) }))

  return NextResponse.json({
    data: entries,
  })
})


export const getPastEntries = withAuth(async (req) => {
  const userId = req.auth.user.id
  const { limit, offset } = getPaginationParams(req)

  const count = await prisma.entry.count({
    where: { userId, datetime: { lt: startOfYesterday() } }
  })

  let data: EntryData[] = []

  if (offset < count) {
    data = (await prisma.entry.findMany({
      select: {
        id: true, title: true, description: true,
        datetime: true, completed: true, type: true,
      },
      where: {
        userId: userId,
        datetime: { lt: startOfYesterday() },
      },
      take: limit,
      skip: offset,
      orderBy: [{ datetime: 'desc', }, { createdAt: 'desc', },]
    })).map((entry) => ({ ...entry, id: Number(entry.id) }))
  }

  return NextResponse.json({ data, count, limit, offset })
})


export const getFutureEntries = withAuth(async (req) => {
  const userId = req.auth.user.id
  const { limit, offset } = getPaginationParams(req)

  const count = await prisma.entry.count({
    where: { userId, datetime: { gt: startOfTomorrow() } }
  })

  let data: EntryData[] = []

  if (offset < count) {
    data = (await prisma.entry.findMany({
      select: {
        id: true, title: true, description: true,
        datetime: true, completed: true, type: true,
      },
      where: {
        userId: userId,
        datetime: { gt: startOfTomorrow() },
      },
      take: limit,
      skip: offset,
      orderBy: [{ datetime: 'asc', }, { createdAt: 'asc', },]
    })).map((entry) => ({ ...entry, id: Number(entry.id) }))
  }

  return NextResponse.json({ data, count, limit, offset })
})


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
    orderBy: [{ datetime: 'desc', }, { createdAt: 'desc', },],
    take: MAX_LIMIT,
  })).map((entry) => ({ ...entry, id: Number(entry.id) }))

  return NextResponse.json({ data: entries })
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


export const createDummyEntries = withAuth(async (req) => {
  const userId = req.auth.user.id
  await prisma.entry.deleteMany({
    where: { userId }
  })
  const entries = Array.from({ length: 1500 }).map(() => ({
    type: faker.helpers.arrayElement(['NOTE', 'TODO']),
    title: faker.lorem.sentence({ min: 3, max: 10 }),
    description: faker.lorem.paragraph({ min: 0, max: 3 }),
    completed: faker.datatype.boolean(),
    datetime: faker.date.between({ from: '2022-06-01', to: '2026-06-01' }),
    userId: userId,
  } satisfies EntryCreate & { userId: string }))

  const result = await prisma.entry.createMany({
    data: entries,
  })

  return NextResponse.json(result)
})

export const deleteAllEntries = withAuth(async (req) => {
  const userId = req.auth.user.id
  const result = await prisma.entry.deleteMany({
    where: { userId }
  })
  return NextResponse.json({ message: 'Data delete successfully!', result })
})
