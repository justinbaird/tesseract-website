import { getPageById } from "@/lib/pages"
import { notFound } from "next/navigation"
import { VisualEditor } from "@/components/admin/visual-editor"
import { unstable_noStore } from "next/cache"

export const dynamic = "force-dynamic"
export const revalidate = 0

interface PageProps {
  params: { id: string }
}

export default async function EditPagePage({ params }: PageProps) {
  unstable_noStore()

  console.log("[v0] Fetching page data for edit page:", params.id)

  const timestamp = Date.now()
  console.log("[v0] Cache-busting timestamp:", timestamp)

  const page = await getPageById(params.id)
  console.log("[v0] Page data fetched for editing:", page?.title || "Page not found")

  if (!page) {
    notFound()
  }

  return <VisualEditor page={page} />
}
