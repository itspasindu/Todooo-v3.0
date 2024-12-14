import { useState, useCallback, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../stores/authStore';
import { Todo } from '../types/todo';

export function useTasks() {
  const { user } = useAuthStore();
  const [tasks, setTasks] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const fetchTasks = async () => {
      try {
        setError(null);
        const { data, error: supabaseError } = await supabase
          .from('tasks')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (supabaseError) {
          throw supabaseError;
        }

        setTasks(data?.map(task => ({
          ...task,
          dueDate: task.due_date ? new Date(task.due_date) : undefined,
          createdAt: new Date(task.created_at),
          updatedAt: new Date(task.updated_at),
        })) || []);
      } catch (err) {
        console.error('Error fetching tasks:', err);
        setError('Failed to load tasks. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [user]);

  const addTask = useCallback(async (taskData: Partial<Todo>) => {
    if (!user) return;

    try {
      setError(null);
      const { data, error: supabaseError } = await supabase
        .from('tasks')
        .insert([{
          ...taskData,
          user_id: user.id,
          due_date: taskData.dueDate?.toISOString(), // Convert to ISO string for database
        }])
        .select()
        .single();

      if (supabaseError) {
        throw supabaseError;
      }

      const newTask: Todo = {
        ...data,
        dueDate: data.due_date ? new Date(data.due_date) : undefined,
        createdAt: new Date(data.created_at),
        updatedAt: new Date(data.updated_at),
      };

      setTasks((current) => [newTask, ...current]);
      return newTask;
    } catch (err) {
      console.error('Error adding task:', err);
      setError('Failed to add task. Please try again.');
      throw err;
    }
  }, [user]);

  const updateTask = useCallback(async (taskId: string, updates: Partial<Todo>) => {
    if (!user) return;

    try {
      setError(null);
      const { error: supabaseError } = await supabase
        .from('tasks')
        .update({
          ...updates,
          due_date: updates.dueDate?.toISOString(),
        })
        .eq('id', taskId)
        .eq('user_id', user.id);

      if (supabaseError) {
        throw supabaseError;
      }

      setTasks((current) =>
        current.map((task) =>
          task.id === taskId ? { ...task, ...updates } : task
        )
      );
    } catch (err) {
      console.error('Error updating task:', err);
      setError('Failed to update task. Please try again.');
      throw err;
    }
  }, [user]);

  const deleteTask = useCallback(async (taskId: string) => {
    if (!user) return;

    try {
      setError(null);
      const { error: supabaseError } = await supabase
        .from('tasks')
        .delete()
        .eq('id', taskId)
        .eq('user_id', user.id);

      if (supabaseError) {
        throw supabaseError;
      }

      setTasks((current) => current.filter((task) => task.id !== taskId));
    } catch (err) {
      console.error('Error deleting task:', err);
      setError('Failed to delete task. Please try again.');
      throw err;
    }
  }, [user]);

  const toggleTask = useCallback(async (taskId: string) => {
    const task = tasks.find((t) => t.id === taskId);
    if (!task) return;

    await updateTask(taskId, { completed: !task.completed });
  }, [tasks, updateTask]);

  const toggleSubtask = useCallback(async (taskId: string, subtaskId: string) => {
    const task = tasks.find((t) => t.id === taskId);
    if (!task || !task.subtasks) return;

    const updatedSubtasks = task.subtasks.map((subtask) =>
      subtask.id === subtaskId
        ? { ...subtask, completed: !subtask.completed }
        : subtask
    );

    await updateTask(taskId, { subtasks: updatedSubtasks });
  }, [tasks, updateTask]);

  return {
    tasks,
    loading,
    error,
    addTask,
    updateTask,
    deleteTask,
    toggleTask,
    toggleSubtask,
  };
}