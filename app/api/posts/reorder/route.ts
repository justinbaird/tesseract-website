import { type NextRequest, NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    const { postIds } = await request.json()

    if (!Array.isArray(postIds)) {
      return NextResponse.json({ error: "Invalid post IDs array" }, { status: 400 })
    }

    const supabase = createAdminClient()

    // Update sort_order for each post based on its position in the array
    const updates = postIds.map((postId, index) =>
      supabase.from("posts").update({ sort_order: index }).eq("id", postId),
    )

    await Promise.all(updates)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Failed to reorder posts:", error)
    return NextResponse.json({ error: "Failed to reorder posts" }, { status: 500 })
  }
}
