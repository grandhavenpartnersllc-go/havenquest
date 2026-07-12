import type { Metadata } from 'next'
import { Poppins } from 'next/font/google'
import './globals.css'
import BetaGate from '@/components/BetaGate'

// Brief 4 — app-wide font swap Inter → Poppins (matches the approved prototype). Poppins is
// not a variable font, so next/font requires explicit weights; 400/500/600/700 are the only
// weights the app uses (confirmed in Phase 0). Exposed as --font-poppins, consumed by
// Tailwind v4's --font-sans in globals.css, so the whole app inherits it.
const poppins = Poppins({
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-poppins',
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
    <html lang="en" className={`${poppins.variable} h-full`}>
      <body className="min-h-full flex flex-col antialiased">
        <BetaGate />
        {children}
      </body>
    </html>
  )
}
