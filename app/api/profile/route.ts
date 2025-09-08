import { type NextRequest, NextResponse } from 'next/server'
import { getProfileSettings, updateProfileSettings } from '@/lib/profile'

// Force dynamic rendering
export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    console.log('[v0] GET /api/profile - Fetching profile settings')
    const profileData = await getProfileSettings()
    return NextResponse.json(profileData)
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
    
    // Fetch updated profile data to return
    const updatedProfile = await getProfileSettings()
    console.log('[v0] Profile updated successfully')
    
    return NextResponse.json(updatedProfile)
  } catch (error) {
    console.error('[v0] Failed to update profile settings:', error)
    return NextResponse.json({ 
      error: 'Failed to update profile settings',
      details: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 })
  }
}
