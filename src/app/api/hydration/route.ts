import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, guest: true, message: 'Sign in to save your hydration data' });
    }

    const { amountMl, drinkType } = await req.json();

    const log = await prisma.hydrationLog.create({
      data: {
        userId: session.user.id,
        amountMl,
        drinkType: drinkType || 'water'
      }
    });

    return NextResponse.json({ success: true, log });

  } catch (error) {
    return NextResponse.json({ error: 'Failed to log hydration' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ logs: [] });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const logs = await prisma.hydrationLog.findMany({
      where: {
        userId: session.user.id,
        date: { gte: today }
      },
      orderBy: { date: 'desc' }
    });

    return NextResponse.json({ logs });

  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch hydration' }, { status: 500 });
  }
}
