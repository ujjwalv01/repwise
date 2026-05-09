'use client';
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GlassCard } from '@/components/ui/GlassCard';
import { Camera, Upload, Search, Plus, Flame, Loader2, X, Check, Utensils, History } from 'lucide-react';
import { FoodAnalysis, FoodLog, MealType } from '@/types';
import { useAppStore } from '@/store/useAppStore';

const MEAL_TYPES: MealType[] = ['BREAKFAST', 'LUNCH', 'DINNER', 'SNACK'];
const CARD: React.CSSProperties = { background: '#161616', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '14px', padding: '18px 22px' };

export default function NutritionPage() {
  const { user, todayFoodLogs, setTodayFoodLogs, addFoodLog, addToast } = useAppStore();
  const [tab, setTab] = useState<'log' | 'scan' | 'search'>('log');
  const [scanning, setScanning] = useState(false);
  const [scanResult, setScanResult] = useState<FoodAnalysis | null>(null);
  const [mealType, setMealType] = useState<MealType>('BREAKFAST');
  const [searchQ, setSearchQ] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [searching, setSearching] = useState(false);
  const [portion, setPortion] = useState(1);
  const [loadingLogs, setLoadingLogs] = useState(true);
  const fileRef = useRef<HTMLInputElement>(null);

  // Fetch today's logs on mount
  useEffect(() => {
    async function fetchLogs() {
      try {
        const res = await fetch('/api/food/log');
        const data = await res.json();
        if (data.logs) setTodayFoodLogs(data.logs);
      } catch (err) {
        addToast('Failed to load today\'s logs', 'error');
      } finally {
        setLoadingLogs(false);
      }
    }
    fetchLogs();
  }, [setTodayFoodLogs, addToast]);

  const totalCal = todayFoodLogs.reduce((a, f) => a + f.calories, 0);
  const totalP = todayFoodLogs.reduce((a, f) => a + f.proteinG, 0);
  const totalC = todayFoodLogs.reduce((a, f) => a + f.carbsG, 0);
  const totalF = todayFoodLogs.reduce((a, f) => a + f.fatG, 0);

  const targets = {
    calories: user?.targetCalories || 2000,
    protein: user?.targetProteinG || 150,
    carbs: user?.targetCarbsG || 200,
    fat: user?.targetFatG || 60,
  };

  const handleScan = async (file: File) => {
    setScanning(true); setScanResult(null); setTab('scan');
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch('/api/food/scan', { method: 'POST', body: formData });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setScanResult(data.food);
      addToast('AI successfully identified your food!', 'success');
    } catch (err: any) {
      addToast(err.message || 'Failed to analyze image', 'error');
    } finally { setScanning(false); }
  };

  const handleSearch = async () => {
    if (!searchQ.trim()) return;
    setSearching(true);
    try {
      const res = await fetch(`/api/food/search?q=${encodeURIComponent(searchQ)}`);
      const data = await res.json();
      setSearchResults(data.results || []);
    } catch (err) {
      addToast('Search failed', 'error');
    } finally { setSearching(false); }
  };

  const selectSearchItem = async (foodName: string) => {
    setSearching(true);
    try {
      const res = await fetch('/api/food/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ foodName })
      });
      const data = await res.json();
      setScanResult(data.food);
      setTab('scan'); // Reuse the scan result view for search results
    } catch (err) {
      addToast('Failed to get food details', 'error');
    } finally { setSearching(false); }
  };

  const logFood = async () => {
    if (!scanResult) return;
    try {
      const res = await fetch('/api/food/log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...scanResult,
          mealType,
          portion,
          aiScanned: tab === 'scan'
        })
      });
      const data = await res.json();
      if (data.success) {
        addFoodLog(data.log);
        addToast(`${scanResult.foodName} logged successfully!`, 'success');
        setTab('log');
        setScanResult(null);
        setPortion(1);
      }
    } catch (err) {
      addToast('Failed to log food', 'error');
    }
  };

  return (
    <div style={{ maxWidth: 1100 }}>
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: 4 }}>Nutrition Tracker</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', color: 'var(--text-secondary)', fontSize: '14px' }}>
          <span>AI food scanner</span>
          <span style={{ width: 4, height: 4, borderRadius: '50%', background: 'var(--accent)' }} />
          <span>Manual logging</span>
          <span style={{ width: 4, height: 4, borderRadius: '50%', background: 'var(--accent)' }} />
          <span>Macro tracking</span>
        </div>
      </motion.div>

      {/* Summary row */}
      <div className="mobile-grid-2" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '14px', marginBottom: '20px' }}>
        {[
          { label: 'Calories', val: totalCal, max: targets.calories, unit: 'kcal' },
          { label: 'Protein',  val: totalP,   max: targets.protein,  unit: 'g'    },
          { label: 'Carbs',   val: totalC,   max: targets.carbs,    unit: 'g'    },
          { label: 'Fat',     val: totalF,   max: targets.fat,      unit: 'g'    },
        ].map(m => (
          <div key={m.label} style={CARD}>
            <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '12px', color: '#6B7280', marginBottom: '6px' }}>{m.label}</div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', marginBottom: '10px' }}>
              <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '24px', fontWeight: 600, color: '#F97316' }}>{Math.round(m.val)}</span>
              <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '12px', color: '#4B5563' }}>/ {m.max}{m.unit}</span>
            </div>
            <div style={{ height: '3px', background: 'rgba(255,255,255,0.07)', borderRadius: '2px', overflow: 'hidden' }}>
              <motion.div initial={{ width: 0 }} animate={{ width: `${Math.min(m.val / m.max * 100, 100)}%` }}
                transition={{ duration: 0.9 }} style={{ height: '100%', background: '#F97316', borderRadius: '2px' }} />
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
        {(['log', 'scan', 'search'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)} style={{
            padding: '7px 18px',
            borderRadius: '8px',
            border: tab === t ? 'none' : '1px solid rgba(255,255,255,0.1)',
            cursor: 'pointer',
            fontFamily: 'Inter, sans-serif',
            fontWeight: tab === t ? 600 : 400,
            fontSize: '14px',
            transition: 'all 150ms ease',
            background: tab === t ? '#F97316' : 'transparent',
            color: tab === t ? '#FFFFFF' : '#9CA3AF',
          }}>
            {t === 'log' ? "Today's Log" : t === 'scan' ? 'AI Scan' : 'Search'}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {tab === 'log' && (
          <motion.div key="log" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <div style={CARD}>
              <h2 style={{ fontFamily: 'Inter, sans-serif', fontSize: '15px', fontWeight: 500, color: '#FFFFFF', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <History size={15} color="#F97316" /> Today's Log
              </h2>

              {loadingLogs ? (
                <div style={{ textAlign: 'center', padding: '2rem' }}><Loader2 size={24} color="#F97316" style={{ animation: 'spin 1s linear infinite' }} /></div>
              ) : todayFoodLogs.length === 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 0', gap: '10px' }}>
                  <Utensils size={22} color="#4B5563" strokeWidth={1.5} />
                  <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '14px', color: '#6B7280' }}>No food logged today yet.</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  {todayFoodLogs.map((f, i) => (
                    <motion.div key={f.id} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0, transition: { delay: i * 0.05 } }}
                      style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '11px 14px', borderRadius: '10px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)' }}>
                      <div>
                        <p style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500, fontSize: '14px', color: '#E5E7EB' }}>{f.foodName}</p>
                        <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '12px', color: '#4B5563', marginTop: '2px' }}>{f.mealType} · {new Date(f.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '14px', fontWeight: 600, color: '#F97316' }}>{Math.round(f.calories)} <span style={{ fontSize: '11px', fontWeight: 400, color: '#9CA3AF' }}>kcal</span></p>
                        <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '11px', color: '#4B5563', marginTop: '2px' }}>{f.proteinG}g P · {f.carbsG}g C · {f.fatG}g F</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}

              <button onClick={() => setTab('scan')} style={{
                marginTop: '16px', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                background: '#F97316', color: '#FFFFFF', border: 'none', borderRadius: '10px',
                padding: '13px', fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: '15px', cursor: 'pointer',
              }}>
                <Plus size={17} /> Add New Meal
              </button>
            </div>
          </motion.div>
        )}

        {tab === 'scan' && (
          <motion.div key="scan" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <GlassCard padding="2rem" style={{ textAlign: 'center' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>AI Food Scanner</h2>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>Take or upload a photo — Gemini identifies food & macros</p>

              <input ref={fileRef} type="file" accept="image/*" capture="environment" style={{ display: 'none' }}
                onChange={e => e.target.files?.[0] && handleScan(e.target.files[0])} />

              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginBottom: '2rem' }}>
                <button className="btn-neon" onClick={() => fileRef.current?.click()} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '12px 24px' }}>
                  <Camera size={20} /> Take Photo
                </button>
                <button className="btn-ghost" onClick={() => { if (fileRef.current) { fileRef.current.removeAttribute('capture'); fileRef.current.click(); } }}
                  style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '12px 24px' }}>
                  <Upload size={20} /> Upload
                </button>
              </div>

              {scanning && (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', padding: '2rem 0' }}>
                  <Loader2 size={40} color="var(--neon-blue)" className="spin" />
                  <p style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>AI is analysing your food image...</p>
                </div>
              )}

              <AnimatePresence>
                {scanResult && (
                  <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }}>
                    <div style={{ ...CARD, textAlign: 'left', marginTop: '16px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
                        <div>
                          <h3 style={{ fontFamily: 'Inter, sans-serif', fontSize: '17px', fontWeight: 600, color: '#F97316' }}>{scanResult.foodName}</h3>
                          <p style={{ fontFamily: 'Inter, sans-serif', color: '#6B7280', fontSize: '13px', marginTop: '2px' }}>Serving: {scanResult.servingSize}</p>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px' }}>
                          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                            {MEAL_TYPES.map(m => (
                              <button key={m} onClick={() => setMealType(m)} style={{
                                padding: '4px 10px', borderRadius: '6px', border: mealType === m ? 'none' : '1px solid rgba(255,255,255,0.1)',
                                cursor: 'pointer', fontFamily: 'Inter, sans-serif', fontSize: '11px', fontWeight: mealType === m ? 600 : 400,
                                background: mealType === m ? '#F97316' : 'transparent', color: mealType === m ? '#FFF' : '#9CA3AF',
                              }}>{m}</button>
                            ))}
                          </div>
                          <span style={{ padding: '3px 10px', borderRadius: '100px', background: 'rgba(16,185,129,0.12)', color: '#10B981', fontFamily: 'Inter, sans-serif', fontSize: '12px', fontWeight: 500 }}>
                            {Math.round(scanResult.confidence * 100)}% Match
                          </span>
                        </div>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '10px', marginBottom: '16px' }}>
                        {[
                          { l: 'Calories', v: Math.round(scanResult.calories * portion), unit: 'kcal', color: '#F97316' },
                          { l: 'Protein',  v: (scanResult.proteinG * portion).toFixed(1), unit: 'g',    color: '#F97316' },
                          { l: 'Carbs',   v: (scanResult.carbsG   * portion).toFixed(1), unit: 'g',    color: '#3B82F6' },
                          { l: 'Fat',     v: (scanResult.fatG     * portion).toFixed(1), unit: 'g',    color: '#8B5CF6' },
                        ].map(m => (
                          <div key={m.l} style={{ textAlign: 'center', padding: '12px 8px', background: 'rgba(255,255,255,0.03)', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.06)' }}>
                            <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '20px', fontWeight: 600, color: m.color, marginBottom: '3px' }}>{m.v}</div>
                            <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '11px', color: '#6B7280' }}>{m.l}</div>
                          </div>
                        ))}
                      </div>

                      <div style={{ marginBottom: '14px', background: 'rgba(255,255,255,0.02)', padding: '14px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.05)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                          <label style={{ fontFamily: 'Inter, sans-serif', fontSize: '13px', color: '#9CA3AF' }}>Portion</label>
                          <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '13px', fontWeight: 600, color: '#F97316' }}>{portion}×</span>
                        </div>
                        <input type="range" min={0.25} max={4} step={0.25} value={portion} onChange={e => setPortion(Number(e.target.value))}
                          style={{ width: '100%', accentColor: '#F97316' }} />
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '6px', fontFamily: 'Inter, sans-serif', fontSize: '11px', color: '#4B5563' }}>
                          <span>0.25×</span><span>4×</span>
                        </div>
                      </div>

                      <button onClick={logFood} style={{
                        width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                        background: '#F97316', color: '#FFF', border: 'none', borderRadius: '10px',
                        padding: '13px', fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: '15px', cursor: 'pointer',
                      }}>
                        <Check size={17} /> Log to Daily Summary
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </GlassCard>
          </motion.div>
        )}

        {tab === 'search' && (
          <motion.div key="search" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <GlassCard padding="1.5rem">
              <div style={{ display: 'flex', gap: 10, marginBottom: '1.5rem' }}>
                <div style={{ position: 'relative', flex: 1 }}>
                  <Search size={18} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <input className="input-glass" style={{ paddingLeft: 42 }} placeholder="Search 1M+ foods..."
                    value={searchQ} onChange={e => setSearchQ(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSearch()} />
                </div>
                <button className="btn-neon" onClick={handleSearch} disabled={searching} style={{ padding: '0 24px' }}>
                  {searching ? <Loader2 className="spin" size={18} /> : 'Search'}
                </button>
              </div>

              {searchResults.length > 0 ? (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  {searchResults.map((item, i) => (
                    <motion.div key={i} initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.03 }}>
                      <GlassCard padding="10px" onClick={() => selectSearchItem(item.name)} style={{ cursor: 'pointer', display: 'flex', gap: 12, alignItems: 'center' }} tilt>
                        <img src={item.image} alt={item.name} style={{ width: 48, height: 48, borderRadius: 8, objectFit: 'cover' }} />
                        <div style={{ flex: 1 }}>
                          <p style={{ fontSize: '0.875rem', fontWeight: 600, marginBottom: 2 }}>{item.name}</p>
                          <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{item.serving_qty} {item.serving_unit}</p>
                        </div>
                        <Plus size={16} color="var(--neon-blue)" />
                      </GlassCard>
                    </motion.div>
                  ))}
                </div>
              ) : !searching && (
                <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                  <Search size={40} style={{ opacity: 0.1, marginBottom: 10 }} />
                  <p>Search for any food, dish, or ingredient.</p>
                </div>
              )}
            </GlassCard>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

