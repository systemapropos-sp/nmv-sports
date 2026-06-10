import { useState, useEffect, useCallback, useRef } from 'react';

const STORAGE_KEY = 'nmv-auto-sync';
const SYNC_INTERVAL = 30000; // 30 seconds

export function useAutoSync(refreshCallback: () => void) {
  const [autoSync, setAutoSync] = useState(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : true;
  });
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const toggleAutoSync = useCallback(() => {
    setAutoSync((prev: boolean) => {
      const next = !prev;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  useEffect(() => {
    if (autoSync) {
      intervalRef.current = setInterval(refreshCallback, SYNC_INTERVAL);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [autoSync, refreshCallback]);

  return { autoSync, toggleAutoSync };
}
