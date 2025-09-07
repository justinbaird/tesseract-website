"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Lock } from "lucide-react"

const ADMIN_PASSWORD_HASH = "ef94e4c45de42ff2316d4c65cbdeaba2c17e91f50d1882f13e4bc5dd3aaab0bd"

// Simple hash function using Web Crypto API
async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder()
  const data = encoder.encode(password)
  const hashBuffer = await crypto.subtle.digest("SHA-256", data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("")
}

interface SimpleAuthProps {
  onAuthenticated: () => void
}

export function SimpleAuth({ onAuthenticated }: SimpleAuthProps) {
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    // Simple delay to prevent brute force
    await new Promise((resolve) => setTimeout(resolve, 500))

    const enteredPasswordHash = await hashPassword(password)

    if (enteredPasswordHash === ADMIN_PASSWORD_HASH) {
      // Store auth state in sessionStorage
      sessionStorage.setItem("admin_authenticated", "true")
      onAuthenticated()
    } else {
      setError("Incorrect password")
      setPassword("")
    }

    setIsLoading(false)
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-[#1a1a1a] border-gray-800">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-[#00ff88] rounded-full flex items-center justify-center mb-4">
            <Lock className="w-6 h-6 text-black" />
          </div>
          <CardTitle className="text-white">Admin Access</CardTitle>
          <CardDescription className="text-gray-400">Enter the admin password to continue</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Input
                type="password"
                placeholder="Enter admin password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-[#0a0a0a] border-gray-700 text-white placeholder:text-gray-500"
                disabled={isLoading}
                autoFocus
              />
            </div>
            {error && <p className="text-red-400 text-sm">{error}</p>}
            <Button
              type="submit"
              className="w-full bg-[#00ff88] hover:bg-[#00cc6a] text-black font-medium"
              disabled={isLoading}
            >
              {isLoading ? "Checking..." : "Access Admin"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
