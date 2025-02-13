import { createClient } from '@supabase/supabase-js'
import { Database } from '@/types/supabase'
import { 
  EthicalAssessmentCategory, 
  EthicalAssessmentResponse,
  StaffInterview,
  RACIMatrix,
  AuditWithDetails
} from '@/lib/types'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

// Create a Supabase client
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)

// Update storage bucket name to match Supabase configuration
const STORAGE_BUCKET = 'images'

export const storage = {
  // Upload an image to Supabase Storage
  uploadImage: async (file: File, path: string) => {
    const { data, error } = await supabase.storage
      .from(STORAGE_BUCKET)
      .upload(path, file, {
        cacheControl: '3600',
        upsert: true
      })
    
    if (error) throw error
    return data
  },

  // Get a public URL for an image
  getImageUrl: (path: string) => {
    const { data } = supabase.storage
      .from(STORAGE_BUCKET)
      .getPublicUrl(path)
    
    return data.publicUrl
  },

  // Delete an image from storage
  deleteImage: async (path: string) => {
    const { error } = await supabase.storage
      .from(STORAGE_BUCKET)
      .remove([path])
    
    if (error) throw error
  }
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
    console.log('Fetching audits from Supabase...')
    
    const { data, error, status, statusText, count } = await supabase
      .from('audits')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Supabase error fetching audits:', {
        error,
        status,
        statusText
      })
      throw error
    }

    console.log('Supabase response:', {
      status,
      statusText,
      totalCount: count,
      rowCount: data?.length || 0,
      data
    })

    return data as Audit[]
  } catch (error) {
    console.error('Error in getAudits:', error)
    if (error instanceof Error) {
      throw new Error(error.message)
    }
    throw new Error('An unexpected database error occurred')
  }
}

export async function getAuditById(id: string): Promise<AuditWithDetails | null> {
  try {
    // Get main audit data with all related information in a single query
    const { data: audit, error: auditError } = await supabase
      .from('audits')
      .select(`
        *,
        ethical_assessment_categories (*),
        ethical_assessment_responses (
          *,
          ethical_assessment_questions (*)
        ),
        raci_matrix (*),
        staff_interviews (*)
      `)
      .eq('id', id)
      .single()

    if (auditError) {
      console.error('Error fetching audit:', auditError)
      throw auditError
    }

    if (!audit) {
      console.error('No audit found with id:', id)
      return null
    }

    return audit as AuditWithDetails
  } catch (error) {
    console.error('Error in getAuditById:', error)
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
    console.error('Error in createAudit:', error)
    throw error
  }
}

export async function updateAudit(id: string, audit: Partial<AuditWithDetails>) {
  try {
    // Start a transaction
    const { data: auditData, error: auditError } = await supabase
      .from('audits')
      .update({
        name: audit.name,
        organization: audit.organization,
        description: audit.description,
        status: audit.status,
        overall_score: audit.overall_score,
        ethical_framework: audit.ethical_framework,
        risks_and_challenges: audit.risks_and_challenges,
        mitigation_strategies: audit.mitigation_strategies,
        continuous_monitoring: audit.continuous_monitoring,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (auditError) throw auditError;

    // Update ethical assessment categories if provided
    if (audit.ethical_assessment_categories) {
      const { error: categoriesError } = await supabase
        .from('ethical_assessment_categories')
        .upsert(
          audit.ethical_assessment_categories.map(category => ({
            audit_id: id,
            category_name: category.category_name,
            score: category.score,
            updated_at: new Date().toISOString()
          })),
          { onConflict: 'audit_id,category_name' }
        );

      if (categoriesError) throw categoriesError;
    }

    // Update ethical assessment responses if provided
    if (audit.ethical_assessment_responses) {
      // First, get existing responses for this audit
      const { data: existingResponses, error: fetchError } = await supabase
        .from('ethical_assessment_responses')
        .select('*')
        .eq('audit_id', id);

      if (fetchError) throw fetchError;

      // Create a map of existing responses by question_id
      const existingResponseMap = new Map(
        existingResponses?.map(response => [response.question_id, response]) || []
      );

      // Prepare upsert data
      const responsesToUpsert = audit.ethical_assessment_responses.map(response => {
        const existing = existingResponseMap.get(response.question_id);
        return {
          id: existing?.id, // Use existing ID if available
          audit_id: id,
          category_name: response.category_name,
          question_id: response.question_id,
          response: response.response,
          updated_at: new Date().toISOString()
        };
      });

      // Perform upsert operation
      const { error: responsesError } = await supabase
        .from('ethical_assessment_responses')
        .upsert(responsesToUpsert, {
          onConflict: 'audit_id,question_id',
          ignoreDuplicates: false
        });

      if (responsesError) throw responsesError;
    }

    // Fetch the updated audit with all related data
    const { data: updatedAudit, error: fetchError } = await supabase
      .from('audits')
      .select(`
        *,
        ethical_assessment_categories (*),
        ethical_assessment_responses (
          *,
          ethical_assessment_questions (*)
        ),
        raci_matrix (*),
        staff_interviews (*)
      `)
      .eq('id', id)
      .single();

    if (fetchError) throw fetchError;
    return updatedAudit;
  } catch (error) {
    console.error('Error in updateAudit:', error);
    throw error;
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
    console.error('Error in deleteAudit:', error)
    return { success: false, error }
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

export async function deleteInterview(interviewId: string) {
  const { error } = await supabase
    .from('interviews')
    .delete()
    .eq('id', interviewId);
    
  if (error) {
    throw new Error(`Error deleting interview: ${error.message}`);
  }
  
  return { success: true };
}

export type Audit = {
  id: string
  name: string
  organization: string
  status: string
  overall_score: number | null
} 