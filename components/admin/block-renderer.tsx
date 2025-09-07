"use client"

import type { ContentBlock } from "@/lib/types/page"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Image from "next/image"

interface BlockRendererProps {
  block: ContentBlock
}

export function BlockRenderer({ block }: BlockRendererProps) {
  const { block_type, content } = block

  switch (block_type) {
    case "hero":
      return (
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-16 text-center">
          <h1 className="text-4xl font-bold mb-4">{content.title}</h1>
          {content.subtitle && <h2 className="text-xl mb-6 opacity-90">{content.subtitle}</h2>}
          {content.description && <p className="text-lg mb-8 opacity-80">{content.description}</p>}
          {content.buttonText && (
            <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
              {content.buttonText}
            </Button>
          )}
        </div>
      )

    case "text":
      return (
        <div className={`p-8 text-${content.alignment || "left"}`}>
          {content.title && <h2 className="text-2xl font-bold mb-4 text-gray-900">{content.title}</h2>}
          <div className="prose max-w-none text-gray-700">
            {(content.text || '').split("\n").map((paragraph: string, index: number) => (
              <p key={index} className="mb-4">
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      )

    case "image":
      return (
        <div className="p-8">
          <div className="relative flex justify-center">
            <div style={{ width: `${content.percentageWidth || 100}%` }}>
              <Image
                src={content.image_url || content.src || "/placeholder.svg"}
                alt={content.alt_text || content.alt || "Image"}
                width={content.width || 600}
                height={content.height || 400}
                className="w-full h-auto rounded-lg"
                unoptimized
              />
              {content.caption && <p className="text-sm text-gray-600 mt-2 text-center">{content.caption}</p>}
            </div>
          </div>
        </div>
      )

    case "portfolio":
      return (
        <div className="p-8">
          {content.title && <h2 className="text-2xl font-bold mb-8 text-center text-gray-900">{content.title}</h2>}
          <div
            className={`grid gap-6 ${
              content.layout === "list" ? "grid-cols-1" : `grid-cols-1 md:grid-cols-${content.itemsPerRow || 3}`
            }`}
          >
            {[1, 2, 3].map((item) => (
              <Card key={item} className="overflow-hidden">
                <div className="aspect-video bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-500">Portfolio Item {item}</span>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold">Project Title {item}</h3>
                  <p className="text-sm text-gray-600 mt-1">Project description...</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )

    case "contact":
      return (
        <div className="p-8 bg-gray-50">
          {content.title && <h2 className="text-2xl font-bold mb-8 text-center text-gray-900">{content.title}</h2>}
          <div className="max-w-md mx-auto">
            {content.email && (
              <p className="text-center mb-4">
                <a href={`mailto:${content.email}`} className="text-blue-600 hover:underline">
                  {content.email}
                </a>
              </p>
            )}
            {content.showForm && (
              <Card className="p-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Name</label>
                    <div className="h-10 bg-gray-100 rounded border"></div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Email</label>
                    <div className="h-10 bg-gray-100 rounded border"></div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Message</label>
                    <div className="h-24 bg-gray-100 rounded border"></div>
                  </div>
                  <Button className="w-full">Send Message</Button>
                </div>
              </Card>
            )}
          </div>
        </div>
      )

    case "video":
      return (
        <div className="p-8">
          {content.title && <h2 className="text-2xl font-bold mb-4 text-gray-900">{content.title}</h2>}
          <div className="aspect-video bg-gray-200 rounded-lg flex items-center justify-center">
            <span className="text-gray-500">Video Player</span>
          </div>
        </div>
      )

    case "image_text_left":
      return (
        <div className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="relative">
              <Image
                src={content.image_src || "/placeholder.svg"}
                alt={content.image_alt || "Section image"}
                width={400}
                height={300}
                className="w-full h-auto rounded-lg"
              />
              {content.image_caption && (
                <p className="text-sm text-gray-600 mt-2 text-center">{content.image_caption}</p>
              )}
            </div>
            <div className={`text-${content.text_alignment || "left"}`}>
              {content.title && <h2 className="text-2xl font-bold mb-4 text-gray-900">{content.title}</h2>}
              <div className="prose max-w-none text-gray-700">
                {(content.text || content.content || '').split("\n").map((paragraph: string, index: number) => (
                  <p key={index} className="mb-4">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </div>
      )

    case "image_text_right":
      return (
        <div className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className={`text-${content.text_alignment || "left"}`}>
              {content.title && <h2 className="text-2xl font-bold mb-4 text-gray-900">{content.title}</h2>}
              <div className="prose max-w-none text-gray-700">
                {(content.text || content.content || '').split("\n").map((paragraph: string, index: number) => (
                  <p key={index} className="mb-4">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
            <div className="relative">
              <Image
                src={content.image_src || "/placeholder.svg"}
                alt={content.image_alt || "Section image"}
                width={400}
                height={300}
                className="w-full h-auto rounded-lg"
              />
              {content.image_caption && (
                <p className="text-sm text-gray-600 mt-2 text-center">{content.image_caption}</p>
              )}
            </div>
          </div>
        </div>
      )

    case "embed":
      return (
        <div className="p-8">
          {content.title && <h2 className="text-2xl font-bold mb-4 text-gray-900">{content.title}</h2>}
          <div className="aspect-video bg-gray-200 rounded-lg flex items-center justify-center">
            <span className="text-gray-500">Embedded Content Preview</span>
          </div>
        </div>
      )

    default:
      return (
        <div className="p-8 bg-gray-100">
          <p className="text-gray-500">Unknown block type: {block_type}</p>
        </div>
      )
  }
}
