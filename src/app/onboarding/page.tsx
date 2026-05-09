'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useAppStore } from '@/store/useAppStore';
import { UserProfile, GoalType, ActivityLevel, WorkoutLocation } from '@/types';
import dynamic from 'next/dynamic';
import { ChevronRight, ChevronLeft, Check, Zap } from 'lucide-react';

const BackgroundScene = dynamic(() => import('@/components/3d/BackgroundScene'), { ssr: false });

// Mifflin-St Jeor BMR formula
function calcMacros(age: number, heightCm: number, weightKg: number, goal: GoalType, activity: ActivityLevel) {
  const bmr = 10 * weightKg + 6.25 * heightCm - 5 * age + 5;
  const activityMult = { SEDENTARY: 1.2, LIGHT: 1.375, MODERATE: 1.55, ACTIVE: 1.725, VERY_ACTIVE: 1.9 }[activity];
  const tdee = Math.round(bmr * activityMult);
  const calories = goal === 'LOSE_FAT' ? tdee - 500 : goal === 'GAIN_MUSCLE' ? tdee + 300 : tdee;
  const proteinG = Math.round(weightKg * 2.0);
  const fatG = Math.round((calories * 0.25) / 9);
  const carbsG = Math.round((calories - proteinG * 4 - fatG * 9) / 4);
  const waterMl = Math.round(weightKg * 35);
  return { targetCalories: calories, targetProteinG: proteinG, targetCarbsG: carbsG, targetFatG: fatG, targetWaterMl: waterMl };
}

const GOALS: { type: GoalType; label: string; emoji: string; desc: string; color: string }[] = [
  { type: 'LOSE_FAT', label: 'Lose Fat', emoji: '', desc: 'Calorie deficit + cardio focus', color: 'var(--accent-primary)' },
  { type: 'GAIN_MUSCLE', label: 'Gain Muscle', emoji: '', desc: 'Progressive overload + surplus', color: 'var(--accent-primary)' },
  { type: 'MAINTAIN', label: 'Maintain', emoji: '', desc: 'Balance & sustain', color: 'var(--accent-primary)' },
  { type: 'IMPROVE_ENDURANCE', label: 'Endurance', emoji: '', desc: 'Cardio & stamina training', color: 'var(--accent-primary)' },
];

const ACTIVITY_LEVELS: { level: ActivityLevel; label: string; desc: string }[] = [
  { level: 'SEDENTARY', label: 'Sedentary', desc: 'Desk job, little exercise' },
  { level: 'LIGHT', label: 'Light', desc: '1-3 days/week' },
  { level: 'MODERATE', label: 'Moderate', desc: '3-5 days/week' },
  { level: 'ACTIVE', label: 'Active', desc: '6-7 days/week' },
  { level: 'VERY_ACTIVE', label: 'Very Active', desc: 'Athlete / physical job' },
];

const slideVariants = {
  enter: (dir: number) => ({ x: dir > 0 ? 60 : -60, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({ x: dir > 0 ? -60 : 60, opacity: 0 }),
};

export default function OnboardingPage() {
  const router = useRouter();
  const { user, setUser } = useAppStore();

  const [step, setStep] = useState(0);
  const [dir, setDir] = useState(1);
  const [form, setForm] = useState({
    name: '', age: 25, heightCm: 170, weightKg: 70,
    goal: 'GAIN_MUSCLE' as GoalType,
    activity: 'MODERATE' as ActivityLevel,
    location: 'HOME' as WorkoutLocation,
  });
  const [macros, setMacros] = useState({ targetCalories: 2200, targetProteinG: 140, targetCarbsG: 220, targetFatG: 60, targetWaterMl: 2450 });

  const STEPS = ['Details', 'Goal', 'Location', 'Activity', 'Macros'];

  const next = () => {
    if (step === 3) {
      // Calculate macros before showing step 4
      const m = calcMacros(form.age, form.heightCm, form.weightKg, form.goal, form.activity);
      setMacros(m);
    }
    setDir(1);
    setStep(s => Math.min(s + 1, 4));
  };

  const back = () => { setDir(-1); setStep(s => Math.max(s - 1, 0)); };

  const finish = async () => {
    const profile = {
      age: form.age,
      heightCm: form.heightCm,
      weightKg: form.weightKg,
      goalType: form.goal,
      activityLevel: form.activity,
      workoutLocation: form.location,
      targetSteps: 10000,
      ...macros,
    };
    
    // Save to database
    try {
      await fetch('/api/user', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profile),
      });
    } catch (e) {
      console.error(e);
    }

    // Save to local Zustand store for immediate UI updates
    setUser({
      ...user,
      id: user?.id || 'guest-' + Math.random().toString(36).substr(2, 9),
      name: form.name || user?.name || 'Guest',
      onboardingDone: true,
      ...profile,
    } as UserProfile);
    
    router.push('/dashboard');
  };

  const pct = ((step + 1) / 5) * 100;

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
      <BackgroundScene />

      {/* Progress bar */}
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, height: 3, background: 'rgba(255,255,255,0.06)', zIndex: 999 }}>
        <motion.div animate={{ width: `${pct}%` }} transition={{ duration: 0.5, ease: 'easeInOut' }}
          style={{ height: '100%', background: 'var(--accent-primary)' }} />
      </div>

      {/* Logo */}
      <div style={{ position: 'fixed', top: 24, left: 32, display: 'flex', alignItems: 'center', gap: 8, zIndex: 999 }}>
        <div style={{ width: 32, height: 32, borderRadius: 8, background: 'var(--accent-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Zap size={18} color="#FFFFFF" fill="#FFFFFF" />
        </div>
        <span style={{ fontFamily: 'Inter', fontWeight: 700, fontSize: '1.1rem', letterSpacing: '-0.02em' }}>RepWise</span>
      </div>

      {/* Step indicator */}
      <div style={{ position: 'fixed', top: 24, right: 32, display: 'flex', gap: 8, zIndex: 999 }}>
        {STEPS.map((s, i) => (
          <div key={s} style={{ width: i === step ? 24 : 8, height: 8, borderRadius: 4, transition: 'all 0.3s',
            background: i < step ? 'var(--accent-success)' : i === step ? 'var(--accent-primary)' : 'rgba(255,255,255,0.15)' }} />
        ))}
      </div>

      {/* Card */}
      <div style={{ width: '100%', maxWidth: 540, padding: '0 1.5rem' }}>
        <AnimatePresence mode="wait" custom={dir}>
          {step === 0 && (
            <motion.div key="step0" custom={dir} variants={slideVariants} initial="enter" animate="center" exit="exit"
              transition={{ type: 'spring', stiffness: 260, damping: 28 }}>
              <StepCard title="Welcome to RepWise" subtitle="Let's set up your profile">
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <Field label="Your Name">
                    <input className="input-glass" placeholder="e.g. Arjun Sharma" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
                  </Field>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem' }}>
                    <Field label="Age"><input className="input-glass" type="number" value={form.age} onChange={e => setForm(f => ({ ...f, age: +e.target.value }))} /></Field>
                    <Field label="Height (cm)"><input className="input-glass" type="number" value={form.heightCm} onChange={e => setForm(f => ({ ...f, heightCm: +e.target.value }))} /></Field>
                    <Field label="Weight (kg)"><input className="input-glass" type="number" value={form.weightKg} onChange={e => setForm(f => ({ ...f, weightKg: +e.target.value }))} /></Field>
                  </div>
                </div>
              </StepCard>
            </motion.div>
          )}

          {step === 1 && (
            <motion.div key="step1" custom={dir} variants={slideVariants} initial="enter" animate="center" exit="exit"
              transition={{ type: 'spring', stiffness: 260, damping: 28 }}>
              <StepCard title="What's your main goal?" subtitle="This shapes your calorie targets & workout style">
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.875rem' }}>
                  {GOALS.map(g => (
                    <motion.button key={g.type} onClick={() => setForm(f => ({ ...f, goal: g.type }))}
                      whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                      style={{ padding: '1.25rem', borderRadius: 14, border: `2px solid ${form.goal === g.type ? g.color : 'rgba(255,255,255,0.08)'}`,
                        background: form.goal === g.type ? `${g.color}18` : 'rgba(255,255,255,0.03)', cursor: 'pointer', textAlign: 'left', transition: 'all 0.2s',
                        boxShadow: form.goal === g.type ? `0 0 20px ${g.color}33` : 'none' }}>
                      <div style={{ fontSize: '2rem', marginBottom: 8 }}>{g.emoji}</div>
                      <div style={{ fontWeight: 700, color: form.goal === g.type ? g.color : 'var(--text-primary)', marginBottom: 4 }}>{g.label}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{g.desc}</div>
                    </motion.button>
                  ))}
                </div>
              </StepCard>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div key="step2" custom={dir} variants={slideVariants} initial="enter" animate="center" exit="exit"
              transition={{ type: 'spring', stiffness: 260, damping: 28 }}>
              <StepCard title="Where do you train?" subtitle="We'll tailor exercises to your environment">
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.875rem' }}>
                  {([['GYM', '', 'Full equipment'], ['HOME', '', 'Bodyweight & dumbbells'], ['BOTH', '', 'Mix of both']] as const).map(([loc, emoji, desc]) => (
                    <motion.button key={loc} onClick={() => setForm(f => ({ ...f, location: loc }))}
                      whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                      style={{ padding: '1.5rem 1rem', borderRadius: 14, border: `2px solid ${form.location === loc ? 'var(--accent-primary)' : 'rgba(255,255,255,0.08)'}`,
                        background: form.location === loc ? 'rgba(0,122,255,0.1)' : 'rgba(255,255,255,0.03)', cursor: 'pointer', textAlign: 'center', transition: 'all 0.2s' }}>
                      <div style={{ fontSize: '2rem', marginBottom: 8 }}>{emoji}</div>
                      <div style={{ fontWeight: 700, fontSize: '0.875rem', marginBottom: 4, color: form.location === loc ? 'var(--accent-primary)' : 'var(--text-primary)' }}>{loc}</div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{desc}</div>
                    </motion.button>
                  ))}
                </div>
              </StepCard>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div key="step3" custom={dir} variants={slideVariants} initial="enter" animate="center" exit="exit"
              transition={{ type: 'spring', stiffness: 260, damping: 28 }}>
              <StepCard title="How active are you?" subtitle="Used to calculate your daily calorie needs">
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {ACTIVITY_LEVELS.map((a, i) => (
                    <motion.button key={a.level} onClick={() => setForm(f => ({ ...f, activity: a.level }))}
                      whileHover={{ x: 4 }} style={{ padding: '1rem 1.25rem', borderRadius: 12,
                        border: `1px solid ${form.activity === a.level ? 'var(--accent-primary)' : 'rgba(255,255,255,0.08)'}`,
                        background: form.activity === a.level ? 'rgba(0,122,255,0.08)' : 'rgba(255,255,255,0.02)',
                        cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', transition: 'all 0.2s' }}>
                      <div style={{ textAlign: 'left' }}>
                        <div style={{ fontWeight: 600, color: form.activity === a.level ? 'var(--accent-primary)' : 'var(--text-primary)' }}>{a.label}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{a.desc}</div>
                      </div>
                      {/* Activity bar */}
                      <div style={{ display: 'flex', gap: 3 }}>
                        {Array.from({ length: 5 }).map((_, j) => (
                          <div key={j} style={{ width: 6, height: 20 * (j + 1) / 5 + 8, borderRadius: 3,
                            background: j <= i ? (form.activity === a.level ? 'var(--accent-primary)' : '#444') : 'rgba(255,255,255,0.08)' }} />
                        ))}
                      </div>
                    </motion.button>
                  ))}
                </div>
              </StepCard>
            </motion.div>
          )}

          {step === 4 && (
            <motion.div key="step4" custom={dir} variants={slideVariants} initial="enter" animate="center" exit="exit"
              transition={{ type: 'spring', stiffness: 260, damping: 28 }}>
              <StepCard title="Your Daily Targets" subtitle="Calculated with Mifflin-St Jeor formula — adjust if needed">
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.875rem', marginBottom: '1.5rem' }}>
                  {[
                    { label: 'Calories', val: macros.targetCalories, unit: 'kcal', color: 'var(--accent-error)' },
                    { label: 'Protein', val: macros.targetProteinG, unit: 'g', color: 'var(--accent-primary)' },
                    { label: 'Carbs', val: macros.targetCarbsG, unit: 'g', color: 'var(--accent-secondary)' },
                    { label: 'Fat', val: macros.targetFatG, unit: 'g', color: 'var(--accent-warning)' },
                    { label: 'Water', val: macros.targetWaterMl, unit: 'ml', color: 'var(--accent-primary)' },
                    { label: 'Steps Goal', val: 10000, unit: 'steps', color: 'var(--accent-success)' },
                  ].map(m => (
                    <div key={m.label} style={{ padding: '1rem', background: 'rgba(255,107,0,0.06)', borderRadius: 12, border: '1px solid rgba(255,107,0,0.18)', textAlign: 'center' }}>
                      <div style={{ fontFamily: 'JetBrains Mono', fontSize: '1.5rem', fontWeight: 700, color: m.color }}>
                        {m.val.toLocaleString()}
                      </div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: 2 }}>{m.unit} {m.label}</div>
                    </div>
                  ))}
                </div>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textAlign: 'center' }}>
                  Based on: {form.weightKg}kg · {form.heightCm}cm · Age {form.age} · {form.goal.replace('_', ' ')} goal
                </p>
              </StepCard>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation buttons */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1.5rem', gap: '0.75rem' }}>
          {step > 0 ? (
            <button className="btn-ghost" onClick={back} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <ChevronLeft size={16} /> Back
            </button>
          ) : <div />}

          {step < 4 ? (
            <motion.button className="btn-primary" onClick={next} whileTap={{ scale: 0.97 }}
              style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '12px 28px', marginLeft: 'auto' }}>
              Continue <ChevronRight size={16} />
            </motion.button>
          ) : (
            <motion.button className="btn-neon-green" onClick={finish} whileTap={{ scale: 0.97 }}
              style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '12px 28px', marginLeft: 'auto', color: '#FFFFFF' }}>
              <Check size={16} /> Start My Journey!
            </motion.button>
          )}
        </div>
      </div>
    </div>
  );
}

function StepCard({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) {
  return (
    <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: 20, padding: '2rem' }}>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: 4 }}>{title}</h1>
      <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '1.5rem' }}>{subtitle}</p>
      {children}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: 6 }}>{label}</label>
      {children}
    </div>
  );
}
