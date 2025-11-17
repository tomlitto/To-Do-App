import React from 'react';
import { ClockIcon } from './icons';

interface CountdownTimerProps {
  timerString: string;
  isActive: boolean;
  resetTimer: () => void;
  minutesInput: string;
  onMinutesInputChange: (value: string) => void;
  onStartTimer: (minutes: number) => void;
}

const CountdownTimer: React.FC<CountdownTimerProps> = ({
  timerString,
  isActive,
  resetTimer,
  minutesInput,
  onMinutesInputChange,
  onStartTimer,
}) => {
  const handleStartClick = () => {
    const minutes = parseInt(minutesInput, 10);
    if (!isNaN(minutes) && minutes > 0) {
      onStartTimer(minutes);
    }
  };

  const displayTime = isActive 
    ? timerString 
    : `${String(parseInt(minutesInput, 10) || 0).padStart(2, '0')}:00`;

  const message = isActive ? 'Time Remaining' : 'Set timer and press start';

  return (
    <div className="mt-8 p-6 bg-white border border-gray-200 rounded-lg shadow-sm flex flex-col justify-center items-center text-center">
        <div className="text-5xl font-mono font-bold text-gray-800 tracking-wider">
            {displayTime}
        </div>
        <div className="mt-2 text-base text-gray-600">
            Focus Block
        </div>
        
        {!isActive ? (
          <div className="mt-4 flex items-center gap-2">
            <input
              type="number"
              value={minutesInput}
              onChange={(e) => onMinutesInputChange(e.target.value)}
              className="w-24 p-2 border border-gray-300 rounded-md text-center text-lg"
              placeholder="Mins"
              min="1"
              aria-label="Set countdown minutes"
            />
            <button
              onClick={handleStartClick}
              className="inline-flex items-center justify-center gap-x-2 rounded-md px-4 py-2 text-sm font-semibold shadow-sm bg-brand-primary hover:bg-blue-600 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 transition-all"
            >
              Start
            </button>
          </div>
        ) : (
          <div className="mt-4">
             <button
              onClick={resetTimer}
              className="inline-flex items-center justify-center gap-x-2 rounded-md px-4 py-2 text-sm font-semibold shadow-sm bg-red-600 hover:bg-red-500 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600 transition-all"
            >
              Reset
            </button>
          </div>
        )}

         <div className="mt-3 text-sm text-gray-500 flex items-center gap-1">
            <ClockIcon className="w-4 h-4" />
            <span>{message}</span>
        </div>
    </div>
  );
};

export default CountdownTimer;