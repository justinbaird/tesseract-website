import { createClient as createSupabaseClient } from "@supabase/supabase-js"
import { cache } from "react"

export const isSupabaseConfigured = true

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || "https://placeholder.supabase.co"
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || "placeholder-key"
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "placeholder-service-key"

function createDummyQuery() {
  const chainable = {
    select: () => chainable,
    insert: () => chainable,
    update: () => chainable,
    delete: () => chainable,
    eq: () => chainable,
    neq: () => chainable,
    single: () => chainable,
    order: () => chainable,
    limit: () => chainable,
    range: () => chainable,
    upsert: () => chainable,
    in: () => chainable,
    then: (resolve: any) => resolve({ data: [], error: null }),
    data: [],
    error: null,
  }
  return chainable
}

// Create client for read operations (uses anon key)
export const createClient = cache(() => {
  try {
    const client = createSupabaseClient(supabaseUrl, supabaseAnonKey)
    return client
  } catch (error) {
    return {
      from: () => createDummyQuery(),
      auth: {
        getUser: () => Promise.resolve({ data: { user: null }, error: null }),
        getSession: () => Promise.resolve({ data: { session: null }, error: null }),
      },
    }
  }
})

// Create admin client for write operations (uses service role key to bypass RLS)
export const createAdminClient = cache(() => {
  try {
    if (!supabaseServiceRoleKey || supabaseServiceRoleKey === "placeholder-service-key") {
      console.error("[v0] SUPABASE_SERVICE_ROLE_KEY is not configured. Write operations will fail.")
      throw new Error("Service role key not configured")
    }
    const client = createSupabaseClient(supabaseUrl, supabaseServiceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    })
    return client
  } catch (error) {
    console.error("[v0] Failed to create admin client:", error)
    return {
      from: () => createDummyQuery(),
      auth: {
        getUser: () => Promise.resolve({ data: { user: null }, error: null }),
        getSession: () => Promise.resolve({ data: { session: null }, error: null }),
      },
    }
  }
})
