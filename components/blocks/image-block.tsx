import Image from "next/image"
import type { ImageBlockContent } from "@/lib/types/page"

interface ImageBlockProps {
  content: ImageBlockContent
}

export function ImageBlock({ content }: ImageBlockProps) {
  const widthStyle = content.percentageWidth ? { width: `${content.percentageWidth}%` } : { width: "100%" }

  const backgroundStyle =
    content.backgroundColor && content.opacity !== undefined
      ? {
          backgroundColor: content.backgroundColor,
          opacity: content.opacity / 100,
        }
      : {}

  return (
    <section className="py-8 px-6" style={backgroundStyle}>
      <div className="max-w-4xl mx-auto">
        <div className="relative flex justify-center">
          <div style={widthStyle}>
            <Image
              src={content.image_url || content.src || "/placeholder.svg"}
              alt={content.alt_text || content.alt || "Image"}
              width={content.width || 800}
              height={content.height || 600}
              className="w-full h-auto rounded-lg shadow-lg"
              unoptimized
            />
          </div>
        </div>
        {content.caption && <p className="text-center text-gray-600 mt-4 italic">{content.caption}</p>}
      </div>
    </section>
  )
}
