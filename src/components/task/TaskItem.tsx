import React, { useState } from 'react';
import { CheckCircle, Circle, Clock, Tag, Trash2, Edit2, ChevronDown, ChevronUp } from 'lucide-react';
import { Todo } from '../../types/todo';
import { format } from 'date-fns';

interface TaskItemProps {
  task: Todo;
  onToggle: () => void;
  onDelete: () => void;
  onEdit: (task: Todo) => void;
  onToggleSubtask: (subtaskId: string) => void;
}

export function TaskItem({ task, onToggle, onDelete, onEdit, onToggleSubtask }: TaskItemProps) {
  const [expanded, setExpanded] = useState(false);

  const priorityColors = {
    low: 'bg-green-100 text-green-800',
    medium: 'bg-yellow-100 text-yellow-800',
    high: 'bg-red-100 text-red-800',
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
      <div className="p-4">
        <div className="flex items-start gap-3">
          <button
            onClick={onToggle}
            className="mt-1 text-gray-400 hover:text-blue-500"
          >
            {task.completed ? (
              <CheckCircle className="text-green-500" />
            ) : (
              <Circle />
            )}
          </button>

          <div className="flex-1">
            <div className="flex items-start justify-between">
              <div>
                <h3 className={`font-medium ${task.completed ? 'text-gray-400 line-through' : 'text-gray-900'}`}>
                  {task.title}
                </h3>
                {task.description && (
                  <p className="mt-1 text-sm text-gray-600">{task.description}</p>
                )}
              </div>

              <div className="flex items-center gap-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${priorityColors[task.priority]}`}>
                  {task.priority}
                </span>
                <button
                  onClick={() => onEdit(task)}
                  className="text-gray-400 hover:text-blue-500"
                >
                  <Edit2 size={16} />
                </button>
                <button
                  onClick={onDelete}
                  className="text-gray-400 hover:text-red-500"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>

            <div className="mt-2 flex flex-wrap gap-2 text-sm text-gray-500">
              {task.dueDate && (
                <div className="flex items-center gap-1">
                  <Clock size={14} />
                  <span>{format(new Date(task.dueDate), 'MMM d, yyyy h:mm a')}</span>
                </div>
              )}
              {task.category && (
                <div className="flex items-center gap-1">
                  <Tag size={14} />
                  <span>{task.category}</span>
                </div>
              )}
            </div>

            {task.subtasks && task.subtasks.length > 0 && (
              <button
                onClick={() => setExpanded(!expanded)}
                className="mt-2 flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700"
              >
                {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                <span>{task.subtasks.length} subtasks</span>
              </button>
            )}
          </div>
        </div>

        {expanded && task.subtasks && (
          <div className="mt-3 pl-8 space-y-2">
            {task.subtasks.map((subtask) => (
              <div key={subtask.id} className="flex items-center gap-2">
                <button
                  onClick={() => onToggleSubtask(subtask.id)}
                  className="text-gray-400 hover:text-blue-500"
                >
                  {subtask.completed ? (
                    <CheckCircle className="text-green-500" size={16} />
                  ) : (
                    <Circle size={16} />
                  )}
                </button>
                <span className={subtask.completed ? 'text-gray-400 line-through' : 'text-gray-700'}>
                  {subtask.title}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}