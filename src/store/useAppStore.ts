'use client';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { DailyStats, FoodLog, UserProfile } from '@/types';

interface AppStore {
  // User
  user: UserProfile | null;
  setUser: (user: UserProfile | null) => void;

  // Sidebar
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;

  // Daily stats (cached)
  dailyStats: DailyStats;
  setDailyStats: (stats: Partial<DailyStats>) => void;

  // Food logs (today)
  todayFoodLogs: FoodLog[];
  setTodayFoodLogs: (logs: FoodLog[]) => void;
  addFoodLog: (log: FoodLog) => void;

  // Hydration
  todayWaterMl: number;
  setTodayWaterMl: (ml: number) => void;
  addWater: (ml: number) => void;

  // Steps (live)
  liveSteps: number;
  setLiveSteps: (steps: number) => void;
  incrementSteps: () => void;

  // Confetti
  showConfetti: boolean;
  triggerConfetti: () => void;
  hideConfetti: () => void;

  // Toast queue
  toasts: { id: string; message: string; type: 'success' | 'error' | 'info' }[];
  addToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  removeToast: (id: string) => void;

  // Active workout
  activeWorkoutPlan: string | null;
  setActiveWorkoutPlan: (plan: string | null) => void;
}

export const useAppStore = create<AppStore>()(
  persist(
    (set, get) => ({
      user: null,
      setUser: (user) => set({ user }),

      sidebarOpen: true,
      setSidebarOpen: (open) => set({ sidebarOpen: open }),
      toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),

      dailyStats: {
        steps: 0,
        caloriesConsumed: 0,
        caloriesBurned: 0,
        waterMl: 0,
        workoutStreak: 0,
        proteinG: 0,
        carbsG: 0,
        fatG: 0,
      },
      setDailyStats: (stats) =>
        set((s) => ({ dailyStats: { ...s.dailyStats, ...stats } })),

      todayFoodLogs: [],
      setTodayFoodLogs: (logs) => set({ todayFoodLogs: logs }),
      addFoodLog: (log) =>
        set((s) => ({ todayFoodLogs: [...s.todayFoodLogs, log] })),

      todayWaterMl: 0,
      setTodayWaterMl: (ml) => set({ todayWaterMl: ml }),
      addWater: (ml) =>
        set((s) => ({ todayWaterMl: s.todayWaterMl + ml })),

      liveSteps: 0,
      setLiveSteps: (steps) => set({ liveSteps: steps }),
      incrementSteps: () => set((s) => ({ liveSteps: s.liveSteps + 1 })),

      showConfetti: false,
      triggerConfetti: () => {
        set({ showConfetti: true });
        setTimeout(() => set({ showConfetti: false }), 3500);
      },
      hideConfetti: () => set({ showConfetti: false }),

      toasts: [],
      addToast: (message, type = 'info') => {
        const id = Date.now().toString();
        set((s) => ({ toasts: [...s.toasts, { id, message, type }] }));
        setTimeout(() => get().removeToast(id), 3000);
      },
      removeToast: (id) =>
        set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),

      activeWorkoutPlan: null,
      setActiveWorkoutPlan: (plan) => set({ activeWorkoutPlan: plan }),
    }),
    {
      name: 'repwise-store',
      partialize: (state) => ({
        user: state.user,
        sidebarOpen: state.sidebarOpen,
        liveSteps: state.liveSteps,
      }),
    }
  )
);
