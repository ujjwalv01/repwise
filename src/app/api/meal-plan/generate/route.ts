import { NextRequest, NextResponse } from 'next/server';
import { generateMealPlan } from '@/lib/gemini';

export async function POST(req: NextRequest) {
  try {
    const { preferences, cuisine, daysCount = 7, calories = 2000, proteinG = 150, carbsG = 200, fatG = 55 } = await req.json();
    const raw = await generateMealPlan(calories, proteinG, carbsG, fatG, preferences, cuisine, daysCount);
    const cleaned = raw.replace(/```json\n?|\n?```/g, '').trim();
    const plan = JSON.parse(cleaned);
    return NextResponse.json({ plan });
  } catch (err) {
    console.error('Meal plan error:', err);
    return NextResponse.json({ error: 'Failed to generate meal plan' }, { status: 500 });
  }
}
