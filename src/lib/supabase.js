import { createClient } from '@supabase/supabase-js'

// Get Supabase credentials from environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL?.trim()
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim()

// Validate environment variables
if (!supabaseUrl || supabaseUrl === 'YOUR_SUPABASE_URL') {
  throw new Error(
    'Missing VITE_SUPABASE_URL. Please check your .env file and restart the dev server.'
  )
}

if (!supabaseAnonKey || supabaseAnonKey === 'YOUR_SUPABASE_ANON_KEY') {
  throw new Error(
    'Missing VITE_SUPABASE_ANON_KEY. Please check your .env file and restart the dev server.'
  )
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

