import { PostEditor } from "@/components/admin/post-editor"

export default function NewPostPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Create New Post</h1>
          <p className="text-gray-400">Add a new post to your portfolio</p>
        </div>

        <PostEditor />
      </div>
    </div>
  )
}
