'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Loader2, Clock, Flame } from 'lucide-react';

const CUISINES = ['Indian', 'Mediterranean', 'Asian', 'Western', 'Mixed'];
const PREFS = ['Vegetarian', 'Vegan', 'No Dairy', 'No Gluten', 'High Protein'];

const INITIAL_MEALS = [
  { day: 1, label: 'Mon', breakfast: { name: 'Moong Dal Chilla', cal: 280, protein: 14, time: 15 }, lunch: { name: 'Paneer Bhurji + Roti', cal: 450, protein: 22, time: 20 }, dinner: { name: 'Grilled Chicken + Salad', cal: 380, protein: 35, time: 25 }, snack: { name: 'Greek Yogurt + Nuts', cal: 160, protein: 10, time: 0 } },
  { day: 2, label: 'Tue', breakfast: { name: 'Oats + Banana', cal: 310, protein: 10, time: 5 }, lunch: { name: 'Rajma Chawal', cal: 420, protein: 18, time: 30 }, dinner: { name: 'Egg Bhurji + Brown Rice', cal: 400, protein: 28, time: 20 }, snack: { name: 'Protein Bar', cal: 200, protein: 20, time: 0 } },
  { day: 3, label: 'Wed', breakfast: { name: 'Besan Omelette', cal: 260, protein: 18, time: 10 }, lunch: { name: 'Chole + Roti', cal: 480, protein: 20, time: 35 }, dinner: { name: 'Baked Fish + Veggies', cal: 350, protein: 32, time: 30 }, snack: { name: 'Sprouts Chaat', cal: 140, protein: 9, time: 5 } },
  { day: 4, label: 'Thu', breakfast: { name: 'Poha + Eggs', cal: 300, protein: 16, time: 15 }, lunch: { name: 'Dal + Brown Rice', cal: 400, protein: 16, time: 20 }, dinner: { name: 'Tofu Stir Fry', cal: 320, protein: 24, time: 20 }, snack: { name: 'Banana + Peanut Butter', cal: 200, protein: 8, time: 0 } },
  { day: 5, label: 'Fri', breakfast: { name: 'Dosa + Sambar', cal: 340, protein: 12, time: 20 }, lunch: { name: 'Chicken Curry + Rice', cal: 500, protein: 34, time: 40 }, dinner: { name: 'Lentil Soup + Bread', cal: 360, protein: 20, time: 25 }, snack: { name: 'Mixed Nuts', cal: 170, protein: 6, time: 0 } },
  { day: 6, label: 'Sat', breakfast: { name: 'Upma + Coconut Chutney', cal: 280, protein: 8, time: 15 }, lunch: { name: 'Palak Paneer + Roti', cal: 420, protein: 20, time: 25 }, dinner: { name: 'Grilled Salmon + Quinoa', cal: 440, protein: 38, time: 30 }, snack: { name: 'Roasted Chana', cal: 150, protein: 9, time: 0 } },
  { day: 7, label: 'Sun', breakfast: { name: 'Idli Sambar', cal: 260, protein: 9, time: 0 }, lunch: { name: 'Mixed Veg Pulao', cal: 390, protein: 12, time: 30 }, dinner: { name: 'Egg Curry + Rice', cal: 430, protein: 26, time: 35 }, snack: { name: 'Fruit Salad', cal: 120, protein: 2, time: 0 } },
];

const CARD: React.CSSProperties = {
  background: '#161616',
  border: '1px solid rgba(255,255,255,0.07)',
  borderRadius: '14px',
  padding: '18px 22px',
  transition: 'border-color 150ms ease'
};

export default function MealPlanPage() {
  const [selectedDay, setSelectedDay] = useState(0);
  const [generating, setGenerating] = useState(false);
  const [prefs, setPrefs] = useState<string[]>([]);
  const [cuisine, setCuisine] = useState('Indian');
  const [plan, setPlan] = useState(INITIAL_MEALS);

  const generate = async () => {
    setGenerating(true);
    await new Promise(r => setTimeout(r, 1500));
    
    // Simulate generation by shifting names based on cuisine
    const prefix = cuisine === 'Indian' ? 'Desi' : cuisine === 'Western' ? 'Classic' : cuisine === 'Asian' ? 'Spicy' : 'Fresh';
    const newPlan = INITIAL_MEALS.map(d => ({
      ...d,
      breakfast: { ...d.breakfast, name: `${prefix} ${d.breakfast.name}` },
      lunch: { ...d.lunch, name: `${prefix} ${d.lunch.name}` },
      dinner: { ...d.dinner, name: `${prefix} ${d.dinner.name}` },
    }));
    
    setPlan(newPlan);
    setGenerating(false);
  };

  const day = plan[selectedDay];
  const totalCal = day.breakfast.cal + day.lunch.cal + day.dinner.cal + day.snack.cal;
  const totalProt = day.breakfast.protein + day.lunch.protein + day.dinner.protein + day.snack.protein;

  return (
    <div style={{ maxWidth: 1000 }}>
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontFamily: 'Inter', fontSize: '2rem', fontWeight: 700, marginBottom: 4 }}>AI Meal Plan</h1>
        <p style={{ fontFamily: 'Inter', color: '#6B7280' }}>30-day macro rotation — no meal repeats</p>
      </motion.div>

      {/* Generator */}
      <div style={{ ...CARD, marginBottom: '20px' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', alignItems: 'flex-end' }}>
          <div style={{ flex: 1, minWidth: 220 }}>
            <label style={{ fontFamily: 'Inter', fontSize: '12px', color: '#6B7280', display: 'block', marginBottom: 10 }}>Cuisine Style</label>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {CUISINES.map(c => (
                <button key={c} onClick={() => setCuisine(c)}
                  style={{ 
                    padding: '6px 14px', borderRadius: '8px', 
                    border: cuisine === c ? 'none' : '1px solid rgba(255,255,255,0.1)', 
                    cursor: 'pointer', fontFamily: 'Inter', fontSize: '13px', transition: 'all 150ms ease',
                    background: cuisine === c ? '#F97316' : 'transparent', 
                    color: cuisine === c ? '#FFFFFF' : '#9CA3AF' 
                  }}>
                  {c}
                </button>
              ))}
            </div>
          </div>
          <div style={{ flex: 1, minWidth: 220 }}>
            <label style={{ fontFamily: 'Inter', fontSize: '12px', color: '#6B7280', display: 'block', marginBottom: 10 }}>Dietary Preferences</label>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {PREFS.map(p => (
                <button key={p} onClick={() => setPrefs(arr => arr.includes(p) ? arr.filter(x => x !== p) : [...arr, p])}
                  style={{ 
                    padding: '6px 14px', borderRadius: '8px', 
                    border: prefs.includes(p) ? 'none' : '1px solid rgba(255,255,255,0.1)', 
                    cursor: 'pointer', fontFamily: 'Inter', fontSize: '13px', transition: 'all 150ms ease',
                    background: prefs.includes(p) ? '#F97316' : 'transparent', 
                    color: prefs.includes(p) ? '#FFFFFF' : '#9CA3AF' 
                  }}>
                  {p}
                </button>
              ))}
            </div>
          </div>
          <button onClick={generate} disabled={generating}
            style={{ 
              display: 'flex', alignItems: 'center', gap: 8, 
              background: '#F97316', color: '#FFFFFF', border: 'none', borderRadius: '10px',
              padding: '12px 20px', fontFamily: 'Inter', fontWeight: 600, fontSize: '15px', cursor: 'pointer',
              whiteSpace: 'nowrap', opacity: generating ? 0.7 : 1
            }}>
            {generating ? <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> : <Sparkles size={16} />}
            {generating ? 'Generating…' : 'Generate 7-Day Plan'}
          </button>
        </div>
      </div>

      {/* Day Selector */}
      <div style={{ display: 'flex', gap: '20px', marginBottom: '24px', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: 0 }}>
        {plan.map((d, i) => (
          <button key={d.day} onClick={() => setSelectedDay(i)}
            style={{ 
              padding: '12px 4px', background: 'none', border: 'none', 
              borderBottom: selectedDay === i ? '2px solid #F97316' : '2px solid transparent',
              cursor: 'pointer', fontFamily: 'Inter', fontWeight: selectedDay === i ? 600 : 400, 
              fontSize: '14px', transition: 'all 150ms ease', flexShrink: 0,
              color: selectedDay === i ? '#FFFFFF' : '#6B7280'
            }}>
            {d.label}
          </button>
        ))}
      </div>

      {/* Day Detail */}
      <AnimatePresence mode="wait">
        <motion.div key={selectedDay} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
          <div style={{ display: 'flex', gap: 10, marginBottom: '20px' }}>
            <div style={{ padding: '7px 14px', background: 'rgba(255,255,255,0.03)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.06)' }}>
              <span style={{ fontFamily: 'Inter', color: '#F97316', fontWeight: 600, fontSize: '14px' }}>{totalCal} kcal</span>
              <span style={{ fontFamily: 'Inter', fontSize: '12px', color: '#6B7280', marginLeft: 6 }}>total</span>
            </div>
            <div style={{ padding: '7px 14px', background: 'rgba(255,255,255,0.03)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.06)' }}>
              <span style={{ fontFamily: 'Inter', color: '#10B981', fontWeight: 600, fontSize: '14px' }}>{totalProt}g</span>
              <span style={{ fontFamily: 'Inter', fontSize: '12px', color: '#6B7280', marginLeft: 6 }}>protein</span>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: '16px' }}>
            {[
              { label: 'BREAKFAST', data: day.breakfast },
              { label: 'LUNCH', data: day.lunch },
              { label: 'DINNER', data: day.dinner },
              { label: 'SNACK', data: day.snack },
            ].map(({ label, data }) => (
              <div key={label} style={{ ...CARD, padding: '16px 20px', borderRadius: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', alignItems: 'center' }}>
                  <span style={{ fontFamily: 'Inter', fontSize: '11px', fontWeight: 500, color: '#6B7280', letterSpacing: '0.08em' }}>{label}</span>
                  {data.time > 0 && (
                    <span style={{ fontFamily: 'Inter', fontSize: '12px', color: '#6B7280', display: 'flex', alignItems: 'center', gap: 4 }}>
                      <Clock size={13} /> {data.time} min
                    </span>
                  )}
                </div>
                <p style={{ fontFamily: 'Inter', fontWeight: 600, fontSize: '15px', color: '#FFFFFF', marginBottom: '10px' }}>{data.name}</p>
                <div style={{ display: 'flex', gap: 16 }}>
                  <span style={{ fontFamily: 'Inter', fontSize: '13px', fontWeight: 500, color: '#F97316' }}>
                    {data.cal} kcal
                  </span>
                  <span style={{ fontFamily: 'Inter', fontSize: '13px', fontWeight: 500, color: '#10B981' }}>
                    {data.protein}g protein
                  </span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
