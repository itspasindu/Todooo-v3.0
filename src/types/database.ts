export interface Database {
  public: {
    Tables: {
      tasks: {
        Row: {
          id: string;
          title: string;
          description?: string;
          completed: boolean;
          created_at: string;
          updated_at: string;
          priority: 'low' | 'medium' | 'high';
          due_date?: string; // Changed from dueDate to due_date to match DB schema
          category?: string;
          recurring?: {
            type: 'daily' | 'weekly' | 'monthly' | 'custom';
            interval?: number;
          };
          subtasks?: {
            id: string;
            title: string;
            completed: boolean;
          }[];
          notifications?: {
            email?: boolean;
            browser?: boolean;
          };
          user_id: string;
        };
        Insert: Omit<Database['public']['Tables']['tasks']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['tasks']['Insert']>;
      };
      todo_lists: {
        Row: {
          id: string;
          name: string;
          color?: string;
          user_id: string;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['todo_lists']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['todo_lists']['Insert']>;
      };
    };
  };
}