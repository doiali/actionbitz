import { prisma } from '@/lib/prisma';

async function getUsers() {
  const data = await prisma.user.findMany();
  return data;
}

async function getTodos() {
  const data = await prisma.todo.findMany();
  return data;
}

// temporary route to play with prisma
export async function GET() {
  try {
    const [users, todos] = await Promise.all([getUsers(), getTodos()]);
    return Response.json({ users, todos });
  } catch (error) {
    return Response.json({ error }, { status: 500 });
  }
}
