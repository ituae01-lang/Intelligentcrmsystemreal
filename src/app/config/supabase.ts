import { createClient } from '@supabase/supabase-js';

// Supabase configuration
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Check if Supabase is configured
export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

// Create Supabase client (will be null if not configured)
export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Database types
export interface Database {
  public: {
    Tables: {
      customers: {
        Row: {
          id: string;
          name: string;
          email: string;
          phone: string;
          category: 'Frequent' | 'Occasional' | 'New';
          join_date: string;
          total_spent: number;
          last_purchase: string;
          location: string;
          created_at: string;
          user_id: string;
        };
        Insert: Omit<Database['public']['Tables']['customers']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['customers']['Insert']>;
      };
      products: {
        Row: {
          id: string;
          name: string;
          category: string;
          price: number;
          stock: number;
          created_at: string;
          user_id: string;
        };
        Insert: Omit<Database['public']['Tables']['products']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['products']['Insert']>;
      };
      purchases: {
        Row: {
          id: string;
          customer_id: string;
          product_id: string;
          quantity: number;
          amount: number;
          date: string;
          created_at: string;
          user_id: string;
        };
        Insert: Omit<Database['public']['Tables']['purchases']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['purchases']['Insert']>;
      };
      interactions: {
        Row: {
          id: string;
          customer_id: string;
          type: 'Sale' | 'Inquiry' | 'Complaint' | 'Call' | 'Visit' | 'Follow-up';
          note: string;
          date: string;
          created_at: string;
          user_id: string;
        };
        Insert: Omit<Database['public']['Tables']['interactions']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['interactions']['Insert']>;
      };
      profiles: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          role: 'Owner' | 'Staff';
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['profiles']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['profiles']['Insert']>;
      };
    };
  };
}

// Helper function to check authentication status
export async function getCurrentUser() {
  if (!supabase) return null;

  const { data: { user }, error } = await supabase.auth.getUser();
  if (error) {
    console.error('Error getting user:', error);
    return null;
  }

  return user;
}

// Helper function to get user profile
export async function getUserProfile(userId: string) {
  if (!supabase) return null;

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error) {
    console.error('Error getting profile:', error);
    return null;
  }

  return data;
}
