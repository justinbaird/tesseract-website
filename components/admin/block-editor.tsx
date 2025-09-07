"use client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Trash2 } from "lucide-react"
import { ImageUpload } from "@/components/admin/image-upload"
import type { ContentBlock } from "@/lib/types/page"

interface BlockEditorProps {
  block: ContentBlock
  onUpdate: (updates: Partial<ContentBlock>) => void
  onDelete: () => void
}

export function BlockEditor({ block, onUpdate, onDelete }: BlockEditorProps) {
  const updateContent = (key: string, value: any) => {
    onUpdate({
      content: {
        ...block.content,
        [key]: value,
      },
    })
  }

  const renderBackgroundControls = () => (
    <div className="space-y-4 pt-4 border-t border-gray-600">
      <h4 className="text-sm font-medium text-gray-300">Background Styling</h4>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="backgroundColor">Background Color</Label>
          <Input
            id="backgroundColor"
            type="color"
            value={block.content.backgroundColor || "#000000"}
            onChange={(e) => updateContent("backgroundColor", e.target.value)}
            className="bg-gray-700 border-gray-600 h-10"
          />
        </div>
        <div>
          <Label htmlFor="opacity">Opacity (%)</Label>
          <Input
            id="opacity"
            type="number"
            min="0"
            max="100"
            step="1"
            value={block.content.opacity ?? 100}
            onChange={(e) => {
              const value = e.target.value === "" ? 0 : Number(e.target.value)
              updateContent("opacity", Math.max(0, Math.min(100, value)))
            }}
            className="bg-gray-700 border-gray-600"
            placeholder="100"
          />
          <p className="text-xs text-gray-400 mt-1">0% = transparent, 100% = fully opaque</p>
        </div>
      </div>
    </div>
  )

  const renderEditor = () => {
    switch (block.block_type) {
      case "hero":
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={block.content.title || ""}
                onChange={(e) => updateContent("title", e.target.value)}
                className="bg-gray-700 border-gray-600"
              />
            </div>
            <div>
              <Label htmlFor="subtitle">Subtitle</Label>
              <Input
                id="subtitle"
                value={block.content.subtitle || ""}
                onChange={(e) => updateContent("subtitle", e.target.value)}
                className="bg-gray-700 border-gray-600"
              />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={block.content.description || ""}
                onChange={(e) => updateContent("description", e.target.value)}
                className="bg-gray-700 border-gray-600"
              />
            </div>
            <div>
              <Label htmlFor="buttonText">Button Text</Label>
              <Input
                id="buttonText"
                value={block.content.buttonText || ""}
                onChange={(e) => updateContent("buttonText", e.target.value)}
                className="bg-gray-700 border-gray-600"
              />
            </div>
            <div>
              <Label htmlFor="buttonLink">Button Link</Label>
              <Input
                id="buttonLink"
                value={block.content.buttonLink || ""}
                onChange={(e) => updateContent("buttonLink", e.target.value)}
                className="bg-gray-700 border-gray-600"
              />
            </div>
            {renderBackgroundControls()}
          </div>
        )

      case "text":
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Title (Optional)</Label>
              <Input
                id="title"
                value={block.content.title || ""}
                onChange={(e) => updateContent("title", e.target.value)}
                className="bg-gray-700 border-gray-600"
              />
            </div>
            <div>
              <Label htmlFor="content">Content</Label>
              <Textarea
                id="content"
                value={block.content.content || ""}
                onChange={(e) => updateContent("content", e.target.value)}
                className="bg-gray-700 border-gray-600 min-h-32"
              />
            </div>
            <div>
              <Label htmlFor="alignment">Text Alignment</Label>
              <Select
                value={block.content.alignment || "left"}
                onValueChange={(value) => updateContent("alignment", value)}
              >
                <SelectTrigger className="bg-gray-700 border-gray-600">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="left">Left</SelectItem>
                  <SelectItem value="center">Center</SelectItem>
                  <SelectItem value="right">Right</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {renderBackgroundControls()}
          </div>
        )

      case "image":
        return (
          <div className="space-y-4">
            <ImageUpload
              onImageUploaded={(url) => updateContent("src", url)}
              currentImage={block.content.src}
              className="mb-4"
            />
            <div>
              <Label htmlFor="alt">Alt Text</Label>
              <Input
                id="alt"
                value={block.content.alt || ""}
                onChange={(e) => updateContent("alt", e.target.value)}
                className="bg-gray-700 border-gray-600"
              />
            </div>
            <div>
              <Label htmlFor="caption">Caption (Optional)</Label>
              <Input
                id="caption"
                value={block.content.caption || ""}
                onChange={(e) => updateContent("caption", e.target.value)}
                className="bg-gray-700 border-gray-600"
              />
            </div>
            <div>
              <Label htmlFor="percentageWidth">Image Width (%)</Label>
              <Input
                id="percentageWidth"
                type="number"
                min="1"
                max="100"
                value={block.content.percentageWidth || 100}
                onChange={(e) => updateContent("percentageWidth", Number(e.target.value))}
                className="bg-gray-700 border-gray-600"
                placeholder="100"
              />
              <p className="text-xs text-gray-400 mt-1">Set image width as percentage of container (1-100%)</p>
            </div>
            {renderBackgroundControls()}
          </div>
        )

      case "portfolio":
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Title (Optional)</Label>
              <Input
                id="title"
                value={block.content.title || ""}
                onChange={(e) => updateContent("title", e.target.value)}
                className="bg-gray-700 border-gray-600"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="featured"
                checked={block.content.showFeaturedOnly || false}
                onCheckedChange={(checked) => updateContent("showFeaturedOnly", checked)}
              />
              <Label htmlFor="featured">Show Featured Only</Label>
            </div>
            <div>
              <Label htmlFor="layout">Layout</Label>
              <Select value={block.content.layout || "grid"} onValueChange={(value) => updateContent("layout", value)}>
                <SelectTrigger className="bg-gray-700 border-gray-600">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="grid">Grid</SelectItem>
                  <SelectItem value="list">List</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {block.content.layout === "grid" && (
              <div>
                <Label htmlFor="itemsPerRow">Items Per Row</Label>
                <Select
                  value={String(block.content.itemsPerRow || 3)}
                  onValueChange={(value) => updateContent("itemsPerRow", Number.parseInt(value))}
                >
                  <SelectTrigger className="bg-gray-700 border-gray-600">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2">2</SelectItem>
                    <SelectItem value="3">3</SelectItem>
                    <SelectItem value="4">4</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
            <div>
              <Label htmlFor="tagFilter">Tag Filter (Optional)</Label>
              <Input
                id="tagFilter"
                value={block.content.tagFilter || ""}
                onChange={(e) => updateContent("tagFilter", e.target.value)}
                className="bg-gray-700 border-gray-600"
                placeholder="e.g., advisory"
              />
              <p className="text-xs text-gray-400 mt-1">Filter posts by tag. Leave empty to show all posts.</p>
            </div>
            {renderBackgroundControls()}
          </div>
        )

      case "contact":
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Title (Optional)</Label>
              <Input
                id="title"
                value={block.content.title || ""}
                onChange={(e) => updateContent("title", e.target.value)}
                className="bg-gray-700 border-gray-600"
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={block.content.email || ""}
                onChange={(e) => updateContent("email", e.target.value)}
                className="bg-gray-700 border-gray-600"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="showForm"
                checked={block.content.showForm || false}
                onCheckedChange={(checked) => updateContent("showForm", checked)}
              />
              <Label htmlFor="showForm">Show Contact Form</Label>
            </div>
            {renderBackgroundControls()}
          </div>
        )

      case "video":
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Title (Optional)</Label>
              <Input
                id="title"
                value={block.content.title || ""}
                onChange={(e) => updateContent("title", e.target.value)}
                className="bg-gray-700 border-gray-600"
              />
            </div>
            <div>
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea
                id="description"
                value={block.content.description || ""}
                onChange={(e) => updateContent("description", e.target.value)}
                placeholder="Add explanatory text that appears before the video"
                className="bg-gray-700 border-gray-600 min-h-20"
              />
            </div>
            <div>
              <Label htmlFor="src">Video URL</Label>
              <Input
                id="src"
                value={block.content.src || ""}
                onChange={(e) => updateContent("src", e.target.value)}
                placeholder="YouTube URL or direct video file URL"
                className="bg-gray-700 border-gray-600"
              />
              <p className="text-xs text-gray-400 mt-1">
                Supports YouTube URLs (e.g., https://www.youtube.com/watch?v=VIDEO_ID) or direct video files (.mp4)
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="autoplay"
                checked={block.content.autoplay || false}
                onCheckedChange={(checked) => updateContent("autoplay", checked)}
              />
              <Label htmlFor="autoplay">Autoplay (muted)</Label>
            </div>
            {renderBackgroundControls()}
          </div>
        )

      case "image_text_left":
      case "image_text_right":
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Title (Optional)</Label>
              <Input
                id="title"
                value={block.content.title || ""}
                onChange={(e) => updateContent("title", e.target.value)}
                className="bg-gray-700 border-gray-600"
              />
            </div>
            <div>
              <Label htmlFor="content">Text Content</Label>
              <Textarea
                id="content"
                value={block.content.content || ""}
                onChange={(e) => updateContent("content", e.target.value)}
                className="bg-gray-700 border-gray-600 min-h-32"
              />
            </div>
            <div>
              <Label className="block text-sm font-medium mb-2">Section Image</Label>
              <ImageUpload
                onImageUploaded={(url) => updateContent("image_src", url)}
                currentImage={block.content.image_src}
                className="mb-4"
              />
            </div>
            <div>
              <Label htmlFor="image_alt">Image Alt Text</Label>
              <Input
                id="image_alt"
                value={block.content.image_alt || ""}
                onChange={(e) => updateContent("image_alt", e.target.value)}
                className="bg-gray-700 border-gray-600"
              />
            </div>
            <div>
              <Label htmlFor="image_caption">Image Caption (Optional)</Label>
              <Input
                id="image_caption"
                value={block.content.image_caption || ""}
                onChange={(e) => updateContent("image_caption", e.target.value)}
                className="bg-gray-700 border-gray-600"
              />
            </div>
            <div>
              <Label htmlFor="text_alignment">Text Alignment</Label>
              <Select
                value={block.content.text_alignment || "left"}
                onValueChange={(value) => updateContent("text_alignment", value)}
              >
                <SelectTrigger className="bg-gray-700 border-gray-600">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="left">Left</SelectItem>
                  <SelectItem value="center">Center</SelectItem>
                  <SelectItem value="right">Right</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {renderBackgroundControls()}
          </div>
        )

      case "embed":
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Title (Optional)</Label>
              <Input
                id="title"
                value={block.content.title || ""}
                onChange={(e) => updateContent("title", e.target.value)}
                className="bg-gray-700 border-gray-600"
              />
            </div>
            <div>
              <Label htmlFor="url">Embed URL</Label>
              <Input
                id="url"
                value={block.content.url || ""}
                onChange={(e) => updateContent("url", e.target.value)}
                placeholder="https://www.youtube.com/watch?v=... or any embeddable URL"
                className="bg-gray-700 border-gray-600"
              />
              <p className="text-xs text-gray-400 mt-1">
                Supports YouTube, Vimeo, Twitter, CodePen, and other embeddable content
              </p>
            </div>
            <div>
              <Label htmlFor="embed_type">Embed Type</Label>
              <Select
                value={block.content.embed_type || "auto"}
                onValueChange={(value) => updateContent("embed_type", value)}
              >
                <SelectTrigger className="bg-gray-700 border-gray-600">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="auto">Auto Detect</SelectItem>
                  <SelectItem value="youtube">YouTube</SelectItem>
                  <SelectItem value="vimeo">Vimeo</SelectItem>
                  <SelectItem value="twitter">Twitter</SelectItem>
                  <SelectItem value="codepen">CodePen</SelectItem>
                  <SelectItem value="iframe">Generic Iframe</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="width">Width</Label>
                <Input
                  id="width"
                  value={block.content.width || "100%"}
                  onChange={(e) => updateContent("width", e.target.value)}
                  placeholder="100% or 800px"
                  className="bg-gray-700 border-gray-600"
                />
              </div>
              <div>
                <Label htmlFor="height">Height</Label>
                <Input
                  id="height"
                  value={block.content.height || "400px"}
                  onChange={(e) => updateContent("height", e.target.value)}
                  placeholder="400px or 50vh"
                  className="bg-gray-700 border-gray-600"
                />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="allow_fullscreen"
                checked={block.content.allow_fullscreen !== false}
                onCheckedChange={(checked) => updateContent("allow_fullscreen", checked)}
              />
              <Label htmlFor="allow_fullscreen">Allow Fullscreen</Label>
            </div>
            {renderBackgroundControls()}
          </div>
        )

      default:
        return <div className="text-gray-400">No editor available for {block.block_type} blocks</div>
    }
  }

  return (
    <Card className="bg-gray-700 border-gray-600">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm capitalize text-white">{block.block_type} Block</CardTitle>
          <Button
            size="sm"
            variant="ghost"
            onClick={onDelete}
            className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {renderEditor()}

        <div className="pt-4 border-t border-gray-600">
          <div className="flex items-center space-x-2">
            <Switch
              id="visible"
              checked={block.is_visible}
              onCheckedChange={(checked) => onUpdate({ is_visible: checked })}
            />
            <Label htmlFor="visible" className="text-sm text-gray-300">
              Visible
            </Label>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
