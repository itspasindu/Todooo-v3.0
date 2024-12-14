import React, { useState } from 'react';
import { TaskItem } from './TaskItem';
import { TaskForm } from './TaskForm';
import { CalendarView } from '../calendar/CalendarView';
import { NotificationCenter } from '../notifications/NotificationCenter';
import { Todo } from '../../types/todo';
import { Plus, Calendar, List as ListIcon } from 'lucide-react';

interface TaskListProps {
  tasks: Todo[];
  onToggleTask: (taskId: string) => void;
  onDeleteTask: (taskId: string) => void;
  onUpdateTask: (taskId: string, updates: Partial<Todo>) => void;
  onAddTask: (task: Partial<Todo>) => void;
  onToggleSubtask: (taskId: string, subtaskId: string) => void;
  onToggleEmailNotifications: (taskId: string) => void;
  onToggleBrowserNotifications: (taskId: string) => void;
}

export function TaskList({
  tasks,
  onToggleTask,
  onDeleteTask,
  onUpdateTask,
  onAddTask,
  onToggleSubtask,
  onToggleEmailNotifications,
  onToggleBrowserNotifications,
}: TaskListProps) {
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Todo | null>(null);
  const [view, setView] = useState<'list' | 'calendar'>('list');

  const handleAddTask = (taskData: Partial<Todo>) => {
    onAddTask(taskData);
    setShowForm(false);
  };

  const handleUpdateTask = (taskData: Partial<Todo>) => {
    if (editingTask) {
      onUpdateTask(editingTask.id, taskData);
      setEditingTask(null);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div className="md:col-span-3 space-y-4">
        <div className="flex justify-between items-center">
          <div className="flex gap-2">
            <button
              onClick={() => setView('list')}
              className={`p-2 rounded-lg ${
                view === 'list' ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <ListIcon size={20} />
            </button>
            <button
              onClick={() => setView('calendar')}
              className={`p-2 rounded-lg ${
                view === 'calendar' ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Calendar size={20} />
            </button>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Plus size={20} />
            <span>Add Task</span>
          </button>
        </div>

        {showForm && (
          <div className="bg-white p-4 rounded-lg shadow">
            <TaskForm
              onSubmit={handleAddTask}
              onCancel={() => setShowForm(false)}
            />
          </div>
        )}

        {editingTask && (
          <div className="bg-white p-4 rounded-lg shadow">
            <TaskForm
              initialValues={editingTask}
              onSubmit={handleUpdateTask}
              onCancel={() => setEditingTask(null)}
            />
          </div>
        )}

        {view === 'calendar' ? (
          <CalendarView
            tasks={tasks}
            onToggleTask={onToggleTask}
            onDeleteTask={onDeleteTask}
            onUpdateTask={onUpdateTask}
            onToggleSubtask={onToggleSubtask}
          />
        ) : (
          <div className="space-y-2">
            {tasks.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                onToggle={() => onToggleTask(task.id)}
                onDelete={() => onDeleteTask(task.id)}
                onEdit={() => setEditingTask(task)}
                onToggleSubtask={(subtaskId) => onToggleSubtask(task.id, subtaskId)}
              />
            ))}
          </div>
        )}
      </div>

      <div className="md:col-span-1">
        <NotificationCenter
          tasks={tasks}
          onToggleEmailNotifications={onToggleEmailNotifications}
          onToggleBrowserNotifications={onToggleBrowserNotifications}
        />
      </div>
    </div>
  );
}