export interface Page {
  id: string
  title: string
  slug: string
  meta_description?: string
  is_published: boolean
  is_homepage: boolean
  parent_id?: string | null
  sort_order?: number
  created_at: string
  updated_at: string
  content_blocks?: ContentBlock[]
}

export interface ContentBlock {
  id: string
  page_id: string
  block_type: BlockType
  content: BlockContent
  position: number
  is_visible: boolean
  created_at: string
  updated_at: string
}

export type BlockType =
  | "hero"
  | "text"
  | "image"
  | "gallery"
  | "portfolio"
  | "contact"
  | "spacer"
  | "video"
  | "testimonial"
  | "image_text_left"
  | "image_text_right"
  | "embed"

export interface BlockContent {
  [key: string]: any
}

// Specific content types for different blocks
export interface HeroBlockContent extends BlockContent {
  title: string
  subtitle?: string
  description?: string
  buttonText?: string
  buttonLink?: string
  backgroundImage?: string
  backgroundColor?: string
  opacity?: number
}

export interface TextBlockContent extends BlockContent {
  title?: string
  content?: string
  text?: string  // Alternative property name from database
  alignment?: "left" | "center" | "right"
  backgroundColor?: string
  opacity?: number
}

export interface ImageBlockContent extends BlockContent {
  src?: string
  image_url?: string  // Primary field from database
  alt?: string
  alt_text?: string   // Primary field from database
  caption?: string
  width?: number
  height?: number
  percentageWidth?: number // Added percentage width property for responsive image sizing
  backgroundColor?: string
  opacity?: number
  original_url?: string  // For reference to original Framer URL
}

export interface PortfolioBlockContent extends BlockContent {
  title?: string
  showFeaturedOnly?: boolean
  layout?: "grid" | "list"
  itemsPerRow?: number
  tagFilter?: string
  backgroundColor?: string
  opacity?: number
}

export interface ContactBlockContent extends BlockContent {
  title?: string
  email?: string
  phone?: string
  showForm?: boolean
  backgroundColor?: string
  opacity?: number
}

export interface ImageTextBlockContent extends BlockContent {
  title?: string
  content: string
  image_src: string
  image_alt: string
  image_caption?: string
  text_alignment?: "left" | "center" | "right"
  backgroundColor?: string
  opacity?: number
}

export interface VideoContent extends BlockContent {
  title?: string
  description?: string
  src: string
  poster?: string
  autoplay?: boolean
  controls?: boolean
  backgroundColor?: string
  opacity?: number
}

export interface EmbedBlockContent extends BlockContent {
  title?: string
  url: string
  embed_type?: "auto" | "youtube" | "vimeo" | "twitter" | "codepen" | "iframe"
  width?: string
  height?: string
  allow_fullscreen?: boolean
  backgroundColor?: string
  opacity?: number
}
