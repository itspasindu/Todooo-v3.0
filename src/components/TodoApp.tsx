import React from 'react';
import { Link } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { TodoList } from './TodoList';
import { AddTodo } from './AddTodo';
import { useTodos } from '../hooks/useTodos';
import { useAuthStore } from '../stores/authStore';
import { UserCircle } from 'lucide-react';

export function TodoApp() {
  const { user } = useAuthStore();
  const {
    lists,
    activeListId,
    setActiveListId,
    addTodo,
    toggleTodo,
    deleteTodo,
    addList,
  } = useTodos();

  const activeList = lists.find((list) => list.id === activeListId);

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar
        lists={lists}
        activeListId={activeListId}
        onSelectList={setActiveListId}
        onAddList={addList}
      />
      
      <main className="flex-1">
        <header className="bg-white shadow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">
              {activeList?.name || 'My Tasks'}
            </h1>
            <Link
              to="/profile"
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
            >
              <UserCircle />
              <span>{user?.full_name || user?.email}</span>
            </Link>
          </div>
        </header>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="max-w-3xl mx-auto">
            <div className="mb-6">
              <AddTodo onAdd={(title) => addTodo(activeListId, title)} />
            </div>

            {activeList && (
              <TodoList
                todos={activeList.todos || []}
                onToggleTodo={(todoId) => toggleTodo(activeListId, todoId)}
                onDeleteTodo={(todoId) => deleteTodo(activeListId, todoId)}
              />
            )}
          </div>
        </div>
      </main>
    </div>
  );
}