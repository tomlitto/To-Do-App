import React from 'react';

interface HeaderProps {
  plannedTotalHours: number;
  actualTotalHours: number;
}

const Header: React.FC<HeaderProps> = ({ plannedTotalHours, actualTotalHours }) => {
  return (
    <header className="bg-brand-primary p-4 flex justify-between items-center">
      <h1 className="text-5xl font-bold text-red-500">
        Must Do Today
      </h1>
      <div className="flex gap-4">
        <div className="text-right bg-black/10 p-2 rounded-md">
          <div className="text-xs text-brand-text/80 uppercase tracking-wider">Planned Total</div>
          <div className="text-xl font-bold text-brand-text">{plannedTotalHours.toFixed(2)} hrs</div>
        </div>
        <div className="text-right bg-black/10 p-2 rounded-md">
          <div className="text-xs text-brand-text/80 uppercase tracking-wider">Actual Total</div>
          <div className="text-xl font-bold text-brand-text">{actualTotalHours.toFixed(2)} hrs</div>
        </div>
      </div>
    </header>
  );
};

export default Header;