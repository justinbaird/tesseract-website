"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import type { Post } from "@/lib/types/post"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { ImageUpload } from "@/components/admin/image-upload"
import { ArrowLeft, Save, X } from "lucide-react"
import Link from "next/link"

interface PostEditorProps {
  post?: Post
}

export function PostEditor({ post }: PostEditorProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: post?.title || "",
    excerpt: post?.excerpt || "",
    content: post?.content || "",
    image_url: post?.image_url || "",
    category: post?.category || "",
    status: post?.status || "published",
    featured: post?.featured || false,
    background_color: post?.background_color || "#000000",
    opacity: post?.opacity ?? 100,
  })
  const [tags, setTags] = useState<string[]>(post?.tags || [])
  const [newTag, setNewTag] = useState("")

  const handleImageUploaded = (url: string) => {
    setFormData({ ...formData, image_url: url })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const url = post ? `/api/posts/${post.id}` : "/api/posts"
      const method = post ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          tags,
        }),
      })

      if (response.ok) {
        router.push("/admin")
        router.refresh()
      } else {
        const error = await response.json()
        alert(error.error || "Failed to save post")
      }
    } catch (error) {
      alert("Failed to save post")
    } finally {
      setIsLoading(false)
    }
  }

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()])
      setNewTag("")
    }
  }

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove))
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault()
      addTag()
    }
  }

  const renderBackgroundControls = () => (
    <div className="space-y-4">
      <div>
        <Label htmlFor="background_color" className="text-white">
          Background Color
        </Label>
        <div className="flex gap-2">
          <Input
            id="background_color"
            type="color"
            value={formData.background_color}
            onChange={(e) => setFormData({ ...formData, background_color: e.target.value })}
            className="w-16 h-10 bg-[#0a0a0a] border-gray-700"
          />
          <Input
            type="text"
            value={formData.background_color}
            onChange={(e) => setFormData({ ...formData, background_color: e.target.value })}
            className="bg-[#0a0a0a] border-gray-700 text-white flex-1"
            placeholder="#000000"
          />
        </div>
      </div>
      <div>
        <Label htmlFor="opacity" className="text-white">
          Opacity ({formData.opacity}%)
        </Label>
        <Input
          id="opacity"
          type="number"
          min="0"
          max="100"
          step="1"
          value={formData.opacity ?? 100}
          onChange={(e) => {
            const value = Number.parseInt(e.target.value)
            if (!isNaN(value) && value >= 0 && value <= 100) {
              setFormData({ ...formData, opacity: value })
            }
          }}
          className="bg-[#0a0a0a] border-gray-700 text-white"
          placeholder="100"
        />
      </div>
    </div>
  )

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <Link href="/admin">
          <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Posts
          </Button>
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-[#1a1a1a] rounded-lg border border-gray-800 p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="title" className="text-white">
                  Title *
                </Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="bg-[#0a0a0a] border-gray-700 text-white"
                  placeholder="Enter post title"
                  required
                />
              </div>

              <div>
                <Label htmlFor="category" className="text-white">
                  Category
                </Label>
                <Input
                  id="category"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="bg-[#0a0a0a] border-gray-700 text-white"
                  placeholder="e.g., UI/UX Design"
                />
              </div>

              <div>
                <ImageUpload
                  onImageUploaded={handleImageUploaded}
                  currentImage={formData.image_url}
                  className="w-full"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="status" className="text-white">
                  Status
                </Label>
                <select
                  id="status"
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as "draft" | "published" })}
                  className={`bg-[#0a0a0a] border border-gray-700 rounded-md px-3 py-2 text-white ${
                    formData.status === "published" ? "border-green-500" : "border-gray-700"
                  }`}
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                </select>
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="featured" className="text-white">
                  Featured Post
                </Label>
                <Switch
                  id="featured"
                  checked={formData.featured}
                  onCheckedChange={(checked) => setFormData({ ...formData, featured: checked })}
                />
              </div>

              <div>
                <Label htmlFor="tags" className="text-white">
                  Tags
                </Label>
                <div className="flex gap-2 mb-2">
                  <Input
                    id="tags"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="bg-[#0a0a0a] border-gray-700 text-white flex-1"
                    placeholder="Add a tag"
                  />
                  <Button type="button" onClick={addTag} size="sm" variant="outline">
                    Add
                  </Button>
                </div>
                <div className="flex flex-wrap gap-1">
                  {tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="bg-gray-800 text-gray-300 hover:bg-gray-700">
                      {tag}
                      <button type="button" onClick={() => removeTag(tag)} className="ml-1 hover:text-red-400">
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-[#1a1a1a] rounded-lg border border-gray-800 p-6">
          <h3 className="text-white text-lg font-semibold mb-4">Background Styling</h3>
          {renderBackgroundControls()}
        </div>

        <div className="bg-[#1a1a1a] rounded-lg border border-gray-800 p-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="excerpt" className="text-white">
                Excerpt
              </Label>
              <Textarea
                id="excerpt"
                value={formData.excerpt}
                onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                className="bg-[#0a0a0a] border-gray-700 text-white"
                placeholder="Brief description of the post"
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="content" className="text-white">
                Content *
              </Label>
              <Textarea
                id="content"
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                className="bg-[#0a0a0a] border-gray-700 text-white"
                placeholder="Write your post content here..."
                rows={12}
                required
              />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-4">
          <Link href="/admin">
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </Link>
          <Button type="submit" disabled={isLoading} className="bg-[#00ff88] hover:bg-[#00cc6a] text-black">
            {isLoading ? (
              "Saving..."
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                {post ? "Update Post" : "Create Post"}
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}
