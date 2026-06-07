import type { Metadata } from 'next'
import { Inter, Dancing_Script } from 'next/font/google'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const dancingScript = Dancing_Script({
  subsets: ['latin'],
  weight: '600',
  variable: '--font-dancing-script',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'HavenQuest — Find Where Your Life Fits in Texas',
  description: 'Match your income and lifestyle to the right Texas city or neighborhood, then connect with the best realtors in your market. Free relocation intelligence.',
  openGraph: {
    title: 'HavenQuest — Texas Relocation Intelligence',
    description: 'Find where your income, household, and lifestyle priorities actually fit in Texas.',
    url: 'https://havenquest.co',
    siteName: 'HavenQuest',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'HavenQuest — Find Where Your Life Fits in Texas',
    description: 'Match your income and lifestyle to the right Texas city — free.',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${dancingScript.variable} h-full`}>
      <body className="min-h-full flex flex-col antialiased">{children}</body>
    </html>
  )
}
