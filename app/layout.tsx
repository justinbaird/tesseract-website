import type React from "react"
import type { Metadata } from "next"
import { Inter, Playfair_Display } from "next/font/google"
import { Toaster } from "sonner"
import { BackgroundProvider } from "@/components/background-provider"
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
  title: "Tesseract Art",
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
        <BackgroundProvider>
          <div
            className="fixed inset-0 bg-cover bg-center bg-no-repeat bg-black z-0"
            style={{
              backgroundImage: "var(--background-image-url)",
            }}
          />
          <div className="relative z-10">{children}</div>
          <Toaster richColors position="top-right" />
        </BackgroundProvider>
      </body>
    </html>
  )
}
