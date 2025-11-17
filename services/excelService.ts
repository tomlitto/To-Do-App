import { Todo, Status } from '../types';

declare const XLSX: any;

// This function is also present in App.tsx. It's duplicated here to make this service self-contained.
const calculateDuration = (startTime: string, endTime: string): string => {
  if (!startTime || !endTime) return '';
  try {
    const [startHours, startMinutes] = startTime.split(':').map(Number);
    const [endHours, endMinutes] = endTime.split(':').map(Number);
    const startTotalMinutes = startHours * 60 + startMinutes;
    const endTotalMinutes = endHours * 60 + endMinutes;
    if (endTotalMinutes < startTotalMinutes) return '0';
    return String(endTotalMinutes - startTotalMinutes);
  } catch (error) {
    console.error("Error calculating duration", error);
    return '';
  }
};

const getTodoStatus = (todo: Todo): Status => {
    if (todo.done) return Status.Done;
    if (todo.actualStart) return Status.InProgress;
    return Status.NotStarted;
};

export const exportToExcel = (data: Todo[], fileName: string): void => {
  const worksheetData = data.map(todo => ({
    'ID': todo.id,
    'Date': todo.date,
    'Activity': todo.activity,
    'Priority': todo.priority,
    'Status': getTodoStatus(todo),
    'Planned Duration (min)': todo.plannedDuration,
    'Planned Start': todo.plannedStart,
    'Planned End': todo.plannedEnd,
    'Actual Start': todo.actualStart,
    'Actual End': todo.actualEnd,
    'Actual Duration (min)': todo.actualDuration,
    'Project Category': todo.projectCategory,
  }));

  const worksheet = XLSX.utils.json_to_sheet(worksheetData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Todos');
  
  // Set column widths
  worksheet['!cols'] = [
    { wch: 5 }, { wch: 12 }, { wch: 40 }, { wch: 10 }, { wch: 15 }, 
    { wch: 20 }, { wch: 15 }, { wch: 15 }, { wch: 15 }, { wch: 15 },
    { wch: 20 }, { wch: 30 }
  ];

  XLSX.writeFile(workbook, fileName);
};

export const importFromExcel = (file: File): Promise<Todo[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = event.target?.result;
        const workbook = XLSX.read(data, { type: 'binary', cellDates: true });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData: any[] = XLSX.utils.sheet_to_json(worksheet);

        const formatDateValue = (value: any): string => {
            if (!value) return '';
            if (value instanceof Date) {
                const year = value.getFullYear();
                const month = String(value.getMonth() + 1).padStart(2, '0');
                const day = String(value.getDate()).padStart(2, '0');
                return `${year}-${month}-${day}`;
            }
            return String(value).trim();
        };

        const formatTimeValue = (value: any): string => {
            if (!value) return '';
            if (value instanceof Date) {
                return `${String(value.getHours()).padStart(2, '0')}:${String(value.getMinutes()).padStart(2, '0')}`;
            }
            return String(value).trim();
        };
        
        const today = new Date();
        const todayString = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

        const todos: Todo[] = jsonData.map((row, index) => {
          if (!row['Activity']) {
            if (Object.keys(row).length === 0) return null;
            throw new Error(`Row ${index + 2} is missing the required 'Activity' field.`);
          }

          const status = (row['Status'] as Status) || Status.NotStarted;
          const plannedStart = formatTimeValue(row['Planned Start']);
          const plannedEnd = formatTimeValue(row['Planned End']);
          const actualStart = formatTimeValue(row['Actual Start']);
          const actualEnd = formatTimeValue(row['Actual End']);
          const date = formatDateValue(row['Date']);

          return {
            id: row['ID'] || index + 1,
            date: date || todayString,
            activity: String(row['Activity'] || ''),
            priority: String(row['Priority'] || ''),
            done: status === Status.Done,
            plannedDuration: calculateDuration(plannedStart, plannedEnd),
            plannedStart,
            plannedEnd,
            actualStart,
            actualEnd,
            actualDuration: calculateDuration(actualStart, actualEnd),
            projectCategory: String(row['Project Category'] || ''),
          };
        }).filter(Boolean) as Todo[];

        resolve(todos);
      } catch (error) {
        console.error("Error parsing Excel file: ", error);
        reject(error);
      }
    };

    reader.onerror = (error) => {
      reject(error);
    };

    reader.readAsBinaryString(file);
  });
};