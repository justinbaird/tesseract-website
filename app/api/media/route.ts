import { createClient } from "@supabase/supabase-js"
import { type NextRequest, NextResponse } from 'next/server'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
)

// Force dynamic rendering
export const dynamic = 'force-dynamic'

// GET /api/media - List all uploaded files
export async function GET() {
  try {
    const { data, error } = await supabase.storage.from('images').list('', {
      limit: 100,
      offset: 0,
      sortBy: { column: 'created_at', order: 'desc' },
    })

    if (error) {
      console.error('[v0] Error listing files:', error)
      return NextResponse.json({ error: 'Failed to list files' }, { status: 500 })
    }

    // Get public URLs for all files
    const filesWithUrls = (data || []).map((file) => {
      const {
        data: { publicUrl },
      } = supabase.storage.from('images').getPublicUrl(file.name)

      return {
        name: file.name,
        url: publicUrl,
        size: file.metadata?.size || 0,
        mimeType: file.metadata?.mimetype || 'application/octet-stream',
        createdAt: file.created_at,
        updatedAt: file.updated_at,
      }
    })

    const response = NextResponse.json({ files: filesWithUrls })
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate')
    return response
  } catch (error) {
    console.error('[v0] Failed to list media files:', error)
    return NextResponse.json({ error: 'Failed to list media files' }, { status: 500 })
  }
}

// POST /api/media - Upload a file (supports any file type)
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    // Validate file size (50MB max for any file type)
    const maxSize = 50 * 1024 * 1024 // 50MB
    if (file.size > maxSize) {
      return NextResponse.json({ error: 'File must be less than 50MB' }, { status: 400 })
    }

    const fileExt = file.name.split('.').pop()
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`

    const { data, error } = await supabase.storage.from('images').upload(fileName, file, {
      cacheControl: '3600',
      upsert: false,
    })

    if (error) {
      console.error('[v0] Error uploading file:', error)
      return NextResponse.json({ error: 'Failed to upload file', details: error.message }, { status: 500 })
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from('images').getPublicUrl(data.path)

    const response = NextResponse.json({
      url: publicUrl,
      name: file.name,
      size: file.size,
      mimeType: file.type,
    })
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate')
    return response
  } catch (error) {
    console.error('[v0] Upload error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// DELETE /api/media - Delete a file
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const fileName = searchParams.get('name')

    if (!fileName) {
      return NextResponse.json({ error: 'File name is required' }, { status: 400 })
    }

    const { error } = await supabase.storage.from('images').remove([fileName])

    if (error) {
      console.error('[v0] Error deleting file:', error)
      return NextResponse.json({ error: 'Failed to delete file', details: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[v0] Delete error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}



