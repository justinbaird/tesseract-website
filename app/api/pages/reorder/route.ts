import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    const { pageIds } = await request.json()

    if (!Array.isArray(pageIds)) {
      return NextResponse.json({ error: "Invalid page IDs array" }, { status: 400 })
    }

    const supabase = createClient()

    // Update sort_order for each page based on its position in the array
    const updates = pageIds.map((pageId, index) =>
      supabase.from("pages").update({ sort_order: index }).eq("id", pageId),
    )

    await Promise.all(updates)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Failed to reorder pages:", error)
    return NextResponse.json({ error: "Failed to reorder pages" }, { status: 500 })
  }
}
