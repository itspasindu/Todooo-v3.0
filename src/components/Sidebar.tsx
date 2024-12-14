import React, { useState } from 'react';
import { ListTodo, Plus } from 'lucide-react';
import { TodoList } from '../types/todo';

interface SidebarProps {
  lists: TodoList[];
  activeListId: string;
  onSelectList: (id: string) => void;
  onAddList: (name: string) => void;
}

export function Sidebar({
  lists,
  activeListId,
  onSelectList,
  onAddList,
}: SidebarProps) {
  const [newListName, setNewListName] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newListName.trim()) {
      onAddList(newListName.trim());
      setNewListName('');
      setIsAdding(false);
    }
  };

  return (
    <div className="w-64 bg-gray-50 p-4 border-r border-gray-200 h-screen">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-800">My Lists</h2>
        <button
          onClick={() => setIsAdding(true)}
          className="text-gray-600 hover:text-gray-800"
        >
          <Plus size={20} />
        </button>
      </div>

      {isAdding && (
        <form onSubmit={handleSubmit} className="mb-4">
          <input
            type="text"
            value={newListName}
            onChange={(e) => setNewListName(e.target.value)}
            placeholder="List name..."
            className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            autoFocus
          />
        </form>
      )}

      <div className="space-y-1">
        {lists.map((list) => (
          <button
            key={list.id}
            onClick={() => onSelectList(list.id)}
            className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
              list.id === activeListId
                ? 'bg-blue-500 text-white'
                : 'text-gray-700 hover:bg-gray-200'
            }`}
          >
            <ListTodo size={18} />
            <span>{list.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}