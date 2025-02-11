import { createClient } from '@supabase/supabase-js';
import { Database } from './database.types';

if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
  throw new Error('Missing env.NEXT_PUBLIC_SUPABASE_URL');
}
if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  throw new Error('Missing env.NEXT_PUBLIC_SUPABASE_ANON_KEY');
}

export const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false
    }
  }
);

// Helper function to get the current user
export const getCurrentUser = async () => {
  try {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) throw error;
    return user;
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
};

// Helper function to get user profile
export const getUserProfile = async (userId: string) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();
  
  if (error) throw error;
  return data;
};

// Helper to create or update user profile
export async function upsertProfile(profile: {
  id: string
  email: string
  full_name?: string | null
  organization?: string | null
}) {
  const { data, error } = await supabase
    .from('profiles')
    .upsert(profile)
    .select()
    .single();

  if (error) throw error;
  return data;
}

// Audit related helpers
export const createAudit = async (auditData: {
  title: string;
  description?: string;
  organization: string;
}) => {
  const user = await getCurrentUser();
  if (!user) throw new Error('User not authenticated');

  const { data, error } = await supabase
    .from('audits')
    .insert({
      ...auditData,
      created_by: user.id,
      status: 'draft'
    })
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const getAuditsByOrganization = async () => {
  const { data, error } = await supabase
    .from('audits')
    .select(`
      *,
      created_by:profiles(full_name, email),
      audit_questions(count)
    `)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
};

export const getAuditDetails = async (auditId: string) => {
  const { data, error } = await supabase
    .from('audits')
    .select(`
      *,
      created_by:profiles(full_name, email),
      audit_questions(
        *,
        audit_responses(*)
      )
    `)
    .eq('id', auditId)
    .single();

  if (error) throw error;
  return data;
}; 