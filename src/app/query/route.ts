import { prisma } from '@/lib/prisma';

// temporary route to play with prisma
export async function GET() {
  try {
    const [
      users,
      accounts,
      sessions,
      tokens,
      authenticators,
    ] = await Promise.all([
      prisma.user.findMany(),
      prisma.account.findMany(),
      prisma.session.findMany(),
      prisma.verificationToken.findMany(),
      prisma.authenticator.findMany(),
    ]);
    return Response.json({
      users,
      accounts,
      sessions,
      tokens,
      authenticators,
    });
  } catch (error) {
    return Response.json({ error }, { status: 500 });
  }
}
