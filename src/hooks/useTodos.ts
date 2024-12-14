import { useState, useCallback, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../stores/authStore';
import { Todo, TodoList } from '../types/todo';

export function useTodos() {
  const { user } = useAuthStore();
  const [lists, setLists] = useState<TodoList[]>([]);
  const [activeListId, setActiveListId] = useState<string>('');

  // Fetch user's todo lists
  useEffect(() => {
    if (!user) return;

    const fetchLists = async () => {
      const { data, error } = await supabase
        .from('todo_lists')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at');

      if (error) {
        console.error('Error fetching lists:', error);
        return;
      }

      setLists(data || []);
      if (data && data.length > 0 && !activeListId) {
        setActiveListId(data[0].id);
      }
    };

    fetchLists();
  }, [user]);

  // Fetch todos for active list
  useEffect(() => {
    if (!activeListId || !user) return;

    const fetchTodos = async () => {
      const { data, error } = await supabase
        .from('todos')
        .select('*')
        .eq('list_id', activeListId)
        .order('created_at');

      if (error) {
        console.error('Error fetching todos:', error);
        return;
      }

      setLists((currentLists) =>
        currentLists.map((list) =>
          list.id === activeListId
            ? { ...list, todos: data || [] }
            : list
        )
      );
    };

    fetchTodos();
  }, [activeListId, user]);

  const addTodo = useCallback(async (listId: string, title: string) => {
    if (!user) return;

    const { data, error } = await supabase
      .from('todos')
      .insert([
        {
          title,
          list_id: listId,
          user_id: user.id,
          completed: false,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error('Error adding todo:', error);
      return;
    }

    setLists((currentLists) =>
      currentLists.map((list) =>
        list.id === listId
          ? { ...list, todos: [...list.todos, data] }
          : list
      )
    );
  }, [user]);

  const toggleTodo = useCallback(async (listId: string, todoId: string) => {
    const list = lists.find((l) => l.id === listId);
    const todo = list?.todos.find((t) => t.id === todoId);
    if (!todo || !user) return;

    const { error } = await supabase
      .from('todos')
      .update({ completed: !todo.completed })
      .eq('id', todoId)
      .eq('user_id', user.id);

    if (error) {
      console.error('Error toggling todo:', error);
      return;
    }

    setLists((currentLists) =>
      currentLists.map((list) =>
        list.id === listId
          ? {
              ...list,
              todos: list.todos.map((t) =>
                t.id === todoId
                  ? { ...t, completed: !t.completed }
                  : t
              ),
            }
          : list
      )
    );
  }, [lists, user]);

  const deleteTodo = useCallback(async (listId: string, todoId: string) => {
    if (!user) return;

    const { error } = await supabase
      .from('todos')
      .delete()
      .eq('id', todoId)
      .eq('user_id', user.id);

    if (error) {
      console.error('Error deleting todo:', error);
      return;
    }

    setLists((currentLists) =>
      currentLists.map((list) =>
        list.id === listId
          ? {
              ...list,
              todos: list.todos.filter((t) => t.id !== todoId),
            }
          : list
      )
    );
  }, [user]);

  const addList = useCallback(async (name: string) => {
    if (!user) return;

    const { data, error } = await supabase
      .from('todo_lists')
      .insert([
        {
          name,
          user_id: user.id,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error('Error adding list:', error);
      return;
    }

    const newList = { ...data, todos: [] };
    setLists((currentLists) => [...currentLists, newList]);
    setActiveListId(newList.id);
  }, [user]);

  return {
    lists,
    activeListId,
    setActiveListId,
    addTodo,
    toggleTodo,
    deleteTodo,
    addList,
  };
}