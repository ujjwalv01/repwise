import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function PUT(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();

    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        age: body.age,
        heightCm: body.heightCm,
        weightKg: body.weightKg,
        goalType: body.goalType,
        activityLevel: body.activityLevel,
        workoutLocation: body.workoutLocation,
        targetCalories: body.targetCalories,
        targetProteinG: body.targetProteinG,
        targetCarbsG: body.targetCarbsG,
        targetFatG: body.targetFatG,
        targetWaterMl: body.targetWaterMl,
        targetSteps: body.targetSteps,
        onboardingDone: body.onboardingDone !== undefined ? body.onboardingDone : true,
      },
    });

    return NextResponse.json(updatedUser);
  } catch (err) {
    console.error("Profile update error:", err);
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
  }
}
