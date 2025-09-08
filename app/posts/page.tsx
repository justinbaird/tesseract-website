import { getPosts } from "@/lib/posts"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

// Force dynamic rendering to avoid build-time data fetching issues
export const dynamic = 'force-dynamic'

export default async function PostsPage() {
  const posts = await getPosts({ status: "published" })
  
  // Debug: Log first post to see what we're getting
  if (posts.length > 0) {
    console.log("[v0] First post data:", {
      title: posts[0].title,
      image_url: posts[0].image_url,
      image_url_type: typeof posts[0].image_url,
      image_url_length: posts[0].image_url?.length,
      has_image_url: !!posts[0].image_url
    })
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <div className="container mx-auto px-4 py-8 max-w-6xl pt-20 lg:pt-8">
        <div className="mb-8">
          <Link href="/">
            <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white mb-6">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>

          <h1 className="text-4xl font-bold mb-4">All Posts</h1>
          <p className="text-gray-400">Browse all published posts and projects</p>
        </div>

        {posts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">No published posts yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <Link key={post.id} href={`/posts/${post.slug}`}>
                <Card className="group hover:shadow-xl transition-all duration-300 overflow-hidden bg-gray-900 border-gray-700 hover:border-gray-600">
                  <div className="aspect-video overflow-hidden bg-gray-900">
                    <Image
                      src={post.image_url || "https://via.placeholder.com/800x400?text=Image+Placeholder"}
                      alt={post.title}
                      width={600}
                      height={400}
                      className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-2 mb-3">
                      {post.featured && <Badge className="bg-[#00ff88] text-black">Featured</Badge>}
                      <Badge variant="outline" className="text-gray-400 border-gray-600">
                        {post.status}
                      </Badge>
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-[#00ff88] transition-colors">
                      {post.title}
                    </h3>
                    {post.excerpt && <p className="text-gray-400 mb-4 line-clamp-3">{post.excerpt}</p>}
                    {post.category && (
                      <div className="text-sm text-gray-500 mb-3">
                        <span>{post.category}</span>
                      </div>
                    )}
                    {post.tags && post.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {post.tags.slice(0, 3).map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs bg-gray-800 text-gray-400">
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
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
