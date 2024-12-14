import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { User } from '../types/auth';
import { useAuthStore } from '../stores/authStore';

export function useAdmin() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user: currentUser } = useAuthStore();

  useEffect(() => {
    if (!currentUser?.role || currentUser.role !== 'admin') {
      setError('Unauthorized access');
      setLoading(false);
      return;
    }

    const fetchUsers = async () => {
      try {
        const { data: users, error: usersError } = await supabase
          .from('users')
          .select('*')
          .order('created_at', { ascending: false });

        if (usersError) throw usersError;

        setUsers(users);
      } catch (err) {
        console.error('Error fetching users:', err);
        setError('Failed to load users');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [currentUser]);

  const updateUserRole = async (userId: string, role: string) => {
    try {
      const { error: updateError } = await supabase
        .from('users')
        .update({ role })
        .eq('id', userId);

      if (updateError) throw updateError;

      setUsers(users.map(user => 
        user.id === userId ? { ...user, role } : user
      ));
    } catch (err) {
      console.error('Error updating user role:', err);
      throw err;
    }
  };

  const deleteUser = async (userId: string) => {
    try {
      const { error: deleteError } = await supabase
        .from('users')
        .delete()
        .eq('id', userId);

      if (deleteError) throw deleteError;

      setUsers(users.filter(user => user.id !== userId));
    } catch (err) {
      console.error('Error deleting user:', err);
      throw err;
    }
  };

  return {
    users,
    loading,
    error,
    updateUserRole,
    deleteUser,
  };
}