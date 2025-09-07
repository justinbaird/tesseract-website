"use client"

import { useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import {
  Save,
  Eye,
  Settings,
  Trash2,
  GripVertical,
  Type,
  ImageIcon,
  Layout,
  Mail,
  Video,
  Star,
  ArrowLeft,
  PanelLeft,
  PanelRight,
  Globe,
} from "lucide-react"
import type { Page, ContentBlock, BlockType } from "@/lib/types/page"
import { BlockRenderer } from "@/components/admin/block-renderer"
import { BlockEditor } from "@/components/admin/block-editor"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

interface VisualEditorProps {
  page: Page
  isNew?: boolean
}

const BLOCK_TYPES: { type: BlockType; label: string; icon: any }[] = [
  { type: "hero", label: "Hero Section", icon: Star },
  { type: "text", label: "Text Block", icon: Type },
  { type: "image", label: "Image", icon: ImageIcon },
  { type: "image_text_left", label: "Image + Text", icon: PanelLeft },
  { type: "image_text_right", label: "Text + Image", icon: PanelRight },
  { type: "portfolio", label: "Portfolio Grid", icon: Layout },
  { type: "contact", label: "Contact Form", icon: Mail },
  { type: "video", label: "Video", icon: Video },
  { type: "embed", label: "Embed Block", icon: Globe },
]

export function VisualEditor({ page, isNew = false }: VisualEditorProps) {
  const [currentPage, setCurrentPage] = useState<Page>(page)
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null)
  const [showSettings, setShowSettings] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const router = useRouter()

  const addBlock = useCallback(
    (type: BlockType) => {
      console.log("[v0] Adding new block of type:", type)

      const newBlock: ContentBlock = {
        id: `temp-${Date.now()}`,
        page_id: currentPage.id,
        block_type: type,
        content: getDefaultContent(type),
        position: currentPage.content_blocks?.length || 0,
        is_visible: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }

      console.log("[v0] Created new block:", newBlock)

      setCurrentPage((prev) => ({
        ...prev,
        content_blocks: [...(prev.content_blocks || []), newBlock],
      }))
      setSelectedBlockId(newBlock.id)
    },
    [currentPage],
  )

  const updateBlock = useCallback((blockId: string, updates: Partial<ContentBlock>) => {
    setCurrentPage((prev) => ({
      ...prev,
      content_blocks:
        prev.content_blocks?.map((block) => (block.id === blockId ? { ...block, ...updates } : block)) || [],
    }))
  }, [])

  const deleteBlock = useCallback((blockId: string) => {
    setCurrentPage((prev) => ({
      ...prev,
      content_blocks: prev.content_blocks?.filter((block) => block.id !== blockId) || [],
    }))
    setSelectedBlockId(null)
  }, [])

  const moveBlock = useCallback((blockId: string, direction: "up" | "down") => {
    setCurrentPage((prev) => {
      const blocks = [...(prev.content_blocks || [])]
      const index = blocks.findIndex((b) => b.id === blockId)
      if (index === -1) return prev

      const newIndex = direction === "up" ? index - 1 : index + 1
      if (newIndex < 0 || newIndex >= blocks.length)
        return prev

        // Swap blocks
      ;[blocks[index], blocks[newIndex]] = [blocks[newIndex], blocks[index]]

      // Update positions
      blocks.forEach((block, i) => {
        block.position = i
      })

      return { ...prev, content_blocks: blocks }
    })
  }, [])

  const savePage = async () => {
    setIsSaving(true)
    try {
      console.log("[v0] Starting page save process")
      console.log("[v0] Page ID:", currentPage.id)
      console.log("[v0] Is new page:", isNew)

      const pageData = {
        title: currentPage.title,
        slug: currentPage.slug,
        meta_description: currentPage.meta_description,
        is_published: currentPage.is_published,
        is_homepage: currentPage.is_homepage,
        content_blocks: currentPage.content_blocks?.map((block, index) => ({
          ...block,
          position: index,
        })),
      }

      console.log("[v0] Page data to save:", JSON.stringify(pageData, null, 2))

      if (isNew) {
        console.log("[v0] Creating new page")
        const response = await fetch("/api/pages", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Cache-Control": "no-cache",
            Pragma: "no-cache",
          },
          body: JSON.stringify(pageData),
        })

        console.log("[v0] Create page response status:", response.status)

        if (!response.ok) {
          const errorText = await response.text()
          console.log("[v0] Create page error response:", errorText)
          throw new Error("Failed to create page")
        }

        const newPage = await response.json()
        console.log("[v0] New page created:", newPage)
        toast.success("Page created successfully!")
        router.push(`/admin/pages/${newPage.id}/edit`)
      } else {
        console.log("[v0] Updating existing page")
        const timestamp = Date.now()
        const response = await fetch(`/api/pages/${currentPage.id}?t=${timestamp}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "Cache-Control": "no-cache",
            Pragma: "no-cache",
          },
          body: JSON.stringify(pageData),
        })

        console.log("[v0] Update page response status:", response.status)

        if (!response.ok) {
          const errorText = await response.text()
          console.log("[v0] Update page error response:", errorText)
          throw new Error("Failed to update page")
        }

        const updatedPage = await response.json()
        console.log("[v0] Page updated successfully:", updatedPage)
        toast.success("Page saved successfully!")

        console.log("[v0] Forcing page reload to show fresh data")
        window.location.reload()
      }
    } catch (error) {
      console.error("[v0] Failed to save page:", error)
      toast.error("Failed to save page. Please try again.")
    } finally {
      setIsSaving(false)
    }
  }

  const selectedBlock = currentPage.content_blocks?.find((b) => b.id === selectedBlockId)

  return (
    <div className="min-h-screen bg-gray-900 text-white flex">
      {/* Sidebar */}
      <div className="w-80 bg-gray-800 border-r border-gray-700 flex flex-col">
        <div className="p-4 border-b border-gray-700">
          <div className="flex items-center gap-2 mb-4">
            <Link href="/admin">
              <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Admin
              </Button>
            </Link>
          </div>
          <h2 className="text-lg font-semibold">Page Builder</h2>
        </div>

        {/* Page Settings */}
        <div className="p-4 border-b border-gray-700">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowSettings(!showSettings)}
            className="w-full justify-start"
          >
            <Settings className="w-4 h-4 mr-2" />
            Page Settings
          </Button>

          {showSettings && (
            <div className="mt-4 space-y-4">
              <div>
                <Label htmlFor="title">Page Title</Label>
                <Input
                  id="title"
                  value={currentPage.title}
                  onChange={(e) => setCurrentPage((prev) => ({ ...prev, title: e.target.value }))}
                  className="bg-gray-700 border-gray-600"
                />
              </div>
              <div>
                <Label htmlFor="slug">URL Slug</Label>
                <Input
                  id="slug"
                  value={currentPage.slug}
                  onChange={(e) => setCurrentPage((prev) => ({ ...prev, slug: e.target.value }))}
                  className="bg-gray-700 border-gray-600"
                />
              </div>
              <div>
                <Label htmlFor="description">Meta Description</Label>
                <Textarea
                  id="description"
                  value={currentPage.meta_description || ""}
                  onChange={(e) => setCurrentPage((prev) => ({ ...prev, meta_description: e.target.value }))}
                  className="bg-gray-700 border-gray-600"
                />
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="published"
                  checked={currentPage.is_published}
                  onCheckedChange={(checked) => setCurrentPage((prev) => ({ ...prev, is_published: checked }))}
                />
                <Label htmlFor="published">Published</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="homepage"
                  checked={currentPage.is_homepage}
                  onCheckedChange={(checked) => setCurrentPage((prev) => ({ ...prev, is_homepage: checked }))}
                />
                <Label htmlFor="homepage">Set as Homepage</Label>
              </div>
            </div>
          )}
        </div>

        {/* Block Library */}
        <div className="p-4 border-b border-gray-700">
          <h3 className="text-sm font-medium mb-3">Add Blocks</h3>
          <div className="grid grid-cols-2 gap-2">
            {BLOCK_TYPES.map(({ type, label, icon: Icon }) => (
              <Button
                key={type}
                variant="outline"
                size="sm"
                onClick={() => addBlock(type)}
                className="h-auto p-3 flex flex-col items-center gap-1"
              >
                <Icon className="w-4 h-4" />
                <span className="text-xs">{label}</span>
              </Button>
            ))}
          </div>
        </div>

        {/* Block Editor */}
        {selectedBlock && (
          <div className="flex-1 p-4 overflow-y-auto">
            <BlockEditor
              block={selectedBlock}
              onUpdate={(updates) => updateBlock(selectedBlock.id, updates)}
              onDelete={() => deleteBlock(selectedBlock.id)}
            />
          </div>
        )}
      </div>

      {/* Main Editor Area */}
      <div className="flex-1 flex flex-col">
        {/* Toolbar */}
        <div className="bg-gray-800 border-b border-gray-700 p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-semibold">{currentPage.title}</h1>
            {currentPage.is_homepage && <Badge className="bg-yellow-500 text-black">Homepage</Badge>}
            {currentPage.is_published ? (
              <Badge className="bg-green-600">Published</Badge>
            ) : (
              <Badge variant="outline">Draft</Badge>
            )}
          </div>
          <div className="flex items-center gap-2">
            {currentPage.is_published && !isNew && (
              <Link href={`/${currentPage.slug === "home" ? "" : currentPage.slug}`} target="_blank">
                <Button variant="outline" size="sm">
                  <Eye className="w-4 h-4 mr-2" />
                  Preview
                </Button>
              </Link>
            )}
            <Button onClick={savePage} disabled={isSaving} className="bg-[#00ff88] hover:bg-[#00cc6a] text-black">
              <Save className="w-4 h-4 mr-2" />
              {isSaving ? "Saving..." : isNew ? "Create Page" : "Save"}
            </Button>
          </div>
        </div>

        {/* Canvas */}
        <div className="flex-1 overflow-y-auto bg-gray-100">
          <div className="max-w-4xl mx-auto bg-white min-h-full">
            {currentPage.content_blocks?.map((block, index) => (
              <div
                key={block.id}
                className={`relative group ${selectedBlockId === block.id ? "ring-2 ring-blue-500" : ""}`}
                onClick={() => setSelectedBlockId(block.id)}
              >
                {/* Block Controls */}
                <div className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="flex items-center gap-1 bg-gray-900 rounded p-1">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={(e) => {
                        e.stopPropagation()
                        moveBlock(block.id, "up")
                      }}
                      disabled={index === 0}
                      className="h-6 w-6 p-0 text-white hover:bg-gray-700"
                    >
                      <GripVertical className="w-3 h-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={(e) => {
                        e.stopPropagation()
                        deleteBlock(block.id)
                      }}
                      className="h-6 w-6 p-0 text-red-400 hover:bg-gray-700"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>

                <BlockRenderer block={block} />
              </div>
            ))}

            {/* Empty State */}
            {(!currentPage.content_blocks || currentPage.content_blocks.length === 0) && (
              <div className="flex items-center justify-center h-96 text-gray-500">
                <div className="text-center">
                  <Layout className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p className="text-lg mb-2">Start building your page</p>
                  <p className="text-sm">Add blocks from the sidebar to get started</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function getDefaultContent(type: BlockType): any {
  console.log("[v0] Generating default content for block type:", type)

  switch (type) {
    case "hero":
      return {
        title: "Hero Title",
        subtitle: "Hero Subtitle",
        description: "Hero description text goes here",
        buttonText: "Call to Action",
        buttonLink: "#",
      }
    case "text":
      return {
        title: "Text Block Title",
        content: "Your text content goes here...",
        alignment: "left",
      }
    case "image":
      return {
        src: "/placeholder.svg?height=400&width=600",
        alt: "Image description",
        caption: "",
      }
    case "image_text_left":
    case "image_text_right":
      const content = {
        title: "Section Title",
        content:
          "Your text content goes here. This section provides a great way to combine images with descriptive text in a visually appealing layout.",
        image_src: "/abstract-geometric-section.png",
        image_alt: "Section image description",
        image_caption: "",
        text_alignment: "left",
      }
      console.log("[v0] Generated image-text content:", content)
      return content
    case "portfolio":
      return {
        title: "Portfolio",
        showFeaturedOnly: false,
        layout: "grid",
        itemsPerRow: 3,
      }
    case "contact":
      return {
        title: "Contact Us",
        email: "hello@example.com",
        showForm: true,
      }
    case "video":
      return {
        src: "",
        title: "Video Title",
        autoplay: false,
      }
    case "embed":
      return {
        title: "Embedded Content",
        url: "",
        embed_type: "auto",
        width: "100%",
        height: "400px",
        allow_fullscreen: true,
      }
    default:
      console.log("[v0] Unknown block type, returning empty content:", type)
      return {}
  }
}
