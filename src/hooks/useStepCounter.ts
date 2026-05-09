'use client';
import { useEffect, useRef, useCallback } from 'react';
import { useAppStore } from '@/store/useAppStore';

/**
 * Real-time step detection using DeviceMotionEvent accelerometer.
 * Threshold algorithm: detects magnitude crossings > 1.2g
 * with 300ms debounce between steps.
 */
export function useStepCounter() {
  const { liveSteps, incrementSteps, triggerConfetti } = useAppStore();
  const lastMagnitude = useRef(0);
  const lastStepTime = useRef(0);
  const THRESHOLD = 1.2;
  const MIN_INTERVAL = 300;

  const handleMotion = useCallback(
    (event: DeviceMotionEvent) => {
      const acc = event.accelerationIncludingGravity;
      if (!acc?.x || !acc?.y || !acc?.z) return;

      const magnitude = Math.sqrt(acc.x ** 2 + acc.y ** 2 + acc.z ** 2) / 9.81; // normalise to g
      const now = Date.now();

      if (
        magnitude > THRESHOLD &&
        lastMagnitude.current <= THRESHOLD &&
        now - lastStepTime.current > MIN_INTERVAL
      ) {
        incrementSteps();
        lastStepTime.current = now;

        // Milestone celebrations
        const newSteps = liveSteps + 1;
        const milestones = [2500, 5000, 7500, 10000];
        if (milestones.includes(newSteps)) {
          triggerConfetti();
          if ('Notification' in window && Notification.permission === 'granted') {
            new Notification(`${newSteps.toLocaleString()} steps!`, {
              body: `Great job! Keep going`,
              icon: '/icon-192.png',
            });
          }
        }
      }
      lastMagnitude.current = magnitude;
    },
    [incrementSteps, liveSteps, triggerConfetti]
  );

  useEffect(() => {
    if (typeof window === 'undefined' || !window.DeviceMotionEvent) return;

    // iOS 13+ requires permission
    const dm = DeviceMotionEvent as unknown as { requestPermission?: () => Promise<string> };
    if (typeof dm.requestPermission === 'function') {
      dm.requestPermission().then((perm) => {
        if (perm === 'granted') window.addEventListener('devicemotion', handleMotion);
      });
    } else {
      window.addEventListener('devicemotion', handleMotion);
    }

    return () => window.removeEventListener('devicemotion', handleMotion);
  }, [handleMotion]);

  return liveSteps;
}
