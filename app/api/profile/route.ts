import { type NextRequest, NextResponse } from 'next/server'
import { getProfileSettings, updateProfileSettings } from '@/lib/profile'
import { revalidatePath } from 'next/cache'

// Force dynamic rendering
export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    console.log('[v0] GET /api/profile - Fetching profile settings')
    const profileData = await getProfileSettings()
    const response = NextResponse.json(profileData)
    // Prevent caching of profile data
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate')
    response.headers.set('Pragma', 'no-cache')
    response.headers.set('Expires', '0')
    return response
  } catch (error) {
    console.error('[v0] Failed to fetch profile settings:', error)
    return NextResponse.json({ 
      error: 'Failed to fetch profile settings',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    console.log('[v0] PUT /api/profile - Updating profile settings')
    const body = await request.json()
    console.log('[v0] Request body:', JSON.stringify(body, null, 2))
    
    await updateProfileSettings(body)
    
    // Revalidate all paths that might display profile data
    revalidatePath('/', 'layout')
    revalidatePath('/admin', 'layout')
    revalidatePath('/api/profile')
    
    // Fetch updated profile data to return
    const updatedProfile = await getProfileSettings()
    console.log('[v0] Profile updated successfully')
    
    const response = NextResponse.json(updatedProfile)
    // Prevent caching
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate')
    response.headers.set('Pragma', 'no-cache')
    response.headers.set('Expires', '0')
    return response
  } catch (error) {
    console.error('[v0] Failed to update profile settings:', error)
    return NextResponse.json({ 
      error: 'Failed to update profile settings',
      details: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 })
  }
}
