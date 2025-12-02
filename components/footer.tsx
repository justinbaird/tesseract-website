"use client"

import { useState, useEffect } from "react"

export function Footer() {
  const [profileData, setProfileData] = useState<{
    name: string | null
  }>({
    name: null
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
            name: data.name || null
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
        name: updatedProfile.name || null
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

  const currentYear = new Date().getFullYear()

  return (
    <footer className="py-12 px-6 lg:px-12 border-t border-white/10">
      <div className="max-w-6xl mx-auto text-center">
        {profileData.name && (
          <div className="text-gray-400">
            <span>© {currentYear} {profileData.name}</span>
          </div>
        )}
      </div>
    </footer>
  )
}
