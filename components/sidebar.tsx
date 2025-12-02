"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import type { Page } from "@/lib/types/page"

const MenuIcon = () => (
  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
  </svg>
)

const XIcon = () => (
  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
)

const HomeIcon = () => (
  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
    />
  </svg>
)

const UserIcon = () => (
  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
    />
  </svg>
)

const FileTextIcon = () => (
  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
    />
  </svg>
)

const LinkedinIcon = () => (
  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
)

const InstagramIcon = () => (
  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-4.358-.2-6.78 2.618-6.98 6.98-.058 1.265-.069 1.689-.069 4.948 0 3.204.013 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.057 1.689.069 4.948.069 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
  </svg>
)

const YoutubeIcon = () => (
  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
  </svg>
)

const SettingsIcon = () => (
  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
)

const WorkIcon = () => (
  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0H8m8 0v6.5M8 6v6.5M12 15v6" />
  </svg>
)

const ChevronDownIcon = () => (
  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
  </svg>
)

const ChevronRightIcon = () => (
  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
  </svg>
)

export function Sidebar() {
  const [isOpen, setIsOpen] = useState(false)
  const [dynamicPages, setDynamicPages] = useState<Page[]>([])
  const [profileImageUrl, setProfileImageUrl] = useState<string>("")
  const [imageError, setImageError] = useState(false)
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false)
  const [expandedSections, setExpandedSections] = useState<{ [key: string]: boolean }>({})
  const [profileData, setProfileData] = useState({ 
    name: null, 
    title: null,
    linkedin_url: null,
    instagram_url: null,
    youtube_url: null
  })

  useEffect(() => {
    const loadPages = async () => {
      try {
        console.log("[v0] Fetching navigation pages")
        const response = await fetch("/api/navigation")
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        const pages = await response.json()
        console.log("[v0] Successfully fetched navigation pages:", pages.length)
        setDynamicPages(pages)
      } catch (error) {
        console.error("[v0] Error fetching navigation pages:", error)
        console.error("Failed to load navigation pages:", error)
      }
    }
    loadPages()

    const savedProfileImage = localStorage.getItem("profileImageUrl")
    if (savedProfileImage) {
      setProfileImageUrl(savedProfileImage)
    }
    // No fallback image - will show initials if no image is set

    // Load profile data
    const loadProfileData = async () => {
      try {
        console.log('[v0] Sidebar: Loading profile data')
        const response = await fetch('/api/profile')
        if (response.ok) {
          const data = await response.json()
          console.log('[v0] Sidebar: Received profile data:', data)
          const newProfileData = { 
            name: data.name || null, 
            title: data.title || null,
            linkedin_url: data.linkedin_url || null,
            instagram_url: data.instagram_url || null,
            youtube_url: data.youtube_url || null
          }
          console.log('[v0] Sidebar: Setting profile data to:', newProfileData)
          setProfileData(newProfileData)
        } else {
          console.error('[v0] Sidebar: Failed to fetch profile data, status:', response.status)
        }
      } catch (error) {
        console.error('[v0] Sidebar: Error loading profile data:', error)
        // Keep defaults
      }
    }
    loadProfileData()

    // Check admin authentication status
    const checkAdminAuth = () => {
      try {
        // Check if user is authenticated (same logic as admin page)
        const isAuth = sessionStorage.getItem("admin_authenticated") === "true"
        setIsAdminAuthenticated(isAuth)
      } catch (error) {
        // sessionStorage might not be available during SSR
        setIsAdminAuthenticated(false)
      }
    }
    
    // Check admin auth on mount and when storage changes
    checkAdminAuth()
    const handleStorageChange = () => checkAdminAuth()
    window.addEventListener("storage", handleStorageChange)
    
    // Also check periodically in case auth changes in same tab
    const authCheckInterval = setInterval(checkAdminAuth, 1000)
    
    const handleProfileImageUpdate = (event: CustomEvent) => {
      setProfileImageUrl(event.detail)
      setImageError(false)
    }

    const handleProfileSettingsUpdate = (event: CustomEvent) => {
      const updatedProfile = event.detail
      setProfileData({
        name: updatedProfile.name || null,
        title: updatedProfile.title || null,
        linkedin_url: updatedProfile.linkedin_url || null,
        instagram_url: updatedProfile.instagram_url || null,
        youtube_url: updatedProfile.youtube_url || null
      })
    }

    window.addEventListener("profileImageUpdated", handleProfileImageUpdate as EventListener)
    window.addEventListener("profileSettingsUpdated", handleProfileSettingsUpdate as EventListener)

    return () => {
      window.removeEventListener("profileImageUpdated", handleProfileImageUpdate as EventListener)
      window.removeEventListener("profileSettingsUpdated", handleProfileSettingsUpdate as EventListener)
      window.removeEventListener("storage", handleStorageChange)
      clearInterval(authCheckInterval)
    }
  }, [])

  const staticNavItems = [{ icon: HomeIcon, label: "Home", href: "/" }]

  // Build hierarchical navigation structure
  const buildHierarchicalNav = () => {
    const parentPages = dynamicPages.filter((page) => {
      const isHomepage =
        page.slug === "home" ||
        page.slug === "homepage" ||
        page.title.toLowerCase().includes("portfolio") ||
        page.title.toLowerCase().includes("home")
      return !isHomepage && !page.parent_id
    })

    const topLevelNavItems = parentPages.map((page) => {
      const children = dynamicPages
        .filter((childPage) => childPage.parent_id === page.id)
        .sort((a, b) => a.title.localeCompare(b.title))
        .map((childPage) => ({
          icon: UserIcon,
          label: childPage.title,
          href: `/${childPage.slug}`,
        }))

      return {
        icon: page.slug === 'work' ? WorkIcon : UserIcon,
        label: page.title,
        href: `/${page.slug}`,
        children: children.length > 0 ? children : undefined,
        isCollapsible: children.length > 0,
      }
    })

    return topLevelNavItems
  }

  const hierarchicalNavItems = buildHierarchicalNav()
  const allNavItems = [...staticNavItems, ...hierarchicalNavItems.filter(item => !item.children)]

  return (
    <>
      {/* Mobile menu button */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-50 lg:hidden text-white hover:bg-white/10"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <XIcon /> : <MenuIcon />}
      </Button>

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-full w-64 bg-black/20 backdrop-blur-sm border-r border-white/10 z-40 transform transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >
        <div className="h-full flex flex-col">
          <div className="p-6 flex-shrink-0">
          {/* Profile section */}
          <div className="mb-8">
            {!imageError && profileImageUrl ? (
              <img
                src={profileImageUrl}
                alt="Profile"
                className="w-16 h-16 rounded-full object-cover mb-4"
                onError={() => setImageError(true)}
              />
            ) : (
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 mb-4 flex items-center justify-center">
                <span className="text-xl font-bold text-white">JB</span>
              </div>
            )}
            {profileData.name && profileData.name.trim() && (
              <h2 className="text-xl font-bold mb-1">{profileData.name}</h2>
            )}
            {profileData.title && profileData.title.trim() && (
              <p className="text-gray-400 text-sm">{profileData.title}</p>
            )}
          </div>

          </div>
          
          {/* Scrollable Navigation */}
          <div className="flex-1 overflow-y-auto px-6">
            <nav className="space-y-2 pb-6">
              {/* Render top-level pages without children */}
              {allNavItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  <item.icon />
                  <span>{item.label}</span>
                </a>
              ))}
              
              {/* Render hierarchical pages with children */}
              {hierarchicalNavItems
                .filter(item => item.children)
                .map((item) => {
                  const isExpanded = expandedSections[item.label] || false
                  
                  return (
                    <div key={item.label} className="space-y-1">
                      <div className="flex items-center">
                        <a
                          href={item.href}
                          className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-300 hover:text-white hover:bg-white/10 transition-colors flex-1"
                          onClick={() => setIsOpen(false)}
                        >
                          <item.icon />
                          <span>{item.label}</span>
                        </a>
                        <button
                          onClick={() => setExpandedSections(prev => ({
                            ...prev,
                            [item.label]: !prev[item.label]
                          }))}
                          className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
                          aria-label={isExpanded ? `Collapse ${item.label} section` : `Expand ${item.label} section`}
                        >
                          {isExpanded ? <ChevronDownIcon /> : <ChevronRightIcon />}
                        </button>
                      </div>
                      
                      {/* Child pages - collapsible */}
                      <div className={`ml-6 space-y-1 overflow-hidden transition-all duration-300 ${
                        isExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                      }`}>
                        {item.children?.map((childItem) => (
                          <a
                            key={childItem.label}
                            href={childItem.href}
                            className="flex items-center gap-3 px-3 py-1.5 rounded-lg text-sm text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
                            onClick={() => setIsOpen(false)}
                          >
                            <span className="w-2 h-2 rounded-full bg-gray-600"></span>
                            <span>{childItem.label}</span>
                          </a>
                        ))}
                      </div>
                    </div>
                  )
                })}
            </nav>
          </div>
          
          {/* Footer section */}
          <div className="flex-shrink-0 p-6">

            <div className="border-t border-white/10 pt-4">
              <a
                href="/posts"
                className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-300 hover:text-white hover:bg-white/10 transition-colors mb-6"
                onClick={() => setIsOpen(false)}
              >
                <FileTextIcon />
                <span>All Posts</span>
              </a>
            </div>

            {/* Social links */}
            <div className="border-t border-white/10 pt-4">
              <p className="text-xs text-gray-500 mb-4">FOLLOW ME</p>
              <div className="space-y-2">
                {profileData.linkedin_url && profileData.linkedin_url.trim() && (
                  <a
                    href={profileData.linkedin_url}
                    className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <LinkedinIcon />
                    LinkedIn
                  </a>
                )}
                {profileData.instagram_url && profileData.instagram_url.trim() && (
                  <a
                    href={profileData.instagram_url}
                    className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <InstagramIcon />
                    Instagram
                  </a>
                )}
                {profileData.youtube_url && profileData.youtube_url.trim() && (
                  <a
                    href={profileData.youtube_url}
                    className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <YoutubeIcon />
                    YouTube
                  </a>
                )}
              </div>
              
              {/* Admin link - only show if authenticated */}
              {isAdminAuthenticated && (
                <div className="mt-4 pt-4 border-t border-white/10">
                  <a
                    href="/admin"
                    className="flex items-center gap-2 text-sm text-[#00ff88] hover:text-[#00cc6a] transition-colors font-medium"
                    onClick={() => setIsOpen(false)}
                    title="Admin Panel"
                  >
                    <SettingsIcon />
                    Admin
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {isOpen && <div className="fixed inset-0 bg-black/50 z-30 lg:hidden" onClick={() => setIsOpen(false)} />}
    </>
  )
}
