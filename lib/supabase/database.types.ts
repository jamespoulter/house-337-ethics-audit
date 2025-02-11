export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          organization: string | null
          role: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          organization?: string | null
          role?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          organization?: string | null
          role?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      audits: {
        Row: {
          id: string
          title: string
          description: string | null
          status: 'draft' | 'in_progress' | 'completed' | 'archived'
          created_by: string
          organization: string
          created_at: string
          updated_at: string
          completed_at: string | null
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          status?: 'draft' | 'in_progress' | 'completed' | 'archived'
          created_by: string
          organization: string
          created_at?: string
          updated_at?: string
          completed_at?: string | null
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          status?: 'draft' | 'in_progress' | 'completed' | 'archived'
          created_by?: string
          organization?: string
          created_at?: string
          updated_at?: string
          completed_at?: string | null
        }
      }
      audit_questions: {
        Row: {
          id: string
          audit_id: string
          question: string
          category: string
          order_index: number
          question_type: 'multiple_choice' | 'text' | 'boolean'
          options: Json | null
          created_at: string
        }
        Insert: {
          id?: string
          audit_id: string
          question: string
          category: string
          order_index: number
          question_type?: 'multiple_choice' | 'text' | 'boolean'
          options?: Json | null
          created_at?: string
        }
        Update: {
          id?: string
          audit_id?: string
          question?: string
          category?: string
          order_index?: number
          question_type?: 'multiple_choice' | 'text' | 'boolean'
          options?: Json | null
          created_at?: string
        }
      }
      audit_responses: {
        Row: {
          id: string
          audit_id: string
          question_id: string
          response: string
          notes: string | null
          responded_by: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          audit_id: string
          question_id: string
          response: string
          notes?: string | null
          responded_by: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          audit_id?: string
          question_id?: string
          response?: string
          notes?: string | null
          responded_by?: string
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
} 