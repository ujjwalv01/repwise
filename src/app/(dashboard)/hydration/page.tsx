'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAppStore } from '@/store/useAppStore';
import dynamic from 'next/dynamic';
import { Droplets, Plus, Bell, BellOff, Loader2 } from 'lucide-react';

const WaterBottle3D = dynamic(() => import('@/components/3d/WaterBottle3D'), { ssr: false });

const QUICK_AMOUNTS = [150, 250, 350, 500];

const CARD: React.CSSProperties = {
  background: '#161616',
  border: '1px solid rgba(255,255,255,0.07)',
  borderRadius: '14px',
  padding: '18px 22px',
};

export default function HydrationPage() {
  const { user, addToast } = useAppStore();
  const [logs, setLogs] = useState<any[]>([]);
  const [custom, setCustom] = useState('');
  const [reminders, setReminders] = useState(false);
  const [loading, setLoading] = useState(true);

  const TARGET = user?.targetWaterMl || 3000;
  const total = logs.reduce((a, b) => a + b.amountMl, 0);
  const fillLevel = Math.min(total / TARGET, 1);

  useEffect(() => {
    async function fetchLogs() {
      try {
        const res = await fetch('/api/hydration');
        const data = await res.json();
        setLogs(data.logs || []);
      } catch (err) {
        addToast('Failed to load hydration logs', 'error');
      } finally {
        setLoading(false);
      }
    }
    fetchLogs();
  }, [addToast]);

  const addWater = async (ml: number, type: string = 'water') => {
    if (ml <= 0) return;
    try {
      const res = await fetch('/api/hydration', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amountMl: ml, drinkType: type })
      });
      const data = await res.json();
      
      if (res.ok && data.success) {
        setLogs(l => [data.log, ...l]);
        addToast(`Added ${ml}ml!`, 'success');
        if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' });
      } else if (data.guest) {
        // Handle guest mode: update local state only
        const guestLog = {
          id: Math.random().toString(36).substr(2, 9),
          amountMl: ml,
          drinkType: type,
          date: new Date().toISOString()
        };
        setLogs(l => [guestLog, ...l]);
        addToast(`${ml}ml added (Guest Mode)`, 'success');
      } else {
        throw new Error(data.error || data.message || 'Failed to log water');
      }
    } catch (err: any) {
      console.error('Hydration Error:', err);
      addToast(err.message || 'Failed to log water', 'error');
    }
  };

  const enableReminders = async () => {
    if ('Notification' in window) {
      const perm = await Notification.requestPermission();
      if (perm === 'granted') {
        setReminders(true);
        addToast('Notifications enabled!', 'success');
      }
    }
  };

  return (
    <div style={{ maxWidth: 900 }}>
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontFamily: 'Inter', fontSize: '2rem', fontWeight: 700, marginBottom: 4 }}>Hydration Tracker</h1>
        <p style={{ fontFamily: 'Inter', color: '#6B7280' }}>Track your daily water intake and stay hydrated</p>
      </motion.div>

      <div className="mobile-grid-1" style={{ display: 'grid', gridTemplateColumns: '1fr 1.6fr', gap: '1.5rem', width: '100%' }}>
        {/* 3D Bottle */}
        <div style={{ ...CARD, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ width: '100%', height: 320 }}>
            <WaterBottle3D fillLevel={fillLevel} />
          </div>
          <div style={{ textAlign: 'center', marginTop: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', justifyContent: 'center' }}>
              <span style={{ fontFamily: 'Inter', fontSize: '28px', fontWeight: 700, color: '#F97316' }}>{total}</span>
              <span style={{ fontFamily: 'Inter', fontSize: '14px', color: '#6B7280' }}>ml</span>
            </div>
            <div style={{ color: '#4B5563', fontSize: '12px', marginTop: '2px' }}>of {TARGET}ml daily goal</div>
            <div style={{ height: '4px', width: '140px', background: 'rgba(255,255,255,0.06)', borderRadius: '2px', margin: '14px auto', overflow: 'hidden' }}>
              <motion.div initial={{ width: 0 }} animate={{ width: `${Math.round(fillLevel * 100)}%` }} 
                transition={{ duration: 0.8 }}
                style={{ height: '100%', background: '#F97316', borderRadius: '2px' }} />
            </div>
          </div>
        </div>

        {/* Controls */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {/* Quick add */}
          <div style={CARD}>
            <h2 style={{ fontFamily: 'Inter', fontSize: '15px', fontWeight: 600, color: '#FFFFFF', marginBottom: '16px' }}>Log Intake</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '10px', marginBottom: '16px' }}>
              {QUICK_AMOUNTS.map(ml => (
                <button key={ml} onClick={() => addWater(ml)}
                  style={{ 
                    padding: '12px 8px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.08)',
                    background: 'rgba(255,255,255,0.02)', cursor: 'pointer', transition: 'all 150ms ease',
                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px'
                  }}>
                  <Droplets size={16} color="#F97316" />
                  <span style={{ fontFamily: 'Inter', fontSize: '13px', fontWeight: 600, color: '#E5E7EB' }}>{ml}ml</span>
                </button>
              ))}
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <input style={{ 
                flex: 1, background: '#1A1A1A', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', 
                padding: '9px 12px', color: '#FFFFFF', fontFamily: 'Inter', fontSize: '14px', outline: 'none' 
              }} type="number" placeholder="Custom amount..." value={custom} onChange={e => setCustom(e.target.value)} />
              <button onClick={() => { if (custom) { addWater(Number(custom)); setCustom(''); } }}
                style={{ 
                  background: '#F97316', color: '#FFFFFF', border: 'none', borderRadius: '8px', 
                  padding: '10px 20px', fontFamily: 'Inter', fontWeight: 600, fontSize: '14px', cursor: 'pointer' 
                }}>
                <Plus size={18} /> Add
              </button>
            </div>
          </div>

          {/* Reminders */}
          <div style={{ ...CARD, padding: '16px 20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ fontFamily: 'Inter', fontSize: '14px', fontWeight: 600, color: '#FFFFFF' }}>Hourly Reminders</h3>
                <p style={{ fontFamily: 'Inter', fontSize: '12px', color: '#6B7280', marginTop: '2px' }}>Get nudge notifications during the day</p>
              </div>
              <button onClick={reminders ? () => setReminders(false) : enableReminders}
                style={{ 
                  padding: '7px 14px', borderRadius: '8px', border: 'none', cursor: 'pointer', 
                  display: 'flex', alignItems: 'center', gap: '6px', fontFamily: 'Inter', fontWeight: 600, fontSize: '12px',
                  background: reminders ? 'rgba(16,185,129,0.15)' : 'rgba(255,255,255,0.06)',
                  color: reminders ? '#10B981' : '#9CA3AF', transition: 'all 150ms ease'
                }}>
                {reminders ? <><Bell size={14} /> ACTIVE</> : <><BellOff size={14} /> ENABLE</>}
              </button>
            </div>
          </div>

          {/* Log */}
          <div style={{ ...CARD, flex: 1 }}>
            <h3 style={{ fontFamily: 'Inter', fontSize: '13px', fontWeight: 500, color: '#6B7280', marginBottom: '14px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Today's History</h3>
            
            {loading ? (
              <div style={{ textAlign: 'center', padding: '2rem' }}><Loader2 size={20} color="#F97316" style={{ animation: 'spin 1s linear infinite' }} /></div>
            ) : logs.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2rem', color: '#4B5563', fontSize: '13px', fontFamily: 'Inter' }}>No water logged yet</div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', maxHeight: '220px', overflowY: 'auto', paddingRight: '4px' }}>
                {logs.map((l, i) => (
                  <div key={l.id} style={{ 
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center', 
                    padding: '10px 14px', borderRadius: '10px', background: 'rgba(255,255,255,0.02)', 
                    border: '1px solid rgba(255,255,255,0.04)' 
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ padding: '6px', borderRadius: '8px', background: 'rgba(255,255,255,0.03)' }}>
                        <Droplets size={14} color="#F97316" />
                      </div>
                      <div>
                        <span style={{ fontFamily: 'Inter', fontSize: '14px', fontWeight: 500, color: '#E5E7EB' }}>{l.drinkType === 'coffee' ? 'Coffee' : 'Water'}</span>
                        <p style={{ fontFamily: 'Inter', fontSize: '11px', color: '#4B5563' }}>{new Date(l.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                      </div>
                    </div>
                    <span style={{ fontFamily: 'Inter', fontSize: '14px', color: '#F97316', fontWeight: 700 }}>+{l.amountMl}ml</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
