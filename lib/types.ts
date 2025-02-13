export interface Audit {
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

export interface EthicalAssessmentCategory {
  id: string
  audit_id: string
  category_name: string
  score: number | null
  created_at: string
  updated_at: string
}

export interface EthicalAssessmentResponse {
  id: string
  audit_id: string
  category_name: string
  question_id: string
  response: number | null
  created_at: string
  updated_at: string
  ethical_assessment_questions?: {
    id: string
    category_name: string
    question_text: string
  }
}

export interface EthicalAssessmentQuestion {
  id: string
  category_name: string
  question_text: string
  created_at: string
  updated_at: string
}

export interface StaffInterview {
  id: string
  audit_id: string
  staff_name: string
  position: string
  interview_date: string | null
  notes: string | null
  created_at: string
  updated_at: string
}

export interface RACIMatrix {
  id: string
  audit_id: string
  role: string
  responsibility: string
  assignment_type: 'R' | 'A' | 'C' | 'I'
  created_at: string
  updated_at: string
}

export interface AuditWithDetails extends Audit {
  ethical_assessment_categories?: EthicalAssessmentCategory[]
  ethical_assessment_responses?: EthicalAssessmentResponse[]
  staff_interviews?: StaffInterview[]
  raci_matrix?: RACIMatrix[]
}

export interface Report {
  id: string
  audit_id: string
  title: string
  description: string
  content: string
  custom_instructions?: string
  created_by: string
  created_at: string
  updated_at: string
  status: 'draft' | 'completed' | 'archived'
  version: number
} 