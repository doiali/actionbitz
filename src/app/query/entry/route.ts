import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

// temporary route to play with prisma
export async function GET() {
  const { user } = await auth() || {}
  if (!user)
    return NextResponse.json({ message: "Not authenticated" }, { status: 401 })

  try {
    const [
      entries,
    ] = await Promise.all([
      prisma.entry.findMany({
        select: {
          id: true, title: true, description: true, datetime: true, completed: true, type: true,
        },
        where: {
          userId: user.id,
        },
        orderBy: [
          {
            datetime: 'desc',
          },
          {
            createdAt: 'desc',
          }
        ]
      }),
    ])
    return Response.json({
      entries: entries.map(entry => ({ ...entry, id: Number(entry.id) })),
    })
  } catch (error) {
    console.log(error)
    return Response.json({ error }, { status: 500 })
  }
}
