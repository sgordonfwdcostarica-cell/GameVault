import { createClient } from '@supabase/supabase-js'
import { env } from './env.js'

// Cliente con service_role: bypassa RLS. Solo se usa en el backend, nunca en el cliente.
export const supabaseAdmin = createClient(env.supabaseUrl, env.supabaseServiceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
})
