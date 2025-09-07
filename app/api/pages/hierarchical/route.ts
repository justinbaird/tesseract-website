import { NextResponse } from "next/server"
import { getHierarchicalPages } from "@/lib/pages"

export async function GET() {
  try {
    console.log("[v0] GET /api/pages/hierarchical - Fetching hierarchical pages")
    
    const pages = await getHierarchicalPages()
    
    console.log("[v0] Successfully fetched hierarchical pages:", pages.length)
    return NextResponse.json(pages)
  } catch (error) {
    console.error("[v0] Error fetching hierarchical pages:", error)
    return NextResponse.json(
      { error: "Failed to fetch hierarchical pages" },
      { status: 500 }
    )
  }
}
