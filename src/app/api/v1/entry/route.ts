import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';
import { NextResponse } from 'next/server';
import { Entry } from '@prisma/client';

export const GET = auth(async function GET(req) {
  const auth = req?.auth;
  if (!auth)
    return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
  // const searchParams = req.nextUrl.searchParams;
  // const cursor = searchParams.get('cursor') || {};
  // const limit = searchParams.get('limit') || 10;
  const userId = auth.user?.id;
  const entries = (await prisma.entry.findMany({
    where: { userId },
    select: {
      id: true,
      type: true,
      title: true,
      description: true,
      datetime: true,
      completed: true,
      createdAt: true,
    },
    orderBy: { datetime: 'desc' },
    // take: Number(limit),
    // cursor: cursor ? { id: String(cursor) } : undefined,
    // skip: cursor ? 1 : 0,
  }))
    .map((entry) => ({ ...entry, id: Number(entry.id) }));

  // const nextCursor = entries.length === Number(limit) ? entries[entries.length - 1].id : null;

  return NextResponse.json(({ data: entries }), { status: 200 });
});

export const POST = auth(async function POST(req) {
  const userId = req?.auth?.user?.id;
  if (!userId)
    return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
  const { title, description, datetime, type } = await req.json() as Entry;
  const entry = await prisma.entry.create({
    data: {
      title,
      type,
      userId,
      description,
      datetime,
    }
  });
  return NextResponse.json(({ ...entry, id: Number(entry.id) }), { status: 200 });
});