import { VisualEditor } from "@/components/admin/visual-editor"

export default function NewPagePage() {
  const newPage = {
    id: "",
    title: "New Page",
    slug: "new-page",
    meta_description: "",
    is_published: false,
    is_homepage: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    content_blocks: [],
  }

  return <VisualEditor page={newPage} isNew />
}
