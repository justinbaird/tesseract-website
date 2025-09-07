import { getPostById } from "@/lib/posts"
import { PostEditor } from "@/components/admin/post-editor"
import { notFound } from "next/navigation"

export const dynamic = "force-dynamic"

interface EditPostPageProps {
  params: {
    id: string
  }
}

export default async function EditPostPage({ params }: EditPostPageProps) {
  console.log("[v0] Loading post edit page for ID:", params.id)

  const post = await getPostById(params.id)

  if (!post) {
    console.log("[v0] Post not found:", params.id)
    notFound()
  }

  console.log("[v0] Post loaded for editing:", post.title)

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Edit Post</h1>
          <p className="text-gray-400">Update your portfolio post</p>
        </div>

        <PostEditor post={post} />
      </div>
    </div>
  )
}
