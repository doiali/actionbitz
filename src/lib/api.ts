'server only'

import { withAuth } from '@/auth'
import { prisma } from './prisma'
import { NextRequest, NextResponse } from 'next/server'
import { EntryCreate, EntryData, EntryJson } from '@/entities/entry'
import { faker } from '@faker-js/faker'
import { EntryReport } from '@/entities/enrty-report'
import { Prisma } from '@prisma/client'
import { parseDateServer } from '@/utils/utils'


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

export const getEntryReport = withAuth(async (req) => {
  const userId = req.auth.user.id
  const searchParams = req.nextUrl.searchParams
  const from = searchParams.get('from')
  const to = searchParams.get('to')

  const whereClause = Prisma.sql`
    WHERE "userId" = ${userId}
    AND ${from ? Prisma.sql`"date" >= ${parseDateServer(from)}` : Prisma.sql`1=1`}
    AND ${to ? Prisma.sql`"date" < ${parseDateServer(to)}` : Prisma.sql`1=1`}
  `

  const result = await prisma.$queryRaw(Prisma.sql`
    SELECT 
      COUNT(*) AS count,
      SUM(CASE WHEN completed = true THEN 1 ELSE 0 END) AS completed,
      COUNT(DISTINCT "date") AS days
    FROM "Entry"
    ${whereClause}
  `) as EntryReport[]
  const { count, completed, days } = result[0]

  return NextResponse.json({
    count: Number(count), completed: Number(completed), days: Number(days)
  })
})

export const getEntries = withAuth(async (req) => {
  const userId = req.auth.user.id
  const { limit, offset } = getPaginationParams(req)
  const searchParams = req.nextUrl.searchParams
  const from = searchParams.get('from')
  const to = searchParams.get('to')
  const order = searchParams.get('order') || 'desc'

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let dateFilter: any = {}
  if (from) dateFilter.gte = parseDateServer(from)
  if (to) dateFilter.lt = parseDateServer(to)
  if (!from && !to) dateFilter = undefined

  const count = await prisma.entry.count({
    where: { userId, date: dateFilter }
  })

  let data: EntryData[] = []

  if (offset < count) {
    data = (await prisma.entry.findMany({
      select: {
        id: true, title: true, description: true, date: true,
        datetime: true, completed: true, type: true,
      },
      where: {
        userId: userId,
        date: dateFilter,
      },
      take: limit,
      skip: offset,
      orderBy: order === 'asc'
        ? [{ date: 'asc' }, { updatedAt: 'asc' }]
        : [{ date: 'desc' }, { updatedAt: 'desc' }]
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
  const { title, description, datetime, date, type } = await req.json() as EntryJson
  console.log(date, parseDateServer(date))
  const entry = await prisma.entry.create({
    data: {
      title,
      description,
      type,
      datetime,
      date: parseDateServer(date),
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
  const { title, description, datetime, type, completed, date } = await req.json() as EntryJson
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
      date: parseDateServer(date),
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
      id: true, title: true, description: true, date: true,
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
  const entries = Array.from({ length: 400 }).map(() => ({
    type: faker.helpers.arrayElement(['NOTE', 'TODO']),
    title: faker.lorem.sentence({ min: 3, max: 10 }),
    description: faker.lorem.paragraph({ min: 0, max: 3 }),
    completed: faker.datatype.boolean(),
    date: faker.date.between({ from: '2024-06-01', to: '2025-06-01' }),
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
