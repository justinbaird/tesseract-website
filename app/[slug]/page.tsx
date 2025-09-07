import { getPageBySlug } from "@/lib/pages"
import { PageRenderer } from "@/components/page-renderer"
import { notFound } from "next/navigation"

// Revalidate every 60 seconds in production, or disable caching in development
export const revalidate = process.env.NODE_ENV === 'development' ? 0 : 60

interface PageProps {
  params: { slug: string }
}

export default async function DynamicPage({ params }: PageProps) {
  const page = await getPageBySlug(params.slug)

  if (!page) {
    notFound()
  }

  return <PageRenderer page={page} />
}

export async function generateMetadata({ params }: PageProps) {
  const page = await getPageBySlug(params.slug)

  if (!page) {
    return {
      title: "Page Not Found",
    }
  }

  return {
    title: page.title,
    description: page.meta_description,
  }
}
