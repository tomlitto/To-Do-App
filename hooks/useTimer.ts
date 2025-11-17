
import { useState, useEffect, useRef, useCallback } from 'react';

export const useTimer = (initialMinutes: number = 0) => {
  const [totalSeconds, setTotalSeconds] = useState(initialMinutes * 60);
  const [isActive, setIsActive] = useState(false);
  const intervalRef = useRef<number | null>(null);

  const startTimer = useCallback((minutes: number) => {
    if (minutes > 0) {
      setTotalSeconds(minutes * 60);
      setIsActive(true);
    }
  }, []);

  const stopTimer = useCallback(() => {
    setIsActive(false);
  }, []);
  
  const resetTimer = useCallback(() => {
    setIsActive(false);
    setTotalSeconds(0);
  }, []);

  useEffect(() => {
    if (isActive && totalSeconds > 0) {
      intervalRef.current = window.setInterval(() => {
        setTotalSeconds(prev => prev - 1);
      }, 1000);
    } else if (totalSeconds === 0 && isActive) {
      setIsActive(false);
      // Optional: play a sound or show notification
      new Notification('Timer Finished!');
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isActive, totalSeconds]);

  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  
  const timerString = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  return { timerString, isActive, startTimer, stopTimer, resetTimer };
};
