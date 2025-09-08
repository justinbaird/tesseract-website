import { Sidebar } from "@/components/sidebar"
import { Hero } from "@/components/hero"
import { Portfolio } from "@/components/portfolio"
import { Footer } from "@/components/footer"
import { getPosts } from "@/lib/posts"
import { getPageBySlug } from "@/lib/pages"
import { PageRenderer } from "@/components/page-renderer"

// Revalidate every 60 seconds in production, or disable caching in development
export const revalidate = process.env.NODE_ENV === 'development' ? 0 : 60

export default async function Home() {
  // Try to get the dynamic homepage first
  const dynamicPage = await getPageBySlug('home')
  
  // If we have a published dynamic homepage, use it
  if (dynamicPage && dynamicPage.is_published) {
    return <PageRenderer page={dynamicPage} />
  }
  
  // Fallback to static homepage if no dynamic page exists or it's not published
  const posts = await getPosts({ status: 'published' }).catch(() => [])

  return (
    <div className="min-h-screen text-white relative overflow-hidden">
      <div
        className="fixed inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url(/web-background.jpg)",
          zIndex: -2,
        }}
      />

      {/* <div className="fixed inset-0 bg-black/30" style={{ zIndex: -1 }} /> */}

      <div className="flex relative z-10">
        <Sidebar />
        <main className="flex-1 ml-0 lg:ml-80 pt-16 lg:pt-0">
          <Hero />
          <Portfolio posts={posts} />
          <Footer />
        </main>
      </div>
    </div>
  )
}
