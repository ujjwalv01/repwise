'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAppStore } from '@/store/useAppStore';
import { Bell, Smartphone, Database, Shield, ChevronRight, LogOut } from 'lucide-react';
import { signOutAction } from '@/app/actions';

function Toggle({ on, onChange }: { on: boolean; onChange: (v: boolean) => void }) {
  return (
    <button onClick={() => onChange(!on)}
      style={{ 
        width: 44, height: 24, borderRadius: 12, border: 'none', cursor: 'pointer', position: 'relative', transition: 'all 150ms ease',
        background: on ? '#F97316' : '#2D2D2D' 
      }}>
      <motion.div animate={{ x: on ? 22 : 2 }} transition={{ type: 'spring', stiffness: 400, damping: 30 }}
        style={{ 
          position: 'absolute', top: 2, width: 20, height: 20, borderRadius: '50%', 
          background: on ? '#FFFFFF' : '#6B7280' 
        }} />
    </button>
  );
}

function SettingRow({ label, desc, children }: { label: string; desc?: string; children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
      <div>
        <p style={{ fontFamily: 'Inter', fontWeight: 500, fontSize: '14px', color: '#FFFFFF' }}>{label}</p>
        {desc && <p style={{ fontFamily: 'Inter', fontSize: '13px', color: '#6B7280', marginTop: 2 }}>{desc}</p>}
      </div>
      {children}
    </div>
  );
}

const SECTION_TITLE: React.CSSProperties = {
  fontFamily: 'Inter', fontSize: '10px', fontWeight: 700, color: '#6B7280', 
  letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '8px', 
  display: 'flex', alignItems: 'center', gap: 8
};

export default function SettingsPage() {
  const { addToast, triggerConfetti } = useAppStore();
  const [hydrationReminder, setHydrationReminder] = useState(true);
  const [workoutReminder, setWorkoutReminder] = useState(false);
  const [weeklyReport, setWeeklyReport] = useState(true);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [reminderInterval, setReminderInterval] = useState('60');

  const requestNotifPerm = async () => {
    if (!('Notification' in window)) { addToast('Notifications not supported on this browser', 'error'); return; }
    const perm = await Notification.requestPermission();
    if (perm === 'granted') { addToast('Notifications enabled!', 'success'); triggerConfetti(); }
    else addToast('Notification permission denied', 'error');
  };

  const exportData = () => {
    const data = JSON.stringify(localStorage, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'repwise-data.json'; a.click();
    addToast('Data exported!', 'success');
  };

  return (
    <div className="page-transition" style={{ maxWidth: 700 }}>
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontFamily: 'Inter', fontSize: '2rem', fontWeight: 700, marginBottom: 4 }}>Settings</h1>
        <p style={{ fontFamily: 'Inter', color: '#6B7280' }}>Customise your RepWise experience</p>
      </motion.div>

      {/* Notifications */}
      <div style={{ background: '#161616', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '14px', padding: '20px 24px', marginBottom: '16px' }}>
        <h2 style={SECTION_TITLE}>
          <Bell size={14} /> Notifications
        </h2>
        <SettingRow label="Hydration Reminders" desc="Get reminded to drink water">
          <Toggle on={hydrationReminder} onChange={setHydrationReminder} />
        </SettingRow>
        <SettingRow label="Reminder Interval" desc="How often to remind you">
          <select value={reminderInterval} onChange={e => setReminderInterval(e.target.value)}
            style={{ 
              width: 130, padding: '8px 12px', background: '#111111', border: '1px solid rgba(255,255,255,0.1)', 
              borderRadius: '8px', color: '#FFFFFF', fontFamily: 'Inter', fontSize: '14px', outline: 'none',
              transition: 'border-color 150ms ease'
            }}
            onFocus={e => e.currentTarget.style.borderColor = 'rgba(249,115,22,0.6)'}
            onBlur={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'}
          >
            <option value="30">Every 30 min</option>
            <option value="45">Every 45 min</option>
            <option value="60">Every 1 hour</option>
            <option value="120">Every 2 hours</option>
          </select>
        </SettingRow>
        <SettingRow label="Workout Reminders" desc="Daily workout nudge">
          <Toggle on={workoutReminder} onChange={setWorkoutReminder} />
        </SettingRow>
        <SettingRow label="Weekly Report Email" desc="Summary every Sunday">
          <Toggle on={weeklyReport} onChange={setWeeklyReport} />
        </SettingRow>
        <div style={{ paddingTop: '16px' }}>
          <button onClick={requestNotifPerm} style={{ 
            display: 'flex', alignItems: 'center', gap: 8, background: 'transparent', 
            border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', padding: '6px 12px',
            color: '#E5E7EB', fontFamily: 'Inter', fontSize: '12px', cursor: 'pointer', transition: 'all 150ms ease'
          }}
          onMouseEnter={e => e.currentTarget.style.borderColor = '#FFF'}
          onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'}
          >
            <Bell size={14} /> Enable Browser Notifications
          </button>
        </div>
      </div>

      {/* Accessibility */}
      <div style={{ background: '#161616', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '14px', padding: '20px 24px', marginBottom: '16px' }}>
        <h2 style={SECTION_TITLE}>
          <Smartphone size={14} /> Accessibility
        </h2>
        <SettingRow label="Reduce Motion" desc="Disable animations for better performance">
          <Toggle on={reducedMotion} onChange={(v) => {
            setReducedMotion(v);
            document.documentElement.style.setProperty('--motion', v ? 'reduce' : 'no-preference');
          }} />
        </SettingRow>
      </div>

      {/* Integrations */}
      <div style={{ background: '#161616', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '14px', padding: '20px 24px', marginBottom: '16px' }}>
        <h2 style={SECTION_TITLE}>
          <Database size={14} /> Integrations
        </h2>
        <SettingRow label="Groq AI" desc="Powers food scan, meal plans & workouts">
          <span style={{ 
            fontFamily: 'Inter', fontSize: '11px', fontWeight: 600, padding: '4px 10px', 
            borderRadius: 20, background: 'rgba(249,115,22,0.15)', color: '#F97316' 
          }}>
            CONNECTED
          </span>
        </SettingRow>
        <SettingRow label="Cloudinary" desc="Food photo uploads">
          <span style={{ 
            fontFamily: 'Inter', fontSize: '11px', fontWeight: 600, padding: '4px 10px', 
            borderRadius: 20, background: 'rgba(255,255,255,0.06)', color: '#9CA3AF' 
          }}>
            CONFIGURED
          </span>
        </SettingRow>
      </div>

      {/* Privacy */}
      <div style={{ background: '#161616', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '14px', padding: '20px 24px', marginBottom: '16px' }}>
        <h2 style={SECTION_TITLE}>
          <Shield size={14} /> Privacy & Data
        </h2>
        <SettingRow label="Export My Data" desc="Download all your data as JSON">
          <button onClick={exportData} style={{ 
            display: 'flex', alignItems: 'center', gap: 6, background: 'transparent', 
            border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', padding: '6px 14px',
            color: '#E5E7EB', fontFamily: 'Inter', fontSize: '13px', cursor: 'pointer' 
          }}>
            Export <ChevronRight size={14} />
          </button>
        </SettingRow>
        <SettingRow label="Clear Local Data" desc="Wipe all stored data from this device">
          <button onClick={() => { localStorage.clear(); addToast('Local data cleared', 'info'); window.location.reload(); }}
            style={{ 
              fontFamily: 'Inter', fontSize: '13px', fontWeight: 600, padding: '6px 14px', borderRadius: '8px', 
              border: '1px solid rgba(239,68,68,0.2)', background: 'rgba(239,68,68,0.08)', color: '#EF4444', cursor: 'pointer' 
            }}>
            Clear
          </button>
        </SettingRow>
      </div>

      {/* Account Section */}
      <div style={{ background: 'rgba(239,68,68,0.03)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '14px', padding: '20px 24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2 style={{ fontFamily: 'Inter', fontSize: '12px', fontWeight: 700, color: '#EF4444', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '4px' }}>
              Danger Zone
            </h2>
            <p style={{ fontFamily: 'Inter', fontSize: '13px', color: '#6B7280' }}>Sign out of your session</p>
          </div>
          <form action={signOutAction}>
            <button type="submit"
              style={{ 
                background: '#EF4444', color: '#FFFFFF', border: 'none', borderRadius: '8px', 
                padding: '10px 20px', fontFamily: 'Inter', fontWeight: 600, fontSize: '14px', 
                display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', transition: 'all 150ms ease'
              }}
              onMouseEnter={e => e.currentTarget.style.filter = 'brightness(1.1)'}
              onMouseLeave={e => e.currentTarget.style.filter = 'none'}
            >
              <LogOut size={16} /> Sign Out
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
