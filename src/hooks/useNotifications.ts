import { useCallback, useEffect } from 'react';
import { Todo } from '../types/todo';

export function useNotifications() {
  useEffect(() => {
    if ('Notification' in window) {
      Notification.requestPermission();
    }
  }, []);

  const sendBrowserNotification = useCallback((task: Todo) => {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('Task Reminder', {
        body: `Task "${task.title}" is due ${new Date(task.dueDate!).toLocaleString()}`,
        icon: '/notification-icon.png',
      });
    }
  }, []);

  const sendEmailNotification = useCallback(async (task: Todo, userEmail: string) => {
    // In a real application, you would integrate with your email service here
    console.log(`Sending email notification for task "${task.title}" to ${userEmail}`);
  }, []);

  const checkAndSendNotifications = useCallback((tasks: Todo[], userEmail: string) => {
    const now = new Date();
    tasks.forEach((task) => {
      if (task.dueDate && !task.completed) {
        const dueDate = new Date(task.dueDate);
        const timeDiff = dueDate.getTime() - now.getTime();
        const hoursDiff = timeDiff / (1000 * 60 * 60);

        if (hoursDiff <= 24 && hoursDiff > 0) {
          if (task.notifications?.browser) {
            sendBrowserNotification(task);
          }
          if (task.notifications?.email) {
            sendEmailNotification(task, userEmail);
          }
        }
      }
    });
  }, [sendBrowserNotification, sendEmailNotification]);

  return {
    checkAndSendNotifications,
    sendBrowserNotification,
    sendEmailNotification,
  };
}