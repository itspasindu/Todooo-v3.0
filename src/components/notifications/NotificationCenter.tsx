import React from 'react';
import { Bell, Mail, Calendar } from 'lucide-react';
import { format, isAfter, isBefore, addDays } from 'date-fns';
import { Todo } from '../../types/todo';

interface NotificationCenterProps {
  tasks: Todo[];
  onToggleEmailNotifications: (taskId: string) => void;
  onToggleBrowserNotifications: (taskId: string) => void;
}

export function NotificationCenter({
  tasks,
  onToggleEmailNotifications,
  onToggleBrowserNotifications,
}: NotificationCenterProps) {
  const now = new Date();
  const nextWeek = addDays(now, 7);

  const upcomingTasks = tasks
    .filter((task) => {
      if (!task.completed && task.dueDate) {
        return isAfter(new Date(task.dueDate), now) && 
               isBefore(new Date(task.dueDate), nextWeek);
      }
      return false;
    })
    .sort((a, b) => {
      if (a.dueDate && b.dueDate) {
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      }
      return 0;
    });

  return (
    <div className="bg-white rounded-lg shadow-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Notifications</h2>
        <div className="flex gap-2">
          <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
            <Bell size={20} />
          </button>
          <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
            <Mail size={20} />
          </button>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-2">Upcoming Tasks</h3>
          {upcomingTasks.length > 0 ? (
            <div className="space-y-2">
              {upcomingTasks.map((task) => (
                <div
                  key={task.id}
                  className="flex items-center justify-between p-2 bg-gray-50 rounded-lg"
                >
                  <div>
                    <p className="font-medium text-gray-900">{task.title}</p>
                    {task.dueDate && (
                      <p className="text-sm text-gray-500">
                        Due: {format(new Date(task.dueDate), 'MMM d, yyyy h:mm a')}
                      </p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => onToggleEmailNotifications(task.id)}
                      className={`p-1.5 rounded-lg ${
                        task.notifications?.email
                          ? 'bg-blue-100 text-blue-600'
                          : 'text-gray-400 hover:bg-gray-100'
                      }`}
                    >
                      <Mail size={16} />
                    </button>
                    <button
                      onClick={() => onToggleBrowserNotifications(task.id)}
                      className={`p-1.5 rounded-lg ${
                        task.notifications?.browser
                          ? 'bg-blue-100 text-blue-600'
                          : 'text-gray-400 hover:bg-gray-100'
                      }`}
                    >
                      <Bell size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">No upcoming tasks</p>
          )}
        </div>
      </div>
    </div>
  );
}