"use client"

import { useState, useEffect } from "react"
import { getPages } from "@/lib/pages"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Plus } from "lucide-react"
import { PageList } from "@/components/admin/page-list"
import type { Page } from "@/lib/types/page"

export default function PagesPage() {
  const [pages, setPages] = useState<Page[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshKey, setRefreshKey] = useState(0)

  const loadPages = async () => {
    try {
      setLoading(true)
      const fetchedPages = await getPages()
      setPages(fetchedPages)
      setRefreshKey((prev) => prev + 1)
    } catch (error) {
      console.error("Failed to load pages:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadPages()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <p className="text-gray-400">Loading pages...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Pages</h1>
            <p className="text-gray-400 mt-2">
              Manage your website pages with the visual editor. Use the arrows to reorder pages in the navigation.
            </p>
          </div>
          <Link href="/admin/pages/new">
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              New Page
            </Button>
          </Link>
        </div>

        <PageList key={refreshKey} initialPages={pages} />
      </div>
    </div>
  )
}
