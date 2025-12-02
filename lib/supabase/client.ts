import { createClient as createSupabaseClient } from "@supabase/supabase-js"

let clientInstance: any = null

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

export const isSupabaseConfigured = !!(supabaseUrl && supabaseAnonKey)

export function createClient() {
  if (clientInstance) {
    return clientInstance
  }

  if (!isSupabaseConfigured) {
    clientInstance = {
      auth: {
        signInWithPassword: async () => ({ data: null, error: { message: "Supabase not configured" } }),
        signUp: async () => ({ data: null, error: { message: "Supabase not configured" } }),
        signOut: async () => ({ error: null }),
        getUser: async () => ({ data: { user: null }, error: null }),
        onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
      },
    } as any
    return clientInstance
  }

  try {
    clientInstance = createSupabaseClient(supabaseUrl!, supabaseAnonKey!, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
      },
    })
    return clientInstance
  } catch (error) {
    clientInstance = {
      auth: {
        signInWithPassword: async () => ({ data: null, error: { message: "Failed to create client" } }),
        signUp: async () => ({ data: null, error: { message: "Failed to create client" } }),
        signOut: async () => ({ error: null }),
        getUser: async () => ({ data: { user: null }, error: null }),
        onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
      },
    } as any
    return clientInstance
  }
}

export const supabase = createClient()
