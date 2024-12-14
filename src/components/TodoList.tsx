import React from 'react';
import { TodoItem } from './TodoItem';
import { Todo } from '../types/todo';

interface TodoListProps {
  todos: Todo[];
  onToggleTodo: (id: string) => void;
  onDeleteTodo: (id: string) => void;
}

export function TodoList({ todos = [], onToggleTodo, onDeleteTodo }: TodoListProps) {
  if (!todos) return null;

  return (
    <div className="space-y-2">
      {todos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onToggle={() => onToggleTodo(todo.id)}
          onDelete={() => onDeleteTodo(todo.id)}
        />
      ))}
      {todos.length === 0 && (
        <p className="text-center text-gray-500 py-4">No todos yet. Add one above!</p>
      )}
    </div>
  );
}