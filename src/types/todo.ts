export type Priority = 'low' | 'medium' | 'high';

export interface Todo {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
  priority: Priority;
  dueDate?: Date;
  category?: string;
  recurring?: {
    type: 'daily' | 'weekly' | 'monthly' | 'custom';
    interval?: number;
  };
  subtasks?: {
    id: string;
    title: string;
    completed: boolean;
  }[];
  notifications?: {
    email?: boolean;
    browser?: boolean;
  };
  user_id: string;
}

export interface TodoList {
  id: string;
  name: string;
  color?: string;
  user_id: string;
}