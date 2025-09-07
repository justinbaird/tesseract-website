'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'

interface BackButtonProps {
  className?: string
}

export function BackButton({ className }: BackButtonProps) {
  const router = useRouter()
  const [backUrl, setBackUrl] = useState('/')
  const [backText, setBackText] = useState('Back to Portfolio')

  useEffect(() => {
    // Check if we have a stored referrer
    const referrer = sessionStorage.getItem('portfolio-referrer')
    const referrerTag = sessionStorage.getItem('portfolio-referrer-tag')
    
    if (referrer) {
      setBackUrl(referrer)
      
      // Set dynamic text based on the tag
      if (referrerTag) {
        const capitalizedTag = referrerTag.charAt(0).toUpperCase() + referrerTag.slice(1)
        setBackText(`Back to ${capitalizedTag}`)
      } else {
        setBackText('Back to Portfolio')
      }
    } else {
      // Fallback to document.referrer if no stored referrer
      if (typeof window !== 'undefined' && document.referrer) {
        const referrerUrl = new URL(document.referrer)
        
        // Check if referrer is from our site and has a tag parameter
        if (referrerUrl.origin === window.location.origin) {
          const searchParams = new URLSearchParams(referrerUrl.search)
          const tag = searchParams.get('tag')
          
          if (tag) {
            setBackUrl(document.referrer)
            const capitalizedTag = tag.charAt(0).toUpperCase() + tag.slice(1)
            setBackText(`Back to ${capitalizedTag}`)
          } else if (referrerUrl.pathname !== window.location.pathname) {
            setBackUrl(document.referrer)
            setBackText('Back to Portfolio')
          }
        }
      }
    }
  }, [])

  const handleBack = () => {
    // Clear the stored referrer after use
    sessionStorage.removeItem('portfolio-referrer')
    sessionStorage.removeItem('portfolio-referrer-tag')
    
    if (backUrl === '/') {
      router.push('/')
    } else {
      router.push(backUrl)
    }
  }

  return (
    <Button 
      variant="ghost" 
      size="sm" 
      className={`text-gray-400 hover:text-white mb-6 ${className}`}
      onClick={handleBack}
    >
      <ArrowLeft className="w-4 h-4 mr-2" />
      {backText}
    </Button>
  )
}
