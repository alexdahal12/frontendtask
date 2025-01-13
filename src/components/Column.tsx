import React, { useState } from 'react';
import { Droppable } from '@hello-pangea/dnd';
import { MoreVertical, Plus, Trash2, Edit2 } from 'lucide-react';
import TaskCard from './TaskCard';
import { Column as ColumnType, Task } from '../types/kanban';
import { useKanbanStore } from '../store/kanbanStore';
import clsx from 'clsx';

interface ColumnProps {
  column: ColumnType;
  tasks: Task[];
  index: number;
}

const Column: React.FC<ColumnProps> = ({ column, tasks }) => {
  const [showOptions, setShowOptions] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(column.title);
  const { addTask, deleteColumn, theme } = useKanbanStore();

  const handleAddTask = () => {
    addTask(column.id, {
      title: 'New Task',
      description: 'Add description here',
      labels: ['new'],
    });
  };

  const handleDeleteColumn = () => {
    deleteColumn(column.id);
    setShowOptions(true);
  };

  const handleTitleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTitle.trim()) {
      useKanbanStore.getState().updateTask(column.id, { title: newTitle.trim() });
      setIsEditing(false);
    }
  };

  return (
    <div className={clsx('p-4 rounded-lg w-80 flex-shrink-0', theme.colors.secondary)}>
      <div className="flex items-center justify-between mb-4">
        {isEditing ? (
          <form onSubmit={handleTitleSubmit} className="flex-1 mr-2">
            <input
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className={clsx(
                'w-full px-2 py-1 text-lg font-semibold border rounded',
                theme.colors.surface,
                theme.colors.border
              )}
              autoFocus
              onBlur={() => setIsEditing(false)}
            />
          </form>
        ) : (
          <h2 
            className="text-lg font-semibold cursor-pointer hover:text-opacity-80"
            onClick={() => setIsEditing(true)}
          >
            {column.title}
          </h2>
        )}
        <div className="flex items-center space-x-2 relative">
          <button
            onClick={handleAddTask}
            className={clsx('p-1 rounded-full transition-colors', theme.colors.hover)}
            aria-label="Add task"
          >
            <Plus size={20} />
          </button>
          <button
            onClick={() => setShowOptions(!showOptions)}
            className={clsx('p-1 rounded-full transition-colors', theme.colors.hover)}
            aria-label="Column options"
          >
            <MoreVertical size={20} />
          </button>
          {showOptions && (
            <div className={clsx(
              'absolute right-0 top-8 rounded-lg shadow-lg py-2 w-48 z-10',
              theme.colors.surface
            )}>
              <button
                onClick={() => setIsEditing(true)}
                className={clsx(
                  'w-full px-4 py-2 text-left flex items-center',
                  theme.colors.hover
                )}
              >
                <Edit2 size={16} className="mr-2" />
                Edit Title
              </button>
              <button
                onClick={handleDeleteColumn}
                className="w-full px-4 py-2 text-left text-red-600 hover:bg-red-50 flex items-center"
              >
                <Trash2 size={16} className="mr-2" />
                Delete Column
              </button>
            </div>
          )}
        </div>
      </div>
      <Droppable droppableId={column.id}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={clsx(
              'min-h-[200px] transition-colors',
              snapshot.isDraggingOver ? theme.colors.hover : ''
            )}
          >
            {tasks.map((task, index) => (
              <TaskCard key={task.id} task={task} index={index} />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
}

export default Column;