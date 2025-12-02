import { createClient, createAdminClient } from "@/lib/supabase/server"
import type { Page, ContentBlock } from "@/lib/types/page"

export async function getPages(): Promise<Page[]> {
  console.log("[v0] Fetching pages")
  const supabase = createClient()

  console.log("[v0] Using sort_order for pages ordering")
  let { data, error } = await supabase.from("pages").select("*").order("sort_order", { ascending: true })

  if (error && error.message.includes("sort_order does not exist")) {
    console.log("[v0] sort_order column doesn't exist, retrying without it")
    // Fallback to created_at ordering if sort_order column doesn't exist yet
    const fallbackResult = await supabase.from("pages").select("*").order("created_at", { ascending: true })
    data = fallbackResult.data
    error = fallbackResult.error

    if (!error && data) {
      console.log("[v0] Successfully fetched pages on retry:", data.length)
    }
  } else if (!error && data) {
    console.log("[v0] Successfully fetched pages:", data.length)
  }

  if (error) {
    console.log("[v0] Error fetching pages:", error.message)
    throw new Error(`Failed to fetch pages: ${error.message}`)
  }

  return data || []
}

export async function getPageBySlug(slug: string): Promise<Page | null> {
  try {
    const supabase = createClient()

    const { data, error } = await supabase
      .from("pages")
      .select(`
        *,
        content_blocks (*)
      `)
      .eq("slug", slug)
      .single()

    if (error) {
      if (error.code === "PGRST116") {
        console.log("[v0] Page not found with slug:", slug)
        return null // Not found
      }
      console.log("[v0] Database error in getPageBySlug:", error.message)
      throw new Error(`Failed to fetch page: ${error.message}`)
    }

    console.log("[v0] Found page:", data?.title, "Published:", data?.is_published)

    // Sort content blocks by position
    if (data.content_blocks) {
      data.content_blocks.sort((a: ContentBlock, b: ContentBlock) => a.position - b.position)
    }

    return data
  } catch (error) {
    console.log("[v0] Unexpected error in getPageBySlug:", error)
    return null
  }
}

export async function getPageById(id: string): Promise<Page | null> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from("pages")
    .select(`
      *,
      content_blocks (*)
    `)
    .eq("id", id)
    .single()

  if (error) {
    if (error.code === "PGRST116") return null
    throw new Error(`Failed to fetch page: ${error.message}`)
  }

  // Sort content blocks by position
  if (data.content_blocks) {
    data.content_blocks.sort((a: ContentBlock, b: ContentBlock) => a.position - b.position)
  }

  return data
}

export async function createPage(pageData: Omit<Page, "id" | "created_at" | "updated_at">): Promise<Page> {
  const supabase = createAdminClient()

  // Extract content blocks from page data
  const { content_blocks, ...pageFields } = pageData

  // Create the page first
  const { data: page, error: pageError } = await supabase.from("pages").insert(pageFields).select().single()

  if (pageError) {
    throw new Error(`Failed to create page: ${pageError.message}`)
  }

  // If there are content blocks, save them separately
  if (content_blocks && content_blocks.length > 0) {
    const blocksToInsert = content_blocks.map((block, index) => ({
      page_id: page.id,
      block_type: block.block_type,
      content: block.content,
      position: index,
      is_visible: block.is_visible ?? true,
    }))

    const { error: blocksError } = await supabase.from("content_blocks").insert(blocksToInsert)

    if (blocksError) {
      // If content blocks fail, we should clean up the page
      await supabase.from("pages").delete().eq("id", page.id)
      throw new Error(`Failed to create content blocks: ${blocksError.message}`)
    }
  }

  // Return the page with content blocks
  return getPageById(page.id) || page
}

export async function updatePage(id: string, updates: Partial<Page>): Promise<Page> {
  console.log("[v0] updatePage - Starting database update")
  console.log("[v0] Page ID:", id)
  console.log("[v0] Updates:", JSON.stringify(updates, null, 2))

  const supabase = createAdminClient()

  const { data, error } = await supabase
    .from("pages")
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single()

  if (error) {
    console.log("[v0] Database update error:", error)
    throw new Error(`Failed to update page: ${error.message}`)
  }

  console.log("[v0] Database update successful:", data)
  return data
}

export async function deletePage(id: string): Promise<void> {
  const supabase = createAdminClient()

  const { error } = await supabase.from("pages").delete().eq("id", id)

  if (error) {
    throw new Error(`Failed to delete page: ${error.message}`)
  }
}

export async function updateContentBlocks(
  pageId: string,
  blocks: Omit<ContentBlock, "id" | "created_at" | "updated_at">[],
): Promise<void> {
  console.log("[v0] updateContentBlocks - Starting content blocks update")
  console.log("[v0] Page ID:", pageId)
  console.log("[v0] Blocks count:", blocks.length)
  console.log("[v0] Blocks data:", JSON.stringify(blocks, null, 2))

  const supabase = createAdminClient()

  // Delete existing blocks
  console.log("[v0] Deleting existing content blocks...")
  const { error: deleteError } = await supabase.from("content_blocks").delete().eq("page_id", pageId)

  if (deleteError) {
    console.log("[v0] Error deleting existing blocks:", deleteError)
    throw new Error(`Failed to delete existing content blocks: ${deleteError.message}`)
  }

  console.log("[v0] Existing blocks deleted successfully")

  // Insert new blocks
  if (blocks.length > 0) {
    console.log("[v0] Inserting new content blocks...")
    console.log("[v0] Blocks to insert:", JSON.stringify(blocks, null, 2))

    blocks.forEach((block, index) => {
      console.log(`[v0] Block ${index + 1}:`, {
        block_type: block.block_type,
        position: block.position,
        is_visible: block.is_visible,
        content_keys: Object.keys(block.content || {}),
      })
    })

    const { data: insertedBlocks, error } = await supabase.from("content_blocks").insert(blocks).select()

    if (error) {
      console.log("[v0] Error inserting new blocks:", error)
      console.log("[v0] Error details:", JSON.stringify(error, null, 2))
      throw new Error(`Failed to update content blocks: ${error.message}`)
    }

    console.log("[v0] New blocks inserted successfully")
    console.log("[v0] Inserted blocks count:", insertedBlocks?.length || 0)
    console.log("[v0] Inserted blocks:", JSON.stringify(insertedBlocks, null, 2))
  }

  console.log("[v0] Content blocks update completed")
}

export async function getNavigationPages(): Promise<Page[]> {
  console.log("[v0] Fetching navigation pages")
  const supabase = createClient()

  console.log("[v0] Using sort_order for navigation pages ordering")
  let { data, error } = await supabase.from("pages").select("*").order("sort_order", { ascending: true })

  if (error && error.message.includes("sort_order does not exist")) {
    console.log("[v0] sort_order column doesn't exist for navigation pages, retrying without it")
    // Fallback to created_at ordering if sort_order column doesn't exist yet
    const fallbackResult = await supabase.from("pages").select("*").order("created_at", { ascending: true })
    data = fallbackResult.data
    error = fallbackResult.error

    if (!error && data) {
      console.log("[v0] Successfully fetched navigation pages on retry:", data.length)
    }
  } else if (!error && data) {
    console.log("[v0] Successfully fetched navigation pages:", data.length)
  }

  if (error) {
    console.log("[v0] Error fetching navigation pages:", error.message)
    throw new Error(`Failed to fetch navigation pages: ${error.message}`)
  }

  return data || []
}

export async function updatePageOrder(pageIds: string[]): Promise<void> {
  const supabase = createAdminClient()

  const updates = pageIds.map((pageId, index) => supabase.from("pages").update({ sort_order: index }).eq("id", pageId))

  await Promise.all(updates)
}

export async function updatePageParent(pageId: string, parentId: string | null): Promise<void> {
  console.log("[v0] updatePageParent - Updating page parent")
  console.log("[v0] Page ID:", pageId)
  console.log("[v0] Parent ID:", parentId)
  
  const supabase = createAdminClient()

  const { error } = await supabase
    .from("pages")
    .update({ parent_id: parentId, updated_at: new Date().toISOString() })
    .eq("id", pageId)

  if (error) {
    console.log("[v0] Error updating page parent:", error)
    throw new Error(`Failed to update page parent: ${error.message}`)
  }

  console.log("[v0] Page parent updated successfully")
}

export async function getHierarchicalPages(): Promise<Page[]> {
  console.log("[v0] Fetching pages with hierarchical structure")
  const supabase = createClient()

  // First try with parent_id and sort_order
  let { data, error } = await supabase
    .from("pages")
    .select("*")
    .order("parent_id", { ascending: true, nullsFirst: true })
    .order("sort_order", { ascending: true })

  if (error && (error.message.includes("parent_id does not exist") || error.message.includes("sort_order does not exist"))) {
    console.log("[v0] parent_id or sort_order column doesn't exist, using basic ordering")
    // Fallback to basic ordering
    const fallbackResult = await supabase.from("pages").select("*").order("created_at", { ascending: true })
    data = fallbackResult.data
    error = fallbackResult.error
  }

  if (error) {
    console.log("[v0] Error fetching hierarchical pages:", error.message)
    throw new Error(`Failed to fetch hierarchical pages: ${error.message}`)
  }

  console.log("[v0] Successfully fetched hierarchical pages:", data?.length || 0)
  return data || []
}
