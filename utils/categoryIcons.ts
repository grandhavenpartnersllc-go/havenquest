import {
  DollarSign, GraduationCap, Shield, Footprints, Train, Music,
  TreePine, Heart, Wifi, Receipt, Sun, Car, Hospital,
  Briefcase, TrendingUp, UtensilsCrossed, Gem, type LucideIcon,
} from 'lucide-react'
import type { LifestyleScores, DNAScores } from '../types'

export const CATEGORY_ICONS: Record<keyof LifestyleScores, LucideIcon> = {
  affordability: DollarSign,
  schools: GraduationCap,
  safety: Shield,
  walkability: Footprints,
  transit: Train,
  nightlife: Music,
  outdoors: TreePine,
  familyFriendly: Heart,
  remoteWork: Wifi,
  lowTaxes: Receipt,
  weather: Sun,
  traffic: Car,
  healthcare: Hospital,
}

export const DNA_CATEGORY_ICONS: Record<keyof DNAScores, LucideIcon> = {
  schoolQuality: GraduationCap,
  familyLifestyle: Heart,
  careerAccess: Briefcase,
  outdoorLifestyle: TreePine,
  growthPotential: TrendingUp,
  diningEntertainment: UtensilsCrossed,
  luxuryLifestyle: Gem,
}
