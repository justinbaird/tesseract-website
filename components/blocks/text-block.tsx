import type { TextBlockContent } from "@/lib/types/page"
import { parseMarkdown } from "@/lib/utils/markdown"

interface TextBlockProps {
  content: TextBlockContent
}

export function TextBlock({ content }: TextBlockProps) {
  const alignmentClass = {
    left: "text-left",
    center: "text-center",
    right: "text-right",
  }[content.alignment || "left"]

  const backgroundStyle =
    content.backgroundColor && content.opacity !== undefined
      ? {
          backgroundColor: content.backgroundColor,
          opacity: content.opacity / 100,
        }
      : {}

  return (
    <section className="relative py-8 px-6" style={backgroundStyle}>
      <div className={`relative max-w-4xl mx-auto ${alignmentClass}`}>
        {content.title && <h2 className="text-3xl md:text-4xl font-bold text-white mb-8">{content.title}</h2>}
        <div className="prose prose-lg max-w-none text-gray-300 leading-relaxed">
          {(content.content || content.text)
            ? (content.content || content.text)
                .split("\n")
                .map(
                  (paragraph, index) =>
                    paragraph.trim() && (
                      <div key={index} className="mb-6" dangerouslySetInnerHTML={{ __html: parseMarkdown(paragraph) }} />
                    ),
                )
            : <p className="text-gray-400">No content available</p>
          }
        </div>
      </div>
    </section>
  )
}
