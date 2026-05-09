'use client';
import dynamic from 'next/dynamic';
import { Sidebar } from '@/components/layout/Sidebar';
import { motion, AnimatePresence } from 'framer-motion';
import { usePathname, useRouter } from 'next/navigation';
import { useAppStore } from '@/store/useAppStore';
import { useEffect } from 'react';
import { useStepCounter } from '@/hooks/useStepCounter';

const ConfettiBurst = dynamic(() => import('@/components/3d/ConfettiBurst'), { ssr: false });

function StepTracker() {
  useStepCounter();
  return null;
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useAppStore();

  useEffect(() => {
    if (user && !user.onboardingDone) {
      router.replace('/onboarding');
    }
  }, [user, router]);

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'row', 
      minHeight: '100vh', 
      background: 'var(--bg-base)' 
    }}>
      <ConfettiBurst />
      <StepTracker />
      <Sidebar />
      <main style={{ 
        flex: 1, 
        overflowY: 'auto', 
        overflowX: 'hidden',
        paddingBottom: '80px', // Space for mobile bottom nav
      }} className="main-content">
        <AnimatePresence mode="wait">
          <motion.div
            key={pathname}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            style={{ minHeight: '100vh' }}
            className="dashboard-content"
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}

