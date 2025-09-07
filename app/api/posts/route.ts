import { type NextRequest, NextResponse } from "next/server"
import { getPosts, createPost, generateSlug, isSlugUnique } from "@/lib/posts"
import type { CreatePostData } from "@/lib/types/post"

// GET /api/posts - Get all posts with optional filtering
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status") as "draft" | "published" | null
    const category = searchParams.get("category")
    const featured = searchParams.get("featured")
    const limit = searchParams.get("limit")
    const offset = searchParams.get("offset")

    const options: any = {}

    if (status) options.status = status
    if (category) options.category = category
    if (featured !== null) options.featured = featured === "true"
    if (limit) options.limit = Number.parseInt(limit)
    if (offset) options.offset = Number.parseInt(offset)

    const posts = await getPosts(options)

    return NextResponse.json({ posts })
  } catch (error) {
    console.error("Error fetching posts:", error)
    return NextResponse.json({ error: "Failed to fetch posts" }, { status: 500 })
  }
}

// POST /api/posts - Create a new post
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, content, excerpt, image_url, category, tags, status, featured, background_color, opacity } = body

    if (!title || !content) {
      return NextResponse.json({ error: "Title and content are required" }, { status: 400 })
    }

    // Generate slug from title
    let slug = generateSlug(title)

    // Ensure slug is unique
    let counter = 1
    const originalSlug = slug
    while (!(await isSlugUnique(slug))) {
      slug = `${originalSlug}-${counter}`
      counter++
    }

    const postData: CreatePostData = {
      title,
      slug,
      content,
      excerpt,
      image_url,
      category,
      tags,
      status: status || "draft",
      featured: featured || false,
      background_color: background_color || "#000000",
      opacity: opacity ?? 100,
    }

    const post = await createPost(postData)

    return NextResponse.json({ post }, { status: 201 })
  } catch (error) {
    console.error("Error creating post:", error)
    return NextResponse.json({ error: "Failed to create post" }, { status: 500 })
  }
}
