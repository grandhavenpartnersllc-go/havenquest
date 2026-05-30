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
}

export interface BuyerProfile {
  bedrooms: 2 | 3 | 4 | 5 | null
  bathrooms: 1 | 2 | 3 | null
  homeType: 'singleFamily' | 'townhome' | 'condo' | null
  constructionPreference: 'new' | 'resale' | null
}

export interface UserProfile {
  annualIncome: number
  householdSize: '1' | '2' | '3-4' | '5+'
  housingPreference: 'buyStarter' | 'buyMedian' | 'luxuryHome' | 'luxuryEstate'
  movingTimeline: '0-3months' | '3-6months' | '6-12months' | 'exploring'
  mustHaves: (keyof LifestyleScores)[]
  niceToHaves: (keyof LifestyleScores)[]
  notPriorities: (keyof LifestyleScores)[]
  buyerProfile?: BuyerProfile
}

export interface CityMatch {
  location: Location
  matchScore: number
  affordabilityScore: number
  affordabilityFlag: boolean
  estimatedMonthlyHousing: number
  estimatedMonthlyTotal: number
  zillowSearchUrl: string
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
  createdAt: string
}

export interface QuizSessionData {
  sessionId: string
  currentStep: number
  annualIncome?: number
  householdSize?: number
  housingPreference?: string
  movingTimeline?: string
  mustHaves?: string[]
  niceToHaves?: string[]
  notPriorities?: string[]
  buyerProfile?: BuyerProfile
  email?: string
  completed?: boolean
}
