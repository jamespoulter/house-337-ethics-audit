import { createClient } from '@supabase/supabase-js'
import { 
  Audit, 
  EthicalAssessmentCategory, 
  EthicalAssessmentResponse,
  StaffInterview,
  RACIMatrix,
  AuditWithDetails,
  AuditSection,
  AuditQuestion
} from '@/lib/types'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Local types for sections and questions
type AuditSection = {
  id: string
  audit_id: string
  name: string
  status: string
  score: number | null
  created_at: string
  updated_at: string
}

type AuditQuestion = {
  id: string
  section_id: string
  question: string
  answer: string | null
  score: number | null
  created_at: string
  updated_at: string
}

// Error handling helper
const handleSupabaseError = (error: any) => {
  console.error('Supabase error:', error)
  if (error.message) {
    throw new Error(error.message)
  }
  throw new Error('An unexpected database error occurred')
}

// Audit functions
export async function getAudits() {
  try {
    const { data, error } = await supabase
      .from('audits')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    return data as Audit[]
  } catch (error) {
    handleSupabaseError(error)
  }
}

export async function getAuditById(id: string): Promise<AuditWithDetails | null> {
  try {
    // Get main audit data
    const { data: audit, error: auditError } = await supabase
      .from('audits')
      .select('*')
      .eq('id', id)
      .single()

    if (auditError) throw auditError

    // Get ethical assessment categories and responses
    const { data: categories, error: categoriesError } = await supabase
      .from('ethical_assessment_categories')
      .select(`
        *,
        ethical_assessment_responses (*)
      `)
      .eq('audit_id', id)

    if (categoriesError) throw categoriesError

    // Get RACI matrix data
    const { data: raciMatrix, error: raciError } = await supabase
      .from('raci_matrix')
      .select('*')
      .eq('audit_id', id)

    if (raciError) throw raciError

    // Get staff interviews
    const { data: interviews, error: interviewsError } = await supabase
      .from('staff_interviews')
      .select('*')
      .eq('audit_id', id)

    if (interviewsError) throw interviewsError

    return {
      ...audit,
      ethical_assessment_categories: categories,
      raci_matrix: raciMatrix,
      staff_interviews: interviews,
    } as AuditWithDetails
  } catch (error) {
    handleSupabaseError(error)
    return null
  }
}

export async function createAudit(auditData: Partial<Audit>) {
  try {
    const { data, error } = await supabase
      .from('audits')
      .insert([auditData])
      .select()
      .single()

    if (error) throw error
    return data as Audit
  } catch (error) {
    handleSupabaseError(error)
  }
}

export async function updateAudit(id: string, audit: Partial<Audit>) {
  try {
    const { data, error } = await supabase
      .from('audits')
      .update({
        ...audit,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  } catch (error) {
    handleSupabaseError(error)
    throw error
  }
}

export async function deleteAudit(id: string) {
  try {
    const { error } = await supabase
      .from('audits')
      .delete()
      .eq('id', id)

    if (error) throw error
    return { success: true }
  } catch (error) {
    handleSupabaseError(error)
    return { success: false, error }
  }
}

// Section functions
export async function createSection(section: Omit<AuditSection, 'id' | 'created_at' | 'updated_at'>) {
  try {
    const { data, error } = await supabase
      .from('audit_sections')
      .insert([section])
      .select()
      .single()

    if (error) throw error
    return data
  } catch (error) {
    handleSupabaseError(error)
  }
}

export async function updateSection(id: string, section: Partial<AuditSection>) {
  try {
    const { data, error } = await supabase
      .from('audit_sections')
      .update(section)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  } catch (error) {
    handleSupabaseError(error)
  }
}

// Question functions
export async function createQuestion(question: Omit<AuditQuestion, 'id' | 'created_at' | 'updated_at'>) {
  try {
    const { data, error } = await supabase
      .from('audit_questions')
      .insert([question])
      .select()
      .single()

    if (error) throw error
    return data
  } catch (error) {
    handleSupabaseError(error)
  }
}

export async function updateQuestion(id: string, question: Partial<AuditQuestion>) {
  try {
    const { data, error } = await supabase
      .from('audit_questions')
      .update(question)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  } catch (error) {
    handleSupabaseError(error)
  }
}

// Staff Interview functions
export async function createInterview(interview: Omit<StaffInterview, 'id' | 'created_at' | 'updated_at'>) {
  try {
    const now = new Date().toISOString()
    const { data, error } = await supabase
      .from('staff_interviews')
      .insert([{
        audit_id: interview.audit_id,
        staff_name: interview.staff_name,
        position: interview.position,
        interview_date: interview.interview_date,
        notes: interview.notes,
        created_at: now,
        updated_at: now
      }])
      .select('*')
      .single()

    if (error) {
      console.error('Supabase error creating interview:', error)
      throw error
    }
    return data as StaffInterview
  } catch (error) {
    console.error('Error in createInterview:', error)
    handleSupabaseError(error)
    throw error
  }
}

export async function updateInterview(id: string, interview: Partial<StaffInterview>) {
  try {
    const { data, error } = await supabase
      .from('staff_interviews')
      .update({
        staff_name: interview.staff_name,
        position: interview.position,
        interview_date: interview.interview_date,
        notes: interview.notes,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select('*')
      .single()

    if (error) {
      console.error('Supabase error updating interview:', error)
      throw error
    }
    return data as StaffInterview
  } catch (error) {
    console.error('Error in updateInterview:', error)
    handleSupabaseError(error)
    throw error
  }
}

export async function updateEthicalAssessmentResponse(
  id: string, 
  response: Partial<EthicalAssessmentResponse>
) {
  try {
    const { data, error } = await supabase
      .from('ethical_assessment_responses')
      .update({
        ...response,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  } catch (error) {
    handleSupabaseError(error)
    throw error
  }
}

// Add a function to batch update responses for better performance
export async function batchUpdateResponses(
  responses: Array<{ id: string; response: Partial<EthicalAssessmentResponse> }>
) {
  try {
    const { data, error } = await supabase
      .from('ethical_assessment_responses')
      .upsert(
        responses.map(({ id, response }) => ({
          id,
          ...response,
          updated_at: new Date().toISOString()
        }))
      )
      .select()

    if (error) throw error
    return data
  } catch (error) {
    handleSupabaseError(error)
    throw error
  }
} 