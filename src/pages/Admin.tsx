import React, { useState } from 'react';
import { UserList } from '../components/admin/UserList';
import { UserDetails } from '../components/admin/UserDetails';
import { AdminStats } from '../components/admin/AdminStats';
import { useAdmin } from '../hooks/useAdmin';
import { Users, LayoutDashboard, Settings } from 'lucide-react';

export function Admin() {
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const { users, loading, error, updateUserRole, deleteUser } = useAdmin();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-red-50 text-red-700 p-4 rounded-lg">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4">
            <LayoutDashboard className="text-blue-600" size={24} />
            <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-4">
              <nav className="space-y-2">
                <button className="w-full flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg">
                  <Users size={20} />
                  Users
                </button>
                <button className="w-full flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-lg">
                  <Settings size={20} />
                  Settings
                </button>
              </nav>
            </div>
          </div>

          <div className="lg:col-span-3 space-y-8">
            <AdminStats users={users} />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <UserList
                users={users}
                selectedUserId={selectedUserId}
                onSelectUser={setSelectedUserId}
                onUpdateRole={updateUserRole}
                onDeleteUser={deleteUser}
              />
              
              {selectedUserId && (
                <UserDetails
                  user={users.find(u => u.id === selectedUserId)!}
                  onClose={() => setSelectedUserId(null)}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}