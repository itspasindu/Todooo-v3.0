import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthLayout } from './components/AuthLayout';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Profile } from './pages/Profile';
import { Admin } from './pages/Admin';
import { TaskList } from './components/task/TaskList';
import { useTasks } from './hooks/useTasks';
import { useNotifications } from './hooks/useNotifications';
import { useAuthStore } from './stores/authStore';

function App() {
  const { user } = useAuthStore();
  const {
    tasks,
    loading,
    error,
    addTask,
    updateTask,
    deleteTask,
    toggleTask,
    toggleSubtask,
  } = useTasks();

  const { checkAndSendNotifications } = useNotifications();

  React.useEffect(() => {
    if (user && tasks.length > 0) {
      const interval = setInterval(() => {
        checkAndSendNotifications(tasks, user.email);
      }, 60000);

      return () => clearInterval(interval);
    }
  }, [user, tasks, checkAndSendNotifications]);

  const handleToggleEmailNotifications = React.useCallback(
    (taskId: string) => {
      const task = tasks.find((t) => t.id === taskId);
      if (task) {
        updateTask(taskId, {
          notifications: {
            ...task.notifications,
            email: !task.notifications?.email,
          },
        });
      }
    },
    [tasks, updateTask]
  );

  const handleToggleBrowserNotifications = React.useCallback(
    (taskId: string) => {
      const task = tasks.find((t) => t.id === taskId);
      if (task) {
        updateTask(taskId, {
          notifications: {
            ...task.notifications,
            browser: !task.notifications?.browser,
          },
        });
      }
    },
    [tasks, updateTask]
  );

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route element={<AuthLayout />}>
          <Route
            path="/"
            element={
              <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
                {loading ? (
                  <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
                  </div>
                ) : error ? (
                  <div className="bg-red-50 text-red-700 p-4 rounded-lg">
                    {error}
                  </div>
                ) : (
                  <TaskList
                    tasks={tasks}
                    onToggleTask={toggleTask}
                    onDeleteTask={deleteTask}
                    onUpdateTask={updateTask}
                    onAddTask={addTask}
                    onToggleSubtask={toggleSubtask}
                    onToggleEmailNotifications={handleToggleEmailNotifications}
                    onToggleBrowserNotifications={handleToggleBrowserNotifications}
                  />
                )}
              </div>
            }
          />
          <Route path="/profile" element={<Profile />} />
          <Route path="/admin" element={<Admin />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;