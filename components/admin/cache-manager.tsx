"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { RefreshCw, CheckCircle } from "lucide-react"

export function CacheManager() {
  const [isClearing, setIsClearing] = useState(false)
  const [cleared, setCleared] = useState(false)

  const clearCache = async () => {
    setIsClearing(true)
    setCleared(false)

    try {
      // Force a hard refresh by reloading the window
      if (typeof window !== 'undefined') {
        // Clear browser cache for this domain
        if ('caches' in window) {
          const cacheNames = await caches.keys()
          await Promise.all(
            cacheNames.map(name => caches.delete(name))
          )
        }

        // Clear localStorage cache if any
        localStorage.removeItem('profileImageUrl')
        
        // Force reload to clear all cached data
        window.location.reload()
      }
    } catch (error) {
      console.error("Error clearing cache:", error)
    } finally {
      setIsClearing(false)
      setCleared(true)
      setTimeout(() => setCleared(false), 3000)
    }
  }

  return (
    <div className="bg-gray-800 p-6 rounded-lg">
      <h3 className="text-lg font-semibold mb-4 text-white">Cache Management</h3>
      <div className="space-y-4">
        <p className="text-sm text-gray-300">
          If you've updated content but don't see changes, clear the cache to force a refresh.
        </p>
        
        <div className="flex items-center gap-3">
          <Button 
            onClick={clearCache} 
            disabled={isClearing}
            variant="outline"
            size="sm"
          >
            {isClearing ? (
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
            ) : cleared ? (
              <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
            ) : (
              <RefreshCw className="h-4 w-4 mr-2" />
            )}
            {isClearing ? "Clearing..." : cleared ? "Cache Cleared!" : "Clear Cache & Refresh"}
          </Button>
          
          {cleared && (
            <span className="text-sm text-green-400">
              Page will reload automatically
            </span>
          )}
        </div>

        <div className="text-xs text-gray-400 space-y-1">
          <p><strong>Development:</strong> Content updates should appear immediately (no cache)</p>
          <p><strong>Production:</strong> Content updates appear within 60 seconds</p>
        </div>
      </div>
    </div>
  )
}
