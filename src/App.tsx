import React, { useState } from 'react';
import { DragDropContext } from '@hello-pangea/dnd';
import { useKanbanStore } from './store/kanbanStore';
import Column from './components/Column';
import { Plus, Undo2, Redo2, Sun, Moon, Palette } from 'lucide-react';
import clsx from 'clsx';

function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [showNewColumnInput, setShowNewColumnInput] = useState(false);
  const [newColumnTitle, setNewColumnTitle] = useState('');
  const [showThemeMenu, setShowThemeMenu] = useState(false);
  const { columns, columnOrder, tasks, moveTask, undo, redo, addColumn, theme, setTheme } =
    useKanbanStore();

  const onDragEnd = (result: any) => {
    const { destination, source } = result;
    if (!destination) return;
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }
    moveTask(source, destination);
  };

  const handleAddColumn = (e: React.FormEvent) => {
    e.preventDefault();
    if (newColumnTitle.trim()) {
      addColumn(newColumnTitle.trim());
      setNewColumnTitle('');
      setShowNewColumnInput(false);
    }
  };

  const filteredTasks = (columnId: string) => {
    const column = columns[columnId];
    return column.taskIds
      .map((taskId) => tasks[taskId])
      .filter(
        (task) =>
          task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          task.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
  };

  return (
    <div className={clsx('min-h-screen', theme.colors.background, theme.colors.text)}>
      <header className={clsx('shadow-sm', theme.colors.surface)}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">Kanban Board</h1>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search tasks..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={clsx(
                    'w-64 px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
                    theme.colors.surface,
                    theme.colors.border
                  )}
                />
              </div>
              <button
                onClick={undo}
                className={clsx(
                  'p-2 rounded-full transition-colors',
                  theme.colors.hover
                )}
                aria-label="Undo"
              >
                <Undo2 size={20} />
              </button>
              <button
                onClick={redo}
                className={clsx(
                  'p-2 rounded-full transition-colors',
                  theme.colors.hover
                )}
                aria-label="Redo"
              >
                <Redo2 size={20} />
              </button>
              <div className="relative">
                <button
                  onClick={() => setShowThemeMenu(!showThemeMenu)}
                  className={clsx(
                    'p-2 rounded-full transition-colors',
                    theme.colors.hover
                  )}
                  aria-label="Theme"
                >
                  <Palette size={20} />
                </button>
                {showThemeMenu && (
                  <div className={clsx(
                    'absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 z-10',
                    theme.colors.surface,
                    theme.colors.border
                  )}>
                    <button
                      onClick={() => {
                        setTheme('light');
                        setShowThemeMenu(false);
                      }}
                      className={clsx(
                        'flex items-center px-4 py-2 text-sm w-full',
                        theme.colors.hover
                      )}
                    >
                      <Sun size={16} className="mr-2" />
                      Light Theme
                    </button>
                    <button
                      onClick={() => {
                        setTheme('dark');
                        setShowThemeMenu(false);
                      }}
                      className={clsx(
                        'flex items-center px-4 py-2 text-sm w-full',
                        theme.colors.hover
                      )}
                    >
                      <Moon size={16} className="mr-2" />
                      Dark Theme
                    </button>
                    <button
                      onClick={() => {
                        setTheme('purple');
                        setShowThemeMenu(false);
                      }}
                      className={clsx(
                        'flex items-center px-4 py-2 text-sm w-full',
                        theme.colors.hover
                      )}
                    >
                      <Palette size={16} className="mr-2" />
                      Purple Theme
                    </button>
                  </div>
                )}
              </div>
              {showNewColumnInput ? (
                <form onSubmit={handleAddColumn} className="flex items-center">
                  <input
                    type="text"
                    value={newColumnTitle}
                    onChange={(e) => setNewColumnTitle(e.target.value)}
                    placeholder="Column title"
                    className={clsx(
                      'px-3 py-2 border rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500',
                      theme.colors.surface,
                      theme.colors.border
                    )}
                    autoFocus
                  />
                  <button
                    type="submit"
                    className={clsx(
                      'px-4 py-2 text-white rounded-r-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500',
                      theme.colors.primary
                    )}
                  >
                    Add
                  </button>
                </form>
              ) : (
                <button
                  onClick={() => setShowNewColumnInput(true)}
                  className={clsx(
                    'inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white',
                    theme.colors.primary
                  )}
                >
                  <Plus size={20} className="mr-2" />
                  Add Column
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="flex space-x-6 overflow-x-auto pb-4">
            {columnOrder.map((columnId, index) => {
              const column = columns[columnId];
              const columnTasks = filteredTasks(columnId);
              return (
                <Column
                  key={column.id}
                  column={column}
                  tasks={columnTasks}
                  index={index}
                />
              );
            })}
          </div>
        </DragDropContext>
      </main>
    </div>
  );
}

export default App;