import { Card } from "@/components/ui/card"
import type { Post } from "@/lib/types/post"
import { Badge } from "@/components/ui/badge"

interface PortfolioProps {
  posts: Post[]
}

function formatDistanceToNow(date: Date): string {
  const now = new Date()
  const diffInMs = now.getTime() - date.getTime()
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24))
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60))
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60))

  if (diffInDays > 0) {
    return `${diffInDays} day${diffInDays === 1 ? "" : "s"}`
  } else if (diffInHours > 0) {
    return `${diffInHours} hour${diffInHours === 1 ? "" : "s"}`
  } else if (diffInMinutes > 0) {
    return `${diffInMinutes} minute${diffInMinutes === 1 ? "" : "s"}`
  } else {
    return "just now"
  }
}

export function Portfolio({ posts }: PortfolioProps) {
  // Show only published posts, prioritize featured posts
  const publishedPosts = posts
    .filter((post) => post.status === "published")
    .sort((a, b) => {
      // Featured posts first, then by published date
      if (a.featured && !b.featured) return -1
      if (!a.featured && b.featured) return 1
      return new Date(b.published_at || b.created_at).getTime() - new Date(a.published_at || a.created_at).getTime()
    })

  if (publishedPosts.length === 0) {
    return (
      <section id="work" className="py-20 px-6 lg:px-12">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-12 text-center">Latest</h2>
          <div className="text-center text-gray-400">
            <p>No published posts yet.</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="work" className="py-20 px-6 lg:px-12">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold mb-12 text-center">Latest</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {publishedPosts.map((post) => (
            <Card
              key={post.id}
              className="bg-black/50 border-white/10 overflow-hidden hover:border-white/30 transition-all duration-300 group cursor-pointer"
            >
              <div className="relative">
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${getCategoryGradient(post.category)} opacity-20 group-hover:opacity-30 transition-opacity`}
                />

                <img
                  src={post.image_url || "/placeholder.svg?height=200&width=400"}
                  alt={post.title}
                  className="w-full h-48 object-cover"
                />

                <div className="absolute top-4 right-4 flex items-center gap-2">
                  {post.featured && <Badge className="bg-[#00ff88] text-black text-xs px-2 py-1">Featured</Badge>}

                  <div className="bg-black/70 px-2 py-1 rounded text-xs">
                    {formatDistanceToNow(new Date(post.published_at || post.created_at))} ago
                  </div>
                </div>
              </div>

              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2 group-hover:text-white transition-colors">{post.title}</h3>

                <div className="flex items-center justify-between mb-2">
                  <p className="text-gray-400 text-sm">{post.category || "Uncategorized"}</p>
                </div>

                {post.excerpt && <p className="text-gray-500 text-sm line-clamp-2 mb-3">{post.excerpt}</p>}

                {post.tags && post.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {post.tags.slice(0, 3).map((tag) => (
                      <Badge
                        key={tag}
                        variant="secondary"
                        className="text-xs bg-gray-800 text-gray-400 hover:bg-gray-700"
                      >
                        {tag}
                      </Badge>
                    ))}
                    {post.tags.length > 3 && (
                      <Badge variant="secondary" className="text-xs bg-gray-800 text-gray-400">
                        +{post.tags.length - 3}
                      </Badge>
                    )}
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

function getCategoryGradient(category?: string): string {
  const gradients: Record<string, string> = {
    "UI/UX Design": "from-purple-500 to-pink-500",
    "Product Design": "from-blue-500 to-cyan-500",
    "Mobile Design": "from-green-500 to-teal-500",
    "Web Design": "from-orange-500 to-red-500",
    Blockchain: "from-green-500 to-blue-500",
    AI: "from-purple-500 to-indigo-500",
    "E-commerce": "from-pink-500 to-purple-500",
    Education: "from-indigo-500 to-blue-500",
    Music: "from-pink-500 to-red-500",
    Documentary: "from-green-500 to-teal-500",
  }

  return gradients[category || ""] || "from-gray-500 to-slate-500"
}
