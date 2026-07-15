import { LifestyleScores, UserProfile, DNAScores } from '../types'

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

// DNA categories (Brief 2a) — used by Card 3 and MM3's re-skinned bucket UI.
// LIFESTYLE_CATEGORIES above is kept as-is for city detail pages, PDF reports,
// and the methodology page, which still display the old 13-category scores.
export const DNA_CATEGORIES: {
  key: keyof DNAScores
  icon: string
  label: string
  description: string
  whatItIs: string
  howItCounts: string
}[] = [
  { key: 'schoolQuality', icon: '🎓', label: 'School Quality', description: 'TEA ratings, STAAR scores, graduation and college-readiness rates', whatItIs: "the strength of local public and private schools, from ratings to district reputation.", howItCounts: "one of the heaviest factors in your match by default, and it counts for even more when you mark it a priority." },
  { key: 'familyLifestyle', icon: '👨‍👩‍👧', label: 'Family Lifestyle', description: 'Parks, youth sports, pediatric healthcare, family-oriented retail', whatItIs: "how well a place suits family life: parks, kid-friendly amenities, safety, and a family-oriented community feel.", howItCounts: "a strong factor in your match by default, and it counts for more when you mark it a priority." },
  { key: 'careerAccess', icon: '💼', label: 'Career Access', description: 'Employment growth, employer diversity, commute access', whatItIs: "the strength of the local job market and access to employers in your field.", howItCounts: "a strong factor in your match by default, and it counts for more when you mark it a priority." },
  { key: 'outdoorLifestyle', icon: '🏞️', label: 'Outdoor Lifestyle', description: 'Trails, lakes, parks, and outdoor recreation access', whatItIs: "access to nature, parks, trails, and outdoor recreation.", howItCounts: "a solid mid-weight factor by default, and it counts for more when you mark it a priority." },
  { key: 'growthPotential', icon: '📈', label: 'Growth Potential', description: 'Population growth, new development, employer expansion', whatItIs: "the area’s economic momentum and how much it’s expected to grow and appreciate over time.", howItCounts: "a solid mid-weight factor by default, and it counts for more when you mark it a priority." },
  { key: 'diningEntertainment', icon: '🍽️', label: 'Dining & Entertainment', description: 'Restaurants, nightlife, arts, and walkable entertainment districts', whatItIs: "the local food scene, nightlife, and things to do.", howItCounts: "a moderate factor by default, and it counts for more when you mark it a priority." },
  { key: 'luxuryLifestyle', icon: '💎', label: 'Luxury Lifestyle', description: 'High-end retail, country clubs, premium amenities', whatItIs: "access to upscale amenities, high-end shopping, dining, and premium services.", howItCounts: "a lighter factor by default, but it counts for more when you mark it a priority." },
]

// Priority-selection subset (Priority Engine B1). growthPotential and careerAccess are
// omitted from the user-facing priority selectors because their per-city data is a
// neutral-5 stub for ~72-74% of cities, so letting a user prioritize them would sort on
// noise. They remain in DNAScores / BASE_DNA_WEIGHTS and are STILL scored at their base
// weight (the removed selector lever leaves them in the 'unassigned' tier = 1.0x) — only
// the lever is gone, not the dimension. DNA_CATEGORIES above stays WHOLE so every display/
// lookup site (incl. non-null-asserted .find on legacy careerAccess/growthPotential values)
// keeps resolving. Consumed ONLY by the three priority-selection UIs.
export const PRIORITY_SELECTABLE_CATEGORIES = DNA_CATEGORIES.filter(
  c => c.key !== 'growthPotential' && c.key !== 'careerAccess'
)

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
  { value: '2', label: '2 people', description: 'Spouse, partner, or roommate' },
  { value: '3-4', label: 'Family of 3–4', description: 'Small family' },
  { value: '5+', label: 'Family of 5+', description: 'Larger family' },
]

export const MUST_HAVE_MAX = 3
// Lowered 5 -> 3 (Priority Engine B1). With only 5 selectable dims, a cap of 5 let a user
// put all five in one tier, which is a strict no-op (uniform tiers cancel under
// renormalization). Capping at 3 forces genuine selectivity.
export const NICE_TO_HAVE_MAX = 3

export const SESSION_PROFILE_KEY = 'hq_profile'
export const SESSION_METRO_KEY = 'hq_metro'
export const SESSION_MATCHES_KEY = 'hq_matches'
export const SESSION_ID_KEY = 'hq_session_id'
export const LOCAL_SESSION_KEY = 'hq_session'
export const LOCAL_PENDING_EMAIL_KEY = 'hq_pending_email'
export const LOCAL_CHECKLIST_KEY = 'hq_checklist'
export const LOCAL_NOTES_KEY = 'hq_notes'
