import { getPosts } from "@/lib/posts"
import { Card, CardContent } from "@/components/ui/card"
import Image from "next/image"
import { PortfolioLink } from "@/components/portfolio-link"
import { parseMarkdown } from "@/lib/utils/markdown"
import type { PortfolioBlockContent } from "@/lib/types/page"

interface PortfolioBlockProps {
  content: PortfolioBlockContent
}

export async function PortfolioBlock({ content }: PortfolioBlockProps) {
  // Fetch posts with tag filtering if specified
  const posts = await getPosts({
    tagFilter: content.tagFilter,
    status: "published" // Only show published posts in portfolio blocks
  })
  const filteredPosts = content.showFeaturedOnly ? posts.filter((post) => post.featured) : posts

  const postsToShow = content.layout === "list" ? filteredPosts : filteredPosts.slice(0, content.itemsPerRow || 3)

  const gridCols = {
    2: "md:grid-cols-2",
    3: "md:grid-cols-3",
    4: "md:grid-cols-4",
  }[content.itemsPerRow || 3]

  // Convert hex color to rgba with opacity
  const getBackgroundStyle = () => {
    if (!content.backgroundColor) {
      return {}
    }
    
    const hex = content.backgroundColor
    const opacity = content.opacity !== undefined ? content.opacity / 100 : 1
    
    // Ensure hex starts with # and is valid
    const cleanHex = hex.startsWith('#') ? hex : `#${hex}`
    
    // Convert hex to rgb
    const r = parseInt(cleanHex.slice(1, 3), 16)
    const g = parseInt(cleanHex.slice(3, 5), 16)
    const b = parseInt(cleanHex.slice(5, 7), 16)
    
    return {
      backgroundColor: `rgba(${r}, ${g}, ${b}, ${opacity})`
    }
  }

  // Always make portfolio cards transparent to show background pattern
  // Override the default Card component background with important modifier
  const cardClassName = "group hover:shadow-xl transition-all duration-300 overflow-hidden border-gray-700 !bg-transparent"

  return (
    <section className="relative py-8 px-6 overflow-hidden">
      <div className="relative z-10 max-w-6xl mx-auto">
        {content.title && (
          <h2 className="text-3xl md:text-4xl font-bold text-center text-white mb-12">{content.title}</h2>
        )}

        {content.layout === "list" ? (
          <div className="space-y-6">
            {postsToShow.map((post) => (
              <PortfolioLink key={post.id} href={`/posts/${post.slug}`} tagFilter={content.tagFilter}>
                <Card className={cardClassName} style={getBackgroundStyle()}>
                  <div className="flex flex-col md:flex-row">
                    <CardContent className="p-6 w-full md:w-2/5 flex-shrink-0 flex flex-col justify-center">
                      <div className="space-y-3">
                        <h3 className="text-xl md:text-2xl font-semibold text-white group-hover:text-blue-400 transition-colors leading-tight">
                          {post.title}
                        </h3>
                        {post.excerpt && (
                          <div 
                            className="text-gray-300 leading-relaxed text-sm md:text-base line-clamp-3 md:line-clamp-4"
                            dangerouslySetInnerHTML={{ __html: parseMarkdown(post.excerpt) }}
                          />
                        )}
                      </div>
                    </CardContent>
                    {post.image_url && (
                      <div className="w-full md:w-3/5 flex-shrink-0">
                        <div className="aspect-video overflow-hidden bg-gray-900">
                          <Image
                            src={post.image_url || "/placeholder.svg"}
                            alt={post.title}
                            width={600}
                            height={400}
                            className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </Card>
              </PortfolioLink>
            ))}
          </div>
        ) : (
          <div className={`grid gap-8 grid-cols-1 ${gridCols}`}>
            {postsToShow.map((post) => (
              <PortfolioLink key={post.id} href={`/posts/${post.slug}`} tagFilter={content.tagFilter}>
                <Card className={`${cardClassName} flex flex-col`} style={getBackgroundStyle()}>
                  {post.image_url && (
                    <div className="aspect-video overflow-hidden flex-shrink-0 bg-gray-900">
                      <Image
                        src={post.image_url || "/placeholder.svg"}
                        alt={post.title}
                        width={600}
                        height={400}
                        className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}
                  <CardContent className="p-4 flex-1 flex flex-col">
                    <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-blue-400 transition-colors line-clamp-2">
                      {post.title}
                    </h3>
                    {post.excerpt && (
                      <div 
                        className="text-gray-300 line-clamp-3 leading-relaxed mb-4"
                        dangerouslySetInnerHTML={{ __html: parseMarkdown(post.excerpt) }}
                      />
                    )}
                  </CardContent>
                </Card>
              </PortfolioLink>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
