'use client';
import { useState, useEffect } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { motion, Variants } from 'framer-motion';
import {
  Footprints, Flame, Droplets, Zap,
  ChevronRight, Apple, Dumbbell, Sparkles, Loader2, Utensils,
} from 'lucide-react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { AnimatedNumber } from '@/components/ui/AnimatedNumber';

const WaterBottle3D = dynamic(() => import('@/components/3d/WaterBottle3D'), { ssr: false });

/* ── Shared card style ─────────────────────────────────────── */
const CARD: React.CSSProperties = {
  background: '#161616',
  border: '1px solid rgba(255,255,255,0.07)',
  borderRadius: '14px',
  padding: '20px 24px',
};

/* ── Thin progress bar ─────────────────────────────────────── */
function Bar({ pct, color, height = 3 }: { pct: number; color: string; height?: number }) {
  return (
    <div style={{ width: '100%', height, background: 'rgba(255,255,255,0.07)', borderRadius: 2, overflow: 'hidden' }}>
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${Math.min(pct, 100)}%` }}
        transition={{ duration: 0.9, ease: [0.34, 1.56, 0.64, 1] }}
        style={{ height: '100%', background: color, borderRadius: 2 }}
      />
    </div>
  );
}

/* ── Stagger animation ─────────────────────────────────────── */
const container: Variants = { hidden: {}, show: { transition: { staggerChildren: 0.07 } } };
const item: Variants = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 320, damping: 28 } } };

export default function DashboardPage() {
  const { user, addToast } = useAppStore();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/dashboard/stats')
      .then(r => r.json())
      .then(d => setStats(d))
      .catch(e => addToast(e.message, 'error'))
      .finally(() => setLoading(false));
  }, [addToast]);

  if (loading) {
    return (
      <div style={{ height: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Loader2 size={32} color="var(--accent)" style={{ animation: 'spin 1s linear infinite' }} />
      </div>
    );
  }

  const T = stats?.targets  || { calories: 2000, protein: 150, carbs: 250, fat: 65, water: 3000, steps: 10000 };
  const C = stats?.consumed || { calories: 0, protein: 0, carbs: 0, fat: 0, water: 0, steps: 0 };
  const recentFood    = stats?.recentFood    || [];
  const workoutStreak = stats?.workoutStreak || 0;

  const hour      = new Date().getHours();
  const greeting  = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';
  const firstName = user?.name?.split(' ')[0] ?? 'Champ';

  /* ── Metric card definitions ───────────────────────────── */
  const metricCards = [
    { label: 'Steps Today',   value: C.steps,                           target: T.steps,    icon: Footprints, unit: '',     live: true  },
    { label: 'Calories Left', value: Math.max(0, T.calories - C.calories), target: T.calories, icon: Flame,      unit: 'kcal', live: false },
    { label: 'Water',         value: C.water,                           target: T.water,    icon: Droplets,   unit: 'ml',   live: false },
    { label: 'Streak',        value: workoutStreak,                     target: 30,         icon: Zap,        unit: 'days', live: false },
  ];

  /* ── Macro bar definitions ─────────────────────────────── */
  const macros = [
    { label: 'Protein', current: C.protein, target: T.protein, color: '#F97316' },
    { label: 'Carbs',   current: C.carbs,   target: T.carbs,   color: '#3B82F6' },
    { label: 'Fat',     current: C.fat,     target: T.fat,     color: '#8B5CF6' },
  ];

  return (
    <div style={{ maxWidth: 1140 }}>

      {/* ── Page Header ─────────────────────────────────── */}
      <div style={{ marginBottom: '28px' }}>
        <motion.h1
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          style={{ fontFamily: 'Inter, sans-serif', fontSize: '26px', fontWeight: 600, color: '#FFFFFF', marginBottom: '4px', letterSpacing: '-0.02em' }}
        >
          {greeting}, {firstName}!
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { delay: 0.08 } }}
          style={{ fontFamily: 'Inter, sans-serif', fontSize: '14px', fontWeight: 400, color: '#6B7280' }}
        >
          {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
        </motion.p>
      </div>

      {/* ── Row 1 — 4 Stat Cards ─────────────────────────── */}
      <motion.div
        variants={container} initial="hidden" animate="show"
        className="mobile-grid-2"
        style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '16px', marginBottom: '20px' }}
      >
        {metricCards.map(({ label, value, target, icon: Icon, unit, live }) => {
          const pct = Math.round(Math.min((value / target) * 100, 200));
          return (
            <motion.div key={label} variants={item}>
              <div style={CARD}>
                {/* Top row: icon + percent */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
                  <Icon size={18} color="#F97316" strokeWidth={1.75} style={{ opacity: 0.8 }} />
                  <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '11px', color: '#9CA3AF' }}>{pct}%</span>
                </div>

                {/* Value + unit */}
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '5px', marginBottom: '4px' }}>
                  <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '28px', fontWeight: 600, color: '#F97316', lineHeight: 1 }}>
                    <AnimatedNumber value={value} />
                  </span>
                  <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '13px', fontWeight: 400, color: '#9CA3AF' }}>{unit}</span>
                </div>

                {/* Label */}
                <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '13px', fontWeight: 400, color: '#6B7280', marginBottom: '12px' }}>
                  {label}
                </div>

                {/* Progress bar — 3px */}
                <Bar pct={(value / target) * 100} color="#F97316" height={3} />

                {/* Live pill */}
                {live && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '8px' }}>
                    <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#10B981', display: 'inline-block' }} />
                    <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '12px', color: '#10B981' }}>Live tracking</span>
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* ── Row 2 — Macros + Hydration ──────────────────── */}
      <div className="mobile-grid-1" style={{ display: 'grid', gridTemplateColumns: '3fr 2fr', gap: '16px', marginBottom: '20px' }}>

        {/* Macros card */}
        <div style={CARD}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
            <h2 style={{ fontFamily: 'Inter, sans-serif', fontSize: '15px', fontWeight: 500, color: '#FFFFFF' }}>Today's Macros</h2>
            <Link href="/nutrition" style={{ display: 'flex', alignItems: 'center', gap: '3px', color: '#F97316', fontSize: '13px', textDecoration: 'none' }}>
              Details <ChevronRight size={13} />
            </Link>
          </div>

          {/* Calorie donut + macro bars */}
          <div style={{ display: 'flex', gap: '20px', alignItems: 'center', marginBottom: '18px' }}>
            {/* Donut */}
            <div style={{ width: 80, height: 80, flexShrink: 0, position: 'relative' }}>
              <svg viewBox="0 0 36 36" style={{ width: '100%', height: '100%', transform: 'rotate(-90deg)' }}>
                <circle cx="18" cy="18" r="15.9" fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="3" />
                <circle cx="18" cy="18" r="15.9" fill="none" stroke="#F97316" strokeWidth="3"
                  strokeDasharray={`${Math.min((C.calories / T.calories) * 100, 100)} 100`}
                  strokeLinecap="round" />
              </svg>
              <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '13px', fontWeight: 600, color: '#F97316' }}>{C.calories}</span>
                <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '10px', color: '#6B7280' }}>kcal</span>
              </div>
            </div>

            {/* Macro bars */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {macros.map(({ label, current, target, color }) => (
                <div key={label}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                    <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '13px', color: '#9CA3AF' }}>{label}</span>
                    <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '12px', color }}>
                      {current}g <span style={{ color: '#4B5563' }}>/ {target}g</span>
                    </span>
                  </div>
                  <Bar pct={(current / target) * 100} color={color} height={6} />
                </div>
              ))}
            </div>
          </div>

          {/* Recent food entries */}
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '14px' }}>
            <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '12px', color: '#4B5563', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Recent entries
            </p>
            {recentFood.length === 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '16px 0', gap: '8px' }}>
                <Utensils size={18} color="#4B5563" strokeWidth={1.5} />
                <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '14px', color: '#4B5563' }}>No meals logged today</p>
              </div>
            ) : recentFood.map((f: any, i: number) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Apple size={13} color="#F97316" strokeWidth={1.5} />
                  <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '13px', color: '#E5E7EB' }}>{f.name}</span>
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '12px', color: '#4B5563' }}>{f.time}</span>
                  <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '12px', color: '#F97316' }}>{Math.round(f.cal)} kcal</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Hydration card */}
        <div style={{ ...CARD, display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <h2 style={{ fontFamily: 'Inter, sans-serif', fontSize: '15px', fontWeight: 500, color: '#FFFFFF' }}>Hydration</h2>
            <Link href="/hydration" style={{ fontFamily: 'Inter, sans-serif', fontSize: '13px', color: '#F97316', textDecoration: 'none' }}>
              + Log
            </Link>
          </div>
          <div style={{ flex: 1, width: '100%', minHeight: 180 }}>
            <WaterBottle3D fillLevel={C.water / T.water} />
          </div>
          <div style={{ textAlign: 'center', marginTop: '10px' }}>
            <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '20px', fontWeight: 600, color: '#14B8A6' }}>
              {C.water}
              <span style={{ fontSize: '13px', fontWeight: 400, color: '#6B7280', marginLeft: '4px' }}>ml</span>
            </span>
            <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '12px', color: '#4B5563', display: 'block', marginTop: '2px' }}>
              of {T.water}ml goal
            </span>
          </div>
        </div>
      </div>

      {/* ── Row 3 — Workout + Quick Actions ─────────────── */}
      <div className="mobile-grid-1" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '16px' }}>

        {/* Workout card */}
        <div style={CARD}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h2 style={{ fontFamily: 'Inter, sans-serif', fontSize: '15px', fontWeight: 500, color: '#FFFFFF', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Dumbbell size={16} color="#F97316" strokeWidth={1.75} />
              Today's Workout
            </h2>
            <Link href="/workout" style={{ display: 'flex', alignItems: 'center', gap: '3px', fontFamily: 'Inter, sans-serif', fontSize: '13px', color: '#F97316', textDecoration: 'none' }}>
              Full plan <ChevronRight size={13} />
            </Link>
          </div>
          <div className="mobile-scroll-x" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '12px' }}>
            {[
              { name: 'Push-Up', sets: '4×12', muscle: 'Chest'  },
              { name: 'Pull-Up', sets: '3×8',  muscle: 'Back'   },
              { name: 'Squat',   sets: '4×10', muscle: 'Legs'   },
            ].map(ex => (
              <div key={ex.name} style={{
                background: 'rgba(255,255,255,0.03)',
                borderRadius: '10px',
                padding: '14px',
                border: '1px solid rgba(255,255,255,0.07)',
                minWidth: '140px',
              }}>
                <p style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: '14px', color: '#E5E7EB', marginBottom: '4px' }}>{ex.name}</p>
                <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '13px', color: '#F97316', marginBottom: '8px' }}>{ex.sets}</p>
                <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '11px', background: 'rgba(249,115,22,0.1)', color: '#F97316', padding: '2px 8px', borderRadius: '100px' }}>
                  {ex.muscle}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div style={CARD}>
          <h2 style={{ fontFamily: 'Inter, sans-serif', fontSize: '15px', fontWeight: 500, color: '#FFFFFF', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Sparkles size={15} color="#F97316" strokeWidth={1.75} />
            Quick Actions
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {[
              { href: '/nutrition',  label: 'Scan Food'       },
              { href: '/workout',    label: 'Start Workout'    },
              { href: '/hydration',  label: 'Log Water'        },
              { href: '/meal-plan',  label: 'View Meal Plan'   },
              { href: '/goals',      label: 'Check Goals'      },
            ].map(({ href, label }) => (
              <Link key={href} href={href} style={{
                display: 'flex',
                alignItems: 'center',
                padding: '9px 12px',
                borderRadius: '8px',
                border: '1px solid rgba(255,255,255,0.06)',
                background: 'rgba(255,255,255,0.02)',
                textDecoration: 'none',
                fontFamily: 'Inter, sans-serif',
                color: '#E5E7EB',
                fontSize: '13px',
                fontWeight: 500,
                transition: 'border-color 150ms ease, background 150ms ease',
              }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLElement).style.borderColor = 'rgba(249,115,22,0.3)';
                  (e.currentTarget as HTMLElement).style.background  = 'rgba(249,115,22,0.06)';
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.06)';
                  (e.currentTarget as HTMLElement).style.background  = 'rgba(255,255,255,0.02)';
                }}
              >
                {label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
