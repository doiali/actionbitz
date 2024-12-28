import { prisma } from '@/lib/prisma';

// temporary route to play with prisma
export async function GET() {
  try {
    const [
      entries,
    ] = await Promise.all([
      prisma.entry.findMany({
        select: {
          id: true, title: true, userId: true
        }
      }),
    ]);
    return Response.json({
      entries: entries.map(entry => ({ ...entry, id: Number(entry.id) })),
    });
  } catch (error) {
    console.log(error);
    return Response.json({ error }, { status: 500 });
  }
}
