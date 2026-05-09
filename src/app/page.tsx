import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Zap } from 'lucide-react';
import { LoginModal } from "./LoginModal";

export default async function RootPage() {
  const session = await auth();

  if (session?.user?.id) {
    const dbUser = await prisma.user.findUnique({ where: { id: session.user.id } });
    if (dbUser?.onboardingDone) redirect("/dashboard");
    else redirect("/onboarding");
  }

  return (
    <>
      {/* ── Fixed Glassmorphism Navbar ── */}
      <header style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 200,
        height: '64px',
        display: 'flex',
        alignItems: 'center',
        padding: '0 6vw',
        background: 'rgba(10,10,10,0.85)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid var(--border-subtle)',
      }} className="mobile-p-4">
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{
            width: 30, height: 30,
            borderRadius: 'var(--radius-sm)',
            background: 'var(--accent)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
          }}>
            <Zap size={16} color="#fff" fill="#fff" />
          </div>
          <span style={{
            fontFamily: 'Inter, sans-serif',
            fontWeight: 600,
            fontSize: '17px',
            color: '#FFFFFF',
            letterSpacing: '-0.02em',
          }}>
            RepWise
          </span>
        </div>

        {/* Auth buttons rendered by LoginModal (client component) */}
        <LoginModal />
      </header>

      {/* ── Full-viewport Hero ── */}
      <section style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        backgroundImage: 'linear-gradient(to bottom, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.5) 100%), url("/bg-hero.png")',
        backgroundSize: 'cover',
        backgroundPosition: 'center center',
        color: '#FFFFFF',
        paddingTop: '64px', /* clear fixed navbar */
      }}>
        {/* Hero body */}
        <div style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          padding: '0 6vw',
        }} className="mobile-p-4">
          <div style={{ maxWidth: 640 }}>


            {/* Headline */}
            <h1 style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: 'clamp(48px, 7vw, 72px)',
              fontWeight: 700,
              lineHeight: 1.05,
              color: '#FFFFFF',
              letterSpacing: '-0.03em',
              marginBottom: '24px',
            }}>
              Train smarter,<br />Not just harder
            </h1>

            {/* Subtext */}
            <p style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: '17px',
              fontWeight: 400,
              color: '#9CA3AF',
              maxWidth: '480px',
              lineHeight: 1.7,
              marginBottom: '36px',
            }}>
              Track nutrition, workouts, and hydration with AI. RepWise builds a smarter, fully personalized path to your fitness goals.
            </p>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--tag-gap, 20px)',
              color: '#6B7280',
              fontSize: '13px',
              fontWeight: 500,
              fontFamily: 'Inter, sans-serif',
              flexWrap: 'wrap'
            }}>
              <span>AI Food Scanner</span>
              <span style={{ width: '4px', height: '4px', borderRadius: '50%', background: 'var(--accent)', flexShrink: 0 }} />
              <span>Workout Plans</span>
              <span style={{ width: '4px', height: '4px', borderRadius: '50%', background: 'var(--accent)', flexShrink: 0 }} />
              <span>Hydration Tracker</span>
            </div>
          </div>
        </div>

        {/* Animated gradient separator line */}
        <div className="hero-separator-wrap">
          <div className="hero-separator-line" />
        </div>
      </section>
    </>
  );
}
