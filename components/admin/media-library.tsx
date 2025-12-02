"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Upload, Copy, Check, Trash2, Image as ImageIcon, File, ExternalLink, X } from "lucide-react"
import { toast } from "sonner"

interface MediaFile {
  name: string
  url: string
  size: number
  mimeType: string
  createdAt: string
  updatedAt: string
}

export function MediaLibrary() {
  const [files, setFiles] = useState<MediaFile[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isUploading, setIsUploading] = useState(false)
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null)
  const [selectedFile, setSelectedFile] = useState<MediaFile | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    loadFiles()
  }, [])

  const loadFiles = async () => {
    try {
      setIsLoading(true)
      const response = await fetch(`/api/media?t=${Date.now()}`, {
        cache: 'no-store',
      })
      if (!response.ok) {
        throw new Error('Failed to load files')
      }
      const data = await response.json()
      setFiles(data.files || [])
    } catch (error) {
      console.error('[v0] Failed to load media files:', error)
      toast.error('Failed to load media library')
    } finally {
      setIsLoading(false)
    }
  }

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validate file size (50MB max)
    if (file.size > 50 * 1024 * 1024) {
      toast.error('File must be less than 50MB')
      return
    }

    setIsUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/media', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Upload failed')
      }

      const data = await response.json()
      toast.success('File uploaded successfully!')
      
      // Reload files list
      await loadFiles()
      
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    } catch (error) {
      console.error('[v0] Failed to upload file:', error)
      toast.error(`Failed to upload file: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setIsUploading(false)
    }
  }

  const handleCopyUrl = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url)
      setCopiedUrl(url)
      toast.success('URL copied to clipboard!')
      setTimeout(() => setCopiedUrl(null), 2000)
    } catch (error) {
      console.error('[v0] Failed to copy URL:', error)
      toast.error('Failed to copy URL')
    }
  }

  const handleDeleteFile = async (fileName: string) => {
    if (!confirm(`Are you sure you want to delete "${fileName}"?`)) {
      return
    }

    try {
      const response = await fetch(`/api/media?name=${encodeURIComponent(fileName)}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete file')
      }

      toast.success('File deleted successfully!')
      await loadFiles()
    } catch (error) {
      console.error('[v0] Failed to delete file:', error)
      toast.error('Failed to delete file')
    }
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
  }

  const isImage = (mimeType: string): boolean => {
    return mimeType.startsWith('image/')
  }

  const getFileIcon = (mimeType: string) => {
    if (isImage(mimeType)) {
      return <ImageIcon className="w-8 h-8 text-blue-400" />
    }
    if (mimeType.includes('video')) {
      return <File className="w-8 h-8 text-red-400" />
    }
    if (mimeType.includes('pdf')) {
      return <File className="w-8 h-8 text-red-600" />
    }
    return <File className="w-8 h-8 text-gray-400" />
  }

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="text-gray-400">Loading media library...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Media Library</h3>
          <p className="text-gray-400 text-sm mt-1">
            Upload and manage images and files. Copy URLs to use in your content blocks.
          </p>
        </div>
        <div>
          <input
            ref={fileInputRef}
            type="file"
            onChange={handleFileUpload}
            disabled={isUploading}
            className="hidden"
            id="media-upload"
          />
          <Button
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="bg-[#00ff88] hover:bg-[#00cc6a] text-black font-medium"
          >
            <Upload className="w-4 h-4 mr-2" />
            {isUploading ? 'Uploading...' : 'Upload File'}
          </Button>
        </div>
      </div>

      {files.length === 0 ? (
        <div className="border-2 border-dashed border-gray-700 rounded-lg p-12 text-center">
          <Upload className="w-12 h-12 text-gray-500 mx-auto mb-4" />
          <p className="text-gray-400 mb-2">No files uploaded yet</p>
          <p className="text-gray-500 text-sm">Upload images, videos, PDFs, and other files to get started</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {files.map((file) => (
            <div
              key={file.name}
              className="bg-[#0a0a0a] border border-gray-800 rounded-lg overflow-hidden hover:border-[#00ff88] transition-colors"
            >
              <div 
                className="aspect-square bg-gray-900 relative group cursor-pointer"
                onClick={() => setSelectedFile(file)}
              >
                {isImage(file.mimeType) ? (
                  <img
                    src={file.url}
                    alt={file.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none'
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    {getFileIcon(file.mimeType)}
                  </div>
                )}
                
                {/* Overlay actions */}
                <div 
                  className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleCopyUrl(file.url)
                    }}
                    className="bg-white/90 hover:bg-white text-black"
                  >
                    {copiedUrl === file.url ? (
                      <Check className="w-4 h-4" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </Button>
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={(e) => {
                      e.stopPropagation()
                      window.open(file.url, '_blank')
                    }}
                    className="bg-white/90 hover:bg-white text-black"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleDeleteFile(file.name)
                    }}
                    className="bg-red-600/90 hover:bg-red-600"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              
              <div className="p-3 space-y-1">
                <p className="text-xs text-gray-400 truncate" title={file.name}>
                  {file.name.length > 20 ? `${file.name.substring(0, 20)}...` : file.name}
                </p>
                <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                
                {/* URL display */}
                <div className="flex items-center gap-1 mt-2">
                  <Input
                    value={file.url}
                    readOnly
                    className="text-xs h-7 bg-[#0a0a0a] border-gray-700 text-gray-400"
                    onClick={(e) => (e.target as HTMLInputElement).select()}
                  />
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleCopyUrl(file.url)}
                    className="h-7 px-2"
                  >
                    {copiedUrl === file.url ? (
                      <Check className="w-3 h-3 text-[#00ff88]" />
                    ) : (
                      <Copy className="w-3 h-3 text-gray-400" />
                    )}
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Selected file preview modal */}
      {selectedFile && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="bg-[#1a1a1a] rounded-lg max-w-4xl w-full max-h-[90vh] overflow-auto">
            <div className="p-6 border-b border-gray-800 flex items-center justify-between">
              <h3 className="text-lg font-semibold">{selectedFile.name}</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedFile(null)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            <div className="p-6">
              {isImage(selectedFile.mimeType) ? (
                <img
                  src={selectedFile.url}
                  alt={selectedFile.name}
                  className="w-full h-auto rounded-lg"
                />
              ) : (
                <div className="text-center py-12">
                  {getFileIcon(selectedFile.mimeType)}
                  <p className="text-gray-400 mt-4">{selectedFile.name}</p>
                  <p className="text-gray-500 text-sm mt-2">{formatFileSize(selectedFile.size)}</p>
                </div>
              )}
              <div className="mt-6 space-y-2">
                <div>
                  <label className="text-sm text-gray-400">File URL</label>
                  <div className="flex gap-2 mt-1">
                    <Input
                      value={selectedFile.url}
                      readOnly
                      className="bg-[#0a0a0a] border-gray-700"
                      onClick={(e) => (e.target as HTMLInputElement).select()}
                    />
                    <Button
                      onClick={() => handleCopyUrl(selectedFile.url)}
                      className="bg-[#00ff88] hover:bg-[#00cc6a] text-black"
                    >
                      {copiedUrl === selectedFile.url ? (
                        <>
                          <Check className="w-4 h-4 mr-2" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4 mr-2" />
                          Copy URL
                        </>
                      )}
                    </Button>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-400">Size:</span>
                    <span className="text-white ml-2">{formatFileSize(selectedFile.size)}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Type:</span>
                    <span className="text-white ml-2">{selectedFile.mimeType}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

