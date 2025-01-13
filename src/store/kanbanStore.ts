import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { KanbanState, Task, Column, Theme } from '../types/kanban';

const themes: Record<string, Theme> = {
  light: {
    name: 'light',
    colors: {
      background: 'bg-gray-50',
      surface: 'bg-white',
      primary: 'bg-blue-600',
      secondary: 'bg-gray-100',
      text: 'text-gray-900',
      border: 'border-gray-200',
      hover: 'hover:bg-gray-100',
    },
  },
  dark: {
    name: 'dark',
    colors: {
      background: 'bg-gray-900',
      surface: 'bg-gray-800',
      primary: 'bg-blue-500',
      secondary: 'bg-gray-700',
      text: 'text-white',
      border: 'border-gray-700',
      hover: 'hover:bg-gray-700',
    },
  },
  purple: {
    name: 'purple',
    colors: {
      background: 'bg-purple-50',
      surface: 'bg-white',
      primary: 'bg-purple-600',
      secondary: 'bg-purple-100',
      text: 'text-gray-900',
      border: 'border-purple-200',
      hover: 'hover:bg-purple-100',
    },
  },
};

const initialState: KanbanState = {
  tasks: {
  },
  columns: {
    'column-1': {
      id: 'column-1',
      title: 'To Do',
      taskIds: [],
    },
    'column-2': {
      id: 'column-2',
      title: 'In Progress',
      taskIds: [],
    },
    'column-3': {
      id: 'column-3',
      title: 'Done',
      taskIds: [],
    },
  },
  columnOrder: ['column-1', 'column-2', 'column-3'],
  taskOrder: [],
  theme: themes.light,
  history: {
    past: [],
    future: [],
  },
};

export const useKanbanStore = create(
  persist<KanbanState & {
    addTask: (columnId: string, task: Omit<Task, 'id' | 'createdAt'>) => void;
    moveTask: (source: any, destination: any) => void;
    addColumn: (title: string) => void;
    deleteColumn: (columnId: string) => void;
    deleteTask: (taskId: string) => void;
    updateTask: (taskId: string, updates: Partial<Task>) => void;
    setTheme: (themeName: string) => void;
    undo: () => void;
    redo: () => void;
  }>(
    (set, get) => ({
      ...initialState,

      setTheme: (themeName) => {
        set((state) => ({
          ...state,
          theme: themes[themeName] || themes.light,
        }));
      },

      // ... rest of the store methods remain the same
      addTask: (columnId, task) => {
        const taskId = `task-${Date.now()}`;
        set((state) => {
          const newState = {
            tasks: {
              ...state.tasks,
              [taskId]: {
                ...task,
                id: taskId,
                createdAt: new Date().toISOString(),
              },
            },
            columns: {
              ...state.columns,
              [columnId]: {
                ...state.columns[columnId],
                taskIds: [...state.columns[columnId].taskIds, taskId],
              },
            },
          };
          return {
            ...newState,
            history: {
              past: [...state.history.past, { ...state }],
              future: [],
            },
          };
        });
      },

      moveTask: (source, destination) => {
        set((state) => {
          const { columns } = state;
          const start = columns[source.droppableId];
          const finish = columns[destination.droppableId];

          if (start === finish) {
            const newTaskIds = Array.from(start.taskIds);
            newTaskIds.splice(source.index, 1);
            newTaskIds.splice(destination.index, 0, start.taskIds[source.index]);

            const newColumn = {
              ...start,
              taskIds: newTaskIds,
            };

            return {
              ...state,
              columns: {
                ...state.columns,
                [newColumn.id]: newColumn,
              },
              history: {
                past: [...state.history.past, { ...state }],
                future: [],
              },
            };
          }

          const startTaskIds = Array.from(start.taskIds);
          startTaskIds.splice(source.index, 1);
          const newStart = {
            ...start,
            taskIds: startTaskIds,
          };

          const finishTaskIds = Array.from(finish.taskIds);
          finishTaskIds.splice(
            destination.index,
            0,
            start.taskIds[source.index]
          );
          const newFinish = {
            ...finish,
            taskIds: finishTaskIds,
          };

          return {
            ...state,
            columns: {
              ...state.columns,
              [newStart.id]: newStart,
              [newFinish.id]: newFinish,
            },
            history: {
              past: [...state.history.past, { ...state }],
              future: [],
            },
          };
        });
      },

      addColumn: (title) => {
        const columnId = `column-${Date.now()}`;
        set((state) => ({
          ...state,
          columns: {
            ...state.columns,
            [columnId]: {
              id: columnId,
              title,
              taskIds: [],
            },
          },
          columnOrder: [...state.columnOrder, columnId],
          history: {
            past: [...state.history.past, { ...state }],
            future: [],
          },
        }));
      },

      deleteColumn: (columnId) => {
        set((state) => {
          const { [columnId]: deletedColumn, ...remainingColumns } =
            state.columns;
          return {
            ...state,
            columns: remainingColumns,
            columnOrder: state.columnOrder.filter((id) => id !== columnId),
            history: {
              past: [...state.history.past, { ...state }],
              future: [],
            },
          };
        });
      },
      deleteTask: (taskId) => {
        set((state) => {
          const { [taskId]: deletedTask, ...remainingTasks } =
            state.tasks;
          return {
            ...state,
            tasks: remainingTasks,
            taskOrder: state.taskOrder.filter((id) => id !== taskId),
            history: {
              past: [...state.history.past, { ...state }],
              future: [],
            },
          };
        });
      },

      updateTask: (taskId, updates) => {
        set((state) => ({
          ...state,
          tasks: {
            ...state.tasks,
            [taskId]: { ...state.tasks[taskId], ...updates },
          },
          history: {
            past: [...state.history.past, { ...state }],
            future: [],
          },
        }));
      },

     
      undo: () => {
        set((state) => {
          const previous = state.history.past[state.history.past.length - 1];
          if (!previous) return state;

          const newPast = state.history.past.slice(0, -1);
          return {
            ...previous,
            history: {
              past: newPast,
              future: [{ ...state }, ...state.history.future],
            },
          };
        });
      },

      redo: () => {
        set((state) => {
          const next = state.history.future[0];
          if (!next) return state;

          const newFuture = state.history.future.slice(1);
          return {
            ...next,
            history: {
              past: [...state.history.past, { ...state }],
              future: newFuture,
            },
          };
        });
      },
    }),
    {
      name: 'kanban-storage',
    }
  )
);