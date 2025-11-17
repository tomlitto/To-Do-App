import React from 'react';
import { Status } from '../types';

interface FilterControlsProps {
  statusFilter: string;
  onStatusChange: (status: string) => void;
  priorityFilter: string;
  onPriorityChange: (priority: string) => void;
  availablePriorities: string[];
}

const FilterControls: React.FC<FilterControlsProps> = ({
  statusFilter,
  onStatusChange,
  priorityFilter,
  onPriorityChange,
  availablePriorities,
}) => {
  const selectClasses = "bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-brand-primary focus:border-brand-primary block w-full p-2.5";

  return (
    <div className="p-4 bg-gray-50 border-b border-gray-300 flex items-center gap-4">
      <div className="flex-1">
        <label htmlFor="status-filter" className="block mb-2 text-sm font-medium text-gray-900">
          Filter by Status
        </label>
        <select
          id="status-filter"
          value={statusFilter}
          onChange={(e) => onStatusChange(e.target.value)}
          className={selectClasses}
        >
          <option value="All">All Statuses</option>
          {Object.values(Status).map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>
      <div className="flex-1">
        <label htmlFor="priority-filter" className="block mb-2 text-sm font-medium text-gray-900">
          Filter by Priority
        </label>
        <select
          id="priority-filter"
          value={priorityFilter}
          onChange={(e) => onPriorityChange(e.target.value)}
          className={selectClasses}
          disabled={availablePriorities.length <= 1}
        >
          {availablePriorities.map((p) => (
             <option key={p} value={p}>
              {p === 'All' ? 'All Priorities' : p}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default FilterControls;
