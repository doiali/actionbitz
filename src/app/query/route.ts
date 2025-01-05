import { withAuth } from '@/auth'
import { prisma } from '@/lib/prisma'

// temporary route to play with prisma
export const GET = withAuth(async function GET() {
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
