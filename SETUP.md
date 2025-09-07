# Setup Guide: Tesseract Website

This guide will help you set up your Tesseract website with Supabase (database), GitHub (version control), and Netlify (hosting).

## 📋 Prerequisites

- GitHub account
- Supabase account  
- Netlify account

## 🚀 Step 1: Create GitHub Repository

1. Go to [GitHub](https://github.com)
2. Click "New repository"
3. Name it: `tesseract-website`
4. Description: "Justin Baird's personal portfolio website built with Next.js 14 and Supabase"
5. Make it **Public**
6. **Don't** initialize with README (we already have files)
7. Click "Create repository"

Your repository will be at: `https://github.com/justinbaird/tesseract-website`

## 🗄️ Step 2: Set Up Supabase Database

### Create Supabase Project
1. Go to [supabase.com](https://supabase.com)
2. Click "Start your project" → "New project"
3. Choose your organization
4. Project details:
   - **Name**: `tesseract-website`
   - **Database Password**: Choose a strong password (save it!)
   - **Region**: Choose closest to your location
5. Click "Create new project"
6. Wait 2-3 minutes for setup to complete

### Get Your API Keys
Once your project is ready:

1. Go to **Settings** → **API**
2. Copy these values:
   - **Project URL** (starts with `https://xxx.supabase.co`)
   - **anon public** key
   - **service_role** key (click "Reveal" first)

### Update Environment Variables
1. Open `.env.local` in your project
2. Replace the placeholder values:
   ```bash
   NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_actual_anon_key_here
   SUPABASE_SERVICE_ROLE_KEY=your_actual_service_role_key_here
   ```

### Run Database Migrations
1. In Supabase, go to **SQL Editor**
2. Run these scripts **in order**:

   **First: Create Posts Table**
   ```sql
   -- Copy and paste content from scripts/001_create_posts_table.sql
   ```

   **Second: Create Pages Table**  
   ```sql
   -- Copy and paste content from scripts/002_create_pages_table.sql
   ```

   **Third: Setup Storage**
   ```sql
   -- Copy and paste content from scripts/003_setup_storage_bucket.sql
   ```

3. Click "Run" for each script
4. Verify tables were created in **Table Editor**

## 🌐 Step 3: Deploy to Netlify

### Option A: Deploy from GitHub (Recommended)
1. Go to [netlify.com](https://netlify.com)
2. Click "Add new site" → "Import an existing project"
3. Choose **GitHub** and authenticate
4. Select `justinbaird/tesseract-website`
5. Configure build settings:
   - **Build command**: `npm run build`
   - **Publish directory**: `.next`
   - **Node version**: `18` (add in environment variables)

### Option B: Manual Deploy
1. Run `npm run build` locally
2. Drag the `.next` folder to Netlify

### Set Environment Variables in Netlify
1. In your Netlify site dashboard, go to **Site settings**
2. Click **Environment variables**
3. Add these variables:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   NEXT_PUBLIC_SITE_URL=https://your-site-name.netlify.app
   NODE_VERSION=18
   ```

### Update Local Environment
Once deployed, update your `.env.local`:
```bash
# For production testing
NEXT_PUBLIC_SITE_URL=https://your-site-name.netlify.app
```

## 🔧 Step 4: Test Your Setup

### Local Testing
1. Stop your local server (Ctrl+C if running)
2. Start it again: `pnpm dev -p 4000`
3. Visit `http://localhost:4000`
4. Go to `/admin` and try creating content

### Production Testing
1. Visit your Netlify URL
2. Test the admin interface
3. Create some sample content

## 📱 Step 5: Admin Access

### Default Admin Setup
- The admin uses sessionStorage authentication
- No user registration needed
- Access: `yoursite.com/admin`

### First Time Setup
1. Visit `/admin`
2. The simple auth will ask for access
3. Create your first posts and pages
4. Set up your homepage using the page editor

## 🔍 Troubleshooting

### Database Connection Issues
- Verify Supabase URL and keys in `.env.local`
- Check Supabase project is running
- Ensure RLS policies are set up (migration scripts handle this)

### Build Errors
- Check Node.js version (should be 18+)
- Clear `.next` folder: `rm -rf .next`
- Reinstall dependencies: `pnpm install`

### Admin Access Issues
- Clear browser storage: Developer Tools → Application → Storage → Clear
- Check console for JavaScript errors

## 📚 Next Steps

1. **Content Creation**: Use `/admin` to create your first posts and pages
2. **Customization**: Modify components in `components/` directory
3. **Styling**: Update Tailwind classes or add custom CSS
4. **Domain**: Set up custom domain in Netlify settings

## 🆘 Support

If you encounter issues:
1. Check the browser console for errors
2. Review Supabase logs in the dashboard
3. Check Netlify build logs
4. Refer to `WARP.md` for development guidance

---
**Ready to go!** Your website should now be fully functional with database, version control, and hosting all set up.
