"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"

export function Hero() {
  const [profileData, setProfileData] = useState<{
    name: string | null
    title: string | null
  }>({
    name: null,
    title: null
  })

  useEffect(() => {
    const loadProfileData = async () => {
      try {
        const response = await fetch(`/api/profile?t=${Date.now()}`, {
          cache: 'no-store',
          headers: {
            'Cache-Control': 'no-cache',
          }
        })
        if (response.ok) {
          const data = await response.json()
          setProfileData({
            name: data.name || null,
            title: data.title || null
          })
        }
      } catch (error) {
        console.error('Failed to load profile data:', error)
      }
    }
    loadProfileData()

    const handleProfileUpdate = (event: CustomEvent) => {
      const updatedProfile = event.detail
      setProfileData({
        name: updatedProfile.name || null,
        title: updatedProfile.title || null
      })
    }
    
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'profileSettingsLastUpdated') {
        loadProfileData()
      }
    }

    window.addEventListener('profileSettingsUpdated', handleProfileUpdate as EventListener)
    window.addEventListener('storage', handleStorageChange)
    return () => {
      window.removeEventListener('profileSettingsUpdated', handleProfileUpdate as EventListener)
      window.removeEventListener('storage', handleStorageChange)
    }
  }, [])

  // Don't render if no profile data
  if (!profileData.name && !profileData.title) {
    return null
  }

  return (
    <section id="home" className="min-h-screen flex items-center justify-center px-6 lg:px-12">
      <div className="max-w-4xl mx-auto text-center">
        {profileData.name && (
          <h1 className="text-5xl lg:text-7xl font-bold mb-6">{profileData.name}</h1>
        )}
        {profileData.title && (
          <p className="text-xl lg:text-2xl text-gray-300 mb-8">{profileData.title}</p>
        )}
      </div>
    </section>
  )
}
