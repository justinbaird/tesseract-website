"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Save, User, Briefcase, Linkedin, Instagram, Youtube } from "lucide-react"
import { toast } from "sonner"
import type { ProfileData } from "@/lib/types/profile"
import { BackgroundImageUpload } from "@/components/admin/background-image-upload"

interface ProfileSettingsEditorProps {
  onProfileUpdated?: (profile: ProfileData) => void
}

export function ProfileSettingsEditor({ onProfileUpdated }: ProfileSettingsEditorProps) {
  const [profileData, setProfileData] = useState<ProfileData>({
    name: '',
    title: '',
    linkedin_url: '',
    instagram_url: '',
    youtube_url: '',
    background_image_url: ''
  })
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    loadProfileData()
  }, [])

  const loadProfileData = async () => {
    try {
      console.log('[v0] Loading profile data for editor')
      const response = await fetch('/api/profile')
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()
      console.log('[v0] Profile data loaded:', data)
      setProfileData({
        name: data.name || '',
        title: data.title || '',
        linkedin_url: data.linkedin_url || '',
        instagram_url: data.instagram_url || '',
        youtube_url: data.youtube_url || '',
        background_image_url: data.background_image_url || ''
      })
    } catch (error) {
      console.error('[v0] Failed to load profile data:', error)
      toast.error('Failed to load profile settings')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSave = async () => {
    if (isSaving) return
    
    setIsSaving(true)
    try {
      console.log('[v0] Saving profile data:', profileData)
      
      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profileData)
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.details || 'Failed to save profile settings')
      }

      const updatedProfile = await response.json()
      console.log('[v0] Profile updated successfully:', updatedProfile)
      
      setProfileData({
        name: updatedProfile.name || '',
        title: updatedProfile.title || '',
        linkedin_url: updatedProfile.linkedin_url || '',
        instagram_url: updatedProfile.instagram_url || '',
        youtube_url: updatedProfile.youtube_url || '',
        background_image_url: updatedProfile.background_image_url || ''
      })

      // Notify parent component and trigger sidebar update
      onProfileUpdated?.(updatedProfile)
      
      // Dispatch custom event to update sidebar
      window.dispatchEvent(new CustomEvent('profileSettingsUpdated', { 
        detail: updatedProfile 
      }))

      toast.success('Profile settings saved successfully!')
    } catch (error) {
      console.error('[v0] Failed to save profile:', error)
      toast.error(`Failed to save profile settings: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setIsSaving(false)
    }
  }

  const handleNameChange = (value: string) => {
    setProfileData(prev => ({ ...prev, name: value }))
  }

  const handleTitleChange = (value: string) => {
    setProfileData(prev => ({ ...prev, title: value }))
  }

  const handleLinkedInChange = (value: string) => {
    setProfileData(prev => ({ ...prev, linkedin_url: value }))
  }

  const handleInstagramChange = (value: string) => {
    setProfileData(prev => ({ ...prev, instagram_url: value }))
  }

  const handleYouTubeChange = (value: string) => {
    setProfileData(prev => ({ ...prev, youtube_url: value }))
  }

  const handleBackgroundImageChange = (url: string) => {
    setProfileData(prev => ({ ...prev, background_image_url: url }))
  }

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <User className="w-5 h-5" />
          <h3 className="text-lg font-semibold">Profile Settings</h3>
        </div>
        <div className="text-gray-400">Loading profile settings...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <User className="w-5 h-5" />
        <h3 className="text-lg font-semibold">Profile Settings</h3>
      </div>
      
      <p className="text-gray-400 text-sm">
        These settings control the name and title displayed in the sidebar navigation. 
        Leave fields empty to hide them from the sidebar.
      </p>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="profile-name" className="flex items-center gap-2 text-sm font-medium">
            <User className="w-4 h-4" />
            Display Name
          </Label>
          <Input
            id="profile-name"
            type="text"
            placeholder="Enter your display name (leave empty to hide)"
            value={profileData.name || ''}
            onChange={(e) => handleNameChange(e.target.value)}
            className="bg-[#0a0a0a] border-gray-700 text-white placeholder:text-gray-500 focus:border-[#00ff88] focus:ring-[#00ff88]"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="profile-title" className="flex items-center gap-2 text-sm font-medium">
            <Briefcase className="w-4 h-4" />
            Professional Title
          </Label>
          <Input
            id="profile-title"
            type="text"
            placeholder="Enter your professional title (leave empty to hide)"
            value={profileData.title || ''}
            onChange={(e) => handleTitleChange(e.target.value)}
            className="bg-[#0a0a0a] border-gray-700 text-white placeholder:text-gray-500 focus:border-[#00ff88] focus:ring-[#00ff88]"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="linkedin-url" className="flex items-center gap-2 text-sm font-medium">
            <Linkedin className="w-4 h-4" />
            LinkedIn URL
          </Label>
          <Input
            id="linkedin-url"
            type="url"
            placeholder="Enter your LinkedIn profile URL (leave empty to hide)"
            value={profileData.linkedin_url || ''}
            onChange={(e) => handleLinkedInChange(e.target.value)}
            className="bg-[#0a0a0a] border-gray-700 text-white placeholder:text-gray-500 focus:border-[#00ff88] focus:ring-[#00ff88]"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="instagram-url" className="flex items-center gap-2 text-sm font-medium">
            <Instagram className="w-4 h-4" />
            Instagram URL
          </Label>
          <Input
            id="instagram-url"
            type="url"
            placeholder="Enter your Instagram profile URL (leave empty to hide)"
            value={profileData.instagram_url || ''}
            onChange={(e) => handleInstagramChange(e.target.value)}
            className="bg-[#0a0a0a] border-gray-700 text-white placeholder:text-gray-500 focus:border-[#00ff88] focus:ring-[#00ff88]"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="youtube-url" className="flex items-center gap-2 text-sm font-medium">
            <Youtube className="w-4 h-4" />
            YouTube URL
          </Label>
          <Input
            id="youtube-url"
            type="url"
            placeholder="Enter your YouTube channel URL (leave empty to hide)"
            value={profileData.youtube_url || ''}
            onChange={(e) => handleYouTubeChange(e.target.value)}
            className="bg-[#0a0a0a] border-gray-700 text-white placeholder:text-gray-500 focus:border-[#00ff88] focus:ring-[#00ff88]"
          />
        </div>
      </div>

      <div className="pt-6 border-t border-gray-800">
        <BackgroundImageUpload 
          currentImageUrl={profileData.background_image_url || '/web-background.jpg'}
          onImageUploaded={handleBackgroundImageChange}
        />
      </div>

      <div className="pt-4 border-t border-gray-800">
        <Button
          onClick={handleSave}
          disabled={isSaving}
          className="bg-[#00ff88] hover:bg-[#00cc6a] text-black font-medium"
        >
          <Save className="w-4 h-4 mr-2" />
          {isSaving ? 'Saving...' : 'Save Profile Settings'}
        </Button>
      </div>
    </div>
  )
}
