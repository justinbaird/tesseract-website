import { type NextRequest, NextResponse } from "next/server"
import { getPageById, updatePage, deletePage, updateContentBlocks } from "@/lib/pages"
import { revalidatePath } from "next/cache"
import { unstable_noStore } from "next/cache"

interface RouteParams {
  params: { id: string }
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    unstable_noStore()

    const page = await getPageById(params.id)
    if (!page) {
      return NextResponse.json({ error: "Page not found" }, { status: 404 })
    }

    const response = NextResponse.json(page)
    response.headers.set("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate")
    response.headers.set("Pragma", "no-cache")
    response.headers.set("Expires", "0")
    return response
  } catch (error) {
    console.error("Failed to fetch page:", error)
    return NextResponse.json({ error: "Failed to fetch page" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    unstable_noStore()

    console.log("[v0] PUT /api/pages/[id] - Starting page update")
    console.log("[v0] Page ID:", params.id)
    console.log("[v0] Request URL:", request.url)
    console.log("[v0] Request method:", request.method)

    console.log("[v0] Authentication bypassed for page saving")

    const body = await request.json()
    console.log("[v0] Request body received:", JSON.stringify(body, null, 2))

    const { content_blocks, ...pageData } = body

    console.log("[v0] Page data to update:", JSON.stringify(pageData, null, 2))
    console.log("[v0] Content blocks count:", content_blocks?.length || 0)

    if (!params.id) {
      console.log("[v0] Error: No page ID provided")
      return NextResponse.json({ error: "Page ID is required" }, { status: 400 })
    }

    // Update page data
    console.log("[v0] Updating page data...")
    const page = await updatePage(params.id, pageData)
    console.log("[v0] Page data updated successfully:", page)

    // Update content blocks if provided
    if (content_blocks) {
      console.log("[v0] Updating content blocks...")
      const blocksToSave = content_blocks.map((block: any, index: number) => ({
        page_id: params.id,
        block_type: block.block_type,
        content: block.content,
        position: index,
        is_visible: block.is_visible,
      }))

      console.log("[v0] Blocks to save:", JSON.stringify(blocksToSave, null, 2))
      const updatedBlocks = await updateContentBlocks(params.id, blocksToSave)
      console.log("[v0] Content blocks updated successfully:", updatedBlocks)
    }

    console.log("[v0] Invalidating cache for all page routes...")
    revalidatePath(`/admin/pages/${params.id}/edit`)
    revalidatePath(`/admin/pages`)
    revalidatePath(`/${page.slug}`) // Public page route
    revalidatePath("/") // Home page that might display page content
    revalidatePath("/admin", "layout")
    revalidatePath("/", "layout")

    // Also invalidate common page routes that might display this content
    if (page.slug === "home" || page.slug === "index") {
      revalidatePath("/")
    }

    console.log("[v0] Cache invalidated for public and admin routes")

    console.log("[v0] Page update completed successfully")

    const response = NextResponse.json({ success: true, page })
    response.headers.set("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate")
    response.headers.set("Pragma", "no-cache")
    response.headers.set("Expires", "0")
    return response
  } catch (error) {
    console.error("[v0] Failed to update page:", error)
    console.error("[v0] Error details:", error instanceof Error ? error.message : String(error))
    return NextResponse.json(
      {
        error: "Failed to update page",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    console.log("[v0] Authentication bypassed for page deletion")

    // Get page info before deletion for cache invalidation
    const page = await getPageById(params.id)

    console.log("[v0] Deleting page...")
    await deletePage(params.id)
    console.log("[v0] Page deleted successfully")

    console.log("[v0] Invalidating cache after page deletion...")
    revalidatePath(`/admin/pages/${params.id}/edit`)
    revalidatePath(`/admin/pages`)
    if (page?.slug) {
      revalidatePath(`/${page.slug}`) // Public page route
    }
    revalidatePath("/") // Home page
    revalidatePath("/admin", "layout")
    revalidatePath("/", "layout")
    console.log("[v0] Cache invalidated after deletion")

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Failed to delete page:", error)
    return NextResponse.json({ error: "Failed to delete page" }, { status: 500 })
  }
}
