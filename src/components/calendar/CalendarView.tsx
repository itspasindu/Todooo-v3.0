import React from 'react';
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isToday,
  isSameDay,
  parseISO,
} from 'date-fns';
import { Todo } from '../../types/todo';
import { TaskItem } from '../task/TaskItem';

interface CalendarViewProps {
  tasks: Todo[];
  onToggleTask: (taskId: string) => void;
  onDeleteTask: (taskId: string) => void;
  onUpdateTask: (taskId: string, updates: Partial<Todo>) => void;
  onToggleSubtask: (taskId: string, subtaskId: string) => void;
}

export function CalendarView({
  tasks,
  onToggleTask,
  onDeleteTask,
  onUpdateTask,
  onToggleSubtask,
}: CalendarViewProps) {
  const [currentDate, setCurrentDate] = React.useState(new Date());
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const getTasksForDate = (date: Date) => {
    return tasks.filter((task) => 
      task.dueDate && isSameDay(task.dueDate, date)
    );
  };

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-4 flex items-center justify-between border-b">
        <h2 className="text-lg font-semibold text-gray-900">
          {format(currentDate, 'MMMM yyyy')}
        </h2>
        <div className="flex gap-2">
          <button
            onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() - 1)))}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
          >
            Previous
          </button>
          <button
            onClick={() => setCurrentDate(new Date())}
            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
          >
            Today
          </button>
          <button
            onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() + 1)))}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
          >
            Next
          </button>
        </div>
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
          const dayTasks = getTasksForDate(date);
          return (
            <div
              key={date.toISOString()}
              className={`bg-white p-2 min-h-[120px] ${
                !isSameMonth(date, currentDate)
                  ? 'bg-gray-50 text-gray-400'
                  : ''
              } ${isToday(date) ? 'bg-blue-50' : ''}`}
            >
              <div className="font-medium text-sm text-gray-900">
                {format(date, 'd')}
              </div>
              <div className="mt-1 space-y-1">
                {dayTasks.map((task) => (
                  <TaskItem
                    key={task.id}
                    task={task}
                    onToggle={() => onToggleTask(task.id)}
                    onDelete={() => onDeleteTask(task.id)}
                    onEdit={(updates) => onUpdateTask(task.id, updates)}
                    onToggleSubtask={(subtaskId) => onToggleSubtask(task.id, subtaskId)}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}