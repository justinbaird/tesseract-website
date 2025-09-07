# Tesseract Website

Justin Baird's personal website built with Next.js 14, featuring a content management system powered by Supabase.

## Project Overview

This is a Next.js website project with the following key technologies:
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS v4 (with shadcn/ui components)
- Supabase (PostgreSQL database + Auth)
- React Server Components

## Getting Started

### Prerequisites
- Node.js 18+ or 20+
- pnpm (preferred) or npm
- Supabase account and project

### Installation

1. Install dependencies:
```bash
pnpm install
# or
npm install
```

2. Set up environment variables:
Copy `.env.local.example` to `.env.local` and fill in your Supabase credentials:
```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key  
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
NEXT_PUBLIC_SITE_URL=your_site_url
```

3. Set up the database:
Run the migration scripts in order in your Supabase SQL Editor:
- `scripts/001_create_posts_table.sql`
- `scripts/003_create_pages_table.sql`
- Additional migration scripts as needed

4. Start the development server:
```bash
pnpm dev
# or
npm run dev
```

## Available Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint

## Project Structure

- `app/` - Next.js App Router pages and layouts
- `components/` - React components (including shadcn/ui)
- `lib/` - Business logic and utilities
- `public/` - Static assets
- `scripts/` - Database migration scripts
- `styles/` - Global CSS files

## Development

This project uses a block-based content management system. See `WARP.md` for detailed development guidelines and architecture information.
