"use client"
import { Button } from "@/components/ui/button"
import type { ContactBlockContent } from "@/lib/types/page"

interface ContactBlockProps {
  content: ContactBlockContent
}

export function ContactBlock({ content }: ContactBlockProps) {
  const backgroundStyle =
    content.backgroundColor && content.opacity !== undefined
      ? {
          backgroundColor: content.backgroundColor,
          opacity: content.opacity / 100,
        }
      : {}

  return (
    <section className="relative py-8 px-6 text-white overflow-hidden" style={backgroundStyle}>
      <div className="relative z-10 max-w-2xl mx-auto text-center">
        {content.title && <h2 className="text-3xl md:text-4xl font-bold mb-8">{content.title}</h2>}

        <div className="space-y-6">
          <p className="text-xl text-gray-300 mb-8">Get in touch with me directly via email</p>

          <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg">
            <a href="mailto:justin@justinbaird.com">Email Me: justin@justinbaird.com</a>
          </Button>
        </div>
      </div>
    </section>
  )
}
