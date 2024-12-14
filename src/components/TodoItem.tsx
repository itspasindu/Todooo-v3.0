import React from 'react';
import { Check, Trash2 } from 'lucide-react';
import { Todo } from '../types/todo';

interface TodoItemProps {
  todo: Todo;
  onToggle: () => void;
  onDelete: () => void;
}

export function TodoItem({ todo, onToggle, onDelete }: TodoItemProps) {
  return (
    <div className="flex items-center gap-3 p-3 bg-white rounded-lg shadow-sm group">
      <button
        onClick={onToggle}
        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center
          ${
            todo.completed
              ? 'bg-green-500 border-green-500'
              : 'border-gray-300 hover:border-green-500'
          }`}
      >
        {todo.completed && <Check size={12} className="text-white" />}
      </button>
      <span
        className={`flex-1 ${
          todo.completed ? 'text-gray-400 line-through' : 'text-gray-700'
        }`}
      >
        {todo.title}
      </span>
      <button
        onClick={onDelete}
        className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 transition-opacity"
      >
        <Trash2 size={16} />
      </button>
    </div>
  );
}