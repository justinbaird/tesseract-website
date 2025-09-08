"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Upload, Image as ImageIcon, Trash2, ExternalLink } from "lucide-react"
import { toast } from "sonner"

interface BackgroundImageUploadProps {
  currentImageUrl: string
  onImageUploaded: (url: string) => void
}

export function BackgroundImageUpload({ currentImageUrl, onImageUploaded }: BackgroundImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [customUrl, setCustomUrl] = useState("")
  const [imageError, setImageError] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file')
      return
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error('Image must be less than 10MB')
      return
    }

    setIsUploading(true)
    try {
      console.log('[v0] Uploading background image:', file.name)
      
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/upload-image', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.details || 'Failed to upload image')
      }

      const data = await response.json()
      console.log('[v0] Background image uploaded successfully:', data.url)
      
      onImageUploaded(data.url)
      setImageError(false)
      toast.success('Background image uploaded successfully!')
      
    } catch (error) {
      console.error('[v0] Failed to upload background image:', error)
      toast.error(`Failed to upload image: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setIsUploading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const handleUrlSubmit = () => {
    if (!customUrl.trim()) {
      toast.error('Please enter an image URL')
      return
    }

    try {
      new URL(customUrl) // Validate URL format
      onImageUploaded(customUrl.trim())
      setCustomUrl('')
      setImageError(false)
      toast.success('Background image URL updated!')
    } catch {
      toast.error('Please enter a valid URL')
    }
  }

  const handleRemoveImage = () => {
    onImageUploaded('/web-background.jpg') // Reset to default
    toast.success('Background image reset to default')
  }

  const isDefaultImage = currentImageUrl === '/web-background.jpg'

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <ImageIcon className="w-5 h-5" />
        <h3 className="text-lg font-semibold">Background Image</h3>
      </div>
      
      <p className="text-gray-400 text-sm">
        Upload a custom background image for your website or provide an image URL.
        Recommended size: 1920x1080px or larger.
      </p>

      {/* Current Image Preview */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">Current Background</Label>
        <div className="relative w-full h-32 bg-gray-900 rounded-lg border border-gray-700 overflow-hidden">
          {!imageError && currentImageUrl ? (
            <img
              src={currentImageUrl}
              alt="Current background"
              className="w-full h-full object-cover"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-500">
              <ImageIcon className="w-8 h-8" />
            </div>
          )}
          <div className="absolute inset-0 bg-black/20 flex items-end p-2">
            <span className="text-white text-xs bg-black/50 px-2 py-1 rounded">
              {isDefaultImage ? 'Default Background' : 'Custom Background'}
            </span>
          </div>
        </div>
        
        <div className="flex gap-2">
          {currentImageUrl && (
            <a
              href={currentImageUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#00ff88] hover:text-[#00cc6a] text-xs flex items-center gap-1"
            >
              <ExternalLink className="w-3 h-3" />
              View Full Size
            </a>
          )}
        </div>
      </div>

      {/* Upload Methods */}
      <div className="space-y-4">
        {/* File Upload */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Upload New Image</Label>
          <div className="flex gap-2">
            <Input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              disabled={isUploading}
              className="bg-[#0a0a0a] border-gray-700 text-white file:bg-[#00ff88] file:text-black file:border-0 file:rounded file:px-3 file:py-1 file:text-sm file:font-medium hover:file:bg-[#00cc6a]"
            />
            {!isDefaultImage && (
              <Button
                onClick={handleRemoveImage}
                variant="outline"
                size="sm"
                className="border-red-700 text-red-400 hover:text-red-300 hover:border-red-600"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            )}
          </div>
          {isUploading && (
            <p className="text-[#00ff88] text-sm">Uploading image...</p>
          )}
        </div>

        {/* URL Input */}
        <div className="space-y-2">
          <Label htmlFor="background-url" className="text-sm font-medium">Or Enter Image URL</Label>
          <div className="flex gap-2">
            <Input
              id="background-url"
              type="url"
              placeholder="https://example.com/image.jpg"
              value={customUrl}
              onChange={(e) => setCustomUrl(e.target.value)}
              className="bg-[#0a0a0a] border-gray-700 text-white placeholder:text-gray-500 focus:border-[#00ff88] focus:ring-[#00ff88]"
            />
            <Button
              onClick={handleUrlSubmit}
              disabled={!customUrl.trim()}
              className="bg-[#00ff88] hover:bg-[#00cc6a] text-black font-medium"
            >
              Set URL
            </Button>
          </div>
        </div>
      </div>

      <div className="text-xs text-gray-500 space-y-1">
        <p>• Supported formats: JPG, PNG, WebP, AVIF</p>
        <p>• Maximum file size: 10MB</p>
        <p>• Images are stored in Supabase storage</p>
      </div>
    </div>
  )
}
