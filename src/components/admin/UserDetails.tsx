import React from 'react';
import { User } from '../../types/auth';
import { X, Mail, Calendar, Shield } from 'lucide-react';
import { format } from 'date-fns';

interface UserDetailsProps {
  user: User;
  onClose: () => void;
}

export function UserDetails({ user, onClose }: UserDetailsProps) {
  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-4 border-b flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">User Details</h2>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-500"
        >
          <X size={20} />
        </button>
      </div>
      <div className="p-4 space-y-4">
        <div className="flex items-center justify-center">
          <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center">
            {user.avatar_url ? (
              <img
                src={user.avatar_url}
                alt={user.full_name || user.email}
                className="w-24 h-24 rounded-full"
              />
            ) : (
              <span className="text-4xl text-gray-400">
                {(user.full_name || user.email).charAt(0).toUpperCase()}
              </span>
            )}
          </div>
        </div>

        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-500">
              Full Name
            </label>
            <p className="mt-1 text-gray-900">{user.full_name || 'Not set'}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-500">
              Email
            </label>
            <div className="mt-1 flex items-center gap-2">
              <Mail size={16} className="text-gray-400" />
              <p className="text-gray-900">{user.email}</p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-500">
              Role
            </label>
            <div className="mt-1 flex items-center gap-2">
              <Shield size={16} className="text-gray-400" />
              <p className="text-gray-900 capitalize">{user.role || 'User'}</p>
            </div>
          </div>

          {user.created_at && (
            <div>
              <label className="block text-sm font-medium text-gray-500">
                Member Since
              </label>
              <div className="mt-1 flex items-center gap-2">
                <Calendar size={16} className="text-gray-400" />
                <p className="text-gray-900">
                  {format(new Date(user.created_at), 'PPP')}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}