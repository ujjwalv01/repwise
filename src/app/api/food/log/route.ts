import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { foodName, calories, proteinG, carbsG, fatG, fiberG, imageUrl, aiScanned, mealType, portion } = await req.json();

    const log = await prisma.foodLog.create({
      data: {
        userId: session.user.id,
        foodName,
        calories: calories * portion,
        proteinG: proteinG * portion,
        carbsG: carbsG * portion,
        fatG: fatG * portion,
        fiberG: (fiberG || 0) * portion,
        imageUrl,
        aiScanned: aiScanned || false,
        mealType: mealType || 'SNACK',
        servingSize: portion,
      }
    });

    return NextResponse.json({ success: true, log });

  } catch (error: any) {
    console.error('Food log error:', error);
    return NextResponse.json({ error: 'Failed to log food' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get today's logs
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const logs = await prisma.foodLog.findMany({
      where: {
        userId: session.user.id,
        date: { gte: today }
      },
      orderBy: { date: 'desc' }
    });

    return NextResponse.json({ logs });

  } catch (_error) {
    return NextResponse.json({ error: 'Failed to fetch logs' }, { status: 500 });
  }
}
