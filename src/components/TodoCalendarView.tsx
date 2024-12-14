import React from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns';
import { Todo } from '../types/todo';

interface TodoCalendarViewProps {
  todos: Todo[];
  onSelectDate: (date: Date) => void;
}

export function TodoCalendarView({ todos, onSelectDate }: TodoCalendarViewProps) {
  const today = new Date();
  const monthStart = startOfMonth(today);
  const monthEnd = endOfMonth(today);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const getTodosForDate = (date: Date) => {
    return todos.filter(
      (todo) =>
        todo.dueDate && format(new Date(todo.dueDate), 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
    );
  };

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">
          {format(today, 'MMMM yyyy')}
        </h2>
      </div>
      <div className="grid grid-cols-7 gap-px bg-gray-200">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <div
            key={day}
            className="bg-gray-50 p-2 text-center text-sm font-medium text-gray-500"
          >
            {day}
          </div>
        ))}
        {days.map((date) => {
          const dayTodos = getTodosForDate(date);
          return (
            <button
              key={date.toISOString()}
              onClick={() => onSelectDate(date)}
              className={`bg-white p-2 h-24 overflow-hidden hover:bg-gray-50 ${
                format(date, 'yyyy-MM-dd') === format(today, 'yyyy-MM-dd')
                  ? 'bg-blue-50'
                  : ''
              }`}
            >
              <div className="font-medium text-sm text-gray-900">
                {format(date, 'd')}
              </div>
              <div className="mt-1">
                {dayTodos.slice(0, 2).map((todo) => (
                  <div
                    key={todo.id}
                    className="text-xs truncate text-gray-500"
                  >
                    {todo.title}
                  </div>
                ))}
                {dayTodos.length > 2 && (
                  <div className="text-xs text-gray-400">
                    +{dayTodos.length - 2} more
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}