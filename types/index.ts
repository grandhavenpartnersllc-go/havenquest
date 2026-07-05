export interface LifestyleScores {
  affordability: number
  schools: number
  safety: number
  walkability: number
  transit: number
  nightlife: number
  outdoors: number
  familyFriendly: number
  remoteWork: number
  lowTaxes: number
  weather: number
  traffic: number
  healthcare: number
}

export interface CategoryInsights {
  affordability: string
  schools: string
  safety: string
  walkability: string
  transit: string
  nightlife: string
  outdoors: string
  familyFriendly: string
  remoteWork: string
  lowTaxes: string
  weather: string
  traffic: string
  healthcare: string
}

export interface HousingData {
  avgRent1BR: number
  avgRent2BR: number
  avgRent3BR: number
  starterHomePrice: number
  medianHomePrice: number
  propertyTaxRate: number
  pricePerSqFt: number
  monthlyUtilities: number
  monthlyGroceries: number
  monthlyTransportation: number
}

export interface MarketData {
  daysOnMarket: number
  saleToListRatio: number
  priceYOY: number
  marketCondition: 'Sellers Market' | 'Balanced Market' | 'Buyers Market'
  redfinMedianPrice: number
  redfinDataSource: string
}

export interface SchoolData {
  teaRating: 'A' | 'B' | 'C' | 'D' | 'F'
  primaryISD: string
}

export interface PersonalityProfile {
  growthProfile: number        // 1 = Fully Established, 10 = Highly Emerging
  pace: number                  // 1 = Very Relaxed, 10 = Fast-Paced
  culture: number                // 1 = Very Private, 10 = Highly Community-Oriented
  environment: number            // 1 = Fully Urban, 10 = Fully Rural
  lifestyleOrientation: number   // 1 = Highly Practical, 10 = Luxury-Oriented
}

export type ArchetypeKey = 'family' | 'firsttime' | 'executive' | 'luxury' | 'retiree' | 'youngpro' | 'general'

export interface PersonalityPreference {
  growthProfile: number
  pace: number
  culture: number
  environment: number
  lifestyleOrientation: number
}

export interface DNAScores {
  schoolQuality: number        // 0-10
  familyLifestyle: number      // 0-10
  careerAccess: number         // 0-10
  outdoorLifestyle: number     // 0-10
  growthPotential: number      // 0-10
  diningEntertainment: number  // 0-10
  luxuryLifestyle: number      // 0-10
}

export type DNADataSource = 'calibrated-prototype' | 'partial-translation' | 'neutral-default'

export type DNABucket = 'must_have' | 'important' | 'would_be_nice' | 'unassigned'

export interface WeightingProfile {
  weightingModelVersion: string
  archetypeWeights: Record<keyof DNAScores, number>
  clientBuckets: Record<keyof DNAScores, DNABucket>
  clientAdjustments: Record<keyof DNAScores, number>
  activeWeights: Record<keyof DNAScores, number>
}

export interface Location {
  id: string
  name: string
  state: string
  county: string
  type: 'city' | 'neighborhood'
  tier: 'tier1' | 'tier2' | 'tier3'
  character?: string
  parentId: string | null
  scores: LifestyleScores
  housing: HousingData
  market: MarketData
  school: SchoolData
  description: string
  strengths: [string, string, string]
  weaknesses: [string, string, string]
  hasNeighborhoodData: boolean
  lastUpdated: string
  metroUsed: string
  zone: string
  personality: PersonalityProfile
  dna: DNAScores
  dnaDataSource: DNADataSource
  categoryInsights: CategoryInsights
  cityNarrative?: string
  cityImageUrl?: string
}

export type HomeFeature =
  | 'garage'
  | 'pool'
  | 'singleStory'
  | 'largeYard'
  | 'homeOffice'
  | 'openFloorPlan'
  | 'primaryBedroomDownstairs'
  | 'guestSuite'
  | 'smartHome'
  | 'largeKitchen'

export interface BuyerProfile {
  bedrooms: 2 | 3 | 4 | 5 | null
  bathrooms: 1 | 2 | 3 | null
  homeType: 'singleFamily' | 'townhome' | 'condo' | null
  constructionPreference: 'new' | 'resale' | null
  features: HomeFeature[]
  dreamHomeNotes: string | null
}

export interface UserProfile {
  annualIncome: number
  householdSize: '1' | '2' | '3-4' | '5+'
  movingTimeline: '0-3months' | '3-6months' | '6-12months' | 'exploring'
  mustHaves: (keyof DNAScores)[]
  niceToHaves: (keyof DNAScores)[]
  notPriorities: (keyof DNAScores)[]
  unassignedPriorities?: (keyof DNAScores)[]
  buyerProfile?: BuyerProfile
  financial_picture?: FinancialPicture
  archetype?: ArchetypeKey
  personalityPreference?: PersonalityPreference
}

// mustHaves/niceToHaves/notPriorities/unassigned updated to DNAScores keys to
// stay consistent with MM3Discover's re-skin to DNA_CATEGORIES (Brief 2a Part 7) —
// not explicitly named in Brief 2a's Part 1, but required for MM3 to compile/make sense.
export interface SandboxProfile {
  downPaymentOverride: string
  proceedsOverride: string | null
  interestRateOverride: number
  mustHaves: (keyof DNAScores)[]
  niceToHaves: (keyof DNAScores)[]
  notPriorities: (keyof DNAScores)[]
  unassigned: (keyof DNAScores)[]
  citiesLocked?: boolean
}

export interface FamilyProfile {
  family_members: string[]
  family_names: string
  children_ages: string[]
  special_needs: string
  work_situation: string
  commute_destination: string
  school_preference: string[]
  faith_community: string
  activities: string
  move_motivation: string
  biggest_concern: string
  additional_notes: string
}

export interface FinancialPicture {
  is_homeowner: boolean;
  home_sale_proceeds: string | null;
  down_payment_available: string;
  purchase_timeline: '0-3months' | '3-6months' | '6-12months' | 'exploring';
}

export interface CityMatch {
  location: Location
  matchScore: number               // Final Match Score, 0-100 — unchanged field name/meaning for existing components
  financialFitScore: number        // 0-10
  functionalFitScore: number       // 0-10 — Community DNA match
  emotionalFitScore: number        // 0-10 — Community Personality match
  affordabilityScore: number
  affordabilityFlag: boolean
  estimatedMonthlyHousing: number
  estimatedMonthlyTotal: number
  zillowSearchUrl: string
  segment: 'Estate' | 'Luxury' | 'High' | 'Mid-Market' | 'Starter'
}

export interface Realtor {
  id: string
  name: string
  brokerage: string
  city: string
  yearsExperience: number
  transactionsLast12mo: number
  rating: number
  reviewCount: number
  designations: string[]
  awards: string
  isRelocationSpecialist: boolean
  phone: string
  website: string
  bio: string
  minPurchasePrice: number
  maxPurchasePrice: number
}

export interface UserSession {
  userId: string
  firstName: string
  email: string
  phone?: string
  currentMileMarker?: number
  createdAt: string
}

export interface PriorityWeight {
  bucket: 'must_have' | 'important' | 'would_be_nice' | 'unassigned'
  weight: 3 | 2 | 1 | 0.5
}

export interface QuizFinancialData {
  income_range: string
  home_proceeds: string | null
  available_funds: string
}

export interface QuizSessionData {
  sessionId: string
  currentStep: number
  annualIncome?: number
  householdSize?: number
  movingTimeline?: string
  mustHaves?: string[]
  niceToHaves?: string[]
  notPriorities?: string[]
  unassignedPriorities?: string[]
  buyerProfile?: BuyerProfile
  email?: string
  completed?: boolean
  // Navigator Quiz v2.1 — gateway + entry path fields (Brief 1)
  entryPath?: 'explorer' | 'directed' | 'instate' | 'exploring'
  archetype?: string
  priorities?: Record<string, PriorityWeight>
  communityFeel?: string
  growthProfile?: number
  lifestyleOrientation?: number
  environment?: number
  pace?: number
  culture?: number
  homeStatus?: string
  workSituation?: string
  financialData?: QuizFinancialData
  metroPreference?: string[]
  targetMetro?: string
}

export interface MM4Profile {
  id?: string
  user_id?: string
  quiz_session_id?: string
  email: string

  // Section 1 — Identity and Household
  primary_first_name?: string
  primary_last_name?: string
  partner_first_name?: string
  partner_last_name?: string
  current_address?: string
  current_city?: string
  current_state?: string
  current_zip?: string
  phone?: string
  preferred_contact?: 'phone' | 'text' | 'email'
  best_time_to_reach?: 'morning' | 'afternoon' | 'evening' | 'anytime'
  num_adults?: number
  num_children?: number
  children_ages?: string
  has_pets?: boolean
  pet_details?: string
  household_members?: Array<{ first_name: string; age: number; relationship: string }>

  // Section 2 — The Move
  why_texas?: string
  why_now?: string
  target_move_date?: string
  timeline_flexibility?: 'hard_deadline' | 'flexible_few_months' | 'very_flexible'
  origin_situation?: 'selling' | 'renting' | 'own_no_sale' | 'other'
  home_listed?: boolean
  approximate_equity?: string
  purchase_contingent?: 'yes' | 'no' | 'possibly' | 'na'

  // Section 3 — Employment and Financial Context
  employment_status?: 'employed_w2' | 'self_employed' | 'retired' | 'employer_relocation' | 'other'
  relocation_package?: boolean
  work_arrangement?: 'fully_remote' | 'hybrid' | 'in_person' | 'na'
  income_range_confirmed?: string

  // Section 4 — Texas Direction
  confirmed_target_city?: string
  ruled_out_cities?: string
  areas_researched?: string
  additional_must_haves?: string
  deal_breakers?: string
  city1_reasoning?: string
  city2_reasoning?: string
  city3_reasoning?: string
  target_confidence?: 'very_confident' | 'leaning_open' | 'torn'
  household_alignment?: 'fully_aligned' | 'mostly_aligned' | 'still_working'
  first_call_priority?: string

  // Section 5 — Anything Else
  special_notes?: string

  // Meta
  last_completed_section?: number
  submitted?: boolean
  submitted_at?: string
}

export interface MDClient {
  id?: string
  md_email: string
  client_email: string
  assigned_at?: string
  status: 'active' | 'closed' | 'paused'
  journey_health: 'on_track' | 'needs_attention' | 'at_risk'
  internal_notes?: string
  shared_notes?: string
}

export interface Message {
  id?: string
  client_email: string
  md_email: string
  sender_role: 'md' | 'client' | 'system'
  subject?: string
  body: string
  read: boolean
  notification_sent: boolean
  created_at?: string
}

export interface MDClientWithProfile {
  assignment: MDClient
  profile: UserProfile
  mm4Profile?: MM4Profile
  currentMM: number
  unreadMessages: number
}
