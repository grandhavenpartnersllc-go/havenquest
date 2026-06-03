import type { Metadata } from 'next'
import Header from '../components/shared/Header'
import Footer from '../components/shared/Footer'
import HeroSection from '../components/landing/HeroSection'
import HowItWorks from '../components/landing/HowItWorks'
import FeaturedCities from '../components/landing/FeaturedCities'
import RealtorCTA from '../components/landing/RealtorCTA'

export const metadata: Metadata = {
  title: 'HavenQuest — Find Where Your Life Fits in Texas',
  description: 'Match your income and lifestyle to the right Texas city or neighborhood. Free relocation intelligence platform — best cities to live in Texas, cost of living, school data, and top realtors.',
  openGraph: {
    title: 'HavenQuest — Find Where Your Life Fits in Texas',
    description: 'Moving to Texas? Find the city that fits your income, household, and lifestyle priorities — then connect with top realtors.',
    url: 'https://havenquest.co',
    siteName: 'HavenQuest',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'HavenQuest — Texas Relocation Intelligence',
    description: 'Find where your income and lifestyle actually fit in Texas. Free.',
  },
}

export default function HomePage() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <HeroSection />
        <HowItWorks />
        <FeaturedCities />
        <RealtorCTA />
      </main>
      <Footer />
    </>
  )
}
