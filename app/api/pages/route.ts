import { type NextRequest, NextResponse } from "next/server"
import { createPage, getPages } from "@/lib/pages"

// Force dynamic rendering
export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const pages = await getPages()
    return NextResponse.json(pages)
  } catch (error) {
    console.error("Failed to fetch pages:", error)
    return NextResponse.json({ error: "Failed to fetch pages" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log('[v0] POST /api/pages - Creating new page')
    const body = await request.json()
    console.log('[v0] Request body:', JSON.stringify(body, null, 2))
    
    const page = await createPage(body)
    console.log('[v0] Page created successfully:', page.id)
    
    return NextResponse.json(page, { status: 201 })
  } catch (error) {
    console.error("[v0] Failed to create page:", error)
    return NextResponse.json({ 
      error: "Failed to create page", 
      details: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 })
  }
}
