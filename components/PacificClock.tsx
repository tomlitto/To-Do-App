import React, { useState, useEffect } from 'react';

const PacificClock: React.FC = () => {
  const [time, setTime] = useState<Date>(new Date());

  useEffect(() => {
    const timerId = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timerId);
  }, []);

  const timeString = time.toLocaleTimeString('en-US', {
    timeZone: 'America/Los_Angeles',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });

  const dateString = time.toLocaleDateString('en-US', {
    timeZone: 'America/Los_Angeles',
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="sticky top-6 p-6 bg-white border border-gray-200 rounded-lg shadow-sm flex flex-col justify-center items-center text-center">
        <div className="text-2xl text-gray-500">
            {dateString}
        </div>
        <div className="mt-1 text-5xl font-mono font-bold text-gray-800 tracking-wider">
            {timeString}
        </div>
        <div className="mt-2 text-base text-gray-600">
            San Francisco (PT)
        </div>
    </div>
  );
};

export default PacificClock;
