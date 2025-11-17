import React, { useState } from 'react';
import { Todo, Status, Priority } from '../types';
import { PlayIcon, CheckIcon, TrashIcon, PencilIcon, XCircleIcon } from './icons';

interface TodoItemProps {
  todo: Todo;
  onUpdate: (todo: Todo) => void;
  onDelete: (id: string) => void;
}

const priorityColorMap: Record<Priority, string> = {
  [Priority.P1]: 'bg-red-500 border-red-400',
  [Priority.P2]: 'bg-orange-500 border-orange-400',
  [Priority.P3]: 'bg-yellow-500 border-yellow-400',
  [Priority.P4]: 'bg-blue-500 border-blue-400',
  [Priority.P5]: 'bg-indigo-500 border-indigo-400',
  [Priority.P6]: 'bg-purple-500 border-purple-400',
};

const statusColorMap: Record<Status, string> = {
    [Status.NotStarted]: 'bg-gray-500',
    [Status.InProgress]: 'bg-blue-500',
    [Status.Done]: 'bg-green-600',
}

// Helper to format ISO string for datetime-local input
const toDateTimeLocal = (isoString?: string): string => {
  if (!isoString) return '';
  const date = new Date(isoString);
  // Correct for timezone offset to display local time in the input
  const timezoneOffset = date.getTimezoneOffset() * 60000;
  const localISOTime = new Date(date.getTime() - timezoneOffset).toISOString().slice(0, 16);
  return localISOTime;
};

const TodoItem: React.FC<TodoItemProps> = ({ todo, onUpdate, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editableTodo, setEditableTodo] = useState<Todo>(todo);
  
  const handleStart = () => {
    onUpdate({
      ...todo,
      status: Status.InProgress,
      actualStart: new Date().toISOString(),
    });
  };

  const handleDone = () => {
    onUpdate({
      ...todo,
      status: Status.Done,
      actualEnd: new Date().toISOString(),
    });
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString([], { year: '2-digit', month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  const handleEdit = () => {
    setEditableTodo(todo);
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };
  
  const handleSave = () => {
    if (!editableTodo.activity.trim() || !editableTodo.duration || !editableTodo.plannedStart || !editableTodo.plannedEnd) {
        alert("Please fill out all fields.");
        return;
    }
    onUpdate({
        ...editableTodo,
        activity: editableTodo.activity.trim(),
        plannedStart: new Date(editableTodo.plannedStart).toISOString(),
        plannedEnd: new Date(editableTodo.plannedEnd).toISOString(),
    });
    setIsEditing(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEditableTodo(prev => ({
      ...prev,
      [name]: name === 'duration' ? Number(value) : value,
    }));
  };

  if (isEditing) {
    return (
      <tr className="bg-dark-card/50 ring-1 ring-brand-secondary">
        {/* Activity & Priority */}
        <td className="w-full max-w-0 py-4 pl-4 pr-3 text-sm font-medium text-white sm:w-auto sm:max-w-none sm:pl-6">
            <div className="flex items-center gap-x-3">
                <select name="priority" value={editableTodo.priority} onChange={handleChange} className="bg-dark-bg border border-dark-border rounded-md p-2 focus:ring-2 focus:ring-brand-secondary focus:outline-none">
                    {Object.values(Priority).map(p => <option key={p} value={p}>{p}</option>)}
                </select>
                <input type="text" name="activity" value={editableTodo.activity} onChange={handleChange} className="w-full bg-dark-bg border border-dark-border rounded-md p-2 focus:ring-2 focus:ring-brand-secondary focus:outline-none" />
            </div>
        </td>
        {/* Status */}
        <td className="px-3 py-4 text-sm text-gray-400">
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColorMap[todo.status]} text-white`}>
                {todo.status}
            </span>
        </td>
        {/* Duration */}
        <td className="px-3 py-4 text-sm text-gray-400">
            <input type="number" name="duration" value={editableTodo.duration} onChange={handleChange} min="1" className="w-24 bg-dark-bg border border-dark-border rounded-md p-2 focus:ring-2 focus:ring-brand-secondary focus:outline-none" />
        </td>
        {/* Timestamps */}
        <td className="px-3 py-4 text-sm text-gray-400">
            <div className="flex flex-col gap-2">
                <input placeholder="Planned Start" aria-label="Planned Start" type="datetime-local" name="plannedStart" value={toDateTimeLocal(editableTodo.plannedStart)} onChange={handleChange} className="w-full bg-dark-bg border border-dark-border rounded-md p-2 text-sm focus:ring-2 focus:ring-brand-secondary focus:outline-none" />
                <input placeholder="Planned End" aria-label="Planned End" type="datetime-local" name="plannedEnd" value={toDateTimeLocal(editableTodo.plannedEnd)} onChange={handleChange} className="w-full bg-dark-bg border border-dark-border rounded-md p-2 text-sm focus:ring-2 focus:ring-brand-secondary focus:outline-none" />
            </div>
        </td>
        {/* Actions */}
        <td className="py-4 pl-3 pr-4 text-center text-sm font-medium sm:pr-6">
            <div className="flex justify-center items-center space-x-2">
                <button onClick={handleSave} className="text-green-400 hover:text-green-300" title="Save">
                    <CheckIcon className="h-5 w-5"/>
                </button>
                <button onClick={handleCancel} className="text-gray-400 hover:text-gray-300" title="Cancel">
                    <XCircleIcon className="h-5 w-5"/>
                </button>
            </div>
        </td>
      </tr>
    );
  }

  return (
    <tr>
      <td className="w-full max-w-0 py-4 pl-4 pr-3 text-sm font-medium text-white sm:w-auto sm:max-w-none sm:pl-6">
        <div className="flex items-center">
          <div className={`h-2.5 w-2.5 rounded-full ${priorityColorMap[todo.priority]} mr-3 border`}></div>
          <div>
            {todo.activity}
            <dl className="font-normal lg:hidden">
              <dt className="sr-only">Priority</dt>
              <dd className="mt-1 text-gray-500">Priority: {todo.priority}</dd>
            </dl>
          </div>
        </div>
      </td>
       <td className="px-3 py-4 text-sm text-gray-400">
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColorMap[todo.status]} text-white`}>
            {todo.status}
        </span>
      </td>
      <td className="px-3 py-4 text-sm text-gray-400">
        <div className="flex flex-col">
            <span>{todo.duration} min</span>
            <span className="text-xs text-gray-500">(Planned)</span>
        </div>
      </td>
      <td className="px-3 py-4 text-sm text-gray-400">
        <div className="grid grid-cols-2 gap-x-4 gap-y-1">
            <span className="text-xs font-semibold text-gray-300">Planned:</span><span className="text-xs">{formatDate(todo.plannedStart)} - {formatDate(todo.plannedEnd)}</span>
            <span className="text-xs font-semibold text-gray-300">Actual:</span><span className="text-xs">{formatDate(todo.actualStart)} - {formatDate(todo.actualEnd)}</span>
        </div>
      </td>
      <td className="py-4 pl-3 pr-4 text-center text-sm font-medium sm:pr-6">
        <div className="flex justify-center items-center space-x-2">
          {todo.status !== Status.Done && (
              <button onClick={handleEdit} className="text-yellow-400 hover:text-yellow-300 transition-colors" title="Edit Task">
                  <PencilIcon className="h-5 w-5"/>
              </button>
          )}
          {todo.status === Status.NotStarted && (
            <button onClick={handleStart} className="text-green-400 hover:text-green-300 transition-colors" title="Start Task">
              <PlayIcon className="h-5 w-5"/>
            </button>
          )}
          {todo.status === Status.InProgress && (
            <button onClick={handleDone} className="text-blue-400 hover:text-blue-300 transition-colors" title="Mark as Done">
              <CheckIcon className="h-5 w-5"/>
            </button>
          )}
          <button onClick={() => onDelete(todo.id)} className="text-red-500 hover:text-red-400 transition-colors" title="Delete Task">
             <TrashIcon className="h-5 w-5"/>
          </button>
        </div>
      </td>
    </tr>
  );
};

export default TodoItem;