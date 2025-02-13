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
          name: string
          organization: string
          description: string | null
          status: string
          overall_score: number | null
          ethical_framework: string | null
          risks_and_challenges: string | null
          mitigation_strategies: string | null
          continuous_monitoring: string | null
          created_at: string
          updated_at: string
          user_id: string
        }
        Insert: {
          id?: string
          name: string
          organization: string
          description?: string | null
          status?: string
          overall_score?: number | null
          ethical_framework?: string | null
          risks_and_challenges?: string | null
          mitigation_strategies?: string | null
          continuous_monitoring?: string | null
          created_at?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          id?: string
          name?: string
          organization?: string
          description?: string | null
          status?: string
          overall_score?: number | null
          ethical_framework?: string | null
          risks_and_challenges?: string | null
          mitigation_strategies?: string | null
          continuous_monitoring?: string | null
          created_at?: string
          updated_at?: string
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
      ethical_assessment_questions: {
        Row: {
          id: string
          category_name: string
          question_text: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          category_name: string
          question_text: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          category_name?: string
          question_text?: string
          created_at?: string
          updated_at?: string
        }
      }
      ethical_assessment_responses: {
        Row: {
          id: string
          audit_id: string
          category_name: string
          question_id: string
          response: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          audit_id: string
          category_name: string
          question_id: string
          response: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          audit_id?: string
          category_name?: string
          question_id?: string
          response?: number
          created_at?: string
          updated_at?: string
        }
      }
      reports: {
        Row: {
          id: string
          audit_id: string
          title: string
          description: string
          content: string
          custom_instructions: string | null
          created_by: string
          created_at: string
          updated_at: string
          status: string
          version: number
        }
        Insert: {
          id?: string
          audit_id: string
          title: string
          description: string
          content: string
          custom_instructions?: string | null
          created_by: string
          created_at?: string
          updated_at?: string
          status?: string
          version?: number
        }
        Update: {
          id?: string
          audit_id?: string
          title?: string
          description?: string
          content?: string
          custom_instructions?: string | null
          created_by?: string
          created_at?: string
          updated_at?: string
          status?: string
          version?: number
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