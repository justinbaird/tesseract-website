import { NextResponse, type NextRequest } from "next/server"

// Disable Supabase configuration check
export const isSupabaseConfigured = false

export async function updateSession(request: NextRequest) {
  // Always allow requests to pass through without authentication
  return NextResponse.next({
    request,
  })
}
