import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import { AuthState, User } from '../types/auth';

const mapSupabaseUser = (supabaseUser: any): User | null => {
  if (!supabaseUser) return null;
  return {
    id: supabaseUser.id,
    email: supabaseUser.email || '',
    full_name: supabaseUser.user_metadata?.full_name,
    avatar_url: supabaseUser.user_metadata?.avatar_url,
  };
};

export const useAuthStore = create<AuthState>((set) => {
  // Initialize auth state
  supabase.auth.getSession().then(({ data: { session } }) => {
    set({
      user: mapSupabaseUser(session?.user),
      loading: false,
    });
  });

  // Listen for auth changes
  supabase.auth.onAuthStateChange((_event, session) => {
    set({
      user: mapSupabaseUser(session?.user),
      loading: false,
    });
  });

  return {
    user: null,
    loading: true,
    signIn: async (email: string, password: string) => {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      set({ user: mapSupabaseUser(data.user) });
    },
    signUp: async (email: string, password: string, fullName: string) => {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      });
      if (error) throw error;
      set({ user: mapSupabaseUser(data.user) });
    },
    signOut: async () => {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      set({ user: null });
    },
    updateProfile: async (data: Partial<User>) => {
      const { error } = await supabase.auth.updateUser({
        data: {
          full_name: data.full_name,
          avatar_url: data.avatar_url,
        },
      });
      if (error) throw error;
      
      const currentUser = await supabase.auth.getUser();
      set({ user: mapSupabaseUser(currentUser.data.user) });
    },
    resetPassword: async (email: string) => {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (error) throw error;
    },
    updatePassword: async (newPassword: string) => {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });
      if (error) throw error;
    },
  };
});