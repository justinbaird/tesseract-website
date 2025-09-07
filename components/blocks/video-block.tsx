import type { VideoContent } from "@/lib/types/page"

interface VideoBlockProps {
  content: VideoContent
}

function getYouTubeEmbedUrl(url: string): string | null {
  const youtubeRegex = /(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/\s]{11})/
  const match = url.match(youtubeRegex)
  if (match) {
    return `https://www.youtube.com/embed/${match[1]}`
  }
  return null
}

function isYouTubeUrl(url: string): boolean {
  return /(?:youtube\.com|youtu\.be)/.test(url)
}

export function VideoBlock({ content }: VideoBlockProps) {
  const isYouTube = content.src && isYouTubeUrl(content.src)
  const embedUrl = isYouTube ? getYouTubeEmbedUrl(content.src) : null

  const backgroundStyle =
    content.backgroundColor && content.opacity !== undefined
      ? {
          backgroundColor: content.backgroundColor,
          opacity: content.opacity / 100,
        }
      : {}

  return (
    <section className="relative py-8 px-6 overflow-hidden" style={backgroundStyle}>
      <div className="relative z-10 max-w-4xl mx-auto">
        {content.title && (
          <h2 className="text-3xl md:text-4xl font-bold text-center text-white mb-8">{content.title}</h2>
        )}

        {content.description && (
          <p className="text-lg text-gray-300 text-center mb-8 max-w-2xl mx-auto leading-relaxed">
            {content.description}
          </p>
        )}

        <div className="aspect-video rounded-lg overflow-hidden shadow-lg">
          {content.src ? (
            isYouTube && embedUrl ? (
              <iframe
                src={`${embedUrl}${content.autoplay ? "?autoplay=1&mute=1" : ""}`}
                className="w-full h-full"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title={content.title || "Video"}
              />
            ) : (
              <video
                className="w-full h-full object-cover"
                controls
                autoPlay={content.autoplay}
                muted={content.autoplay}
              >
                <source src={content.src} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            )
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
              <p className="text-gray-500">Video source not configured</p>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
