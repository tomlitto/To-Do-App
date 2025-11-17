import React, { useState, useEffect, useRef } from 'react';
import { Todo, Status } from '../types';
import TimePicker from './TimePicker';

interface TodoTableProps {
  todos: Todo[];
  onUpdate: (id: number, field: keyof Todo, value: string | boolean) => void;
  onStartFocusBlock: (duration: string) => void;
  categoryFilter: string;
  onCategoryChange: (category: string) => void;
  availableCategories: string[];
  statusFilter: string;
  onStatusChange: (status: string) => void;
  priorityFilter: string;
  onPriorityChange: (priority: string) => void;
  availablePriorities: string[];
}

const TodoTable: React.FC<TodoTableProps> = ({ 
  todos, 
  onUpdate, 
  onStartFocusBlock,
  categoryFilter, 
  onCategoryChange, 
  availableCategories,
  statusFilter,
  onStatusChange,
  priorityFilter,
  onPriorityChange,
  availablePriorities
}) => {
  const headerClasses = 'p-2 bg-brand-primary text-brand-text font-semibold border-black border text-sm';
  const cellClasses = 'border-black border';
  const inputClasses = `w-full h-full p-1 border-none focus:outline-none focus:ring-1 focus:ring-blue-400 bg-transparent disabled:bg-transparent`;

  const [pickerState, setPickerState] = useState<{
    isOpen: boolean;
    targetId: number | null;
    targetField: keyof Todo | null;
    initialValue: string;
  }>({
    isOpen: false,
    targetId: null,
    targetField: null,
    initialValue: '00:00',
  });

  const [isCategoryFilterOpen, setIsCategoryFilterOpen] = useState(false);
  const [isPriorityFilterOpen, setIsPriorityFilterOpen] = useState(false);
  const [isStatusFilterOpen, setIsStatusFilterOpen] = useState(false);
  
  const categoryFilterMenuRef = useRef<HTMLDivElement>(null);
  const priorityFilterMenuRef = useRef<HTMLDivElement>(null);
  const statusFilterMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (categoryFilterMenuRef.current && !categoryFilterMenuRef.current.contains(event.target as Node)) {
        setIsCategoryFilterOpen(false);
      }
      if (priorityFilterMenuRef.current && !priorityFilterMenuRef.current.contains(event.target as Node)) {
        setIsPriorityFilterOpen(false);
      }
      if (statusFilterMenuRef.current && !statusFilterMenuRef.current.contains(event.target as Node)) {
        setIsStatusFilterOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const openPicker = (id: number, field: keyof Todo, value: string) => {
    setPickerState({
      isOpen: true,
      targetId: id,
      targetField: field,
      initialValue: value || '00:00',
    });
  };

  const handlePickerClose = (newTime: string | null) => {
    if (newTime !== null && pickerState.targetId && pickerState.targetField) {
      onUpdate(pickerState.targetId, pickerState.targetField, newTime);
    }
    setPickerState({ isOpen: false, targetId: null, targetField: null, initialValue: '00:00' });
  };
  
  const timeFields: (keyof Todo)[] = ['plannedStart', 'plannedEnd', 'actualStart', 'actualEnd'];

  const renderFilterDropdown = (
    filterValue: string,
    options: string[],
    onChange: (value: string) => void,
    allLabel: string,
  ) => (
    <ul className="py-1 text-gray-700 text-sm">
      {options.map(option => (
        <li key={option}>
          <button
            onClick={() => onChange(option)}
            className={`w-full text-left px-4 py-2 hover:bg-gray-100 ${filterValue === option ? 'font-bold bg-gray-100' : ''}`}
          >
            {option === 'All' ? allLabel : option}
          </button>
        </li>
      ))}
    </ul>
  );

  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-black">
          <thead>
            <tr>
              <th className={`${headerClasses} w-10`}>#</th>
              <th className={`${headerClasses} w-32`}>Date</th>
              <th className={`${headerClasses} w-2/5`}>Activity</th>
              <th className={`${headerClasses} relative`}>
                <button
                  onClick={() => setIsPriorityFilterOpen(prev => !prev)}
                  className="w-full h-full flex items-center justify-between p-2"
                >
                  Priority
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {isPriorityFilterOpen && (
                  <div ref={priorityFilterMenuRef} className="absolute top-full left-0 mt-1 w-40 bg-white border border-gray-300 rounded-md shadow-lg z-10">
                    {renderFilterDropdown(priorityFilter, availablePriorities, (p) => { onPriorityChange(p); setIsPriorityFilterOpen(false); }, 'All Priorities')}
                  </div>
                )}
              </th>
              <th className={`${headerClasses} w-20`}>Start ?</th>
              <th className={`${headerClasses} w-28 relative`}>
                 <button
                  onClick={() => setIsStatusFilterOpen(prev => !prev)}
                  className="w-full h-full flex items-center justify-between p-2"
                >
                  Done ?
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {isStatusFilterOpen && (
                  <div ref={statusFilterMenuRef} className="absolute top-full left-0 mt-1 w-40 bg-white border border-gray-300 rounded-md shadow-lg z-10">
                    {renderFilterDropdown(statusFilter, ['All', 'Pending', 'Completed'], (s) => { onStatusChange(s); setIsStatusFilterOpen(false); }, 'All Tasks')}
                  </div>
                )}
              </th>
              <th className={headerClasses}>Planned Duration</th>
              <th className={headerClasses}>Planned Start</th>
              <th className={headerClasses}>Planned End</th>
              <th className={headerClasses}>Actual Start</th>
              <th className={headerClasses}>Actual End</th>
              <th className={headerClasses}>Actual Duration</th>
              <th className={`${headerClasses} w-72 relative`}>
                <button
                  onClick={() => setIsCategoryFilterOpen(prev => !prev)}
                  className="w-full h-full flex items-center justify-between p-2"
                >
                  Project Category
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {isCategoryFilterOpen && (
                  <div ref={categoryFilterMenuRef} className="absolute top-full left-0 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg z-10">
                    {renderFilterDropdown(categoryFilter, availableCategories, (c) => { onCategoryChange(c); setIsCategoryFilterOpen(false); }, 'All Categories')}
                  </div>
                )}
              </th>
            </tr>
          </thead>
          <tbody>
            {todos.map((todo) => {
              const isDone = todo.done;
              const doneClass = isDone ? 'line-through text-gray-500' : '';

              return (
                <tr key={todo.id} className={`h-10 transition-colors ${isDone ? 'bg-gray-100' : ''}`}>
                  <td className={`${cellClasses} bg-gray-100 text-center ${doneClass}`}>{todo.id}</td>
                  <td className={cellClasses}>
                    <input type="date" value={todo.date} onChange={(e) => onUpdate(todo.id, 'date', e.target.value)} className={`${inputClasses} text-center ${doneClass}`} disabled={isDone} />
                  </td>
                  <td className={cellClasses}>
                    <input type="text" value={todo.activity} onChange={(e) => onUpdate(todo.id, 'activity', e.target.value)} className={`${inputClasses} ${doneClass}`} disabled={isDone} />
                  </td>
                  <td className={cellClasses}>
                    <select
                      value={todo.priority}
                      onChange={(e) => onUpdate(todo.id, 'priority', e.target.value)}
                      className={`${inputClasses} text-center ${doneClass}`}
                      aria-label={`Priority for task ${todo.id}`}
                      disabled={isDone}
                    >
                      <option value="">--</option>
                      {Array.from({ length: 12 }, (_, i) => (
                        <option key={`p-${i + 1}`} value={`P${i + 1}`}>{i + 1}</option>
                      ))}
                    </select>
                  </td>
                  <td className={`${cellClasses} text-center`}>
                    <input
                      type="checkbox"
                      onChange={() => {
                        if (todo.plannedDuration) {
                          onStartFocusBlock(todo.plannedDuration);
                        }
                      }}
                      disabled={isDone || !todo.plannedDuration}
                      className="w-4 h-4 cursor-pointer"
                      aria-label={`Start focus block for task ${todo.id}`}
                    />
                  </td>
                  <td className={`${cellClasses} text-center`}>
                    <input
                      type="checkbox"
                      checked={isDone}
                      onChange={(e) => onUpdate(todo.id, 'done', e.target.checked)}
                      className="w-4 h-4"
                    />
                  </td>
                  <td className={`${cellClasses} text-center ${doneClass}`}>
                    {todo.plannedDuration}
                  </td>
                  
                  {timeFields.map(field => (
                    <td key={field} className={cellClasses}>
                      <button 
                        onClick={() => openPicker(todo.id, field, todo[field] as string)} 
                        className={`${inputClasses} text-center cursor-pointer h-full w-full ${doneClass}`}
                        aria-label={`Select time for ${field}`}
                        disabled={isDone}
                      >
                        {todo[field] || '--:--'}
                      </button>
                    </td>
                  ))}

                  <td className={`${cellClasses} text-center ${doneClass}`}>
                    {todo.actualDuration}
                  </td>
                  <td className={cellClasses}>
                    <input type="text" value={todo.projectCategory} onChange={(e) => onUpdate(todo.id, 'projectCategory', e.target.value)} className={`${inputClasses} text-center ${doneClass}`} disabled={isDone} />
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
      
      <TimePicker 
        isOpen={pickerState.isOpen}
        onClose={handlePickerClose}
        initialTime={pickerState.initialValue}
      />
    </>
  );
};

export default TodoTable;