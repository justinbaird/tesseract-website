export interface ProfileSetting {
  id: string
  setting_key: string
  setting_value: string | null
  created_at: string
  updated_at: string
}

export interface ProfileData {
  name: string | null
  title: string | null
  linkedin_url: string | null
  instagram_url: string | null
  youtube_url: string | null
}

export type ProfileSettingKey = 'profile_name' | 'profile_title' | 'linkedin_url' | 'instagram_url' | 'youtube_url'
