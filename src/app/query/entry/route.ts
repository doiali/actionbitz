import { withAuth } from '@/auth'
import { prisma } from '@/lib/prisma'

// temporary route to play with prisma
export const GET = withAuth(async function GET(req) {
  const userId = req.auth.user.id
  try {
    const [
      entries,
    ] = await Promise.all([
      prisma.entry.findMany({
        select: {
          id: true, title: true, description: true, datetime: true, completed: true, type: true,
        },
        where: {
          userId: userId,
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
})
