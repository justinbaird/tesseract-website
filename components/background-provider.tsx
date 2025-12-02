"use client"

import { useEffect, useState } from "react"

export function BackgroundProvider({ children }: { children: React.ReactNode }) {
  const [backgroundUrl, setBackgroundUrl] = useState<string | null>(null)

  useEffect(() => {
    // Initialize CSS variable
    document.documentElement.style.setProperty('--background-image-url', 'none')
    
    const loadBackgroundImage = async () => {
      try {
        const response = await fetch('/api/profile')
        if (response.ok) {
          const data = await response.json()
          if (data.background_image_url && data.background_image_url.trim()) {
            setBackgroundUrl(data.background_image_url)
          }
        }
      } catch (error) {
        console.error('Failed to load background image:', error)
        // Keep default black background from layout
      }
    }

    loadBackgroundImage()

    // Listen for background image updates
    const handleBackgroundUpdate = (event: CustomEvent) => {
      const updatedProfile = event.detail
      if (updatedProfile.background_image_url && updatedProfile.background_image_url.trim()) {
        setBackgroundUrl(updatedProfile.background_image_url)
      } else {
        setBackgroundUrl(null)
      }
    }

    window.addEventListener('profileSettingsUpdated', handleBackgroundUpdate as EventListener)

    return () => {
      window.removeEventListener('profileSettingsUpdated', handleBackgroundUpdate as EventListener)
    }
  }, [])

  useEffect(() => {
    // Update CSS custom property for background image
    if (backgroundUrl && backgroundUrl.trim()) {
      document.documentElement.style.setProperty('--background-image-url', `url(${backgroundUrl})`)
    } else {
      // Clear background image if empty
      document.documentElement.style.setProperty('--background-image-url', 'none')
    }
  }, [backgroundUrl])

  return <>{children}</>
}
