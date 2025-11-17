
// Fix: Add and export Priority and Status enums
export enum Priority {
  P1 = 'P1',
  P2 = 'P2',
  P3 = 'P3',
  P4 = 'P4',
  P5 = 'P5',
  P6 = 'P6',
}

export enum Status {
  NotStarted = 'Not Started',
  InProgress = 'In Progress',
  Done = 'Done',
}


export interface Todo {
  id: number;
  date: string;
  activity: string;
  priority: string;
  done: boolean;
  plannedDuration: string;
  plannedStart: string;
  plannedEnd: string;
  actualStart: string;
  actualEnd: string;
  actualDuration: string;
  projectCategory: string;
}