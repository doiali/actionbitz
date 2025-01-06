import { users, entries } from '@/lib/placeholder-data';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcrypt';

async function seedUsers() {
  const data = await Promise.all(users.map(user => new Promise<typeof users[0]>((resolve) => {
    const hashedPassword = bcrypt.hashSync(user.password, 10);
    resolve({ ...user, password: hashedPassword });
  })));

  const usersData = await prisma.user.findMany({ where: { email: { in: users.map(user => user.email) } } });
  const userIds = new Map(usersData.map(user => [user.email, user.id]));

  await prisma.entry.deleteMany({ where: { userId: { in: [...userIds.values()] } } });
  await prisma.user.deleteMany({ where: { id: { in: [...userIds.values()] } } });

  const insertedUsers = await prisma.user.createMany({
    data,
  });
  return insertedUsers;
}

async function seedEntris() {
  const usersData = await prisma.user.findMany({ where: { email: { in: users.map(user => user.email) } } });
  const userIds = new Map(usersData.map(user => [user.email, user.id]));
  const entryData: { title: string, userId: string; }[] = [];
  entries.forEach(({ title, userEmail }) => {
    const userId = userIds.get(userEmail);
    if (!userId) return;
    entryData.push({ title, userId });
  });

  const insertedEntries = await prisma.entry.createMany({
    data: entryData,
  });
  return insertedEntries;
}

// temporary route to seed database
export async function GET() {
  try {
    const insertedUsers = await seedUsers();
    const insertedEntries = await seedEntris();

    return Response.json({ message: 'Database seeded successfully', insertedUsers, insertedEntries });
  } catch (error) {
    return Response.json({ error }, { status: 500 });
  }
}