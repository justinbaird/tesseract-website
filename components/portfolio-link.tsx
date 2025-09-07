'use client'

import { Suspense } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'

interface PortfolioLinkProps {
  href: string
  tagFilter?: string
  children: React.ReactNode
}

function PortfolioLinkInner({ href, tagFilter, children }: PortfolioLinkProps) {
  const searchParams = useSearchParams()
  
  const handleClick = () => {
    // Store the current page as referrer for smart back navigation
    const currentUrl = window.location.pathname + window.location.search
    sessionStorage.setItem('portfolio-referrer', currentUrl)
    
    // Store the tag filter if it exists for dynamic back button text
    if (tagFilter) {
      sessionStorage.setItem('portfolio-referrer-tag', tagFilter)
    } else {
      // Check if we have a tag in URL params (for filtered portfolio pages)
      const urlTag = searchParams.get('tag')
      if (urlTag) {
        sessionStorage.setItem('portfolio-referrer-tag', urlTag)
      } else {
        sessionStorage.removeItem('portfolio-referrer-tag')
      }
    }
  }

  return (
    <Link href={href} onClick={handleClick}>
      {children}
    </Link>
  )
}

export function PortfolioLink({ href, tagFilter, children }: PortfolioLinkProps) {
  return (
    <Suspense fallback={
      <Link href={href}>
        {children}
      </Link>
    }>
      <PortfolioLinkInner href={href} tagFilter={tagFilter}>
        {children}
      </PortfolioLinkInner>
    </Suspense>
  )
}
