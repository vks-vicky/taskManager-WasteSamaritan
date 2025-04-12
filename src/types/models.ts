export type TaskStatus = 'todo' | 'in-progress' | 'done';

export interface Task  {
    id: string;
    title: string;
    description?: string;
    status: TaskStatus;
    categoryId: string;
    tagIds: string[];
    dueDate: string; 
    createdAt: string;
}

export interface Category {
    id: string;
    name: string;
    color: string;
  }
  
export interface Tag {
    id: string;
    name: string;
    color: string;
  }