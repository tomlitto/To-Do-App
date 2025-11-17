
import React from 'react';
import { Todo } from '../types';

interface StatusDisplayProps {
  todos: Todo[];
}

const StatusDisplay: React.FC<StatusDisplayProps> = ({ todos }) => {
  const relevantTodos = todos.filter(t => t.activity && t.activity.trim() !== '');
  const totalTasks = relevantTodos.length;
  const completedTasks = relevantTodos.filter(t => t.done).length;
  const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <div className="p-4 border-b border-gray-300">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-lg font-semibold text-brand-primary">Status</h2>
        <span className="text-2xl font-bold text-brand-primary">{progress}%</span>
      </div>

      <div className="w-full border border-brand-primary h-7 relative">
        <div 
          className="bg-brand-primary h-full transition-all duration-500" 
          style={{ width: `${progress}%` }}
        ></div>
        <div className="absolute top-0 left-0 w-full h-full flex">
          {[...Array(10)].map((_, i) => (
            <div 
              key={i} 
              className="flex-1 border-r border-dotted border-brand-primary last:border-r-0"
            ></div>
          ))}
        </div>
      </div>

      <div className="flex justify-between text-sm text-brand-primary mt-1">
        {[...Array(11)].map((_, i) => (
          <span key={i}>{i * 10}%</span>
        ))}
      </div>

      <div className="text-right text-xs text-gray-500 mt-2">Priority 1 is high, Priority 5 is low</div>
    </div>
  );
};

export default StatusDisplay;