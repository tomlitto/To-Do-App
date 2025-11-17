
import React, { useState } from 'react';
import { Todo, Priority } from '../types';

interface AddTaskFormProps {
  onAddMultipleTasks: (tasks: Omit<Todo, 'id' | 'status'>[]) => void;
}

interface TaskRowData {
  activity: string;
  priority: Priority;
  duration: string;
  plannedStart: string;
  plannedEnd: string;
}

const createEmptyRow = (): TaskRowData => ({
  activity: '',
  priority: Priority.P3,
  duration: '',
  plannedStart: '',
  plannedEnd: '',
});

const AddTaskForm: React.FC<AddTaskFormProps> = ({ onAddMultipleTasks }) => {
  const [rows, setRows] = useState<TaskRowData[]>(Array(10).fill(null).map(createEmptyRow));

  const handleInputChange = (index: number, field: keyof TaskRowData, value: string) => {
    const newRows = [...rows];
    newRows[index] = { ...newRows[index], [field]: value };
    setRows(newRows);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newTasks = rows
      .map(row => ({
        ...row,
        activity: row.activity.trim(),
      }))
      .filter(row => row.activity && row.duration && row.plannedStart && row.plannedEnd)
      .map(row => ({
        activity: row.activity,
        priority: row.priority,
        duration: parseInt(row.duration, 10),
        plannedStart: new Date(row.plannedStart).toISOString(),
        plannedEnd: new Date(row.plannedEnd).toISOString(),
      }));

    if (newTasks.length > 0) {
      onAddMultipleTasks(newTasks);
      setRows(Array(10).fill(null).map(createEmptyRow));
    } else {
      alert('Please fill out at least one task completely to add.');
    }
  };

  const inputClasses = "w-full bg-dark-bg border border-dark-border rounded-md p-2 focus:ring-2 focus:ring-brand-secondary focus:outline-none text-gray-200 text-sm";
  const thClasses = "py-2 px-2 text-left text-xs font-medium text-gray-400 uppercase tracking-wider";

  return (
    <div className="mt-6 p-4 border border-dark-border rounded-lg bg-gray-800/50">
      <form onSubmit={handleSubmit}>
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto">
            <thead>
              <tr>
                <th className={`${thClasses} w-2/5`}>Activity</th>
                <th className={thClasses}>Priority</th>
                <th className={thClasses}>Duration (min)</th>
                <th className={thClasses}>Planned Start</th>
                <th className={thClasses}>Planned End</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, index) => (
                <tr key={index} className="border-t border-dark-border">
                  <td className="p-1">
                    <input
                      type="text"
                      value={row.activity}
                      onChange={(e) => handleInputChange(index, 'activity', e.target.value)}
                      className={inputClasses}
                      placeholder={`Task ${index + 1}`}
                      aria-label={`Activity for task ${index + 1}`}
                    />
                  </td>
                  <td className="p-1">
                    <select
                      value={row.priority}
                      onChange={(e) => handleInputChange(index, 'priority', e.target.value as Priority)}
                      className={inputClasses}
                      aria-label={`Priority for task ${index + 1}`}
                    >
                      {Object.values(Priority).map(p => <option key={p} value={p}>{p}</option>)}
                    </select>
                  </td>
                  <td className="p-1">
                    <input
                      type="number"
                      value={row.duration}
                      onChange={(e) => handleInputChange(index, 'duration', e.target.value)}
                      className={inputClasses}
                      placeholder="e.g., 60"
                      min="1"
                      aria-label={`Duration for task ${index + 1}`}
                    />
                  </td>
                  <td className="p-1">
                    <input
                      type="datetime-local"
                      value={row.plannedStart}
                      onChange={(e) => handleInputChange(index, 'plannedStart', e.target.value)}
                      className={inputClasses}
                      aria-label={`Planned start time for task ${index + 1}`}
                    />
                  </td>
                  <td className="p-1">
                    <input
                      type="datetime-local"
                      value={row.plannedEnd}
                      onChange={(e) => handleInputChange(index, 'plannedEnd', e.target.value)}
                      className={inputClasses}
                      aria-label={`Planned end time for task ${index + 1}`}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-4 flex justify-end">
          <button
            type="submit"
            className="w-full sm:w-auto bg-brand-secondary hover:bg-blue-500 text-white font-bold py-2 px-6 rounded-md transition duration-300"
          >
            Add All Tasks
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddTaskForm;
