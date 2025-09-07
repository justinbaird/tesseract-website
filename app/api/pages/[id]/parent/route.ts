import { NextRequest, NextResponse } from "next/server"
import { updatePageParent } from "@/lib/pages"

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { parentId } = await request.json()
    
    console.log("[v0] PATCH /api/pages/[id]/parent - Request received")
    console.log("[v0] Page ID:", params.id)
    console.log("[v0] Parent ID:", parentId)
    
    await updatePageParent(params.id, parentId)
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Error updating page parent:", error)
    return NextResponse.json(
      { error: "Failed to update page parent" },
      { status: 500 }
    )
  }
}
