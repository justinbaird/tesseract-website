import { NextResponse } from "next/server"
import { getHierarchicalPages } from "@/lib/pages"

export async function GET() {
  // Return empty array during build if Supabase isn't configured
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || 
      process.env.NEXT_PUBLIC_SUPABASE_URL === 'https://your-project-id.supabase.co') {
    console.log("[v0] Supabase not configured, returning empty navigation")
    return NextResponse.json([])
  }
  
  try {
    const pages = await getHierarchicalPages()
    return NextResponse.json(pages)
  } catch (error) {
    console.error("Failed to fetch navigation pages:", error)
    return NextResponse.json([])
  }
}
