import { LifestyleScores, UserProfile } from '../types'

export const LIFESTYLE_CATEGORIES: {
  key: keyof LifestyleScores
  icon: string
  label: string
  description: string
}[] = [
  { key: 'affordability', icon: '💰', label: 'Affordability', description: 'Housing costs relative to your income' },
  { key: 'schools', icon: '🎓', label: 'Schools', description: 'Public school district quality' },
  { key: 'safety', icon: '🛡️', label: 'Safety', description: 'Crime rates and community safety' },
  { key: 'walkability', icon: '🚶', label: 'Walkability', description: 'Errands and daily life on foot' },
  { key: 'transit', icon: '🚌', label: 'Transit', description: 'Bus, rail, and commute options' },
  { key: 'nightlife', icon: '🎵', label: 'Nightlife', description: 'Bars, music, restaurants, entertainment' },
  { key: 'outdoors', icon: '🏞️', label: 'Outdoors', description: 'Parks, trails, nature access' },
  { key: 'familyFriendly', icon: '👨‍👩‍👧', label: 'Family Friendly', description: 'Overall environment for raising children' },
  { key: 'remoteWork', icon: '💻', label: 'Remote Work', description: 'Broadband, tech culture, coworking' },
  { key: 'lowTaxes', icon: '📋', label: 'Low Taxes', description: 'Property tax rates and tax burden' },
  { key: 'weather', icon: '☀️', label: 'Weather', description: 'Climate, sunshine, seasonal comfort' },
  { key: 'traffic', icon: '🚗', label: 'Traffic', description: 'Commute times and congestion levels' },
  { key: 'healthcare', icon: '🏥', label: 'Healthcare', description: 'Hospitals, specialists, and medical access' },
]

export const TIER_LABELS: Record<string, string> = {
  tier1: 'Major Metro',
  tier2: 'Growing Suburb',
  tier3: 'Lifestyle City',
}

export const METRO_OPTIONS = [
  { id: 'austin', label: 'Austin Metro', description: 'Austin, Round Rock, Cedar Park, Georgetown, and more' },
  { id: 'dallas', label: 'Dallas-Fort Worth Metro', description: 'Dallas, Fort Worth, Frisco, Plano, McKinney' },
  { id: 'houston', label: 'Houston Metro', description: 'Houston, The Woodlands, Sugar Land' },
  { id: 'sanAntonio', label: 'San Antonio Metro', description: 'San Antonio, New Braunfels' },
] as const

export const HOUSEHOLD_OPTIONS: { value: UserProfile['householdSize']; label: string; description: string }[] = [
  { value: '1', label: 'Just me', description: 'Solo living' },
  { value: '2', label: '2 people', description: 'Partner or roommate' },
  { value: '3-4', label: 'Family of 3–4', description: 'Small family' },
  { value: '5+', label: 'Family of 5+', description: 'Larger family' },
]

export const MUST_HAVE_MAX = 4
export const NICE_TO_HAVE_MAX = 5

export const SESSION_PROFILE_KEY = 'hq_profile'
export const SESSION_METRO_KEY = 'hq_metro'
export const SESSION_MATCHES_KEY = 'hq_matches'
export const SESSION_ID_KEY = 'hq_session_id'
export const LOCAL_SESSION_KEY = 'hq_session'
export const LOCAL_PENDING_EMAIL_KEY = 'hq_pending_email'
export const LOCAL_CHECKLIST_KEY = 'hq_checklist'
export const LOCAL_NOTES_KEY = 'hq_notes'
