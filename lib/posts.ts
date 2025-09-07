import { createClient } from "@/lib/supabase/server"
import type { Post, CreatePostData, UpdatePostData } from "@/lib/types/post"

// Get all posts with optional filtering
export async function getPosts(options?: {
  status?: "draft" | "published"
  category?: string
  featured?: boolean
  tagFilter?: string
  limit?: number
  offset?: number
}) {
  const supabase = createClient()

  console.log("[v0] Fetching posts with options:", options)

  let query = supabase.from("posts").select("*")

  // Use sort_order for admin-defined ordering, fallback to created_at
  query = query.order("sort_order", { ascending: true, nullsFirst: false })
         .order("created_at", { ascending: false })
  console.log("[v0] Using sort_order (admin-defined) with created_at fallback")

  if (options?.status) {
    query = query.eq("status", options.status)
  }

  if (options?.category) {
    query = query.eq("category", options.category)
  }

  if (options?.featured !== undefined) {
    query = query.eq("featured", options.featured)
  }

  if (options?.tagFilter) {
    query = query.contains("tags", [options.tagFilter])
  }

  if (options?.limit) {
    query = query.limit(options.limit)
  }

  if (options?.offset) {
    query = query.range(options.offset, options.offset + (options.limit || 10) - 1)
  }
  const { data, error } = await query

  if (error && error.message.includes("sort_order does not exist")) {
    console.log("[v0] sort_order column doesn't exist, retrying without it")
    // Retry without sort_order
    let retryQuery = supabase.from("posts").select("*").order("created_at", { ascending: false })

    if (options?.status) {
      retryQuery = retryQuery.eq("status", options.status)
    }

    if (options?.category) {
      retryQuery = retryQuery.eq("category", options.category)
    }

    if (options?.featured !== undefined) {
      retryQuery = retryQuery.eq("featured", options.featured)
    }

    if (options?.tagFilter) {
      retryQuery = retryQuery.contains("tags", [options.tagFilter])
    }

    if (options?.limit) {
      retryQuery = retryQuery.limit(options.limit)
    }

    if (options?.offset) {
      retryQuery = retryQuery.range(options.offset, options.offset + (options.limit || 10) - 1)
    }

    const retryResult = await retryQuery
    if (retryResult.error) {
      console.log("[v0] Retry failed:", retryResult.error.message)
      throw new Error(`Failed to fetch posts: ${retryResult.error.message}`)
    }
    console.log("[v0] Successfully fetched posts on retry:", retryResult.data?.length || 0)
    return retryResult.data as Post[]
  }

  if (error) {
    console.log("[v0] Posts fetch error:", error.message)
    throw new Error(`Failed to fetch posts: ${error.message}`)
  }

  console.log("[v0] Successfully fetched posts:", data?.length || 0)
  return data as Post[]
}

// Get a single post by slug
export async function getPostBySlug(slug: string) {
  const supabase = createClient()

  const { data, error } = await supabase.from("posts").select("*").eq("slug", slug).single()

  if (error) {
    if (error.code === "PGRST116") {
      return null // Post not found
    }
    throw new Error(`Failed to fetch post: ${error.message}`)
  }

  return data as Post
}

// Get a single post by ID
export async function getPostById(id: string) {
  const supabase = createClient()

  const { data, error } = await supabase.from("posts").select("*").eq("id", id).single()

  if (error) {
    if (error.code === "PGRST116") {
      return null // Post not found
    }
    throw new Error(`Failed to fetch post: ${error.message}`)
  }

  return data as Post
}

// Create a new post
export async function createPost(postData: CreatePostData) {
  const supabase = createClient()

  const { data, error } = await supabase
    .from("posts")
    .insert([
      {
        ...postData,
        published_at: postData.status === "published" ? new Date().toISOString() : null,
      },
    ])
    .select()
    .single()

  if (error) {
    throw new Error(`Failed to create post: ${error.message}`)
  }

  return data as Post
}

// Update an existing post
export async function updatePost(postData: UpdatePostData) {
  const supabase = createClient()

  const updateData: any = { ...postData }
  delete updateData.id

  // Set published_at when status changes to published
  if (postData.status === "published") {
    updateData.published_at = new Date().toISOString()
  } else if (postData.status === "draft") {
    updateData.published_at = null
  }

  const { data, error } = await supabase.from("posts").update(updateData).eq("id", postData.id).select().single()

  if (error) {
    throw new Error(`Failed to update post: ${error.message}`)
  }

  return data as Post
}

// Delete a post
export async function deletePost(id: string) {
  const supabase = createClient()

  const { error } = await supabase.from("posts").delete().eq("id", id)

  if (error) {
    throw new Error(`Failed to delete post: ${error.message}`)
  }

  return true
}

// Generate a unique slug from title
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9 -]/g, "") // Remove special characters
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/-+/g, "-") // Replace multiple hyphens with single hyphen
    .trim()
}

// Check if slug is unique
export async function isSlugUnique(slug: string, excludeId?: string) {
  const supabase = createClient()

  let query = supabase.from("posts").select("id").eq("slug", slug)

  if (excludeId) {
    query = query.neq("id", excludeId)
  }

  const { data, error } = await query

  if (error) {
    throw new Error(`Failed to check slug uniqueness: ${error.message}`)
  }

  return data.length === 0
}

// Update post order
export async function updatePostOrder(postIds: string[]): Promise<void> {
  const supabase = createClient()

  const updates = postIds.map((postId, index) => supabase.from("posts").update({ sort_order: index }).eq("id", postId))

  await Promise.all(updates)
}
