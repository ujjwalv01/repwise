import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST() {
  try {
    const session = await auth();
    if (!session?.user?.id || !session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const lastWeek = new Date();
    lastWeek.setDate(lastWeek.getDate() - 7);

    // Fetch user data and logs
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: {
        foodLogs: { where: { date: { gte: lastWeek } } },
        workoutLogs: { where: { date: { gte: lastWeek } } },
        stepLogs: { where: { date: { gte: lastWeek } } },
      }
    });

    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    // Calculate stats
    const totalCal = user.foodLogs.reduce((a, b) => a + b.calories, 0);
    const avgCal = Math.round(totalCal / 7);
    const totalWorkouts = user.workoutLogs.length;
    const avgSteps = Math.round(user.stepLogs.reduce((a, b) => a + b.steps, 0) / (user.stepLogs.length || 1));

    // Send email
    const { error } = await resend.emails.send({
      from: `RepWise AI <${process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev'}>`,
      to: [user.email],
      subject: 'Your Weekly Fitness Summary - RepWise',
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; background: #0a0a0a; color: #ffffff; padding: 40px; border-radius: 20px;">
          <h1 style="color: #00d4ff; font-size: 24px; text-align: center;">Weekly Progress Report</h1>
          <p style="text-align: center; color: #a0a0a0;">Great work this week, ${user.name?.split(' ')[0]}!</p>
          
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin: 40px 0;">
            <div style="background: rgba(255,255,255,0.05); padding: 20px; border-radius: 12px; text-align: center;">
              <p style="margin: 0; color: #a0a0a0; font-size: 12px;">AVG CALORIES</p>
              <p style="margin: 5px 0 0; color: #ff4d6d; font-size: 24px; font-weight: bold;">${avgCal}</p>
            </div>
            <div style="background: rgba(255,255,255,0.05); padding: 20px; border-radius: 12px; text-align: center;">
              <p style="margin: 0; color: #a0a0a0; font-size: 12px;">WORKOUTS</p>
              <p style="margin: 5px 0 0; color: #39ff14; font-size: 24px; font-weight: bold;">${totalWorkouts}</p>
            </div>
          </div>

          <div style="background: rgba(255,255,255,0.05); padding: 20px; border-radius: 12px; margin-bottom: 30px;">
             <h3 style="margin-top: 0; font-size: 16px; color: #00d4ff;">Activity Insight</h3>
             <p style="color: #d0d0d0; font-size: 14px; line-height: 1.6;">
               Your average step count was <strong>${avgSteps}</strong> per day. 
               ${avgSteps > 8000 ? "You're doing excellent on your daily movement!" : "Try to aim for a bit more walking next week to hit your targets."}
             </p>
          </div>

          <a href="${process.env.AUTH_URL}/dashboard" style="display: block; width: 100%; padding: 15px; background: #00d4ff; color: #000000; text-align: center; text-decoration: none; border-radius: 10px; font-weight: bold;">VIEW FULL DASHBOARD</a>
          
          <p style="margin-top: 40px; font-size: 11px; color: #666; text-align: center;">
            You received this because you are an active user of RepWise. <br/>
            Keep pushing your limits!
          </p>
        </div>
      `
    });

    if (error) {
      return NextResponse.json({ error }, { status: 400 });
    }

    return NextResponse.json({ success: true, message: 'Email sent' });

  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
