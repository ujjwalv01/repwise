'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GlassCard } from '@/components/ui/GlassCard';
import { Dumbbell, Play, ChevronDown, ChevronUp, Loader2, Sparkles, Timer, Camera } from 'lucide-react';
import Link from 'next/link';

const INITIAL_PLAN = [
  { day: 'Monday', focus: 'Push Day — Chest & Triceps', color: 'var(--accent-primary)', exercises: [
    { name: 'Push-Up', sets: 4, reps: '8-12', restSec: 90, muscleGroups: ['Chest', 'Triceps'], tips: 'Keep core tight throughout', difficulty: 1 },
    { name: 'Overhead Press', sets: 4, reps: '8-12', restSec: 90, muscleGroups: ['Shoulders', 'Triceps'], tips: 'Lock core, press straight up', difficulty: 2 },
    { name: 'Diamond Push-Up', sets: 3, reps: '10-15', restSec: 60, muscleGroups: ['Triceps'], tips: 'Tuck elbows close', difficulty: 2 },
    { name: 'Lateral Raise', sets: 3, reps: '12-15', restSec: 60, muscleGroups: ['Shoulders'], tips: 'Slight bend in elbows', difficulty: 1 },
  ]},
  { day: 'Tuesday', focus: 'Pull Day — Back & Biceps', color: 'var(--accent-primary)', exercises: [
    { name: 'Pull-Up', sets: 4, reps: '5-10', restSec: 120, muscleGroups: ['Lats', 'Biceps'], tips: 'Full dead hang between reps', difficulty: 3 },
    { name: 'Bent-Over Row', sets: 4, reps: '8-12', restSec: 90, muscleGroups: ['Back', 'Biceps'], tips: 'Keep back flat, pull to lower chest', difficulty: 2 },
    { name: 'Bicep Curl', sets: 3, reps: '10-15', restSec: 60, muscleGroups: ['Biceps'], tips: 'Elbows pinned at sides', difficulty: 1 },
  ]},
  { day: 'Wednesday', focus: 'Legs — Quads & Glutes', color: 'var(--accent-primary)', exercises: [
    { name: 'Squat', sets: 4, reps: '8-12', restSec: 120, muscleGroups: ['Quads', 'Glutes'], tips: 'Drive knees out, chest up', difficulty: 2 },
    { name: 'Bulgarian Split Squat', sets: 3, reps: '10 each', restSec: 90, muscleGroups: ['Quads', 'Glutes'], tips: 'Stay upright, control descent', difficulty: 3 },
    { name: 'Glute Bridge', sets: 3, reps: '15-20', restSec: 60, muscleGroups: ['Glutes', 'Hamstrings'], tips: 'Squeeze hard at top', difficulty: 1 },
  ]},
  { day: 'Thursday', focus: 'Rest / Light Cardio', color: 'var(--accent-primary)', exercises: [] },
  { day: 'Friday', focus: 'Full Body + Core', color: 'var(--accent-primary)', exercises: [
    { name: 'Burpee', sets: 3, reps: '10-15', restSec: 90, muscleGroups: ['Full Body'], tips: 'Chest to floor on way down', difficulty: 3 },
    { name: 'Mountain Climber', sets: 3, reps: '30 sec', restSec: 60, muscleGroups: ['Core', 'Shoulders'], tips: 'Keep hips level', difficulty: 2 },
    { name: 'Plank', sets: 3, reps: '45 sec', restSec: 60, muscleGroups: ['Core'], tips: 'Breathe steadily', difficulty: 1 },
  ]},
  { day: 'Saturday', focus: 'Active Recovery', color: 'var(--accent-primary)', exercises: [
    { name: 'Walking', sets: 1, reps: '30 min', restSec: 0, muscleGroups: ['Cardio'], tips: 'Steady pace', difficulty: 1 },
  ]},
  { day: 'Sunday', focus: 'Rest Day', color: 'var(--accent-primary)', exercises: [] },
];

const CARD: React.CSSProperties = { 
  background: '#161616', 
  border: '1px solid rgba(255,255,255,0.07)', 
  borderRadius: '14px', 
  padding: '20px 24px',
  transition: 'border-color 150ms ease'
};
const DIFFICULTY_LABELS = ['', 'Easy', 'Medium', 'Hard'];
const DIFFICULTY_STYLE: Record<string, React.CSSProperties> = {
  Easy:   { background: 'rgba(16,185,129,0.15)',  color: '#10B981' },
  Medium: { background: 'rgba(245,158,11,0.15)', color: '#F59E0B' },
  Hard:   { background: 'rgba(239,68,68,0.15)',   color: '#EF4444' },
};

export default function WorkoutPage() {
  const [expanded, setExpanded] = useState<string | null>('Monday');
  const [generating, setGenerating] = useState(false);
  const [goal, setGoal] = useState('GAIN_MUSCLE');
  const [days, setDays] = useState(4);
  const [schedule, setSchedule] = useState(INITIAL_PLAN.slice(0, 5));

  const generate = async () => {
    setGenerating(true);
    await new Promise(r => setTimeout(r, 1500));
    
    // Create a dynamic plan based on days
    const newPlan = INITIAL_PLAN.slice(0, days).map(d => ({
      ...d,
      focus: goal === 'LOSE_FAT' ? d.focus.replace('Hypertrophy', 'Fat Loss') : d.focus,
      exercises: d.exercises.map(ex => ({
        ...ex,
        reps: goal === 'LOSE_FAT' ? '15-20' : goal === 'IMPROVE_ENDURANCE' ? '20+' : ex.reps
      }))
    }));
    
    setSchedule(newPlan);
    setGenerating(false);
  };

  return (
    <div style={{ maxWidth: 900 }}>
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: 4 }}>Workout Plans</h1>
        <p style={{ color: 'var(--text-secondary)' }}>AI-generated • Bodyweight & dumbbell exercises</p>
      </motion.div>

      {/* AI Generator */}
      <div style={{ ...CARD, border: '1px solid rgba(249,115,22,0.25)', background: 'rgba(249,115,22,0.05)', marginBottom: '20px' }}>
        <h2 style={{ fontFamily: 'Inter, sans-serif', fontSize: '15px', fontWeight: 500, color: '#FFFFFF', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Sparkles size={15} color="#F97316" strokeWidth={1.75} /> Generate AI Workout Plan
        </h2>
        <div className="mobile-grid-1" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: '16px', alignItems: 'end' }}>
          <div>
            <label style={{ fontFamily: 'Inter, sans-serif', fontSize: '12px', color: '#6B7280', display: 'block', marginBottom: '6px' }}>Goal</label>
            <select value={goal} onChange={e => setGoal(e.target.value)} style={{
              width: '100%', background: '#1A1A1A', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px',
              padding: '9px 12px', color: '#E5E7EB', fontFamily: 'Inter, sans-serif', fontSize: '14px', outline: 'none',
            }}>
              <option value="LOSE_FAT">Lose Fat</option>
              <option value="GAIN_MUSCLE">Gain Muscle</option>
              <option value="MAINTAIN">Maintain</option>
              <option value="IMPROVE_ENDURANCE">Endurance</option>
            </select>
          </div>
          <div>
            <label style={{ fontFamily: 'Inter, sans-serif', fontSize: '12px', color: '#6B7280', display: 'block', marginBottom: '6px' }}>Days per week: <span style={{ color: '#F97316', fontWeight: 600 }}>{days}</span></label>
            <input type="range" min={3} max={6} value={days} onChange={e => setDays(Number(e.target.value))} style={{ width: '100%', accentColor: '#F97316' }} />
          </div>
          <button onClick={generate} disabled={generating} style={{
            display: 'flex', alignItems: 'center', gap: '7px',
            background: '#F97316', color: '#FFF', border: 'none', borderRadius: '8px',
            padding: '10px 18px', fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: '14px', cursor: 'pointer',
            opacity: generating ? 0.7 : 1,
            justifyContent: 'center'
          }}>
            {generating ? <Loader2 size={15} style={{ animation: 'spin 1s linear infinite' }} /> : <Sparkles size={15} />}
            {generating ? 'Generating...' : 'Generate Plan'}
          </button>
        </div>
      </div>

      {/* Weekly Schedule */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {schedule.map((day) => (
          <div key={day.day} style={CARD} onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)'} onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'}>
            <button onClick={() => setExpanded(expanded === day.day ? null : day.day)}
              style={{ width: '100%', background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: expanded === day.day ? '14px' : 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#F97316', display: 'inline-block', flexShrink: 0 }} />
                <div style={{ textAlign: 'left' }}>
                  <span style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: '14px', color: '#E5E7EB', marginRight: '8px' }}>{day.day}</span>
                  <span style={{ fontFamily: 'Inter, sans-serif', color: '#6B7280', fontSize: '13px' }}>{day.focus}</span>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                {day.exercises.length > 0 && <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '12px', color: '#4B5563' }}>{day.exercises.length} exercises</span>}
                {expanded === day.day ? <ChevronUp size={15} color="#6B7280" /> : <ChevronDown size={15} color="#6B7280" />}
              </div>
            </button>

            <AnimatePresence>
              {expanded === day.day && day.exercises.length > 0 && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                  style={{ borderTop: '1px solid rgba(255,255,255,0.06)', overflow: 'hidden' }}>
                  <div style={{ paddingTop: '14px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {day.exercises.map((ex, i) => {
                      const diff = DIFFICULTY_LABELS[ex.difficulty];
                      return (
                        <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', background: '#111111', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.06)' }}>
                          <div style={{ flex: 1 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '5px' }}>
                              <span style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: '14px', color: '#E5E7EB' }}>{ex.name}</span>
                              {diff && <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '11px', padding: '2px 8px', borderRadius: '100px', fontWeight: 500, ...DIFFICULTY_STYLE[diff] }}>{diff}</span>}
                            </div>
                            <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '12px', color: '#6B7280', marginBottom: '7px' }}>{ex.tips}</p>
                            <div style={{ display: 'flex', gap: '6px' }}>
                              {ex.muscleGroups.map(m => (
                                <span key={m} style={{ fontFamily: 'Inter, sans-serif', fontSize: '11px', padding: '2px 8px', borderRadius: '100px', background: 'rgba(255,255,255,0.06)', color: '#9CA3AF' }}>{m}</span>
                              ))}
                            </div>
                          </div>
                          <div style={{ display: 'flex', gap: '20px', alignItems: 'center', marginLeft: '16px', flexShrink: 0 }} className="mobile-only-stack">
                            <div style={{ textAlign: 'center' }}>
                              <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '18px', fontWeight: 700, color: '#F97316' }}>{ex.sets}×{ex.reps}</div>
                              <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '11px', color: '#4B5563', marginTop: '2px' }}>sets × reps</div>
                            </div>
                            <div style={{ textAlign: 'center' }}>
                              <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '13px', fontWeight: 400, color: '#9CA3AF' }}>{ex.restSec}s</div>
                              <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '11px', color: '#4B5563', marginTop: '2px' }}>rest</div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </div>
  );
}
