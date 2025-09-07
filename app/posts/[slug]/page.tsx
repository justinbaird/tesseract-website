import { getPostBySlug, getPosts } from "@/lib/posts"
import { notFound } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { Tag } from "lucide-react"
import { parseMarkdown } from "@/lib/utils/markdown"
import { BackButton } from "@/components/back-button"

// Revalidate every 60 seconds in production, or disable caching in development
export const revalidate = process.env.NODE_ENV === 'development' ? 0 : 60


interface PostPageProps {
  params: {
    slug: string
  }
}

export default async function PostPage({ params }: PostPageProps) {
  const post = await getPostBySlug(params.slug)

  if (!post || post.status !== "published") {
    notFound()
  }

  // Convert hex color to rgba with opacity for background only
  const hexToRgba = (hex: string, opacity: number) => {
    const r = parseInt(hex.slice(1, 3), 16)
    const g = parseInt(hex.slice(3, 5), 16)
    const b = parseInt(hex.slice(5, 7), 16)
    return `rgba(${r}, ${g}, ${b}, ${opacity})`
  }

  const backgroundColor = post.background_color || "#0a0a0a"
  const opacity = post.opacity ? post.opacity / 100 : 1
  const backgroundRgba = hexToRgba(backgroundColor, opacity)

  return (
    <div className="min-h-screen text-white relative">
      {/* Only add background overlay if opacity is less than 100% to allow pattern through */}
      {opacity < 1 && (
        <div 
          className="absolute inset-0 pointer-events-none -z-10" 
          style={{ 
            backgroundColor: backgroundRgba
          }}
        />
      )}
      <div className="container mx-auto px-4 py-8 max-w-4xl relative z-10 pt-20 lg:pt-8">
        <div className="mb-8">
          <BackButton />

          {post.featured && <Badge className="bg-[#00ff88] text-black mb-4">Featured</Badge>}

          <h1 className="text-4xl font-bold mb-4">{post.title}</h1>

          {post.category && (
            <div className="flex items-center gap-6 text-gray-400 text-sm mb-6">
              <div className="flex items-center gap-2">
                <Tag className="w-4 h-4" />
                <span>{post.category}</span>
              </div>
            </div>
          )}

          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {post.tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="bg-gray-800 text-gray-300">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </div>

        {post.image_url && (
          <div className="mb-8 bg-gray-900 rounded-lg">
            <img
              src={post.image_url || "/placeholder.svg"}
              alt={post.title}
              className="w-full h-64 md:h-96 object-contain rounded-lg"
            />
          </div>
        )}

        {post.excerpt && (
          <div
            className="text-xl text-gray-300 mb-8 font-medium leading-relaxed"
            dangerouslySetInnerHTML={{ __html: parseMarkdown(post.excerpt) }}
          />
        )}

        <div className="prose prose-invert prose-lg max-w-none">
          <div className="leading-relaxed" dangerouslySetInnerHTML={{ __html: parseMarkdown(post.content) }} />
        </div>
      </div>
    </div>
  )
}

// Generate static params for all published posts
export async function generateStaticParams() {
  const posts = await getPosts({ status: "published" })

  return posts.map((post) => ({
    slug: post.slug,
  }))
}
