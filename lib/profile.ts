import { createClient, createAdminClient } from '@/lib/supabase/server'
import type { ProfileData, ProfileSetting, ProfileSettingKey } from '@/lib/types/profile'

export async function getProfileSettings(): Promise<ProfileData> {
  try {
    console.log('[v0] Fetching profile settings')
    
    const supabase = createClient()
    const { data, error } = await supabase
      .from('profile_settings')
      .select('setting_key, setting_value')
      .in('setting_key', ['profile_name', 'profile_title', 'linkedin_url', 'instagram_url', 'youtube_url', 'background_image_url'])
      .order('setting_key')

    if (error) {
      console.error('[v0] Error fetching profile settings:', error)
      // Return empty values on error - no defaults
      return {
        name: null,
        title: null,
        linkedin_url: null,
        instagram_url: null,
        youtube_url: null,
        background_image_url: null
      }
    }

    console.log('[v0] Profile settings fetched:', data?.length || 0)
    console.log('[v0] Settings found:', data?.map(d => d.setting_key) || [])

    // Convert array to object
    const profileData: ProfileData = {
      name: null,
      title: null,
      linkedin_url: null,
      instagram_url: null,
      youtube_url: null,
      background_image_url: null
    }

    data?.forEach((setting: ProfileSetting) => {
      switch (setting.setting_key) {
        case 'profile_name':
          profileData.name = setting.setting_value
          break
        case 'profile_title':
          profileData.title = setting.setting_value
          break
        case 'linkedin_url':
          profileData.linkedin_url = setting.setting_value
          break
        case 'instagram_url':
          profileData.instagram_url = setting.setting_value
          break
        case 'youtube_url':
          profileData.youtube_url = setting.setting_value
          break
        case 'background_image_url':
          profileData.background_image_url = setting.setting_value
          break
      }
    })

    // Return actual values from database - no defaults
    const result = {
      name: profileData.name,
      title: profileData.title,
      linkedin_url: profileData.linkedin_url,
      instagram_url: profileData.instagram_url,
      youtube_url: profileData.youtube_url,
      background_image_url: profileData.background_image_url
    }
    
    console.log('[v0] Profile data result:', result)
    return result
  } catch (error) {
    console.error('[v0] Failed to fetch profile settings:', error)
    // Return empty values on error - no defaults
    return {
      name: null, 
      title: null,
      linkedin_url: null,
      instagram_url: null,
      youtube_url: null,
      background_image_url: null
    }
  }
}

export async function updateProfileSetting(key: ProfileSettingKey, value: string): Promise<ProfileSetting> {
  try {
    console.log(`[v0] Updating profile setting: ${key} = ${value}`)

    const supabase = createAdminClient()
    const { data, error } = await supabase
      .from('profile_settings')
      .upsert({
        setting_key: key,
        setting_value: value,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'setting_key'
      })
      .select()
      .single()

    if (error) {
      console.error('[v0] Error updating profile setting:', error)
      throw new Error(`Failed to update ${key}: ${error.message}`)
    }

    console.log('[v0] Profile setting updated successfully:', data)
    return data
  } catch (error) {
    console.error('[v0] Failed to update profile setting:', error)
    throw error
  }
}

export async function updateProfileSettings(profileData: ProfileData): Promise<void> {
  try {
    console.log('[v0] Updating multiple profile settings:', profileData)

    const updates = []
    
    if (profileData.name !== null) {
      updates.push({
        setting_key: 'profile_name',
        setting_value: profileData.name,
        updated_at: new Date().toISOString()
      })
    }
    
    if (profileData.title !== null) {
      updates.push({
        setting_key: 'profile_title', 
        setting_value: profileData.title,
        updated_at: new Date().toISOString()
      })
    }
    
    if (profileData.linkedin_url !== null) {
      updates.push({
        setting_key: 'linkedin_url',
        setting_value: profileData.linkedin_url,
        updated_at: new Date().toISOString()
      })
    }
    
    if (profileData.instagram_url !== null) {
      updates.push({
        setting_key: 'instagram_url',
        setting_value: profileData.instagram_url,
        updated_at: new Date().toISOString()
      })
    }
    
    if (profileData.youtube_url !== null) {
      updates.push({
        setting_key: 'youtube_url',
        setting_value: profileData.youtube_url,
        updated_at: new Date().toISOString()
      })
    }
    
    if (profileData.background_image_url !== null) {
      updates.push({
        setting_key: 'background_image_url',
        setting_value: profileData.background_image_url,
        updated_at: new Date().toISOString()
      })
    }

    if (updates.length === 0) {
      console.log('[v0] No profile updates to apply')
      return
    }

    const supabase = createAdminClient()
    const { error } = await supabase
      .from('profile_settings')
      .upsert(updates, {
        onConflict: 'setting_key'
      })

    if (error) {
      console.error('[v0] Error updating profile settings:', error)
      throw new Error(`Failed to update profile settings: ${error.message}`)
    }

    console.log('[v0] Profile settings updated successfully')
  } catch (error) {
    console.error('[v0] Failed to update profile settings:', error)
    throw error
  }
}
