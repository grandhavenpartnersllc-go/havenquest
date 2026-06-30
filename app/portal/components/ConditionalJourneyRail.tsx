'use client'

import { usePathname } from 'next/navigation'
import JourneyRail from './JourneyRail'

export default function ConditionalJourneyRail() {
  const pathname = usePathname()
  if (pathname.startsWith('/portal/mm3') || pathname.startsWith('/portal/mm4')) return null
  return <JourneyRail />
}
