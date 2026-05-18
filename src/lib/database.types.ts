export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          full_name: string;
          email: string;
          password_hash: string;
          role: 'realtor' | 'admin';
          created_at: string;
        };
        Insert: {
          id: string;
          full_name?: string;
          email: string;
          password_hash?: string;
          role?: 'realtor' | 'admin';
          created_at?: string;
        };
        Update: {
          id?: string;
          full_name?: string;
          email?: string;
          password_hash?: string;
          role?: 'realtor' | 'admin';
          created_at?: string;
        };
      };
      leads: {
        Row: {
          id: string;
          full_name: string;
          email: string;
          phone: string;
          budget: number;
          preferred_location: string;
          assigned_user_id: string;
          pipeline_stage: 'new' | 'contacted' | 'viewing_scheduled' | 'negotiating' | 'closed_won' | 'closed_lost';
          created_at: string;
        };
        Insert: {
          id?: string;
          full_name?: string;
          email?: string;
          phone?: string;
          budget?: number;
          preferred_location?: string;
          assigned_user_id: string;
          pipeline_stage?: 'new' | 'contacted' | 'viewing_scheduled' | 'negotiating' | 'closed_won' | 'closed_lost';
          created_at?: string;
        };
        Update: {
          id?: string;
          full_name?: string;
          email?: string;
          phone?: string;
          budget?: number;
          preferred_location?: string;
          assigned_user_id?: string;
          pipeline_stage?: 'new' | 'contacted' | 'viewing_scheduled' | 'negotiating' | 'closed_won' | 'closed_lost';
          created_at?: string;
        };
      };
      properties: {
        Row: {
          id: string;
          title: string;
          description: string;
          price: number;
          property_type: 'house' | 'apartment' | 'penthouse' | 'villa' | 'commercial' | 'land';
          location: string;
          realtor_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          title?: string;
          description?: string;
          price?: number;
          property_type?: 'house' | 'apartment' | 'penthouse' | 'villa' | 'commercial' | 'land';
          location?: string;
          realtor_id: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string;
          price?: number;
          property_type?: 'house' | 'apartment' | 'penthouse' | 'villa' | 'commercial' | 'land';
          location?: string;
          realtor_id?: string;
          created_at?: string;
        };
      };
      conversations: {
        Row: {
          id: string;
          lead_id: string;
          message_content: string;
          sender_type: 'user' | 'ai' | 'lead';
          created_at: string;
        };
        Insert: {
          id?: string;
          lead_id: string;
          message_content?: string;
          sender_type?: 'user' | 'ai' | 'lead';
          created_at?: string;
        };
        Update: {
          id?: string;
          lead_id?: string;
          message_content?: string;
          sender_type?: 'user' | 'ai' | 'lead';
          created_at?: string;
        };
      };
      appointments: {
        Row: {
          id: string;
          lead_id: string;
          property_id: string;
          appointment_date: string;
          status: 'scheduled' | 'completed' | 'cancelled' | 'no_show';
          notes: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          lead_id: string;
          property_id: string;
          appointment_date?: string;
          status?: 'scheduled' | 'completed' | 'cancelled' | 'no_show';
          notes?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          lead_id?: string;
          property_id?: string;
          appointment_date?: string;
          status?: 'scheduled' | 'completed' | 'cancelled' | 'no_show';
          notes?: string;
          created_at?: string;
        };
      };
      deals: {
        Row: {
          id: string;
          lead_id: string;
          property_id: string;
          deal_value: number;
          deal_stage: 'proposed' | 'under_review' | 'accepted' | 'rejected' | 'completed';
          created_at: string;
        };
        Insert: {
          id?: string;
          lead_id: string;
          property_id: string;
          deal_value?: number;
          deal_stage?: 'proposed' | 'under_review' | 'accepted' | 'rejected' | 'completed';
          created_at?: string;
        };
        Update: {
          id?: string;
          lead_id?: string;
          property_id?: string;
          deal_value?: number;
          deal_stage?: 'proposed' | 'under_review' | 'accepted' | 'rejected' | 'completed';
          created_at?: string;
        };
      };
      tasks: {
        Row: {
          id: string;
          assigned_user_id: string;
          lead_id: string | null;
          task_title: string;
          task_description: string;
          due_date: string;
          priority: 'low' | 'medium' | 'high' | 'urgent';
          status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
          created_at: string;
        };
        Insert: {
          id?: string;
          assigned_user_id: string;
          lead_id?: string | null;
          task_title?: string;
          task_description?: string;
          due_date?: string;
          priority?: 'low' | 'medium' | 'high' | 'urgent';
          status?: 'pending' | 'in_progress' | 'completed' | 'cancelled';
          created_at?: string;
        };
        Update: {
          id?: string;
          assigned_user_id?: string;
          lead_id?: string | null;
          task_title?: string;
          task_description?: string;
          due_date?: string;
          priority?: 'low' | 'medium' | 'high' | 'urgent';
          status?: 'pending' | 'in_progress' | 'completed' | 'cancelled';
          created_at?: string;
        };
      };
      ai_memory: {
        Row: {
          id: string;
          entity_id: string;
          entity_type: 'lead' | 'property';
          raw_content: string;
          embedding_vector: number[] | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          entity_id: string;
          entity_type?: 'lead' | 'property';
          raw_content?: string;
          embedding_vector?: number[] | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          entity_id?: string;
          entity_type?: 'lead' | 'property';
          raw_content?: string;
          embedding_vector?: number[] | null;
          created_at?: string;
        };
      };
      notifications: {
        Row: {
          id: string;
          user_id: string;
          content: string;
          notification_type: 'lead_activity' | 'appointment_reminder' | 'deal_update' | 'task_due' | 'system';
          read_status: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          content?: string;
          notification_type?: 'lead_activity' | 'appointment_reminder' | 'deal_update' | 'task_due' | 'system';
          read_status?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          content?: string;
          notification_type?: 'lead_activity' | 'appointment_reminder' | 'deal_update' | 'task_due' | 'system';
          read_status?: boolean;
          created_at?: string;
        };
      };
      subscriptions: {
        Row: {
          id: string;
          user_id: string;
          plan_name: 'monthly' | 'annual';
          billing_status: 'active' | 'past_due' | 'cancelled' | 'expired';
          current_period_start: string;
          current_period_end: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          plan_name?: 'monthly' | 'annual';
          billing_status?: 'active' | 'past_due' | 'cancelled' | 'expired';
          current_period_start?: string;
          current_period_end?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          plan_name?: 'monthly' | 'annual';
          billing_status?: 'active' | 'past_due' | 'cancelled' | 'expired';
          current_period_start?: string;
          current_period_end?: string;
          created_at?: string;
        };
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      user_role: 'realtor' | 'admin';
      pipeline_stage: 'new' | 'contacted' | 'viewing_scheduled' | 'negotiating' | 'closed_won' | 'closed_lost';
      property_type: 'house' | 'apartment' | 'penthouse' | 'villa' | 'commercial' | 'land';
      sender_type: 'user' | 'ai' | 'lead';
      appointment_status: 'scheduled' | 'completed' | 'cancelled' | 'no_show';
      deal_stage: 'proposed' | 'under_review' | 'accepted' | 'rejected' | 'completed';
      task_priority: 'low' | 'medium' | 'high' | 'urgent';
      task_status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
      entity_type: 'lead' | 'property';
      notification_type: 'lead_activity' | 'appointment_reminder' | 'deal_update' | 'task_due' | 'system';
      plan_name: 'monthly' | 'annual';
      billing_status: 'active' | 'past_due' | 'cancelled' | 'expired';
    };
  };
}

export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row'];
export type InsertTables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert'];
export type UpdateTables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update'];
