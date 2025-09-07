"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Edit, Eye, GripVertical, ChevronUp, ChevronDown, Trash2, ChevronLeft, ChevronRight } from "lucide-react"
import type { Page } from "@/lib/types/page"

interface PageListProps {
  initialPages: Page[]
}

interface HierarchicalPage extends Page {
  level: number
  children?: HierarchicalPage[]
}

export function PageList({ initialPages }: PageListProps) {
  const [pages, setPages] = useState(initialPages)
  const [isReordering, setIsReordering] = useState(false)
  const [deletingPageId, setDeletingPageId] = useState<string | null>(null)
  const [isNesting, setIsNesting] = useState(false)

  console.log("[v0] PageList rendering with", pages.length, "pages")

  const deletePage = async (pageId: string, pageTitle: string) => {
    if (!confirm(`Are you sure you want to delete "${pageTitle}"? This action cannot be undone.`)) {
      return
    }

    try {
      setDeletingPageId(pageId)
      console.log("[v0] Deleting page:", pageId)

      const response = await fetch(`/api/pages/${pageId}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete page")
      }

      console.log("[v0] Page deleted successfully")
      setPages(pages.filter((page) => page.id !== pageId))
    } catch (error) {
      console.error("Failed to delete page:", error)
      alert("Failed to delete page. Please try again.")
    } finally {
      setDeletingPageId(null)
    }
  }

  const movePageUp = async (index: number) => {
    if (index === 0) return

    console.log("[v0] Moving page up from index", index)
    const newPages = [...pages]
    const temp = newPages[index]
    newPages[index] = newPages[index - 1]
    newPages[index - 1] = temp

    setPages(newPages)
    await updateOrder(newPages)
  }

  const movePageDown = async (index: number) => {
    if (index === pages.length - 1) return

    console.log("[v0] Moving page down from index", index)
    const newPages = [...pages]
    const temp = newPages[index]
    newPages[index] = newPages[index + 1]
    newPages[index + 1] = temp

    setPages(newPages)
    await updateOrder(newPages)
  }

  const updateOrder = async (reorderedPages: Page[]) => {
    try {
      setIsReordering(true)
      const pageIds = reorderedPages.map((page) => page.id)

      const response = await fetch("/api/pages/reorder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pageIds }),
      })

      if (!response.ok) {
        throw new Error("Failed to update page order")
      }
      console.log("[v0] Successfully reordered pages")
    } catch (error) {
      console.error("Failed to reorder pages:", error)
      setPages(initialPages)
    } finally {
      setIsReordering(false)
    }
  }

  const nestPage = async (displayIndex: number) => {
    if (displayIndex === 0) return // Can't nest the first page
    
    const page = displayPages[displayIndex]
    const pageAbove = displayPages[displayIndex - 1]
    
    // Determine the target parent:
    // - If page above is a top-level page, nest under it
    // - If page above is a child, nest under its parent (making them siblings)
    let targetParentId: string
    if (!pageAbove.parent_id) {
      // Page above is top-level, nest under it directly
      targetParentId = pageAbove.id
    } else {
      // Page above is a child, nest under its parent (same parent)
      targetParentId = pageAbove.parent_id
    }
    
    console.log("[v0] Nesting page", page.title, "under parent ID:", targetParentId)
    
    try {
      setIsNesting(true)
      const response = await fetch(`/api/pages/${page.id}/parent`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ parentId: targetParentId }),
      })

      if (!response.ok) {
        throw new Error("Failed to nest page")
      }

      // Update local state
      const newPages = [...pages]
      const originalIndex = pages.findIndex(p => p.id === page.id)
      newPages[originalIndex] = { ...page, parent_id: targetParentId }
      setPages(newPages)
      
      console.log("[v0] Successfully nested page")
    } catch (error) {
      console.error("Failed to nest page:", error)
      alert("Failed to nest page. Please try again.")
    } finally {
      setIsNesting(false)
    }
  }

  const unnestPage = async (displayIndex: number) => {
    const page = displayPages[displayIndex]
    
    if (!page.parent_id) return // Already at top level
    
    console.log("[v0] Unnesting page", page.title)
    
    try {
      setIsNesting(true)
      const response = await fetch(`/api/pages/${page.id}/parent`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ parentId: null }),
      })

      if (!response.ok) {
        throw new Error("Failed to unnest page")
      }

      // Update local state
      const newPages = [...pages]
      const originalIndex = pages.findIndex(p => p.id === page.id)
      newPages[originalIndex] = { ...page, parent_id: null }
      setPages(newPages)
      
      console.log("[v0] Successfully unnested page")
    } catch (error) {
      console.error("Failed to unnest page:", error)
      alert("Failed to unnest page. Please try again.")
    } finally {
      setIsNesting(false)
    }
  }

  // Create hierarchical structure for display
  const getHierarchicalPages = (): HierarchicalPage[] => {
    const hierarchical: HierarchicalPage[] = []
    const pageMap = new Map<string, HierarchicalPage>()
    
    // Convert pages to hierarchical pages and create map
    pages.forEach(page => {
      const hierarchicalPage: HierarchicalPage = {
        ...page,
        level: 0,
        children: []
      }
      pageMap.set(page.id, hierarchicalPage)
    })
    
    // Build hierarchy
    pages.forEach(page => {
      const hierarchicalPage = pageMap.get(page.id)!
      
      if (page.parent_id && pageMap.has(page.parent_id)) {
        const parent = pageMap.get(page.parent_id)!
        hierarchicalPage.level = 1
        parent.children!.push(hierarchicalPage)
      } else {
        hierarchical.push(hierarchicalPage)
      }
    })
    
    return hierarchical
  }

  // Flatten hierarchical structure back to display order
  const flattenHierarchical = (hierarchicalPages: HierarchicalPage[]): HierarchicalPage[] => {
    const flattened: HierarchicalPage[] = []
    
    hierarchicalPages.forEach(page => {
      flattened.push(page)
      if (page.children) {
        flattened.push(...page.children)
      }
    })
    
    return flattened
  }

  const displayPages = flattenHierarchical(getHierarchicalPages())

  if (pages.length === 0) {
    return (
      <div className="text-center py-8 text-gray-400">
        <p>No pages found. Create your first page to get started.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="text-sm text-gray-400 mb-4">
        Use ↑↓ arrows to reorder pages, ← to unnest (move to top level), → to nest under the page above.
      </div>
      <div className="grid gap-6">
        {displayPages.map((page, displayIndex) => {
          // Find the original index in the pages array for operations
          const originalIndex = pages.findIndex(p => p.id === page.id)
          const isChild = page.level > 0
          
          // Enhanced nesting logic: can nest under any top-level page (parent_id is null)
          // or under the same parent as the page above (if it's a child)
          let canNest = false
          if (displayIndex > 0 && !page.parent_id) {
            const pageAbove = displayPages[displayIndex - 1]
            // Can nest under a top-level page OR under the same parent as a child page
            canNest = !pageAbove.parent_id || pageAbove.level === 1
          }
          
          const canUnnest = page.parent_id !== null && page.parent_id !== undefined
          
          return (
            <Card 
              key={page.id} 
              className={`bg-gray-800 border-gray-700 transition-all ${
                isChild ? 'ml-8 border-l-4 border-l-blue-500' : ''
              }`}
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {/* Vertical ordering controls */}
                    <div className="flex flex-col gap-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-6 w-6 p-0 text-gray-400 hover:text-white"
                        onClick={() => movePageUp(originalIndex)}
                        disabled={originalIndex === 0 || isReordering}
                        title="Move page up in navigation order"
                      >
                        <ChevronUp className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-6 w-6 p-0 text-gray-400 hover:text-white"
                        onClick={() => movePageDown(originalIndex)}
                        disabled={originalIndex === pages.length - 1 || isReordering}
                        title="Move page down in navigation order"
                      >
                        <ChevronDown className="w-4 h-4" />
                      </Button>
                    </div>
                    
                    {/* Horizontal nesting controls */}
                    <div className="flex flex-col gap-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-6 w-6 p-0 text-gray-400 hover:text-white disabled:opacity-30"
                        onClick={() => unnestPage(displayIndex)}
                        disabled={!canUnnest || isNesting}
                        title="Move page to top level (unnest)"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-6 w-6 p-0 text-gray-400 hover:text-white disabled:opacity-30"
                        onClick={() => nestPage(displayIndex)}
                        disabled={!canNest || isNesting}
                        title="Nest page under the page above"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                    </div>
                    
                    <GripVertical className="w-4 h-4 text-gray-500" />
                    <div>
                      <CardTitle className="text-white flex items-center gap-2">
                        {isChild && <span className="text-blue-400">├─</span>}
                        {page.title}
                        {page.is_homepage && <Badge variant="secondary">Homepage</Badge>}
                        {page.parent_id && <Badge variant="outline" className="border-blue-500 text-blue-400">Child</Badge>}
                        {page.is_published ? (
                          <Badge className="bg-green-600 border-green-500">Published</Badge>
                        ) : (
                          <Badge variant="outline" className="border-yellow-500 text-yellow-400">
                            Draft
                          </Badge>
                        )}
                      </CardTitle>
                      <CardDescription className="text-gray-400">
                        /{page.slug} • Updated {new Date(page.updated_at).toLocaleDateString()}
                        {isChild && (
                          <span className="ml-2 text-blue-400">(nested)</span>
                        )}
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Link href={`/admin/pages/${page.id}/edit`}>
                      <Button size="sm" variant="outline">
                        <Edit className="w-4 h-4 mr-2" />
                        Edit
                      </Button>
                    </Link>
                    {page.is_published && (
                      <Link href={`/${page.slug === "home" ? "" : page.slug}`} target="_blank">
                        <Button size="sm" variant="outline">
                          <Eye className="w-4 h-4 mr-2" />
                          View
                        </Button>
                      </Link>
                    )}
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-red-600 text-red-400 hover:bg-red-600 hover:text-white bg-transparent"
                      onClick={() => deletePage(page.id, page.title)}
                      disabled={deletingPageId === page.id}
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      {deletingPageId === page.id ? "Deleting..." : "Delete"}
                    </Button>
                  </div>
                </div>
              </CardHeader>
              {page.meta_description && (
                <CardContent>
                  <p className="text-gray-300 text-sm">{page.meta_description}</p>
                </CardContent>
              )}
            </Card>
          )
        })}
      </div>
    </div>
  )
}
