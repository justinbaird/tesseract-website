# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

This is Justin Baird's personal website built with Next.js 14, featuring a content management system powered by Supabase. The project was initially created using v0.app and automatically syncs with the deployed version on Vercel.

**Key Technologies:**
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS v4 (with shadcn/ui components)
- Supabase (PostgreSQL database + Auth)
- React Server Components

## Essential Commands

### Development
```bash
# Install dependencies (uses pnpm)
pnpm install

# Start development server
pnpm dev
# or
npm run dev

# Build for production
pnpm build
# or
npm run build

# Start production server
pnpm start
# or
npm run start

# Run linting
pnpm lint
# or
npm run lint
```

### Database Management
```bash
# Apply SQL migrations (run these in Supabase SQL Editor)
# 1. First run: scripts/001_create_posts_table.sql
# 2. Then run: scripts/002_create_pages_table.sql
# 3. Then run: scripts/003_setup_storage_bucket.sql

# Check migration scripts in the scripts/ directory
ls scripts/
```

## Architecture Overview

### Database Layer (Supabase)
The application uses two main database tables:

1. **posts** - Blog posts/portfolio items with fields like title, slug, content, category, status
2. **pages** - Dynamic pages with associated content_blocks for flexible page building
3. **content_blocks** - JSONB-based flexible content blocks (hero, text, image, portfolio, etc.)

Key patterns:
- All tables use UUID primary keys
- Automatic `updated_at` timestamp triggers
- Support for `sort_order` columns (with fallback to `created_at`)
- Draft/published workflow for content

### Application Structure

```
app/                    # Next.js App Router
├── layout.tsx         # Root layout with fonts and global styles
├── page.tsx           # Homepage with dynamic page support
├── [slug]/            # Dynamic page routes
├── admin/             # Content management admin interface
└── posts/             # Blog posts listing page

lib/                   # Business logic and utilities
├── supabase/         # Database client configuration (client.ts, server.ts, middleware.ts)
├── types/            # TypeScript type definitions (page.ts, post.ts)
├── utils/            # Utility functions (markdown processing)
├── actions.ts        # Server actions for auth
├── pages.ts          # Page and content block operations
├── posts.ts          # Blog post/portfolio operations
└── utils.ts          # General utility functions

components/           # React components
├── ui/              # shadcn/ui base components
├── blocks/          # Content block components (hero, text, image, etc.)
├── admin/           # Admin interface components (editors, lists, auth)
├── auth/            # Authentication components
├── page-renderer.tsx # Dynamic page rendering system
└── [component-files] # Core site components (footer, sidebar, etc.)

scripts/             # Database migration files (3 core migrations)
public/              # Static assets and images
```

### Content Management System

The CMS supports a block-based page building system:

**Block Types Available:**
- `hero` - Hero sections with title, subtitle, CTA
- `text` - Rich text content blocks  
- `image` - Image blocks with captions
- `image_text_left/right` - Image + text combination blocks
- `portfolio` - Portfolio item galleries
- `contact` - Contact forms and information
- `video` - Video embed blocks
- `embed` - Generic iframe/embed blocks
- `gallery` - Image gallery blocks
- `spacer` - Spacing/layout blocks
- `testimonial` - Testimonial content blocks

**Key Features:**
- Pages can be set as homepage (`is_homepage: true`)
- Content blocks are positioned and can be toggled visible
- Fallback to static layout if dynamic homepage fails
- Support for draft/published workflows

### Data Flow Patterns

1. **Page Rendering**: `page.tsx` → `getPageBySlug("home")` → `PageRenderer` → Individual block components
2. **Content Fetching**: Server components fetch data directly using lib functions
3. **Error Handling**: Graceful degradation with fallbacks (e.g., empty arrays for failed post fetches)
4. **Database Resilience**: Automatic retry logic for missing columns during schema updates

### Styling System

- **Tailwind CSS v4** with custom configuration
- **shadcn/ui** component library (new-york style)
- **CSS Variables** for theming
- **Custom fonts**: Inter (body) and Playfair Display (headings)
- **Background**: Fixed background image with overlay system

### Environment Configuration

Required environment variables:
```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key  
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
NEXT_PUBLIC_SITE_URL=your_site_url (for auth redirects)
```

### Admin Interface

The application includes a comprehensive admin interface at `/admin` for content management:

**Authentication:**
- Simple session-based auth (stored in sessionStorage)
- No user accounts - single admin access

**Content Management Features:**
- **Posts Management**: Create, edit, delete portfolio posts with rich metadata
- **Pages Management**: Visual page builder with drag-drop block ordering
- **Profile Management**: Upload and manage profile images
- **Visual Editor**: Real-time preview of content blocks
- **Cache Management**: Clear application caches

**Key Admin Components:**
- `SimpleAuth` - Basic authentication gate
- `PostEditor` - Rich post creation/editing interface
- `VisualEditor` - Block-based page editor with live preview
- `BlockEditor` - Individual content block configuration
- `BlockRenderer` - Admin preview of content blocks

## Development Patterns

### Adding New Content Block Types

1. Add new block type to `lib/types/page.ts` (`BlockType` union)
2. Create corresponding content interface (e.g., `MyBlockContent`) extending `BlockContent`
3. Implement display component in `components/blocks/my-block.tsx`
4. Add admin editing component in `components/admin/block-editor.tsx` 
5. Register in `components/page-renderer.tsx` switch statement
6. Update `components/admin/visual-editor.tsx` for block creation UI

### Database Schema Updates

- Create new migration files in `scripts/` directory
- Use `IF NOT EXISTS` clauses for safe migrations
- Update TypeScript types in `lib/types/`
- Handle missing columns gracefully in queries (see posts.ts examples)

### Error Handling Philosophy

- Log errors with `[v0]` prefix for identification
- Provide fallbacks for non-critical features
- Use try-catch blocks around external service calls
- Graceful degradation (e.g., empty content arrays)
- Unknown block types display debug information in development
- Database column missing errors are handled with fallback queries

### Development Workflow

**Content Development:**
1. Create/edit content via `/admin` interface
2. Use visual editor for real-time preview
3. Test on various screen sizes using responsive design
4. Publish when ready (toggle `is_published` flag)

**Database Changes:**
1. Create migration script in `scripts/` with sequential numbering
2. Use `IF NOT EXISTS` clauses for safe migrations
3. Test migration in Supabase SQL editor
4. Update TypeScript types in `lib/types/`
5. Handle missing columns in queries (see patterns in `posts.ts`)

**Component Development:**
- Follow shadcn/ui patterns for consistency
- Use Tailwind CSS v4 with CSS variables
- Implement responsive designs (mobile-first)
- Add proper TypeScript interfaces for all props

## Important Notes

- **Auto-sync**: Changes to deployed v0.app project automatically push to this repository
- **Build config**: ESLint and TypeScript errors are ignored during builds (`next.config.mjs`)
- **Image optimization**: Disabled for compatibility (`unoptimized: true`)
- **Package manager**: Project uses pnpm (check `pnpm-lock.yaml`)
- **CSS framework**: Uses Tailwind v4 with PostCSS plugin
- **No testing framework**: Project currently has no automated tests
- **Admin auth**: Simple sessionStorage-based auth, no user management system
- **shadcn/ui**: Uses "new-york" style variant with CSS variables enabled

## Troubleshooting

### Common Issues
- **Missing sort_order columns**: The codebase handles this gracefully with fallback queries
- **Supabase connection**: Check environment variables and client configuration
- **Build errors**: TypeScript/ESLint errors are ignored in production builds
- **Content not showing**: Verify `is_published` and `is_visible` flags in database

### Database Issues
- Run migration scripts in order if tables don't exist
- Check Supabase RLS policies if data access fails
- Verify environment variables are properly set
