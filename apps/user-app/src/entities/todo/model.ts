// Todo entity model

export enum TodoStatus {
  TODO = 'todo',
  DOING = 'doing',
  DONE = 'done',
}

export enum TodoPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
}

export interface Todo {
  id: string;
  title: string;
  status: TodoStatus;
  dueDate: string | null;
  priority: TodoPriority | null;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

