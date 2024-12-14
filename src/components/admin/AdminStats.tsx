import React from 'react';
import { User } from '../../types/auth';
import { Users, UserCheck, UserPlus, Clock } from 'lucide-react';
import { format, subDays } from 'date-fns';

interface AdminStatsProps {
  users: User[];
}

export function AdminStats({ users }: AdminStatsProps) {
  const totalUsers = users.length;
  const activeUsers = users.filter(user => user.last_sign_in_at).length;
  const newUsers = users.filter(
    user => user.created_at && 
    new Date(user.created_at) > subDays(new Date(), 7)
  ).length;

  const stats = [
    {
      name: 'Total Users',
      value: totalUsers,
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      name: 'Active Users',
      value: activeUsers,
      icon: UserCheck,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      name: 'New Users (7d)',
      value: newUsers,
      icon: UserPlus,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {stats.map((stat) => (
        <div
          key={stat.name}
          className="bg-white rounded-lg shadow px-6 py-4"
        >
          <div className="flex items-center">
            <div className={`${stat.bgColor} rounded-lg p-3`}>
              <stat.icon className={stat.color} size={24} />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">{stat.name}</p>
              <p className="text-2xl font-semibold text-gray-900">
                {stat.value}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}