import React from 'react';
import { User } from '../../types/auth';
import { UserCircle, Trash2, Shield } from 'lucide-react';

interface UserListProps {
  users: User[];
  selectedUserId: string | null;
  onSelectUser: (userId: string) => void;
  onUpdateRole: (userId: string, role: string) => void;
  onDeleteUser: (userId: string) => void;
}

export function UserList({
  users,
  selectedUserId,
  onSelectUser,
  onUpdateRole,
  onDeleteUser,
}: UserListProps) {
  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold text-gray-900">Users</h2>
      </div>
      <div className="divide-y">
        {users.map((user) => (
          <div
            key={user.id}
            className={`p-4 hover:bg-gray-50 cursor-pointer ${
              selectedUserId === user.id ? 'bg-blue-50' : ''
            }`}
            onClick={() => onSelectUser(user.id)}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                  {user.avatar_url ? (
                    <img
                      src={user.avatar_url}
                      alt={user.full_name || user.email}
                      className="w-10 h-10 rounded-full"
                    />
                  ) : (
                    <UserCircle className="text-gray-400" size={24} />
                  )}
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">
                    {user.full_name || 'Unnamed User'}
                  </h3>
                  <p className="text-sm text-gray-500">{user.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <select
                  value={user.role || 'user'}
                  onChange={(e) => onUpdateRole(user.id, e.target.value)}
                  onClick={(e) => e.stopPropagation()}
                  className="text-sm border rounded-md px-2 py-1"
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteUser(user.id);
                  }}
                  className="p-1 text-gray-400 hover:text-red-500"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}