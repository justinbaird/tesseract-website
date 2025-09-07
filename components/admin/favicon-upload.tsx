"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Upload, X } from "lucide-react"

interface FaviconUploadProps {
  currentFaviconUrl?: string
  onFaviconUploaded: (url: string) => void
}

export function FaviconUpload({ currentFaviconUrl, onFaviconUploaded }: FaviconUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [dragActive, setDragActive] = useState(false)

  const handleFileUpload = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      alert("Please select an image file")
      return
    }

    // Check if it's a suitable favicon size (ideally 16x16, 32x32, or 48x48)
    const img = new Image()
    img.onload = async () => {
      if (img.width > 512 || img.height > 512) {
        alert("Favicon should be 512x512 pixels or smaller for best results")
        return
      }
      await uploadFile(file)
    }
    img.src = URL.createObjectURL(file)
  }

  const uploadFile = async (file: File) => {
    setIsUploading(true)
    try {
      const formData = new FormData()
      formData.append("file", file)
      formData.append("bucket", "images")
      formData.append("folder", "favicon")

      const response = await fetch("/api/upload-image", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error("Upload failed")
      }

      const data = await response.json()
      onFaviconUploaded(data.url)
    } catch (error) {
      console.error("Error uploading favicon:", error)
      alert("Failed to upload favicon. Please try again.")
    } finally {
      setIsUploading(false)
    }
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0])
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileUpload(e.target.files[0])
    }
  }

  const removeFavicon = () => {
    onFaviconUploaded("")
  }

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold text-white mb-2">Website Favicon</h3>
        <p className="text-gray-400 text-sm mb-4">
          Upload a favicon for your website. Recommended size: 32x32 or 48x48 pixels. Supports PNG, ICO, or SVG formats.
        </p>
      </div>

      {currentFaviconUrl ? (
        <div className="flex items-center gap-4 p-4 bg-gray-800/50 rounded-lg border border-gray-700">
          <div className="w-8 h-8 bg-white rounded flex items-center justify-center">
            <img
              src={currentFaviconUrl || "/placeholder.svg"}
              alt="Current favicon"
              className="w-6 h-6 object-contain"
              onError={(e) => {
                e.currentTarget.style.display = "none"
              }}
            />
          </div>
          <div className="flex-1">
            <p className="text-white text-sm font-medium">Current favicon</p>
            <p className="text-gray-400 text-xs truncate">{currentFaviconUrl}</p>
          </div>
          <Button
            onClick={removeFavicon}
            variant="outline"
            size="sm"
            className="border-red-600 text-red-400 hover:bg-red-600 hover:text-white bg-transparent"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      ) : null}

      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          dragActive ? "border-[#00ff88] bg-[#00ff88]/10" : "border-gray-600 hover:border-gray-500"
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p className="text-white mb-2">
          {isUploading ? "Uploading favicon..." : "Drop your favicon here or click to browse"}
        </p>
        <p className="text-gray-400 text-sm mb-4">PNG, ICO, or SVG up to 512x512px</p>
        <input
          type="file"
          accept="image/*,.ico"
          onChange={handleInputChange}
          disabled={isUploading}
          className="hidden"
          id="favicon-upload"
        />
        <label htmlFor="favicon-upload">
          <Button
            type="button"
            disabled={isUploading}
            className="bg-[#00ff88] hover:bg-[#00cc6a] text-black font-medium"
          >
            {isUploading ? "Uploading..." : "Choose File"}
          </Button>
        </label>
      </div>
    </div>
  )
}
