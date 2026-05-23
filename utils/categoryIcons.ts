import {
  DollarSign, GraduationCap, Shield, Footprints, Train, Music,
  TreePine, Heart, Wifi, Receipt, Sun, Car, type LucideIcon,
} from 'lucide-react'
import type { LifestyleScores } from '../types'

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
}
