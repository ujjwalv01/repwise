import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';

export async function GET(req: NextRequest) {
  try {
    const session = await auth();

    // Guest mode — return default targets with zero consumption
    if (!session?.user?.id) {
      return NextResponse.json({
        targets: { calories: 2000, protein: 150, carbs: 250, fat: 65, water: 3000, steps: 10000 },
        consumed: { calories: 0, protein: 0, carbs: 0, fat: 0, water: 0, steps: 0 },
        recentFood: [],
        workoutStreak: 0,
        isGuest: true,
      });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Fetch user with targets and all daily logs
    const [user, foodLogs, hydrationLogs, stepLogs, workoutLogs] = await Promise.all([
      prisma.user.findUnique({ where: { id: session.user.id } }),
      prisma.foodLog.findMany({ where: { userId: session.user.id, date: { gte: today } } }),
      prisma.hydrationLog.findMany({ where: { userId: session.user.id, date: { gte: today } } }),
      prisma.stepLog.findMany({ where: { userId: session.user.id, date: { gte: today } } }),
      prisma.workoutLog.findMany({ where: { userId: session.user.id, date: { gte: today } } }),
    ]);

    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    const caloriesConsumed = foodLogs.reduce((a, b) => a + b.calories, 0);
    const proteinG = foodLogs.reduce((a, b) => a + b.proteinG, 0);
    const carbsG = foodLogs.reduce((a, b) => a + b.carbsG, 0);
    const fatG = foodLogs.reduce((a, b) => a + b.fatG, 0);
    const waterMl = hydrationLogs.reduce((a, b) => a + b.amountMl, 0);
    const steps = stepLogs.reduce((a, b) => a + b.steps, 0);

    return NextResponse.json({
      targets: {
        calories: user.targetCalories || 2000,
        protein: user.targetProteinG || 150,
        carbs: user.targetCarbsG || 200,
        fat: user.targetFatG || 60,
        water: user.targetWaterMl || 3000,
        steps: user.targetSteps || 10000,
      },
      consumed: {
        calories: Math.round(caloriesConsumed),
        protein: Math.round(proteinG),
        carbs: Math.round(carbsG),
        fat: Math.round(fatG),
        water: waterMl,
        steps: steps,
      },
      recentFood: foodLogs.slice(0, 3).map(f => ({
        name: f.foodName,
        cal: f.calories,
        time: f.date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      })),
      workoutStreak: 12, // For now mock, can be calculated from workoutLogs history
    });

  } catch (error: any) {
    console.error('Dashboard stats error:', error);
    return NextResponse.json({ error: 'Failed to fetch dashboard stats' }, { status: 500 });
  }
}
