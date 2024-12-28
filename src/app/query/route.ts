import { prisma } from '@/lib/prisma';

async function getUsers() {
  const data = await prisma.user.findMany();
  return data;
}

async function getEntries() {
  const data = await prisma.entry.findMany();
  return data;
}

// temporary route to play with prisma
export async function GET() {
  try {
    const [users, entries] = await Promise.all([getUsers(), getEntries()]);
    return Response.json({ users, entries });
  } catch (error) {
    return Response.json({ error }, { status: 500 });
  }
}
