import type React from "react"
import type { Metadata } from "next"
import { Inter, Playfair_Display } from "next/font/google"
import { Toaster } from "sonner"
import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
  fallback: ["system-ui", "arial"],
})

const playfair = Playfair_Display({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-playfair",
  fallback: ["serif"],
})

export const metadata: Metadata = {
  title: "Justin Baird - Creative Technologist",
  description:
    "Senior Product Designer and UX/UI expert with 20+ years of experience in innovation, technology, product, management and strategy.",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable} antialiased`}>
      <head>
        <link
          rel="icon"
          type="image/x-icon"
          href="https://abomabdabkstyvllkosz.supabase.co/storage/v1/object/public/images/1755445930689-zdpkx07tami.avif"
        />
      </head>
      <body className="font-sans">
        <div
          className="fixed inset-0 bg-cover bg-center bg-no-repeat z-0"
          style={{
            backgroundImage: "url(/web-background.jpg)",
          }}
        />
        <div className="relative z-10">{children}</div>
        <Toaster richColors position="top-right" />
      </body>
    </html>
  )
}
