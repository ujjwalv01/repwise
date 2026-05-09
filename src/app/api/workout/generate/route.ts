import { NextRequest, NextResponse } from 'next/server';
import { generateWorkoutPlan } from '@/lib/gemini';

export async function POST(req: NextRequest) {
  try {
    const { goalType, fitnessLevel, daysPerWeek, sessionDuration, location } = await req.json();
    const raw = await generateWorkoutPlan(goalType, fitnessLevel, daysPerWeek, sessionDuration, location);
    const cleaned = raw.replace(/```json\n?|\n?```/g, '').trim();
    const plan = JSON.parse(cleaned);
    return NextResponse.json({ plan });
  } catch (err) {
    console.error('Workout plan error:', err);
    return NextResponse.json({ error: 'Failed to generate workout plan' }, { status: 500 });
  }
}
