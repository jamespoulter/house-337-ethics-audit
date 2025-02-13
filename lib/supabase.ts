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
    // Check authentication first
    const { data: { session }, error: authError } = await supabase.auth.getSession()
    
    if (authError) {
      console.error('Authentication error:', authError)
      throw new Error('Authentication failed')
    }

    if (!session) {
      console.error('No active session')
      throw new Error('Not authenticated')
    }

    console.log('Authenticated as user:', session.user.id)
    
    // Fetch audits with detailed logging
    const { data, error, status, statusText, count } = await supabase
      .from('audits')
      .select('*', { count: 'exact' })
      .eq('user_id', session.user.id) // Explicitly filter by user_id
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Supabase error fetching audits:', {
        error,
        status,
        statusText,
        errorCode: error.code,
        errorMessage: error.message,
        errorDetails: error.details
      })
      throw error
    }

    console.log('Supabase response:', {
      status,
      statusText,
      totalCount: count,
      rowCount: data?.length || 0,
      data,
      userId: session.user.id
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
    // Check authentication first
    const { data: { session }, error: authError } = await supabase.auth.getSession()
    
    if (authError) {
      console.error('Authentication error:', authError)
      throw new Error('Authentication failed')
    }

    if (!session) {
      console.error('No active session')
      throw new Error('Not authenticated')
    }

    console.log('Fetching audit with ID:', id, 'for user:', session.user.id)
    
    // First, check if the audit exists and is accessible
    const { data: auditExists, error: existsError } = await supabase
      .from('audits')
      .select('id')
      .eq('id', id)
      .eq('user_id', session.user.id) // Explicitly check user ownership
      .single()

    if (existsError) {
      console.error('Error checking audit existence:', {
        error: existsError,
        errorCode: existsError.code,
        errorMessage: existsError.message,
        errorDetails: existsError.details,
        userId: session.user.id,
        auditId: id
      })
      throw existsError
    }

    if (!auditExists) {
      console.error('No audit found with id:', id, 'for user:', session.user.id)
      return null
    }

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
      .eq('user_id', session.user.id) // Explicitly check user ownership
      .single()

    if (auditError) {
      console.error('Error fetching audit details:', {
        error: auditError,
        errorCode: auditError.code,
        errorMessage: auditError.message,
        errorDetails: auditError.details,
        hint: auditError.hint,
        userId: session.user.id,
        auditId: id
      })
      throw auditError
    }

    if (!audit) {
      console.error('No audit details found with id:', id, 'for user:', session.user.id)
      return null
    }

    console.log('Successfully fetched audit:', {
      id: audit.id,
      name: audit.name,
      userId: session.user.id,
      categoriesCount: audit.ethical_assessment_categories?.length || 0,
      responsesCount: audit.ethical_assessment_responses?.length || 0,
      raciCount: audit.raci_matrix?.length || 0,
      interviewsCount: audit.staff_interviews?.length || 0
    })

    return audit as AuditWithDetails
  } catch (error) {
    console.error('Error in getAuditById:', error)
    return null
  }
}

export async function createAudit(auditData: Partial<Audit>) {
  try {
    // Get the current session
    const { data: { session }, error: authError } = await supabase.auth.getSession()
    
    if (authError) {
      console.error('Authentication error:', authError)
      throw new Error('Authentication failed')
    }

    if (!session) {
      console.error('No active session')
      throw new Error('Not authenticated')
    }

    // Add user_id to the audit data
    const auditWithUserId = {
      ...auditData,
      user_id: session.user.id
    }

    const { data, error } = await supabase
      .from('audits')
      .insert([auditWithUserId])
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