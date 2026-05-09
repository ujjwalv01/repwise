'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Target, Plus, Check, Trash2 } from 'lucide-react';
import { Goal } from '@/types';

const SAMPLE_GOALS: Goal[] = [
  { id: '1', userId: 'u1', title: 'Lose 5kg', type: 'LOSE_FAT', targetValue: 5, currentValue: 2.3, unit: 'kg', completed: false, createdAt: new Date().toISOString() },
  { id: '2', userId: 'u1', title: 'Run 5km', type: 'IMPROVE_ENDURANCE', targetValue: 5, currentValue: 3.2, unit: 'km', completed: false, createdAt: new Date().toISOString() },
  { id: '3', userId: 'u1', title: 'Bench 80kg', type: 'GAIN_MUSCLE', targetValue: 80, currentValue: 80, unit: 'kg', completed: true, createdAt: new Date().toISOString() },
];

const GOAL_THEME: Record<string, { color: string, label: string }> = {
  LOSE_FAT: { color: '#EF4444', label: 'LOSE FAT' },
  GAIN_MUSCLE: { color: '#14B8A6', label: 'GAIN MUSCLE' },
  MAINTAIN: { color: '#F97316', label: 'MAINTAIN' },
  IMPROVE_ENDURANCE: { color: '#8B5CF6', label: 'ENDURANCE' },
};

const CARD: React.CSSProperties = {
  background: '#161616',
  border: '1px solid rgba(255,255,255,0.07)',
  borderRadius: '14px',
  padding: '18px 22px',
};

export default function GoalsPage() {
  const [goals, setGoals] = useState<Goal[]>(SAMPLE_GOALS);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', type: 'GAIN_MUSCLE', targetValue: '', unit: 'kg' });

  const addGoal = () => {
    if (!form.title || !form.targetValue) return;
    const newGoal: Goal = { 
      id: Date.now().toString(), 
      userId: 'u1', 
      title: form.title, 
      type: form.type as Goal['type'], 
      targetValue: Number(form.targetValue), 
      currentValue: 0, 
      unit: form.unit, 
      completed: false, 
      createdAt: new Date().toISOString() 
    };
    setGoals(g => [...g, newGoal]);
    setShowForm(false);
    setForm({ title: '', type: 'GAIN_MUSCLE', targetValue: '', unit: 'kg' });
  };

  return (
    <div style={{ maxWidth: 800 }}>
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ fontFamily: 'Inter', fontSize: '2rem', fontWeight: 700, marginBottom: 4 }}>Goals</h1>
            <p style={{ fontFamily: 'Inter', color: '#6B7280' }}>Track your fitness milestones</p>
          </div>
          <button 
            onClick={() => setShowForm(s => !s)} 
            style={{ 
              display: 'flex', alignItems: 'center', gap: '6px',
              background: '#F97316', color: '#FFFFFF', border: 'none', borderRadius: '8px',
              padding: '8px 16px', fontFamily: 'Inter', fontWeight: 600, fontSize: '14px', cursor: 'pointer'
            }}
          >
            <Plus size={16} /> New Goal
          </button>
        </div>
      </motion.div>

      {showForm && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: '1.5rem' }}>
          <div style={{ ...CARD, border: '1px solid rgba(249,115,22,0.2)', background: 'rgba(249,115,22,0.03)' }}>
            <h3 style={{ fontFamily: 'Inter', fontSize: '15px', fontWeight: 600, color: '#FFFFFF', marginBottom: '1rem' }}>Create New Goal</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr auto', gap: '10px', alignItems: 'end' }}>
              <div>
                <label style={{ fontFamily: 'Inter', fontSize: '12px', color: '#6B7280', display: 'block', marginBottom: 4 }}>Title</label>
                <input style={{ width: '100%', background: '#1A1A1A', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', padding: '9px 12px', color: '#FFFFFF', fontFamily: 'Inter', fontSize: '14px', outline: 'none' }} placeholder="e.g. Lose 5kg" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} />
              </div>
              <div>
                <label style={{ fontFamily: 'Inter', fontSize: '12px', color: '#6B7280', display: 'block', marginBottom: 4 }}>Type</label>
                <select style={{ width: '100%', background: '#1A1A1A', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', padding: '9px 12px', color: '#FFFFFF', fontFamily: 'Inter', fontSize: '14px', outline: 'none' }} value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))}>
                  <option value="LOSE_FAT">Lose Fat</option>
                  <option value="GAIN_MUSCLE">Gain Muscle</option>
                  <option value="MAINTAIN">Maintain</option>
                  <option value="IMPROVE_ENDURANCE">Endurance</option>
                </select>
              </div>
              <div>
                <label style={{ fontFamily: 'Inter', fontSize: '12px', color: '#6B7280', display: 'block', marginBottom: 4 }}>Target</label>
                <input style={{ width: '100%', background: '#1A1A1A', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', padding: '9px 12px', color: '#FFFFFF', fontFamily: 'Inter', fontSize: '14px', outline: 'none' }} type="number" placeholder="5" value={form.targetValue} onChange={e => setForm(f => ({ ...f, targetValue: e.target.value }))} />
              </div>
              <div>
                <label style={{ fontFamily: 'Inter', fontSize: '12px', color: '#6B7280', display: 'block', marginBottom: 4 }}>Unit</label>
                <input style={{ width: '100%', background: '#1A1A1A', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', padding: '9px 12px', color: '#FFFFFF', fontFamily: 'Inter', fontSize: '14px', outline: 'none' }} placeholder="kg" value={form.unit} onChange={e => setForm(f => ({ ...f, unit: e.target.value }))} />
              </div>
              <button onClick={addGoal} style={{ background: '#F97316', color: '#FFFFFF', border: 'none', borderRadius: '8px', padding: '10px 18px', fontFamily: 'Inter', fontWeight: 600, fontSize: '14px', cursor: 'pointer' }}>Add</button>
            </div>
          </div>
        </motion.div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {goals.map((goal, i) => {
          const pct = Math.min((goal.currentValue / goal.targetValue) * 100, 100);
          const theme = GOAL_THEME[goal.type];
          return (
            <motion.div key={goal.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0, transition: { delay: i * 0.06 } }}>
              <div style={CARD}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                  <div style={{ display: 'flex', gap: '14px' }}>
                    <div style={{ 
                      width: '40px', height: '40px', borderRadius: '10px', 
                      background: `${theme.color}15`, border: `1px solid ${theme.color}30`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center' 
                    }}>
                      {goal.completed ? <Check size={20} color="#10B981" /> : <Target size={20} color={theme.color} />}
                    </div>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                        <span style={{ fontFamily: 'Inter', fontWeight: 600, fontSize: '15px', color: '#FFFFFF' }}>{goal.title}</span>
                        <span style={{ fontFamily: 'Inter', fontSize: '10px', fontWeight: 500, color: '#6B7280', letterSpacing: '0.1em' }}>{theme.label}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
                        <span style={{ fontFamily: 'Inter', fontSize: '20px', fontWeight: 700, color: theme.color }}>{goal.currentValue}</span>
                        <span style={{ fontFamily: 'Inter', fontSize: '13px', color: '#6B7280' }}>/ {goal.targetValue} {goal.unit}</span>
                      </div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontFamily: 'Inter', fontSize: '12px', color: '#9CA3AF' }}>{pct.toFixed(0)}% complete</div>
                    </div>
                    <button onClick={() => setGoals(g => g.filter(g2 => g2.id !== goal.id))}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#4B5563', padding: '4px', transition: 'color 150ms ease' }}>
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
                <div style={{ height: '5px', background: 'rgba(255,255,255,0.06)', borderRadius: '3px', overflow: 'hidden' }}>
                  <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                    style={{ height: '100%', background: goal.completed ? '#10B981' : theme.color, borderRadius: '3px' }} />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
