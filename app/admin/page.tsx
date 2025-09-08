"use client"

import { useState, useEffect } from "react"
import { getPosts } from "@/lib/posts"
import { getHierarchicalPages } from "@/lib/pages"
import { PostsList } from "@/components/admin/posts-list"
import { PageList } from "@/components/admin/page-list"
import { SimpleAuth } from "@/components/admin/simple-auth"
import { ProfileImageUpload } from "@/components/admin/profile-image-upload"
import { ProfileSettingsEditor } from "@/components/admin/profile-settings-editor"
import { Button } from "@/components/ui/button"
import { Plus, FileText, Edit, LogOut, User, Home } from "lucide-react"
import Link from "next/link"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [posts, setPosts] = useState([])
  const [pages, setPages] = useState([])
  const [refreshKey, setRefreshKey] = useState(0)
  const [profileImageUrl, setProfileImageUrl] = useState("")

  useEffect(() => {
    // Check if user is authenticated from sessionStorage
    const isAuth = sessionStorage.getItem("admin_authenticated") === "true"
    setIsAuthenticated(isAuth)
    
    if (isAuth) {
      loadData()
    }
    
    setIsLoading(false)
    
    const savedProfileImage = localStorage.getItem("profileImageUrl")
    if (savedProfileImage) {
      setProfileImageUrl(savedProfileImage)
    }
  }, [])

  const loadData = async () => {
    try {
      const [postsData, pagesData] = await Promise.all([getPosts(), getHierarchicalPages()])
      setPosts(postsData)
      setPages(pagesData)
      setRefreshKey((prev) => prev + 1)
    } catch (error) {
      console.error("Failed to load data:", error)
    }
  }

  const handleAuthenticated = () => {
    setIsAuthenticated(true)
    loadData()
  }

  const handleSignOut = () => {
    sessionStorage.removeItem("admin_authenticated")
    setIsAuthenticated(false)
    setPosts([])
    setPages([])
  }

  const handleProfileImageUploaded = (url: string) => {
    setProfileImageUrl(url)
    localStorage.setItem("profileImageUrl", url)
    window.dispatchEvent(new CustomEvent("profileImageUpdated", { detail: url }))
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <SimpleAuth onAuthenticated={handleAuthenticated} />
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <div className="container mx-auto px-4 py-8 pt-20 lg:pt-8">
        <div className="relative flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Content Management</h1>
            <p className="text-gray-400">Manage your portfolio posts and pages</p>
          </div>
          
          {/* Center button */}
          <div className="absolute left-1/2 transform -translate-x-1/2">
            <Link href="/">
              <Button 
                variant="default" 
                className="bg-[#00ff88] hover:bg-[#00cc6a] text-black font-medium"
              >
                <Home className="w-4 h-4 mr-2" />
                Back to Website
              </Button>
            </Link>
          </div>
          
          <div className="flex items-center gap-4">
            <Button
              onClick={handleSignOut}
              variant="outline"
              className="border-gray-700 text-gray-300 hover:text-white bg-transparent"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>

        <Tabs defaultValue="posts" className="space-y-6">
          <TabsList className="bg-[#1a1a1a] border border-gray-800">
            <TabsTrigger value="posts" className="data-[state=active]:bg-[#00ff88] data-[state=active]:text-black">
              <Edit className="w-4 h-4 mr-2" />
              Posts ({posts.length})
            </TabsTrigger>
            <TabsTrigger value="pages" className="data-[state=active]:bg-[#00ff88] data-[state=active]:text-black">
              <FileText className="w-4 h-4 mr-2" />
              Pages ({pages.length})
            </TabsTrigger>
            <TabsTrigger value="profile" className="data-[state=active]:bg-[#00ff88] data-[state=active]:text-black">
              <User className="w-4 h-4 mr-2" />
              Profile
            </TabsTrigger>
          </TabsList>

          <TabsContent value="posts">
            <div className="bg-[#1a1a1a] rounded-lg border border-gray-800">
              <div className="p-6 border-b border-gray-800 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold">All Posts</h2>
                  <p className="text-gray-400 text-sm mt-1">
                    {posts.length} {posts.length === 1 ? "post" : "posts"} total
                  </p>
                </div>
                <Link href="/admin/posts/new">
                  <Button className="bg-[#00ff88] hover:bg-[#00cc6a] text-black font-medium">
                    <Plus className="w-4 h-4 mr-2" />
                    New Post
                  </Button>
                </Link>
              </div>
              <PostsList key={refreshKey} posts={posts} />
            </div>
          </TabsContent>

          <TabsContent value="pages">
            <div className="bg-[#1a1a1a] rounded-lg border border-gray-800">
              <div className="p-6 border-b border-gray-800 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold">All Pages</h2>
                  <p className="text-gray-400 text-sm mt-1">
                    {pages.length} {pages.length === 1 ? "page" : "pages"} total. Use the arrows to reorder and nest pages in the navigation.
                  </p>
                </div>
                <Link href="/admin/pages/new">
                  <Button className="bg-[#00ff88] hover:bg-[#00cc6a] text-black font-medium">
                    <Plus className="w-4 h-4 mr-2" />
                    New Page
                  </Button>
                </Link>
              </div>
              <PageList key={refreshKey} initialPages={pages} />
            </div>
          </TabsContent>

          <TabsContent value="profile">
            <div className="bg-[#1a1a1a] rounded-lg border border-gray-800">
              <div className="p-6 space-y-8">
                <ProfileImageUpload currentImageUrl={profileImageUrl} onImageUploaded={handleProfileImageUploaded} />
                <div className="border-t border-gray-800 pt-8">
                  <ProfileSettingsEditor />
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
