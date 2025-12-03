import { Button } from "@/components/ui/button"
import type { HeroBlockContent } from "@/lib/types/page"
import { parseMarkdown } from "@/lib/utils/markdown"

interface HeroBlockProps {
  content: HeroBlockContent
}

export function HeroBlock({ content }: HeroBlockProps) {
  const backgroundStyle =
    content.backgroundColor && content.opacity !== undefined
      ? {
          backgroundColor: content.backgroundColor,
          opacity: content.opacity / 100,
        }
      : {}

  return (
    <section
      className="relative min-h-[80vh] flex items-center justify-center text-white overflow-hidden"
      style={backgroundStyle}
    >
      <div className="relative z-10 text-center max-w-4xl mx-auto px-6">
        <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent whitespace-pre-line break-words">
          {content.title.length > 150 
            ? content.title.substring(0, 150) + "..." 
            : content.title
          }
        </h1>

        {content.subtitle && <h2 className="text-xl md:text-2xl text-gray-300 mb-8 font-light">{content.subtitle}</h2>}

        {content.description && (
          <div 
            className="text-lg text-gray-400 mb-12 max-w-2xl mx-auto leading-relaxed"
            dangerouslySetInnerHTML={{ __html: parseMarkdown(content.description) }}
          />
        )}

        {content.buttonText && content.buttonLink && (
          <Button size="lg" className="bg-white text-black hover:bg-gray-100 px-8 py-3 text-lg font-medium" asChild>
            <a href={content.buttonLink}>{content.buttonText}</a>
          </Button>
        )}
      </div>
    </section>
  )
}
