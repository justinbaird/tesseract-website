"use client"

import type React from "react"

import { useState } from "react"
import { Upload, User, X } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ProfileImageUploadProps {
  currentImageUrl?: string
  onImageUploaded: (url: string) => void
}

export function ProfileImageUpload({ currentImageUrl, onImageUploaded }: ProfileImageUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [dragActive, setDragActive] = useState(false)

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
        const error = await response.json()
        throw new Error(error.error || "Upload failed")
      }

      const { url } = await response.json()
      onImageUploaded(url)
    } catch (error) {
      console.error("Error uploading image:", error)
      alert("Error uploading image. Please try again.")
    } finally {
      setUploading(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragActive(false)

    const files = Array.from(e.dataTransfer.files)
    const imageFile = files.find((file) => file.type.startsWith("image/"))

    if (imageFile) {
      uploadImage(imageFile)
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      uploadImage(file)
    }
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Profile Image</h3>

      {currentImageUrl && (
        <div className="flex items-center gap-4">
          <img
            src={currentImageUrl || "/placeholder.svg"}
            alt="Current profile"
            className="w-16 h-16 rounded-full object-cover"
          />
          <Button variant="outline" size="sm" onClick={() => onImageUploaded("")}>
            <X className="h-4 w-4 mr-2" />
            Remove
          </Button>
        </div>
      )}

      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          dragActive ? "border-blue-500 bg-blue-50" : "border-gray-300"
        }`}
        onDragOver={(e) => {
          e.preventDefault()
          setDragActive(true)
        }}
        onDragLeave={() => setDragActive(false)}
        onDrop={handleDrop}
      >
        <User className="h-12 w-12 mx-auto mb-4 text-gray-400" />
        <p className="text-sm text-gray-600 mb-4">Drag and drop your profile image here, or click to select</p>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
          id="profile-image-upload"
          disabled={uploading}
        />
        <Button
          variant="outline"
          onClick={() => document.getElementById("profile-image-upload")?.click()}
          disabled={uploading}
        >
          <Upload className="h-4 w-4 mr-2" />
          {uploading ? "Uploading..." : "Select Image"}
        </Button>
      </div>
    </div>
  )
}
