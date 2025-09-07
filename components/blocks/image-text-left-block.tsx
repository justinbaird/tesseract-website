import type { ImageTextBlockContent } from "@/lib/types/page"
import { parseMarkdown } from "@/lib/utils/markdown"

interface ImageTextLeftBlockProps {
  content: ImageTextBlockContent
}

export function ImageTextLeftBlock({ content }: ImageTextLeftBlockProps) {
  const backgroundStyle =
    content.backgroundColor && content.opacity !== undefined
      ? {
          backgroundColor: content.backgroundColor,
          opacity: content.opacity / 100,
        }
      : {}

  return (
    <section className="py-8 px-6" style={backgroundStyle}>
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="order-1">
            <img
              src={content.image_src || "/placeholder.svg"}
              alt={content.image_alt}
              className="w-full h-auto rounded-lg shadow-lg"
            />
            {content.image_caption && (
              <p className="text-sm text-gray-400 mt-2 text-center italic">{content.image_caption}</p>
            )}
          </div>

          <div className="order-2">
            {content.title && <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">{content.title}</h2>}
            <div className={`text-gray-300 leading-relaxed text-${content.text_alignment || "left"}`}>
              {content.content
                .split("\n")
                .map(
                  (paragraph, index) =>
                    paragraph.trim() && (
                      <div
                        key={index}
                        className="mb-4"
                        dangerouslySetInnerHTML={{ __html: parseMarkdown(paragraph) }}
                      />
                    ),
                )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
