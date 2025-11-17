import React, { useState, useEffect, useMemo } from 'react';
import { KeyboardIcon, ClockIcon } from './icons';

interface TimePickerProps {
  isOpen: boolean;
  onClose: (newTime: string | null) => void;
  initialTime: string; // Expected format "HH:mm" (24-hour)
}

const parseTime = (time24: string) => {
  const [h, m] = (time24 || "00:00").split(':').map(Number);
  const period = h >= 12 ? 'PM' : 'AM';
  let hour12 = h % 12;
  if (hour12 === 0) hour12 = 12; // 0 and 12 should be 12 in 12-hour format
  return { hour: hour12, minute: m, period: period as 'AM' | 'PM' };
};

const formatTime = (hour: number, minute: number, period: 'AM' | 'PM'): string => {
  let hour24 = hour;
  if (period === 'PM' && hour < 12) {
    hour24 += 12;
  } else if (period === 'AM' && hour === 12) {
    hour24 = 0;
  }
  const fH = String(hour24).padStart(2, '0');
  const fM = String(minute).padStart(2, '0');
  return `${fH}:${fM}`;
};

const TimePicker: React.FC<TimePickerProps> = ({ isOpen, onClose, initialTime }) => {
  const [time, setTime] = useState(parseTime(initialTime));
  const [activeInput, setActiveInput] = useState<'hour' | 'minute'>('hour');
  const [inputMode, setInputMode] = useState<'clock' | 'manual'>('clock');

  // States for manual input fields
  const [hourStr, setHourStr] = useState('');
  const [minuteStr, setMinuteStr] = useState('');

  useEffect(() => {
    if (isOpen) {
      const parsed = parseTime(initialTime);
      setTime(parsed);
      setHourStr(String(parsed.hour).padStart(2, '0'));
      setMinuteStr(String(parsed.minute).padStart(2, '0'));
      setActiveInput('hour');
      setInputMode('clock');
    }
  }, [isOpen, initialTime]);
  
  const handleHourChange = (newHour: number) => {
    const newTime = { ...time, hour: newHour };
    setTime(newTime);
    setHourStr(String(newHour).padStart(2, '0'));
    setActiveInput('minute');
  };

  const handleMinuteChange = (newMinute: number) => {
    const newTime = { ...time, minute: newMinute };
    setTime(newTime);
    setMinuteStr(String(newMinute).padStart(2, '0'));
  };
  
  const handlePeriodChange = (newPeriod: 'AM' | 'PM') => {
    setTime(prev => ({ ...prev, period: newPeriod }));
  };

  const handleManualHourChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setHourStr(e.target.value.replace(/[^0-9]/g, '').slice(0, 2));
  };
  
  const handleManualMinuteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMinuteStr(e.target.value.replace(/[^0-9]/g, '').slice(0, 2));
  };

  const validateAndSetTime = () => {
    let hour = parseInt(hourStr, 10);
    if (isNaN(hour) || hour < 1 || hour > 12) {
      hour = time.hour; // revert to last valid state on blur
    }
    let minute = parseInt(minuteStr, 10);
    if (isNaN(minute) || minute < 0 || minute > 59) {
      minute = time.minute; // revert
    }
    const newTime = { ...time, hour, minute };
    setTime(newTime);
    setHourStr(String(hour).padStart(2, '0'));
    setMinuteStr(String(minute).padStart(2, '0'));
  };

  const handleOk = () => {
    if (inputMode === 'manual') {
      let hour = parseInt(hourStr, 10);
      if (isNaN(hour) || hour < 1 || hour > 12) hour = 12;

      let minute = parseInt(minuteStr, 10);
      if (isNaN(minute) || minute < 0 || minute > 59) minute = 0;
      
      onClose(formatTime(hour, minute, time.period));
    } else {
      onClose(formatTime(time.hour, time.minute, time.period));
    }
  };

  const handleCancel = () => {
    onClose(null);
  };
  
  const clockNumbers = useMemo(() => Array.from({ length: 12 }, (_, i) => i + 1), []);
  const manualInputClasses = "text-6xl p-2 rounded-lg bg-picker-accent-light w-28 text-center focus:outline-none focus:ring-2 focus:ring-picker-accent-dark";


  if (!isOpen) {
    return null;
  }

  const handRotation = activeInput === 'hour'
    ? (time.hour % 12) * 30 + (time.minute / 60) * 30
    : time.minute * 6;

  return (
    <div className="fixed inset-0 bg-black/30 flex justify-center items-center z-50">
      <div className="bg-picker-bg rounded-3xl p-6 w-80 text-picker-text-main shadow-2xl">
        <h3 className="text-sm text-picker-text-secondary px-2 mb-6">Select time</h3>
        
        {/* Digital Display */}
        <div className="flex items-center justify-center gap-x-2 mb-6">
          {inputMode === 'manual' ? (
            <>
              <input 
                type="text"
                inputMode="numeric"
                value={hourStr}
                onChange={handleManualHourChange}
                onBlur={validateAndSetTime}
                className={manualInputClasses}
                aria-label="Hour input"
              />
              <div className="text-6xl pb-2">:</div>
              <input 
                type="text"
                inputMode="numeric"
                value={minuteStr}
                onChange={handleManualMinuteChange}
                onBlur={validateAndSetTime}
                className={manualInputClasses}
                aria-label="Minute input"
              />
            </>
          ) : (
            <>
              <div 
                className={`text-6xl p-2 rounded-lg cursor-pointer ${activeInput === 'hour' ? 'bg-picker-accent-light' : 'bg-gray-200/50'}`}
                onClick={() => setActiveInput('hour')}
              >
                {String(time.hour).padStart(2, '0')}
              </div>
              <div className="text-6xl pb-2">:</div>
              <div 
                 className={`text-6xl p-2 rounded-lg cursor-pointer ${activeInput === 'minute' ? 'bg-picker-accent-light' : 'bg-gray-200/50'}`}
                 onClick={() => setActiveInput('minute')}
              >
                {String(time.minute).padStart(2, '0')}
              </div>
            </>
          )}
          <div className="flex flex-col gap-y-1 ml-2 border border-picker-text-secondary rounded-lg overflow-hidden">
            <button 
              onClick={() => handlePeriodChange('AM')}
              className={`px-3 py-2 text-sm font-medium ${time.period === 'AM' ? 'bg-picker-am-pm-active' : ''}`}
            >AM</button>
            <button 
              onClick={() => handlePeriodChange('PM')}
              className={`px-3 py-2 text-sm font-medium border-t border-picker-text-secondary ${time.period === 'PM' ? 'bg-picker-am-pm-active' : ''}`}
            >PM</button>
          </div>
        </div>

        {/* Analog Clock or empty space */}
        <div className="w-64 h-64 mx-auto my-8 relative">
          {inputMode === 'clock' && (
            <div className="w-full h-full bg-picker-accent-light rounded-full">
              <div className="absolute top-1/2 left-1/2 w-2 h-2 bg-picker-accent-dark rounded-full -translate-x-1/2 -translate-y-1/2"></div>
              {/* Hand */}
              <div 
                className="absolute bottom-1/2 left-1/2 w-1 h-24 bg-picker-accent-dark origin-bottom" 
                style={{ transform: `translateX(-50%) rotate(${handRotation}deg)` }}
              >
                <div className="absolute -top-1 right-1/2 w-2 h-2 bg-picker-accent-dark rounded-full translate-x-1/2"></div>
              </div>
              {/* Numbers */}
              {clockNumbers.map(num => { // num is 1..12
                const angle = num * 30;
                if (activeInput === 'hour') {
                  const isSelected = num === time.hour;
                  return (
                    <div 
                      key={num} 
                      className="absolute w-10 h-10 top-1/2 left-1/2 -m-5 flex justify-center items-center cursor-pointer rounded-full"
                      style={{ transform: `rotate(${angle}deg) translate(0, -88px) rotate(-${angle}deg)` }}
                      onClick={() => handleHourChange(num)}
                    >
                      <div className={`w-full h-full flex justify-center items-center rounded-full ${isSelected ? 'bg-picker-accent-dark text-white' : 'hover:bg-picker-accent-light/50'}`}>
                        {num}
                      </div>
                    </div>
                  );
                } else { // activeInput === 'minute'
                  const minuteValue = num === 12 ? 0 : num * 5;
                  const isSelected = minuteValue === time.minute;
                  return (
                    <div 
                      key={num} 
                      className="absolute w-10 h-10 top-1/2 left-1/2 -m-5 flex justify-center items-center cursor-pointer rounded-full"
                      style={{ transform: `rotate(${angle}deg) translate(0, -88px) rotate(-${angle}deg)` }}
                      onClick={() => handleMinuteChange(minuteValue)}
                    >
                      <div className={`w-full h-full flex justify-center items-center rounded-full ${isSelected ? 'bg-picker-accent-dark text-white' : 'hover:bg-picker-accent-light/50'}`}>
                        {String(minuteValue).padStart(2, '0')}
                      </div>
                    </div>
                  );
                }
              })}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex justify-between items-center mt-6">
            <button 
              className="text-picker-accent-dark p-2 rounded-full hover:bg-picker-accent-light"
              onClick={() => setInputMode(prev => prev === 'clock' ? 'manual' : 'clock')}
              aria-label={inputMode === 'clock' ? 'Switch to manual input' : 'Switch to clock view'}
            >
              {inputMode === 'clock' ? <KeyboardIcon className="w-6 h-6" /> : <ClockIcon className="w-6 h-6" />}
            </button>
            <div className="flex gap-x-4">
                <button onClick={handleCancel} className="text-picker-accent-dark font-medium px-4 py-2 rounded-full hover:bg-picker-accent-light">Cancel</button>
                <button onClick={handleOk} className="text-picker-accent-dark font-medium px-4 py-2 rounded-full hover:bg-picker-accent-light">OK</button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default TimePicker;