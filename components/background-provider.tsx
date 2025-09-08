"use client"

import { useEffect, useState } from "react"

export function BackgroundProvider({ children }: { children: React.ReactNode }) {
  const [backgroundUrl, setBackgroundUrl] = useState('/web-background.jpg')

  useEffect(() => {
    const loadBackgroundImage = async () => {
      try {
        const response = await fetch('/api/profile')
        if (response.ok) {
          const data = await response.json()
          if (data.background_image_url) {
            setBackgroundUrl(data.background_image_url)
          }
        }
      } catch (error) {
        console.error('Failed to load background image:', error)
        // Keep default background
      }
    }

    loadBackgroundImage()

    // Listen for background image updates
    const handleBackgroundUpdate = (event: CustomEvent) => {
      const updatedProfile = event.detail
      if (updatedProfile.background_image_url) {
        setBackgroundUrl(updatedProfile.background_image_url)
      }
    }

    window.addEventListener('profileSettingsUpdated', handleBackgroundUpdate as EventListener)

    return () => {
      window.removeEventListener('profileSettingsUpdated', handleBackgroundUpdate as EventListener)
    }
  }, [])

  useEffect(() => {
    // Update CSS custom property for background image
    document.documentElement.style.setProperty('--background-image-url', `url(${backgroundUrl})`)
  }, [backgroundUrl])

  return <>{children}</>
}
