import { prisma } from '@/lib/prisma';

async function getUsers() {
  const data = await prisma.user.findMany()
  return data
}

// temporary route to play with prisma
export async function GET() {
  try {
    const result = await getUsers();
    return Response.json(result);
  } catch (error) {
    return Response.json({ error }, { status: 500 });
  }
}
