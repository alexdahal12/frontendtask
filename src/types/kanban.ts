export interface Task {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  labels: string[];
}

export interface Column {
  id: string;
  title: string;
  taskIds: string[];
}

export interface Theme {
  name: string;
  colors: {
    background: string;
    surface: string;
    primary: string;
    secondary: string;
    text: string;
    border: string;
    hover: string;
  };
}

export interface KanbanState {
  tasks: Record<string, Task>;
  columns: Record<string, Column>;
  columnOrder: string[];
  taskOrder: string[];
  theme: Theme;
  history: {
    past: KanbanData[];
    future: KanbanData[];
  };
}

export interface KanbanData {
  tasks: Record<string, Task>;
  columns: Record<string, Column>;
  columnOrder: string[];
  taskOrder: string[];
  theme: Theme;
}