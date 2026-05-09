'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAppStore } from '@/store/useAppStore';
import { useRouter } from 'next/navigation';
import { Edit2, Check, LogOut, Flame, Award, Droplets, Footprints, Settings } from 'lucide-react';
import Link from 'next/link';

const CARD: React.CSSProperties = {
  background: '#161616',
  border: '1px solid rgba(255,255,255,0.07)',
  borderRadius: '10px',
  padding: '16px',
  textAlign: 'center',
};

export default function ProfilePage() {
  const { user, setUser, addToast, triggerConfetti } = useAppStore();
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    name: user?.name ?? '',
    age: user?.age ?? 25,
    heightCm: user?.heightCm ?? 170,
    weightKg: user?.weightKg ?? 70,
  });

  const save = () => {
    if (!user) return;
    setUser({ ...user, name: form.name, age: form.age, heightCm: form.heightCm, weightKg: form.weightKg });
    setEditing(false);
    addToast('Profile updated!', 'success');
  };

  const logout = async () => {
    try {
      // If they are a Google user, we need to reset onboardingDone in the DB
      if (user?.id) {
        await fetch('/api/user', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ onboardingDone: false }),
        });
      }
      setUser(null);
      router.replace('/onboarding');
    } catch (err) {
      addToast('Failed to reset onboarding', 'error');
    }
  };

  const targets = [
    { label: 'Daily Calories', value: `${user?.targetCalories ?? 0} kcal`, icon: Flame, color: '#F97316' },
    { label: 'Protein Target', value: `${user?.targetProteinG ?? 0}g`, icon: Award, color: '#3B82F6' },
    { label: 'Water Goal', value: `${user?.targetWaterMl ?? 0}ml`, icon: Droplets, color: '#14B8A6' },
    { label: 'Steps Goal', value: `${user?.targetSteps ?? 10000}`, icon: Footprints, color: '#10B981' },
  ];

  const BMI = (user?.weightKg && user?.heightCm) 
    ? (user.weightKg / ((user.heightCm / 100) ** 2)).toFixed(1) 
    : '—';
  const BMILabel = BMI === '—' ? '—' : +BMI < 18.5 ? 'Underweight' : +BMI < 25 ? 'Healthy' : +BMI < 30 ? 'Overweight' : 'Obese';
  const BMIColor = BMI === '—' ? '#888' : +BMI < 25 ? '#10B981' : +BMI < 30 ? '#F59E0B' : '#EF4444';

  return (
    <div className="page-transition" style={{ maxWidth: 800 }}>
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 style={{ fontFamily: 'Inter', fontSize: '2.5rem', fontWeight: 700, marginBottom: 4 }}>Profile</h1>
          <p style={{ fontFamily: 'Inter', color: '#6B7280' }}>Your personal fitness identity</p>
        </div>
        <Link href="/settings" style={{
          padding: '12px',
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: '12px',
          color: '#9CA3AF',
          transition: 'all 0.2s',
        }}>
          <Settings size={20} />
        </Link>
      </motion.div>

      {/* Avatar + Info */}
      <div style={{ background: '#161616', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '14px', padding: '32px', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px', marginBottom: '32px' }}>
          <div style={{ 
            width: 80, height: 80, borderRadius: '50%', 
            background: 'linear-gradient(135deg, #F97316, #EC4899)', 
            display: 'flex', alignItems: 'center', justifyContent: 'center', 
            fontSize: '28px', fontWeight: 700, color: '#FFFFFF', flexShrink: 0,
            fontFamily: 'Inter'
          }}>
            {user?.name?.[0]?.toUpperCase() ?? '?'}
          </div>
          <div style={{ flex: 1 }}>
            {editing ? (
              <input 
                style={{ 
                  width: '100%', background: '#1A1A1A', border: '1px solid rgba(255,255,255,0.1)', 
                  borderRadius: '8px', padding: '10px 14px', color: '#FFFFFF', 
                  fontFamily: 'Inter', fontSize: '18px', fontWeight: 600, outline: 'none' 
                }}
                value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} 
              />
            ) : (
              <h2 style={{ fontFamily: 'Inter', fontSize: '20px', fontWeight: 600, color: '#FFFFFF', marginBottom: 4 }}>{user?.name ?? 'RepWise User'}</h2>
            )}
            <p style={{ fontFamily: 'Inter', color: '#6B7280', fontSize: '14px', marginTop: '4px' }}>
              {user?.goalType?.replace('_', ' ')} · {user?.workoutLocation} · {user?.activityLevel?.replace('_', ' ')}
            </p>
          </div>
          <button 
            onClick={editing ? save : () => setEditing(true)} 
            style={{ 
              display: 'flex', alignItems: 'center', gap: 8, padding: '9px 18px',
              background: editing ? '#F97316' : 'transparent',
              border: '1px solid ' + (editing ? '#F97316' : '#9CA3AF'),
              borderRadius: '8px', color: editing ? '#FFF' : '#9CA3AF', cursor: 'pointer',
              fontFamily: 'Inter', fontWeight: 500, fontSize: '14px', transition: 'all 150ms ease'
            }}
            onMouseEnter={e => { if(!editing) e.currentTarget.style.borderColor = '#FFF'; e.currentTarget.style.color = '#FFF'; }}
            onMouseLeave={e => { if(!editing) { e.currentTarget.style.borderColor = '#9CA3AF'; e.currentTarget.style.color = '#9CA3AF'; } }}
          >
            {editing ? <><Check size={16} /> Save</> : <><Edit2 size={16} /> Edit</>}
          </button>
        </div>

        {/* Body stats mini-cards */}
        <div className="mobile-grid-2" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '12px' }}>
          {[
            { label: 'Age', field: 'age', unit: 'yrs' },
            { label: 'Height', field: 'heightCm', unit: 'cm' },
            { label: 'Weight', field: 'weightKg', unit: 'kg' },
          ].map(({ label, field, unit }) => (
            <div key={field} style={CARD}>
              <div style={{ fontFamily: 'Inter', fontSize: '11px', color: '#6B7280', marginBottom: '6px', textTransform: 'uppercase' }}>{label}</div>
              {editing ? (
                <input type="number" 
                  style={{ 
                    width: '100%', background: 'transparent', border: 'none', textAlign: 'center', 
                    color: '#FFFFFF', fontFamily: 'Inter', fontWeight: 600, fontSize: '18px', outline: 'none' 
                  }}
                  value={(form as any)[field]} onChange={e => setForm(f => ({ ...f, [field]: +e.target.value }))} 
                />
              ) : (
                <div style={{ fontFamily: 'Inter', fontWeight: 600, fontSize: '18px', color: '#FFFFFF' }}>
                  {(user as any)?.[field] ?? '—'}
                  <span style={{ fontSize: '12px', color: '#6B7280', fontWeight: 400, marginLeft: '2px' }}>{unit}</span>
                </div>
              )}
            </div>
          ))}
          <div style={{ ...CARD, background: `${BMIColor}0F`, border: `1px solid ${BMIColor}20` }}>
            <div style={{ fontFamily: 'Inter', fontSize: '11px', color: '#6B7280', marginBottom: '6px', textTransform: 'uppercase' }}>BMI</div>
            <div style={{ fontFamily: 'Inter', fontWeight: 600, fontSize: '18px', color: BMIColor }}>{BMI}</div>
            <div style={{ fontFamily: 'Inter', fontSize: '11px', color: BMIColor, fontWeight: 500, marginTop: '2px' }}>{BMILabel}</div>
          </div>
        </div>
      </div>

      {/* Targets */}
      <div style={{ background: '#161616', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '14px', padding: '20px 24px', marginBottom: '2rem' }}>
        <h3 style={{ fontFamily: 'Inter', fontSize: '15px', fontWeight: 600, color: '#FFFFFF', marginBottom: '1.25rem' }}>Daily Targets</h3>
        <div className="mobile-grid-2" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '12px' }}>
          {targets.map(({ label, value, icon: Icon, color }) => (
            <div key={label} style={{ padding: '20px 12px', background: 'rgba(255,255,255,0.02)', borderRadius: 12, border: '1px solid rgba(255,255,255,0.04)', textAlign: 'center' }}>
              <Icon size={20} color={color} style={{ marginBottom: 10 }} />
              <div style={{ fontFamily: 'Inter', fontWeight: 600, color: '#FFFFFF', fontSize: '15px' }}>{value}</div>
              <div style={{ fontFamily: 'Inter', fontSize: '11px', color: '#6B7280', marginTop: '4px' }}>{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', gap: '16px' }}>
        <button 
          onClick={() => { triggerConfetti(); addToast('Keep crushing it!', 'success'); }} 
          style={{ 
            display: 'flex', alignItems: 'center', gap: 8, padding: '12px 24px',
            background: '#F97316', color: '#FFFFFF', border: 'none', borderRadius: '8px',
            fontFamily: 'Inter', fontWeight: 600, fontSize: '14px', cursor: 'pointer', transition: 'all 150ms ease'
          }}
          onMouseEnter={e => e.currentTarget.style.filter = 'brightness(1.1)'}
          onMouseLeave={e => e.currentTarget.style.filter = 'none'}
        >
          Celebrate Progress
        </button>
        <button 
          onClick={logout} 
          style={{ 
            display: 'flex', alignItems: 'center', gap: 8, marginLeft: 'auto',
            background: 'transparent', border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '8px', color: '#9CA3AF', padding: '10px 20px',
            fontFamily: 'Inter', fontWeight: 500, fontSize: '14px', cursor: 'pointer', transition: 'all 150ms ease'
          }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = '#FFF'; e.currentTarget.style.color = '#FFF'; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = '#9CA3AF'; }}
        >
          <LogOut size={16} /> Reset & Re-onboard
        </button>
      </div>
    </div>
  );
}
