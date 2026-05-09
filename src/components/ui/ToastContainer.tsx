'use client';
import { useAppStore } from '@/store/useAppStore';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export function ToastContainer() {
  const { toasts, removeToast } = useAppStore();

  return (
    <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-2 pointer-events-none">
      <AnimatePresence>
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, x: 60, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 60, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-xl border"
            style={{
              background: 'rgba(15,15,26,0.95)',
              backdropFilter: 'blur(20px)',
              borderColor:
                t.type === 'success'
                  ? 'rgba(57,255,20,0.3)'
                  : t.type === 'error'
                  ? 'rgba(255,77,109,0.3)'
                  : 'rgba(0,212,255,0.3)',
              boxShadow:
                t.type === 'success'
                  ? '0 0 20px rgba(57,255,20,0.15)'
                  : t.type === 'error'
                  ? '0 0 20px rgba(255,77,109,0.15)'
                  : '0 0 20px rgba(0,212,255,0.15)',
            }}
          >
            {t.type === 'success' && <CheckCircle2 size={18} color="var(--neon-green)" />}
            {t.type === 'error' && <AlertCircle size={18} color="var(--neon-coral)" />}
            {t.type === 'info' && <Info size={18} color="var(--neon-blue)" />}
            <span style={{ color: 'var(--text-primary)', fontSize: '0.875rem', fontWeight: 500 }}>
              {t.message}
            </span>
            <button
              onClick={() => removeToast(t.id)}
              style={{ color: 'var(--text-muted)', marginLeft: 4 }}
            >
              <X size={14} />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
