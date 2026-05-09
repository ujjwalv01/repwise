'use client';
import { motion } from 'framer-motion';
import { TrendingUp, Weight, Trophy } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

const weightData = [
  { date: 'Apr 1', kg: 82.5 }, { date: 'Apr 8', kg: 82.0 }, { date: 'Apr 15', kg: 81.2 },
  { date: 'Apr 22', kg: 80.8 }, { date: 'May 1', kg: 80.1 },
];

const stepsData = [
  { day: 'Mon', steps: 8200 }, { day: 'Tue', steps: 11400 }, { day: 'Wed', steps: 6800 },
  { day: 'Thu', steps: 9300 }, { day: 'Fri', steps: 12100 }, { day: 'Sat', steps: 5400 }, { day: 'Sun', steps: 7800 },
];

const PRs = [
  { exercise: 'Pull-Up', record: '12 reps', date: 'Apr 28' },
  { exercise: 'Squat', record: '80kg × 8', date: 'Apr 22' },
  { exercise: 'Plank', record: '2:45', date: 'May 1' },
  { exercise: 'Push-Up', record: '40 reps', date: 'Apr 15' },
];

const CARD: React.CSSProperties = {
  background: '#161616',
  border: '1px solid rgba(255,255,255,0.07)',
  borderRadius: '14px',
  padding: '20px 24px',
};

const customTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: '#1A1A1A', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: '8px 14px' }}>
      <p style={{ color: '#6B7280', fontSize: '11px', marginBottom: 4 }}>{label}</p>
      <p style={{ color: '#FFFFFF', fontFamily: 'Inter', fontWeight: 600, fontSize: '13px' }}>
        {payload[0].value}{payload[0].name === 'kg' ? 'kg' : ''}
      </p>
    </div>
  );
};

export default function ProgressPage() {
  return (
    <div style={{ maxWidth: 1000 }}>
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontFamily: 'Inter', fontSize: '2rem', fontWeight: 700, marginBottom: 4 }}>Progress Tracker</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', color: '#6B7280', fontSize: '14px' }}>
          <span>Weight trend</span>
          <span style={{ width: 4, height: 4, borderRadius: '50%', background: 'var(--accent)' }} />
          <span>Steps</span>
          <span style={{ width: 4, height: 4, borderRadius: '50%', background: 'var(--accent)' }} />
          <span>Personal records</span>
        </div>
      </motion.div>

      <div className="mobile-grid-1" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
        {/* Weight Chart */}
        <div style={CARD}>
          <h2 style={{ fontFamily: 'Inter', fontSize: '15px', fontWeight: 600, color: '#FFFFFF', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: 8 }}>
            <Weight size={16} color="#F97316" /> Weight Trend
          </h2>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={weightData}>
              <CartesianGrid vertical={false} stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="date" tick={{ fill: '#6B7280', fontSize: 11 }} axisLine={false} tickLine={false} dy={10} />
              <YAxis tick={{ fill: '#6B7280', fontSize: 11 }} axisLine={false} tickLine={false} domain={['auto', 'auto']} dx={-10} />
              <Tooltip content={customTooltip} cursor={{ stroke: 'rgba(255,255,255,0.1)' }} />
              <Line type="monotone" dataKey="kg" name="kg" stroke="#F97316" strokeWidth={2} dot={{ fill: '#F97316', r: 4, strokeWidth: 0 }} activeDot={{ r: 6, strokeWidth: 0 }} />
            </LineChart>
          </ResponsiveContainer>
          <div style={{ display: 'flex', gap: '2rem', marginTop: '1.5rem' }}>
            <div>
              <div style={{ fontFamily: 'Inter', fontSize: '12px', color: '#6B7280', marginBottom: '2px' }}>Start</div>
              <div style={{ fontFamily: 'Inter', color: '#FFFFFF', fontWeight: 500, fontSize: '14px' }}>82.5kg</div>
            </div>
            <div>
              <div style={{ fontFamily: 'Inter', fontSize: '12px', color: '#6B7280', marginBottom: '2px' }}>Current</div>
              <div style={{ fontFamily: 'Inter', color: '#FFFFFF', fontWeight: 500, fontSize: '14px' }}>80.1kg</div>
            </div>
            <div>
              <div style={{ fontFamily: 'Inter', fontSize: '12px', color: '#6B7280', marginBottom: '2px' }}>Lost</div>
              <div style={{ fontFamily: 'Inter', color: '#10B981', fontWeight: 500, fontSize: '14px' }}>-2.4kg</div>
            </div>
          </div>
        </div>

        {/* Steps Chart */}
        <div style={CARD}>
          <h2 style={{ fontFamily: 'Inter', fontSize: '15px', fontWeight: 600, color: '#FFFFFF', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: 8 }}>
            <TrendingUp size={16} color="#3B82F6" /> Weekly Steps
          </h2>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={stepsData}>
              <CartesianGrid vertical={false} stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="day" tick={{ fill: '#6B7280', fontSize: 11 }} axisLine={false} tickLine={false} dy={10} />
              <YAxis tick={{ fill: '#6B7280', fontSize: 11 }} axisLine={false} tickLine={false} dx={-10} />
              <Tooltip content={customTooltip} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
              <Bar dataKey="steps" fill="#3B82F6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Personal Records */}
      <div style={CARD}>
        <h2 style={{ fontFamily: 'Inter', fontSize: '15px', fontWeight: 600, color: '#FFFFFF', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: 8 }}>
          <Trophy size={16} color="#F97316" /> Personal Records
        </h2>
        <div className="mobile-grid-2" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
          {PRs.map((pr, i) => (
            <motion.div key={pr.exercise} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1, transition: { delay: i * 0.08 } }}
              style={{
                padding: '1.25rem',
                background: 'rgba(249,115,22,0.08)',
                borderRadius: 12,
                border: '1px solid rgba(249,115,22,0.2)',
                textAlign: 'center'
              }}>
              <div style={{ fontSize: '1.5rem', marginBottom: 8 }}>🏆</div>
              <p style={{ fontFamily: 'Inter', fontWeight: 600, fontSize: '14px', color: '#FFFFFF', marginBottom: 4 }}>{pr.exercise}</p>
              <p style={{ fontFamily: 'Inter', color: '#F97316', fontWeight: 700, fontSize: '16px' }}>{pr.record}</p>
              <p style={{ fontFamily: 'Inter', fontSize: '12px', color: '#6B7280', marginTop: 4 }}>{pr.date}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
