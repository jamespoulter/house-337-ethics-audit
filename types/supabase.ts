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
      audits: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          name: string
          organization: string
          status: 'in_progress' | 'completed'
          overall_score: number | null
          user_id: string
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          name: string
          organization: string
          status?: 'in_progress' | 'completed'
          overall_score?: number | null
          user_id: string
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          name?: string
          organization?: string
          status?: 'in_progress' | 'completed'
          overall_score?: number | null
          user_id?: string
        }
      }
      ethical_assessment_categories: {
        Row: {
          id: string
          audit_id: string
          category_name: string
          score: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          audit_id: string
          category_name: string
          score?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          audit_id?: string
          category_name?: string
          score?: number | null
          created_at?: string
          updated_at?: string
        }
      }
      ethical_assessment_responses: {
        Row: {
          id: string
          category_id: string
          question_id: string
          response: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          category_id: string
          question_id: string
          response?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          category_id?: string
          question_id?: string
          response?: number | null
          created_at?: string
          updated_at?: string
        }
      }
      raci_matrix: {
        Row: {
          id: string
          audit_id: string
          role: string
          responsibility: string
          assignment_type: 'R' | 'A' | 'C' | 'I'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          audit_id: string
          role: string
          responsibility: string
          assignment_type: 'R' | 'A' | 'C' | 'I'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          audit_id?: string
          role?: string
          responsibility?: string
          assignment_type?: 'R' | 'A' | 'C' | 'I'
          created_at?: string
          updated_at?: string
        }
      }
      staff_interviews: {
        Row: {
          id: string
          audit_id: string
          staff_name: string
          position: string
          interview_date: string | null
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          audit_id: string
          staff_name: string
          position: string
          interview_date?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          audit_id?: string
          staff_name?: string
          position?: string
          interview_date?: string | null
          notes?: string | null
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