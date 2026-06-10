import { useState, useEffect } from 'react';

interface CountdownProps {
  targetTime: string; // ISO string
}

export default function Countdown({ targetTime }: CountdownProps) {
  const [timeLeft, setTimeLeft] = useState<number>(0);

  useEffect(() => {
    const calculate = () => {
      const now = Date.now();
      const target = new Date(targetTime).getTime();
      const diff = target - now;
      setTimeLeft(diff);
    };

    calculate();
    const interval = setInterval(calculate, 1000);
    return () => clearInterval(interval);
  }, [targetTime]);

  // Only show if 20 minutes or less remaining AND game hasn't started
  if (timeLeft <= 0 || timeLeft > 20 * 60 * 1000) return null;

  const minutes = Math.floor(timeLeft / 60000);
  const seconds = Math.floor((timeLeft % 60000) / 1000);

  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500 text-white text-xs font-bold animate-pulse">
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <polyline points="12,6 12,12 16,14"/>
      </svg>
      {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
    </span>
  );
}
