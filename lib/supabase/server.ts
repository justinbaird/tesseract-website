import { createClient as createSupabaseClient } from "@supabase/supabase-js"
import { cache } from "react"

export const isSupabaseConfigured = true

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || "https://placeholder.supabase.co"
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || "placeholder-key"

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
    then: (resolve: any) => resolve({ data: [], error: null }),
    data: [],
    error: null,
  }
  return chainable
}

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
