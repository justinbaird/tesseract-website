import type { EmbedBlockContent } from "@/lib/types/page"

interface EmbedBlockProps {
  content: EmbedBlockContent
}

const detectEmbedType = (url: string): string => {
  if (url.includes("youtube.com") || url.includes("youtu.be")) return "youtube"
  if (url.includes("vimeo.com")) return "vimeo"
  if (url.includes("twitter.com") || url.includes("x.com")) return "twitter"
  if (url.includes("codepen.io")) return "codepen"
  return "iframe"
}

const getEmbedUrl = (url: string, type: string): string => {
  switch (type) {
    case "youtube":
      const youtubeId = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/)?.[1]
      return youtubeId ? `https://www.youtube.com/embed/${youtubeId}` : url

    case "vimeo":
      const vimeoId = url.match(/vimeo\.com\/(\d+)/)?.[1]
      return vimeoId ? `https://player.vimeo.com/video/${vimeoId}` : url

    case "codepen":
      const codepenUrl = url.replace("/pen/", "/embed/")
      return codepenUrl.includes("/embed/") ? codepenUrl : url

    default:
      return url
  }
}

export default function EmbedBlock({ content }: EmbedBlockProps) {
  if (!content.url) {
    return (
      <section className="py-8 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-gray-400">No embed URL provided</p>
        </div>
      </section>
    )
  }

  const detectedType = content.embed_type === "auto" ? detectEmbedType(content.url) : content.embed_type
  const embedUrl = getEmbedUrl(content.url, detectedType)

  const backgroundStyle =
    content.backgroundColor && content.opacity !== undefined
      ? {
          backgroundColor: content.backgroundColor,
          opacity: content.opacity / 100,
        }
      : {}

  if (detectedType === "twitter") {
    return (
      <section className="py-8 px-4" style={backgroundStyle}>
        <div className="max-w-2xl mx-auto">
          {content.title && <h2 className="text-3xl font-bold text-white mb-8 text-center">{content.title}</h2>}
          <div className="flex justify-center">
            <blockquote className="twitter-tweet">
              <a href={content.url}>Loading tweet...</a>
            </blockquote>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-8 px-4" style={backgroundStyle}>
      <div className="max-w-4xl mx-auto">
        {content.title && <h2 className="text-3xl font-bold text-white mb-8 text-center">{content.title}</h2>}
        <div className="relative overflow-hidden rounded-lg backdrop-blur-sm">
          <iframe
            src={embedUrl}
            width={content.width || "100%"}
            height={content.height || "400px"}
            frameBorder="0"
            allowFullScreen={content.allow_fullscreen}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            className="w-full"
            style={{ minHeight: content.height || "400px" }}
          />
        </div>
      </div>
    </section>
  )
}
