import { users } from '@/lib/placeholder-data';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcrypt';

async function seedUsers() {
  const data = await Promise.all(users.map(user => new Promise<typeof users[0]>((resolve) => {
    const hashedPassword = bcrypt.hashSync(user.password, 10);
    resolve({ ...user, password: hashedPassword });
  })));

  await prisma.user.deleteMany({});
  const insertedUsers = await prisma.user.createMany({
    data,
  });
  return insertedUsers;
}

// temporary route to seed database
export async function GET() {
  try {
    const insertedUsers = seedUsers();

    return Response.json({ message: 'Database seeded successfully', insertedUsers });
  } catch (error) {
    return Response.json({ error }, { status: 500 });
  }
}