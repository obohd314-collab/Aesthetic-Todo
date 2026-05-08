export type Priority = 'low' | 'medium' | 'high';
export type Section = 'inbox' | 'today' | 'upcoming' | 'someday';

export interface SubTask {
  id: string;
  title: string;
  completed: boolean;
}

export interface Task {
  id: string;
  title: string;
  note?: string;
  dueDate?: string;
  priority: Priority;
  category: string;
  completed: boolean;
  section: Section;
  subtasks: SubTask[];
  createdAt: string;
  recurring?: 'daily' | 'weekly' | 'monthly' | 'none';
  order: number;
}

export interface Theme {
  id: string;
  name: string;
  bg: string;
  card: string;
  accent: string;
  text: string;
  muted: string;
  border: string;
}

export interface Stats {
  completedToday: number;
  totalCompleted: number;
  productivityScore: number;
  streak: number;
}
