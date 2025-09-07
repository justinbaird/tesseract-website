import { type NextRequest, NextResponse } from "next/server"
import { revalidatePath } from "next/cache"
import { getPostById, updatePost, deletePost, generateSlug, isSlugUnique } from "@/lib/posts"
import type { UpdatePostData } from "@/lib/types/post"

// GET /api/posts/[id] - Get a single post by ID
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const post = await getPostById(params.id)

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 })
    }

    return NextResponse.json({ post })
  } catch (error) {
    console.error("Error fetching post:", error)
    return NextResponse.json({ error: "Failed to fetch post" }, { status: 500 })
  }
}

// PUT /api/posts/[id] - Update a post
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const { title, content, excerpt, image_url, category, tags, status, featured } = body

    console.log("[v0] PUT /api/posts/[id] - Updating post:", params.id)
    console.log("[v0] Update data:", { title, status, featured })

    // Check if post exists
    const existingPost = await getPostById(params.id)
    if (!existingPost) {
      console.log("[v0] Post not found:", params.id)
      return NextResponse.json({ error: "Post not found" }, { status: 404 })
    }

    const updateData: UpdatePostData = {
      id: params.id,
      ...body,
    }

    // If title changed, generate new slug
    if (title && title !== existingPost.title) {
      let slug = generateSlug(title)

      // Ensure slug is unique (excluding current post)
      let counter = 1
      const originalSlug = slug
      while (!(await isSlugUnique(slug, params.id))) {
        slug = `${originalSlug}-${counter}`
        counter++
      }

      updateData.slug = slug
      console.log("[v0] Generated new slug:", slug)
    }

    const post = await updatePost(updateData)
    console.log("[v0] Post updated successfully:", post.id)

    revalidatePath(`/admin/posts/${params.id}`)
    revalidatePath("/admin")
    revalidatePath(`/${existingPost.slug}`) // Individual post page
    revalidatePath(`/${post.slug}`) // New slug if changed
    revalidatePath("/") // Home page that might show posts
    revalidatePath("/posts") // Posts list page
    console.log("[v0] Cache invalidated for admin and public post pages")

    return NextResponse.json({ post })
  } catch (error) {
    console.error("[v0] Error updating post:", error)
    return NextResponse.json({ error: "Failed to update post" }, { status: 500 })
  }
}

// DELETE /api/posts/[id] - Delete a post
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Check if post exists
    const existingPost = await getPostById(params.id)
    if (!existingPost) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 })
    }

    await deletePost(params.id)

    revalidatePath("/admin")
    revalidatePath(`/${existingPost.slug}`) // Individual post page
    revalidatePath("/") // Home page that might show posts
    revalidatePath("/posts") // Posts list page
    console.log("[v0] Cache invalidated for admin and public pages after post deletion")

    return NextResponse.json({ message: "Post deleted successfully" })
  } catch (error) {
    console.error("Error deleting post:", error)
    return NextResponse.json({ error: "Failed to delete post" }, { status: 500 })
  }
}
