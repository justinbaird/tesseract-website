import type { Page, ContentBlock } from "@/lib/types/page"
import { HeroBlock } from "@/components/blocks/hero-block"
import { TextBlock } from "@/components/blocks/text-block"
import { ImageBlock } from "@/components/blocks/image-block"
import { PortfolioBlock } from "@/components/blocks/portfolio-block"
import { ContactBlock } from "@/components/blocks/contact-block"
import { VideoBlock } from "@/components/blocks/video-block"
import { ImageTextLeftBlock } from "@/components/blocks/image-text-left-block"
import { ImageTextRightBlock } from "@/components/blocks/image-text-right-block"
import EmbedBlock from "@/components/blocks/embed-block"
import { Sidebar } from "@/components/sidebar"

interface PageRendererProps {
  page: Page
}

export function PageRenderer({ page }: PageRendererProps) {
  if (!page.content_blocks || page.content_blocks.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center text-gray-500">
          <h2 className="text-2xl font-semibold mb-2">Page is empty</h2>
          <p>No content blocks have been added to this page yet.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen text-white relative overflow-hidden">
      <div className="flex">
        <Sidebar />
        <main className="flex-1 ml-0 lg:ml-64 relative z-10 pt-16 lg:pt-0">
          {page.content_blocks
            .filter((block) => block.is_visible)
            .map((block) => (
              <BlockRenderer key={block.id} block={block} />
            ))}
        </main>
      </div>
    </div>
  )
}

function BlockRenderer({ block }: { block: ContentBlock }) {
  console.log("[v0] Rendering block:", block.block_type, block)

  switch (block.block_type) {
    case "hero":
      return <HeroBlock content={block.content} />
    case "text":
      return <TextBlock content={block.content} />
    case "image":
      return <ImageBlock content={block.content} />
    case "image_text_left":
      return <ImageTextLeftBlock content={block.content} />
    case "image_text_right":
      return <ImageTextRightBlock content={block.content} />
    case "portfolio":
      return <PortfolioBlock content={block.content} />
    case "contact":
      return <ContactBlock content={block.content} />
    case "video":
      return <VideoBlock content={block.content} />
    case "embed":
      return <EmbedBlock {...block.content} />
    default:
      console.error("[v0] Unknown block type:", block.block_type, block)
      return (
        <div className="py-8 px-6 bg-red-900/20 border border-red-500/30 rounded-lg mx-6 my-4">
          <div className="text-center text-red-400">
            <h3 className="text-lg font-semibold mb-2">Unknown Block Type</h3>
            <p className="text-sm">Block type "{block.block_type}" is not supported.</p>
            <details className="mt-2 text-xs">
              <summary className="cursor-pointer">Debug Info</summary>
              <pre className="mt-2 text-left bg-black/30 p-2 rounded overflow-auto">
                {JSON.stringify(block, null, 2)}
              </pre>
            </details>
          </div>
        </div>
      )
  }
}
