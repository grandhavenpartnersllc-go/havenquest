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

export interface Location {
  id: string
  name: string
  state: string
  county: string
  type: 'city' | 'neighborhood'
  tier: 'tier1' | 'tier2' | 'tier3'
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
  mustHaves: (keyof LifestyleScores)[]
  niceToHaves: (keyof LifestyleScores)[]
  notPriorities: (keyof LifestyleScores)[]
  buyerProfile?: BuyerProfile
  financial_picture?: FinancialPicture
}

export interface SandboxProfile {
  downPaymentOverride: string
  proceedsOverride: string | null
  interestRateOverride: number
  mustHaves: (keyof LifestyleScores)[]
  niceToHaves: (keyof LifestyleScores)[]
  notPriorities: (keyof LifestyleScores)[]
  unassigned: (keyof LifestyleScores)[]
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
  matchScore: number
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

export interface QuizSessionData {
  sessionId: string
  currentStep: number
  annualIncome?: number
  householdSize?: number
  movingTimeline?: string
  mustHaves?: string[]
  niceToHaves?: string[]
  notPriorities?: string[]
  buyerProfile?: BuyerProfile
  email?: string
  completed?: boolean
}

export interface MM4Profile {
  id?: string
  user_id?: string
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

  // Section 5 — Anything Else
  special_notes?: string

  // Meta
  last_completed_section?: number
  submitted?: boolean
  submitted_at?: string
}
