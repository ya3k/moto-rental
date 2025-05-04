import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

// Create the client - the auth context will handle the case when credentials are missing
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export default supabase 