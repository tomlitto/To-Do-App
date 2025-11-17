import React, { useState, useEffect, useMemo } from 'react';
import { Todo, Status } from './types';
import Header from './components/Header';
import StatusDisplay from './components/StatusDisplay';
import TodoTable from './components/TodoTable';
import MotivationalQuote from './components/MotivationalQuote';
import PacificClock from './components/PacificClock';
import ActionsBar from './components/ActionsBar';
import { exportToExcel, importFromExcel } from './services/excelService';
import InspirationalImage from './components/InspirationalImage';
import CountdownTimer from './components/CountdownTimer';
import FocusMusic from './components/FocusMusic';
import { useTimer } from './hooks/useTimer';

const NUM_TODO_ROWS = 20;

const createInitialTodos = (): Todo[] => {
  const today = new Date();
  const dateString = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  return Array.from({ length: NUM_TODO_ROWS }, (_, i) => ({
    id: i + 1,
    date: dateString,
    activity: '',
    priority: '',
    done: false,
    plannedDuration: '',
    plannedStart: '',
    plannedEnd: '',
    actualStart: '',
    actualEnd: '',
    actualDuration: '',
    projectCategory: '',
  }));
};

const calculateDuration = (startTime: string, endTime: string): string => {
  if (!startTime || !endTime) {
    return '';
  }
  try {
    const [startHours, startMinutes] = startTime.split(':').map(Number);
    const [endHours, endMinutes] = endTime.split(':').map(Number);

    const startTotalMinutes = startHours * 60 + startMinutes;
    const endTotalMinutes = endHours * 60 + endMinutes;
    
    if (endTotalMinutes < startTotalMinutes) {
        return '0';
    }

    const durationInMinutes = endTotalMinutes - startTotalMinutes;
    return String(durationInMinutes);
  } catch (error) {
    console.error("Error calculating duration", error);
    return '';
  }
};

const getTodoStatus = (todo: Todo): Status => {
  if (todo.done) {
    return Status.Done;
  }
  if (todo.actualStart) {
    return Status.InProgress;
  }
  return Status.NotStarted;
};


const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>(createInitialTodos);
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [priorityFilter, setPriorityFilter] = useState<string>('All');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [sortConfig, setSortConfig] = useState<{ key: keyof Todo | null; direction: 'ascending' | 'descending' }>({
    key: null,
    direction: 'ascending',
  });


  const { timerString, startTimer, isActive, resetTimer } = useTimer(0);
  const [countdownMinutes, setCountdownMinutes] = useState('30');


  useEffect(() => {
    try {
      const storedTodos = localStorage.getItem('todos');
      const initial = createInitialTodos(); // 20 empty rows
      if (storedTodos) {
        const parsedTodos = JSON.parse(storedTodos);
        if (Array.isArray(parsedTodos)) {
          parsedTodos.forEach((todo, index) => {
            if (todo && typeof todo === 'object' && index < NUM_TODO_ROWS) {
              // Merge stored todo with an initial one and sanitize types to prevent crashes
              initial[index] = { 
                ...initial[index], 
                ...todo, 
                id: index + 1,
                activity: String(todo.activity || ''),
                priority: String(todo.priority || ''),
                projectCategory: String(todo.projectCategory || ''),
              };
            }
          });
        }
      }
      setTodos(initial);
    } catch (error) {
      console.error("Failed to load todos from local storage", error);
      setTodos(createInitialTodos());
    }
  }, []);


  useEffect(() => {
    try {
        if (todos.length > 0) {
            localStorage.setItem('todos', JSON.stringify(todos));
        }
    } catch (error) {
      console.error("Failed to save todos to local storage", error);
    }
  }, [todos]);

  const { plannedTotalHours, actualTotalHours } = useMemo(() => {
    let plannedMinutes = 0;
    let actualMinutes = 0;
    todos.forEach(todo => {
      plannedMinutes += Number(todo.plannedDuration) || 0;
      actualMinutes += Number(todo.actualDuration) || 0;
    });
    return {
      plannedTotalHours: plannedMinutes / 60,
      actualTotalHours: actualMinutes / 60,
    };
  }, [todos]);

  const displayedTodos = useMemo(() => {
    const filtered = todos.filter(todo => {
      const status = getTodoStatus(todo);
      let statusMatch = false;

      if (statusFilter === 'All') {
        statusMatch = true;
      } else if (statusFilter === 'Pending') {
        statusMatch = (status === Status.NotStarted || status === Status.InProgress);
      } else if (statusFilter === 'Completed') {
        statusMatch = status === Status.Done;
      } else { // This else handles the old enum values if they are ever passed
        statusMatch = status === statusFilter;
      }
      
      const priorityMatch = priorityFilter === 'All' || !todo.priority.trim() || todo.priority.trim().toLowerCase() === priorityFilter.trim().toLowerCase();
      const categoryMatch = categoryFilter === 'All' || !todo.projectCategory.trim() || todo.projectCategory.trim().toLowerCase() === categoryFilter.trim().toLowerCase();
      
      // We want to show rows that are either being filtered or are empty
      const isEmptyRow = !todo.activity && !todo.priority && !todo.plannedStart && !todo.actualStart && !todo.projectCategory;

      return (statusMatch && priorityMatch && categoryMatch) || isEmptyRow;
    });

    if (sortConfig.key) {
        filtered.sort((a, b) => {
            // Keep empty rows at the bottom
            const aIsEmpty = !a.activity.trim();
            const bIsEmpty = !b.activity.trim();
            if (aIsEmpty && !bIsEmpty) return 1;
            if (!aIsEmpty && bIsEmpty) return -1;
            if (aIsEmpty && bIsEmpty) return 0;
            
            const aValue = a[sortConfig.key!];
            const bValue = b[sortConfig.key!];
            
            let comparison = 0;
            // Handle numeric sort for duration
            if (sortConfig.key === 'plannedDuration') {
                const aNum = Number(aValue) || 0;
                const bNum = Number(bValue) || 0;
                if (aNum < bNum) comparison = -1;
                if (aNum > bNum) comparison = 1;
            } else { // Handle string/time sort for start time
                if (!aValue) return 1; // Put empty values at the bottom
                if (!bValue) return -1;
                if (aValue < bValue) comparison = -1;
                if (aValue > bValue) comparison = 1;
            }
            
            return sortConfig.direction === 'ascending' ? comparison : -comparison;
        });
    }
    
    return filtered;

  }, [todos, statusFilter, priorityFilter, categoryFilter, sortConfig]);

  const availablePriorities = useMemo(() => {
    const priorities = new Set(todos.map(t => t.priority.trim()).filter(p => p));
    return ['All', ...Array.from(priorities)];
  }, [todos]);

  const availableCategories = useMemo(() => {
    const categories = new Set(todos.map(t => t.projectCategory.trim()).filter(c => c));
    return ['All', ...Array.from(categories)];
  }, [todos]);


  const handleUpdateTodo = (id: number, field: keyof Todo, value: string | boolean) => {
    const newTodos = [...todos];
    const todoIndex = todos.findIndex(t => t.id === id);

    if (todoIndex === -1) return;

    const updatedTodo = { ...newTodos[todoIndex], [field as any]: value };

    if (field === 'plannedStart' || field === 'plannedEnd') {
      const duration = calculateDuration(updatedTodo.plannedStart, updatedTodo.plannedEnd);
      updatedTodo.plannedDuration = duration;
    }

    if (field === 'actualStart' || field === 'actualEnd') {
      const duration = calculateDuration(updatedTodo.actualStart, updatedTodo.actualEnd);
      updatedTodo.actualDuration = duration;
    }
    
    newTodos[todoIndex] = updatedTodo;
    setTodos(newTodos);
  };
  
  const handleSort = (key: keyof Todo) => {
    let newDirection: 'ascending' | 'descending' = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      newDirection = 'descending';
    }
    setSortConfig({ key, direction: newDirection });
  };

  const handleExport = () => {
    const nonEmptyTodos = todos.filter(todo => todo.activity && todo.activity.trim() !== '');
    if (nonEmptyTodos.length > 0) {
      exportToExcel(nonEmptyTodos, 'must_do_today.xlsx');
    } else {
      alert("There are no tasks to export.");
    }
  };

  const handleImport = async (file: File) => {
    try {
      const importedTodos = await importFromExcel(file);
      const newTodos = createInitialTodos(); // Start with a clean slate of 20 rows

      importedTodos.forEach((todo, index) => {
        if (index < NUM_TODO_ROWS) {
          // Merge imported data into the default structure
          newTodos[index] = { ...newTodos[index], ...todo, id: index + 1 };
        }
      });
      
      setTodos(newTodos);
      alert(`${importedTodos.length} tasks imported successfully!`);
    } catch (error) {
      console.error("Import failed:", error);
      alert(`Failed to import tasks: ${error instanceof Error ? error.message : String(error)}`);
    }
  };

  const handleStartFocusBlock = (duration: string) => {
    const minutes = parseInt(duration, 10);
    if (!isNaN(minutes) && minutes > 0) {
      setCountdownMinutes(duration);
      startTimer(minutes);
    }
  };


  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6 font-sans">
      <main className="grid grid-cols-1 lg:grid-cols-[300px_1fr_300px] gap-8">
        <aside className="hidden lg:block">
          <MotivationalQuote />
          <InspirationalImage />
        </aside>

        <div className="border border-gray-200 shadow-sm bg-white rounded-lg overflow-hidden">
          <Header plannedTotalHours={plannedTotalHours} actualTotalHours={actualTotalHours} />

          <div className="p-4 border-b border-gray-300 bg-gray-50">
            <ActionsBar
              onImport={handleImport}
              onExport={handleExport}
            />
          </div>

          <StatusDisplay todos={todos} />
          <TodoTable 
            todos={displayedTodos} 
            onUpdate={handleUpdateTodo} 
            categoryFilter={categoryFilter}
            onCategoryChange={setCategoryFilter}
            availableCategories={availableCategories}
            statusFilter={statusFilter}
            onStatusChange={setStatusFilter}
            priorityFilter={priorityFilter}
            onPriorityChange={setPriorityFilter}
            availablePriorities={availablePriorities}
            onStartFocusBlock={handleStartFocusBlock}
            onSort={handleSort}
            sortConfig={sortConfig}
          />
        </div>

        <aside className="hidden lg:block">
          <PacificClock />
          <CountdownTimer
            timerString={timerString}
            isActive={isActive}
            resetTimer={resetTimer}
            minutesInput={countdownMinutes}
            onMinutesInputChange={setCountdownMinutes}
            onStartTimer={startTimer}
          />
          <FocusMusic />
        </aside>
      </main>
    </div>
  );
};

export default App;