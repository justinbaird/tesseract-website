export interface Post {
  id: string
  title: string
  slug: string
  excerpt?: string
  content: string
  image_url?: string
  category?: string
  tags?: string[]
  status: "draft" | "published"
  featured: boolean
  background_color?: string
  opacity?: number
  created_at: string
  updated_at: string
  published_at?: string
}

export interface CreatePostData {
  title: string
  slug: string
  excerpt?: string
  content: string
  image_url?: string
  category?: string
  tags?: string[]
  status?: "draft" | "published"
  featured?: boolean
  background_color?: string
  opacity?: number
}

export interface UpdatePostData extends Partial<CreatePostData> {
  id: string
}
