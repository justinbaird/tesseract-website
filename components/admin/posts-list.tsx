"use client"

import { useState } from "react"
import type { Post } from "@/lib/types/post"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Edit, Trash2, Star, GripVertical, ChevronUp, ChevronDown } from "lucide-react"
import Link from "next/link"

interface PostsListProps {
  posts: Post[]
}

function formatDistanceToNow(date: Date): string {
  const now = new Date()
  const diffInMs = now.getTime() - date.getTime()
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24))
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60))
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60))

  if (diffInDays > 0) {
    return `${diffInDays} day${diffInDays === 1 ? "" : "s"}`
  } else if (diffInHours > 0) {
    return `${diffInHours} hour${diffInHours === 1 ? "" : "s"}`
  } else if (diffInMinutes > 0) {
    return `${diffInMinutes} minute${diffInMinutes === 1 ? "" : "s"}`
  } else {
    return "just now"
  }
}

export function PostsList({ posts: initialPosts }: PostsListProps) {
  const [posts, setPosts] = useState(initialPosts)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [isReordering, setIsReordering] = useState(false)

  const movePostUp = async (index: number) => {
    if (index === 0) return

    const newPosts = [...posts]
    const temp = newPosts[index]
    newPosts[index] = newPosts[index - 1]
    newPosts[index - 1] = temp

    setPosts(newPosts)
    await updateOrder(newPosts)
  }

  const movePostDown = async (index: number) => {
    if (index === posts.length - 1) return

    const newPosts = [...posts]
    const temp = newPosts[index]
    newPosts[index] = newPosts[index + 1]
    newPosts[index + 1] = temp

    setPosts(newPosts)
    await updateOrder(newPosts)
  }

  const updateOrder = async (reorderedPosts: Post[]) => {
    try {
      setIsReordering(true)
      const postIds = reorderedPosts.map((post) => post.id)

      const response = await fetch("/api/posts/reorder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postIds }),
      })

      if (!response.ok) {
        throw new Error("Failed to update post order")
      }
    } catch (error) {
      console.error("Failed to reorder posts:", error)
      // Revert on error
      setPosts(initialPosts)
    } finally {
      setIsReordering(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this post?")) return

    setDeletingId(id)
    try {
      const response = await fetch(`/api/posts/${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        setPosts(posts.filter((post) => post.id !== id))
      } else {
        alert("Failed to delete post")
      }
    } catch (error) {
      alert("Failed to delete post")
    } finally {
      setDeletingId(null)
    }
  }

  if (posts.length === 0) {
    return (
      <div className="p-8 text-center">
        <p className="text-gray-400 mb-4">No posts found</p>
        <Link href="/admin/posts/new">
          <Button className="bg-[#00ff88] hover:bg-[#00cc6a] text-black">Create your first post</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="divide-y divide-gray-800">
      {posts.map((post, index) => (
        <div key={post.id} className="p-6 hover:bg-[#1f1f1f] transition-colors">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3">
              <div className="flex flex-col gap-1 mt-1">
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-6 w-6 p-0 text-gray-400 hover:text-white"
                  onClick={() => movePostUp(index)}
                  disabled={index === 0 || isReordering}
                >
                  <ChevronUp className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-6 w-6 p-0 text-gray-400 hover:text-white"
                  onClick={() => movePostDown(index)}
                  disabled={index === posts.length - 1 || isReordering}
                >
                  <ChevronDown className="w-4 h-4" />
                </Button>
              </div>
              <GripVertical className="w-4 h-4 text-gray-500 mt-1" />

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-lg font-semibold text-white truncate">{post.title}</h3>
                  {post.featured && <Star className="w-4 h-4 text-[#00ff88] fill-current" />}
                </div>

                {post.excerpt && <p className="text-gray-400 text-sm mb-3 line-clamp-2">{post.excerpt}</p>}

                <div className="flex items-center gap-4 text-xs text-gray-500">
                  <span>Created {formatDistanceToNow(new Date(post.created_at))} ago</span>
                  {post.published_at && <span>Published {formatDistanceToNow(new Date(post.published_at))} ago</span>}
                  {post.category && <span className="text-gray-400">in {post.category}</span>}
                </div>

                {post.tags && post.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {post.tags.slice(0, 3).map((tag) => (
                      <Badge
                        key={tag}
                        variant="secondary"
                        className="text-xs bg-gray-800 text-gray-300 hover:bg-gray-700"
                      >
                        {tag}
                      </Badge>
                    ))}
                    {post.tags.length > 3 && (
                      <Badge variant="secondary" className="text-xs bg-gray-800 text-gray-300">
                        +{post.tags.length - 3} more
                      </Badge>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2 ml-4">
              <Badge
                variant={post.status === "published" ? "default" : "secondary"}
                className={
                  post.status === "published"
                    ? "bg-green-600 hover:bg-green-700 text-white"
                    : "bg-yellow-600 hover:bg-yellow-700 text-white"
                }
              >
                {post.status}
              </Badge>

              <div className="flex items-center gap-1">
                <Link href={`/admin/posts/${post.id}`}>
                  <Button size="sm" variant="ghost" className="text-gray-400 hover:text-white">
                    <Edit className="w-4 h-4" />
                  </Button>
                </Link>

                <Button
                  size="sm"
                  variant="ghost"
                  className="text-gray-400 hover:text-red-400"
                  onClick={() => handleDelete(post.id)}
                  disabled={deletingId === post.id}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
