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
# 2. Then run: scripts/003_create_pages_table.sql
# 3. Apply any additional migration scripts as needed

# Check for additional migration scripts in the scripts/ directory
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
└── page.tsx           # Homepage with dynamic page support

lib/                   # Business logic and utilities
├── supabase/         # Database client configuration
├── types/            # TypeScript type definitions  
├── actions.ts        # Server actions for auth
├── pages.ts          # Page and content block operations
└── posts.ts          # Blog post/portfolio operations

components/           # React components
├── ui/              # shadcn/ui base components
├── blocks/          # Content block components (hero, text, image, etc.)
├── page-renderer.tsx # Dynamic page rendering system
└── [component-files]

scripts/             # Database migration files
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

## Development Patterns

### Adding New Content Block Types

1. Add new block type to `lib/types/page.ts` (`BlockType` union)
2. Create corresponding content interface (e.g., `MyBlockContent`)
3. Implement component in `components/blocks/my-block.tsx`
4. Register in `components/page-renderer.tsx` switch statement

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

## Important Notes

- **Auto-sync**: Changes to deployed v0.app project automatically push to this repository
- **Build config**: ESLint and TypeScript errors are ignored during builds (`next.config.mjs`)
- **Image optimization**: Disabled for compatibility (`unoptimized: true`)
- **Package manager**: Project uses pnpm (check `pnpm-lock.yaml`)
- **CSS framework**: Uses Tailwind v4 with PostCSS plugin

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
