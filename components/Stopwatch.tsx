import React from 'react';
import { useStopwatch } from '../hooks/useStopwatch';
import { ClockIcon } from './icons';

const Stopwatch: React.FC = () => {
  const { timerString } = useStopwatch();

  return (
    <div className="mt-8 p-6 bg-white border border-gray-200 rounded-lg shadow-sm flex flex-col justify-center items-center text-center">
        <div className="text-5xl font-mono font-bold text-gray-800 tracking-wider">
            {timerString}
        </div>
        <div className="mt-2 text-base text-gray-600">
            Work Session
        </div>
        <div className="mt-1 text-sm text-gray-500 flex items-center gap-1">
            <ClockIcon className="w-4 h-4" />
            <span>Time Elapsed</span>
        </div>
    </div>
  );
};

export default Stopwatch;