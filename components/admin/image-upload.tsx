"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Upload, X, ImageIcon } from "lucide-react"

interface ImageUploadProps {
  onImageUploaded: (url: string) => void
  currentImage?: string
  className?: string
}

export function ImageUpload({ onImageUploaded, currentImage, className }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [preview, setPreview] = useState<string | null>(currentImage || null)

  const uploadImage = async (file: File) => {
    try {
      setUploading(true)

      const formData = new FormData()
      formData.append("file", file)

      const response = await fetch("/api/upload-image", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Upload failed")
      }

      const data = await response.json()

      setPreview(data.url)
      onImageUploaded(data.url)
    } catch (error) {
      console.error("Error uploading image:", error)
      alert(`Error uploading image: ${error instanceof Error ? error.message : "Please try again."}`)
    } finally {
      setUploading(false)
    }
  }

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        alert("Please select an image file")
        return
      }

      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        alert("Image must be less than 5MB")
        return
      }

      uploadImage(file)
    }
  }

  const removeImage = () => {
    setPreview(null)
    onImageUploaded("")
  }

  return (
    <div className={className}>
      <label className="block text-sm font-medium mb-2">Featured Image</label>

      {preview ? (
        <div className="relative">
          <img
            src={preview || "/placeholder.svg"}
            alt="Preview"
            className="w-full h-48 object-cover rounded-lg border"
          />
          <Button
            type="button"
            variant="destructive"
            size="sm"
            className="absolute top-2 right-2"
            onClick={removeImage}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
          <ImageIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <div className="space-y-2">
            <Button
              type="button"
              variant="outline"
              disabled={uploading}
              onClick={() => document.getElementById("image-upload")?.click()}
            >
              <Upload className="h-4 w-4 mr-2" />
              {uploading ? "Uploading..." : "Upload Image"}
            </Button>
            <p className="text-sm text-gray-500">PNG, JPG, GIF up to 5MB</p>
          </div>
        </div>
      )}

      <Input
        id="image-upload"
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
        disabled={uploading}
      />
    </div>
  )
}
